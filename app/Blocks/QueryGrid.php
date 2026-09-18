<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

/** A layout variation of Core's query/post-template, with no separate query engine. */
final class QueryGrid {
    public function __construct( private string $pluginFile ) {}

    public function register(): void {
        add_action( 'enqueue_block_editor_assets', array( $this, 'editor' ) );
        add_action( 'enqueue_block_assets', array( $this, 'editorStyles' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'styles' ) );
        add_filter( 'render_block_core/post-template', array( $this, 'rendered' ), 10, 2 );
    }

    public function rendered( string $html, array $block ): string {
        $classes = preg_split( '/\s+/', $block['attrs']['className'] ?? '' );
        if ( ! is_admin() && ! ( defined( 'REST_REQUEST' ) && REST_REQUEST ) && '' !== $html
            && in_array( 'zmblocks-query-grid', $classes, true )
            && array_intersect( array( 'zmblocks-masonry-pack', 'zmblocks-masonry-next' ), $classes ) ) {
            wp_enqueue_script( 'zmblocks-interactive', plugins_url( 'build/interactive.js', $this->pluginFile ), array(), (string) filemtime( dirname( $this->pluginFile ) . '/build/interactive.js' ), true );
        }
        return $html;
    }

    public function editor(): void {
        $file = dirname( $this->pluginFile ) . '/build/query-grid.asset.php';
        if ( ! is_file( $file ) ) { return; }
        $asset = require $file;
        wp_enqueue_script( 'zmblocks-query-grid', plugins_url( 'build/query-grid.js', $this->pluginFile ), $asset['dependencies'], $asset['version'], true );
        wp_set_script_translations( 'zmblocks-query-grid', 'zmblocks', dirname( $this->pluginFile ) . '/languages' );
    }

    public function editorStyles(): void {
        if ( is_admin() ) {
            $screen = get_current_screen();
            if ( $screen && $screen->is_block_editor() ) { $this->styles(); }
        }
    }

    public function styles(): void {
        // Load the small scoped stylesheet in the head, including for dynamic templates.
        $file = dirname( $this->pluginFile ) . '/build/query-grid.css';
        if ( is_file( $file ) ) {
            wp_enqueue_style( 'zmblocks-query-grid', plugins_url( 'build/query-grid.css', $this->pluginFile ), array(), (string) filemtime( $file ) );
        }
    }
}
