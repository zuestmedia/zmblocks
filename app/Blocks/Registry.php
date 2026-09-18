<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

final class Registry {
    /** Shared inventory for registration, diagnostics and the administration page. */
    public const NAMES = array( 'section', 'icon', 'grid', 'column', 'card', 'image', 'button', 'filter', 'overlay' );

    public static function catalog(): array {
        return array(
            'section' => array( __( 'Section', 'zmblocks' ), __( 'Content width, backgrounds, spacing and viewport height.', 'zmblocks' ) ),
            'icon' => array( __( 'Icon', 'zmblocks' ), __( 'Local UIkit icons with custom pixel sizes and text alignment.', 'zmblocks' ) ),
            'grid' => array( __( 'Grid', 'zmblocks' ), __( 'Column count, responsive layout, Flex, dividers, Scrollspy and padding/margin.', 'zmblocks' ) ),
            'column' => array( __( 'Column', 'zmblocks' ), __( 'Inside Grid: arbitrary blocks, responsive widths, visual order and filter categories.', 'zmblocks' ) ),
            'card' => array( __( 'Card', 'zmblocks' ), __( 'Optional content wrapper with colors, backgrounds, links, corner radii, text alignment and padding/margin.', 'zmblocks' ) ),
            'image' => array( __( 'Image', 'zmblocks' ), __( 'Image box with natural/full/custom width, alignment, padding/margin, captions and optional lightbox.', 'zmblocks' ) ),
            'button' => array( __( 'Button', 'zmblocks' ), __( 'Links styled as buttons, with optional inline icons.', 'zmblocks' ) ),
            'filter' => array( __( 'Filter', 'zmblocks' ), __( 'Freely named categories filtering Grid Columns.', 'zmblocks' ) ),
            'overlay' => array( __( 'Overlay', 'zmblocks' ), __( 'Image with editable overlay content, hover/focus effects and rounded corners.', 'zmblocks' ) ),
        );
    }

    public function __construct( private string $pluginFile ) {}

    public function register(): void {
        add_action( 'init', array( $this, 'blocks' ), 20 );
        add_action( 'init', array( Patterns::class, 'register' ), 21 );
        add_filter( 'block_categories_all', array( $this, 'categories' ) );
        add_action( 'admin_notices', array( $this, 'missingBuildNotice' ) );
    }

    public function missingBuildNotice(): void {
        if ( ! current_user_can( 'activate_plugins' ) ) { return; }
        foreach ( self::NAMES as $name ) {
            if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'zmblocks/' . $name ) ) {
                echo '<div class="notice notice-error"><p>' . esc_html__( 'ZMBlocks: a block could not be registered. Run npm run build in the zmblocks folder and make sure the complete build directory is deployed.', 'zmblocks' ) . '</p></div>';
                return;
            }
        }
    }

    public function categories( array $categories ): array {
        if ( ! in_array( 'zmblocks', array_column( $categories, 'slug' ), true ) ) {
            $categories[] = array( 'slug' => 'zmblocks', 'title' => __( 'ZM Blocks', 'zmblocks' ) );
        }
        return $categories;
    }

    public function blocks(): void {
        foreach ( self::NAMES as $name ) {
            $path = dirname( $this->pluginFile ) . '/build/blocks/' . $name;
            if ( in_array( $name, array( 'icon', 'button' ), true ) && ! is_file( dirname( $this->pluginFile ) . '/build/blocks/icon/icons.json' ) ) { continue; }
            if ( is_file( $path . '/block.json' ) && is_file( $path . '/index.asset.php' ) && is_file( $path . '/index.js' ) && is_file( $path . '/render.php' ) ) {
                $block = register_block_type( $path );
                if ( $block ) {
                    foreach ( $block->editor_script_handles as $handle ) {
                        wp_set_script_translations( $handle, 'zmblocks', dirname( $this->pluginFile ) . '/languages' );
                    }
                }
            }
        }
    }
}
