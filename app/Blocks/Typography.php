<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

/** Optional typography for Core text blocks; Core save markup remains unchanged. */
final class Typography {
    public function __construct( private string $pluginFile ) {}

    private function schema(): array {
        static $schema;
        return $schema ??= json_decode( file_get_contents( dirname( $this->pluginFile ) . '/build/typography-schema.json' ), true );
    }

    public function register(): void {
        add_filter( 'register_block_type_args', array( $this, 'attributes' ), 10, 2 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'editor' ) );
        add_action( 'enqueue_block_assets', array( $this, 'editorStyles' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'frontendStyles' ) );
        foreach ( array( 'heading', 'paragraph' ) as $name ) {
            add_filter( 'render_block_core/' . $name, array( $this, 'render' ), 10, 2 );
        }
    }

    public function attributes( array $args, string $name ): array {
        if ( ! in_array( $name, array( 'core/heading', 'core/paragraph' ), true ) ) { return $args; }
        foreach ( $this->schema() as $key => $values ) {
            $args['attributes'][$key] = array( 'type' => 'string', 'enum' => $values, 'default' => '' );
        }
        return $args;
    }

    public function editor(): void {
        $base = dirname( $this->pluginFile ) . '/build/';
        if ( ! is_file( $base . 'typography.asset.php' ) ) { return; }
        $asset = require $base . 'typography.asset.php';
        wp_enqueue_script( 'zmblocks-typography', plugins_url( 'build/typography.js', $this->pluginFile ), $asset['dependencies'], $asset['version'], true );
        wp_set_script_translations( 'zmblocks-typography', 'zmblocks', dirname( $this->pluginFile ) . '/languages' );
    }

    private function styles(): void {
        $file = dirname( $this->pluginFile ) . '/build/uikit/typography.css';
        if ( is_file( $file ) ) { wp_enqueue_style( 'zmblocks-typography', plugins_url( 'build/uikit/typography.css', $this->pluginFile ), array(), (string) filemtime( $file ) ); }
    }

    public function editorStyles(): void {
        if ( is_admin() ) { $screen = get_current_screen(); if ( $screen && $screen->is_block_editor() ) { $this->styles(); } }
    }

    public function frontendStyles(): void {
        // Core text can come from templates, synced patterns or dynamic sources.
        // Enqueue the small scoped sheet before wp_head prints styles, never inside content.
        $this->styles();
    }

    public function render( string $html, array $block ): string {
        $name = $block['blockName'] ?? '';
        if ( ! in_array( $name, array( 'core/heading', 'core/paragraph' ), true ) ) { return $html; }
        $a = $block['attrs'] ?? array();
        $keys = 'core/heading' === $name ? array( 'zmHeadingSize' => 'uk-heading-', 'zmHeadingDecoration' => 'uk-heading-' ) : array( 'zmTextStyle' => 'uk-text-', 'zmTextSize' => 'uk-text-' );
        $keys += array( 'zmTextWeight' => 'uk-text-', 'zmTextTransform' => 'uk-text-' );
        $classes = array();
        foreach ( $keys as $key => $prefix ) {
            if ( ! empty( $a[$key] ) && in_array( $a[$key], $this->schema()[$key], true ) ) { $classes[] = $prefix . $a[$key]; }
        }
        if ( ! $classes ) { return $html; }
        $tags = new \WP_HTML_Tag_Processor( $html );
        if ( ! $tags->next_tag() || ! in_array( $tags->get_tag(), 'core/heading' === $name ? array( 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ) : array( 'P' ), true ) ) { return $html; }
        $tags->add_class( 'zmblocks-typography' );
        foreach ( $classes as $class ) { $tags->add_class( $class ); }
        if ( ! empty( $a['fontSize'] ) || ! empty( $a['style']['typography']['fontSize'] ) ) { $tags->add_class( 'zmblocks-core-font-size' ); }
        return $tags->get_updated_html();
    }
}
