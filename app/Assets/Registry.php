<?php
namespace ZMP\Blocks\Assets;

use ZMP\Blocks\UIkit\Environment;

defined( 'ABSPATH' ) || exit;

/** Resolve local assets only for components used in the current context. */
final class Registry {
    public function __construct( private string $pluginFile, private Environment $environment ) {}

    public function register(): void {
        add_action( 'wp_enqueue_scripts', array( $this, 'preload' ), 20 );
        add_action( 'enqueue_block_assets', array( $this, 'editor' ), 20 );
        foreach ( array( 'section', 'icon', 'grid', 'column', 'card', 'image', 'button', 'filter', 'overlay' ) as $name ) {
            add_filter( 'render_block_zmblocks/' . $name, array( $this, 'rendered' ), 10, 2 );
        }
    }

    public function sectionStyles( string $context ): array {
        return $this->blockStyles( 'section', $context );
    }

    public function blockStyles( string $component, string $context ): array {
        if ( ! in_array( $component, array( 'section', 'container', 'icon', 'grid', 'column', 'card', 'image', 'button', 'filter', 'overlay' ), true ) ) { return array(); }
        $base = $this->localStyle( 'zmblocks-' . $component, 'blocks/' . $component . '/view.css' );
        if ( 'section' === $component ) { $base = array_merge( $this->blockStyles( 'container', $context ), $base ); }
        if ( in_array( $component, array( 'icon', 'image', 'column', 'filter', 'overlay' ), true ) ) { return $base; }
        $provider = $this->environment->getProvider( $context );
        $supported = null === $provider['version'] || version_compare( $provider['version'], '3.0.0', '>=' )
            && version_compare( $provider['version'], '4.0.0', '<' );
        $hasComponent = in_array( '*', $provider['components'], true ) || in_array( $component, $provider['components'], true );
        if ( 'zmblocks' !== $provider['id'] && $provider['css'] && $supported && $hasComponent ) {
            $sheet = $provider['stylesheet'];
            if ( $sheet && ! wp_style_is( $sheet['handle'], 'registered' ) ) {
                wp_register_style( $sheet['handle'], $sheet['src'], array(), $provider['version'] );
            }
            $usable = true;
            foreach ( $provider['handles']['css'] as $handle ) {
                if ( ! wp_style_is( $handle, 'registered' ) ) { $usable = false; }
            }
            if ( $usable ) {
                foreach ( $provider['handles']['css'] as $handle ) { wp_enqueue_style( $handle ); }
                // No handles means the explicit provider promises inline or external CSS.
                return array_merge( $provider['handles']['css'], $base );
            }
        }
        return array_merge( $this->localStyle( 'zmblocks-uikit-' . $component, 'uikit/' . $component . '.css' ), $base );
    }

    private function localStyle( string $handle, string $relative ): array {
        $file = dirname( $this->pluginFile ) . '/build/' . $relative;
        if ( ! is_file( $file ) ) { return array(); }
        if ( ! wp_style_is( $handle, 'registered' ) ) {
            wp_register_style( $handle, plugins_url( 'build/' . $relative, $this->pluginFile ), array(), (string) filemtime( $file ) );
        }
        wp_enqueue_style( $handle );
        return array( $handle );
    }

    public function preload(): void {
        // Optimize the common singular case. Rendering below handles all other sources.
        if ( ! is_singular() ) { return; }
        $post = get_queried_object();
        foreach ( array( 'section', 'icon', 'grid', 'column', 'card', 'image', 'button', 'filter', 'overlay' ) as $name ) {
            if ( $post instanceof \WP_Post && has_block( 'zmblocks/' . $name, $post ) ) {
                $this->blockStyles( $name, 'frontend' );
            }
        }
    }

    public function editor(): void {
        if ( ! is_admin() ) { return; }
        $screen = get_current_screen();
        if ( ! $screen || ! $screen->is_block_editor() ) { return; }
        // Available before insertion, including inside the content iframe. No UIkit JS.
        foreach ( array( 'section', 'icon', 'grid', 'column', 'card', 'image', 'button', 'filter', 'overlay' ) as $name ) { $this->blockStyles( $name, 'editor-content' ); }
    }

    public function rendered( string $html, array $block ): string {
        if ( '' === $html || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_admin() ) { return $html; }
        if ( 'zmblocks/overlay' === ( $block['blockName'] ?? '' ) && 'hover' === ( $block['attrs']['visibility'] ?? 'hover' ) ) {
            wp_enqueue_script( 'zmblocks-overlay-touch', plugins_url( 'build/blocks/overlay/view.js', $this->pluginFile ), array(), (string) filemtime( dirname( $this->pluginFile ) . '/build/blocks/overlay/view.js' ), true );
        }
        $interactiveGrid = 'zmblocks/grid' === ( $block['blockName'] ?? '' ) && ( 'none' !== ( $block['attrs']['masonry'] ?? 'none' ) || ! empty( $block['attrs']['divider'] ) || 'none' !== ( $block['attrs']['scrollspy'] ?? 'none' ) );
        if ( $interactiveGrid || 'zmblocks/filter' === ( $block['blockName'] ?? '' ) || ( 'zmblocks/image' === ( $block['blockName'] ?? '' ) && 'lightbox' === ( $block['attrs']['linkDestination'] ?? '' ) ) ) {
            wp_enqueue_script( 'zmblocks-interactive', plugins_url( 'build/interactive.js', $this->pluginFile ), array(), (string) filemtime( dirname( $this->pluginFile ) . '/build/interactive.js' ), true );
        }
        $handles = $this->blockStyles( substr( $block['blockName'] ?? 'zmblocks/section', 9 ), 'frontend' );
        if ( 'zmblocks/image' === ( $block['blockName'] ?? '' ) && 'lightbox' === ( $block['attrs']['linkDestination'] ?? '' ) ) { $handles = array_merge( $handles, $this->localStyle( 'zmblocks-lightbox', 'interactive.css' ) ); }
        if ( ! did_action( 'wp_head' ) ) { return $html; }
        // Classic themes, synced patterns and dynamic sources may render after wp_head.
        // Print any still-pending handles once, with dependencies, directly before the block.
        ob_start();
        foreach ( $handles as $handle ) {
            if ( ! wp_style_is( $handle, 'done' ) ) { wp_print_styles( array( $handle ) ); }
        }
        return ob_get_clean() . $html;
    }
}
