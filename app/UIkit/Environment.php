<?php
namespace ZMP\Blocks\UIkit;

defined( 'ABSPATH' ) || exit;

/** Resolve explicit capabilities, never the theme slug or an admin JavaScript global. */
final class Environment {
    public function getProvider( string $context = 'frontend' ): array {
        $candidate = null;
        $support = get_theme_support( 'zmblocks-uikit' );
        if ( is_array( $support ) && isset( $support[0] ) && is_array( $support[0] ) ) {
            $declaration = $support[0];
            $candidate = $declaration['contexts'][$context] ?? ( 'frontend' === $context ? $declaration : null );
            if ( is_array( $candidate ) ) { $candidate['id'] = 'theme'; }
        }
        if ( ! is_array( $candidate ) ) { $candidate = $this->legacyTheme( $context ); }

        /** Return a capability declaration or null/false to force the local fallback. */
        $candidate = apply_filters( 'zmblocks_uikit_provider', $candidate, $context );
        return $this->normalize( $candidate, $context );
    }

    public function getVersion( string $context = 'frontend' ): ?string {
        return $this->getProvider( $context )['version'];
    }

    public function isAvailable( string $capability, string $context = 'frontend' ): bool {
        $provider = $this->getProvider( $context );
        return in_array( $capability, array( 'css', 'js', 'icons' ), true ) && $provider[$capability];
    }

    private function normalize( mixed $candidate, string $context ): array {
        $fallback = array(
            'id' => 'zmblocks', 'version' => '3.23.12', 'context' => $context,
            'css' => true, 'js' => false, 'icons' => false, 'components' => array( 'section', 'container', 'grid', 'card', 'button' ),
            'handles' => array( 'css' => array( 'zmblocks-uikit-section', 'zmblocks-uikit-container', 'zmblocks-uikit-grid', 'zmblocks-uikit-card', 'zmblocks-uikit-button' ), 'js' => array(), 'icons' => array() ),
            'stylesheet' => null,
        );
        if ( ! is_array( $candidate ) || empty( $candidate['id'] ) || ! is_string( $candidate['id'] ) ) {
            return $fallback;
        }
        $version = isset( $candidate['version'] ) && is_string( $candidate['version'] )
            && preg_match( '/^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/D', $candidate['version'] )
            ? $candidate['version'] : null;
        $result = array(
            'id' => sanitize_key( $candidate['id'] ), 'version' => $version, 'context' => $context,
            'components' => isset( $candidate['components'] ) && is_array( $candidate['components'] )
                ? array_values( array_filter( $candidate['components'], 'is_string' ) ) : array( '*' ),
            'handles' => array(), 'stylesheet' => null,
        );
        foreach ( array( 'css', 'js', 'icons' ) as $capability ) {
            $result[$capability] = true === ( $candidate[$capability] ?? false );
            $handles = $candidate['handles'][$capability] ?? array();
            $result['handles'][$capability] = is_array( $handles ) ? array_values( array_filter( $handles, static function ( $handle ) {
                return is_string( $handle ) && 1 === preg_match( '/^[a-zA-Z0-9_-]+$/D', $handle );
            } ) ) : array();
        }
        // Only the local legacy adapter supplies a file-backed stylesheet descriptor.
        if ( isset( $candidate['stylesheet'] ) && is_array( $candidate['stylesheet'] )
            && isset( $candidate['stylesheet']['src'], $candidate['stylesheet']['handle'] )
            && is_string( $candidate['stylesheet']['src'] ) && is_string( $candidate['stylesheet']['handle'] )
            && in_array( $candidate['stylesheet']['handle'], $result['handles']['css'], true ) ) {
            $result['stylesheet'] = array(
                'src' => esc_url_raw( $candidate['stylesheet']['src'] ),
                'handle' => $candidate['stylesheet']['handle'],
            );
        }
        return $result;
    }

    private function legacyTheme( string $context ): ?array {
        global $zmtheme;
        if ( ! in_array( $context, array( 'frontend', 'editor-content' ), true ) ) { return null; }
        $theme = $zmtheme['theme'] ?? null;
        foreach ( array( 'getFramework', 'getCss', 'getCssChildTheme', 'getJs', 'getIcons' ) as $method ) {
            if ( ! is_object( $theme ) || ! is_callable( array( $theme, $method ) ) ) { return null; }
        }
        if ( 'zm-uikit' !== $theme->getFramework() ) { return null; }
        $childCss = $theme->getCssChildTheme();
        $relative = $childCss ?: $theme->getCss();
        $root = $childCss ? get_stylesheet_directory() : get_template_directory();
        $url = $childCss ? get_stylesheet_directory_uri() : get_template_directory_uri();
        $file = is_string( $relative ) && '' !== $relative ? realpath( $root . '/' . ltrim( $relative, '/' ) ) : false;
        $resolvedRoot = realpath( $root );
        if ( ! $file || ! $resolvedRoot || ! str_starts_with( $file, $resolvedRoot . DIRECTORY_SEPARATOR ) || ! is_readable( $file ) ) { return null; }
        $banner = file_get_contents( $file, false, null, 0, 256 );
        preg_match( '/UIkit\s+(\d+\.\d+\.\d+)/i', $banner, $version );
        return array(
            'id' => 'theme', 'version' => $version[1] ?? null,
            'css' => true, 'js' => (bool) $theme->getJs(), 'icons' => (bool) $theme->getIcons(),
            'components' => array( '*' ),
            'handles' => array( 'css' => array( 'zm-uikit-css' ), 'js' => array( 'zm-uikit-js' ), 'icons' => array( 'zm-uikit-icons' ) ),
            'stylesheet' => array( 'handle' => 'zm-uikit-css', 'src' => $url . '/' . ltrim( $relative, '/' ) ),
        );
    }
}
