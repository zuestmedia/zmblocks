<?php
namespace ZMP\Blocks\Admin;

defined( 'ABSPATH' ) || exit;

/** Read-only administration, available with any theme and without ZMPlugin. */
final class StatusPage {
    private bool $companionMenu = false;

    public function __construct( private string $pluginFile ) {}

    public function register(): void {
        // Resolve integration after ZMPlugin's init and menu registration.
        add_action( 'admin_menu', array( $this, 'menu' ), 20 );
        add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
        add_filter( 'plugin_action_links_' . plugin_basename( $this->pluginFile ), array( $this, 'actionLinks' ) );
    }

    public function menu(): void {
        global $zmplugin, $menu;

        $parent = isset( $zmplugin['zmplugin'] ) && is_object( $zmplugin['zmplugin'] )
            && is_callable( array( $zmplugin['zmplugin'], 'getSlug' ) )
            ? $zmplugin['zmplugin']->getSlug() : null;
        $parentExists = is_string( $parent ) && in_array( $parent, array_column( (array) $menu, 2 ), true );

        if ( $parentExists && class_exists( '\ZMP\Plugin\AdminMenu' ) ) {
            $adapter = new \ZMP\Blocks\Integrations\ZMPluginMenu( $this );
            $adapter->setSubMenuPageParent( $parent );
            $adapter->setSubMenuPageName( __( 'ZMBlocks', 'zmblocks' ) );
            $adapter->SubMenuPage();
            $this->companionMenu = true;
            return;
        }

        add_management_page( __( 'ZMBlocks', 'zmblocks' ), __( 'ZMBlocks', 'zmblocks' ), 'manage_options', 'zmblocks', array( $this, 'render' ) );
    }

    public function actionLinks( array $links ): array {
        if ( current_user_can( 'manage_options' ) ) {
            $url = admin_url( $this->companionMenu ? 'admin.php?page=zmblocks' : 'tools.php?page=zmblocks' );
            array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Overview', 'zmblocks' ) . '</a>' );
        }
        return $links;
    }

    public function assets( string $hook ): void {
        $screen = get_current_screen();
        if ( ! $screen || 'zmblocks' !== $screen->base && ! str_ends_with( $hook, '_page_zmblocks' ) ) {
            return;
        }
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $file = dirname( $this->pluginFile ) . '/build/admin.css';
        if ( is_file( $file ) ) {
            wp_enqueue_style( 'zmblocks-admin', plugins_url( 'build/admin.css', $this->pluginFile ), array(), (string) filemtime( $file ) );
        }
    }

    public function render(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You are not allowed to access this page.', 'zmblocks' ), '', array( 'response' => 403 ) );
            return;
        }
        $theme = wp_get_theme();
        $catalog = \ZMP\Blocks\Blocks\Registry::catalog();
        $rows = array(
            __( 'Plugin version', 'zmblocks' ) => ZMBLOCKS_VERSION,
            __( 'WordPress version', 'zmblocks' ) => get_bloginfo( 'version' ),
            __( 'PHP version', 'zmblocks' ) => PHP_VERSION,
            __( 'Active theme', 'zmblocks' ) => $theme->get( 'Name' ),
            __( 'Administration', 'zmblocks' ) => $this->companionMenu
                ? __( 'Integrated with ZMPlugin', 'zmblocks' ) : __( 'Standalone', 'zmblocks' ),
        );
        ?>
        <div class="wrap zmblocks-overview">
            <h1><?php esc_html_e( 'ZMBlocks', 'zmblocks' ); ?></h1>
            <p><?php esc_html_e( 'UIkit layout blocks for the WordPress editor.', 'zmblocks' ); ?></p>
            <div class="notice notice-info inline"><p><?php esc_html_e( 'Tabs / Switcher, Accordion, Section, Grid, Card, Image, Icon, Button, Filter and Overlay are available in the ZM Blocks category. Grid always contains Columns; Cards are optional. The Filterable showcase pattern combines editable blocks with your own categories. Image offers a full-screen lightbox.', 'zmblocks' ); ?></p></div>
            <h2><?php esc_html_e( 'Available blocks', 'zmblocks' ); ?></h2>
            <table class="widefat striped">
                <caption class="screen-reader-text"><?php esc_html_e( 'Block registration and features', 'zmblocks' ); ?></caption>
                <thead><tr><th scope="col"><?php esc_html_e( 'Block', 'zmblocks' ); ?></th><th scope="col"><?php esc_html_e( 'Status', 'zmblocks' ); ?></th><th scope="col"><?php esc_html_e( 'Features', 'zmblocks' ); ?></th></tr></thead>
                <tbody>
                <?php foreach ( \ZMP\Blocks\Blocks\Registry::NAMES as $name ) :
                    $details = $catalog[$name];
                    $registered = \WP_Block_Type_Registry::get_instance()->is_registered( 'zmblocks/' . $name );
                    ?>
                    <tr><th scope="row"><?php echo esc_html( $details[0] ); ?><br><code><?php echo esc_html( 'zmblocks/' . $name ); ?></code></th><td><?php echo esc_html( $registered ? __( 'Registered', 'zmblocks' ) : __( 'Not registered. Check the plugin build.', 'zmblocks' ) ); ?></td><td><?php echo esc_html( $details[1] ); ?></td></tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <h2><?php esc_html_e( 'Core block extensions', 'zmblocks' ); ?></h2>
            <p><?php esc_html_e( 'Heading and Paragraph: optional UIkit typography, heading decoration, Lead/Meta, text size, weight and transformation. WordPress font sizes take priority.', 'zmblocks' ); ?></p>
            <h2><?php esc_html_e( 'Patterns', 'zmblocks' ); ?></h2>
            <p><?php esc_html_e( 'ZM Query Grid – Cards with post details: eight posts, offset three, responsive columns, featured images, date, author, categories, excerpt and pagination. Available under Patterns > ZM Blocks.', 'zmblocks' ); ?></p>
            <p><?php esc_html_e( 'ZM Post Overlay: optional Overlay variation with a native Featured Image and a Read more link to the current post. The overlay group remains freely editable. Insert it into a Query Loop Post Template instead of a Card.', 'zmblocks' ); ?></p>
            <p><?php esc_html_e( 'ZM Query Grid: insert this Query Loop variation from the block inserter. WordPress supplies posts, filters and pagination. Select its Post Template for responsive columns and gaps, and edit the nested ZM Card once for all posts. The normal Grid and Column blocks are unchanged.', 'zmblocks' ); ?></p>
            <p><?php esc_html_e( 'Filterable showcase: editable Cards, Images and Overlays with two freely editable sample categories. Patterns supply initial content only; new Grid Columns are always empty.', 'zmblocks' ); ?></p>
            <h2><?php esc_html_e( 'Planned extensions — not yet available', 'zmblocks' ); ?></h2>
            <p><?php esc_html_e( 'Next: Gallery, Slider and Slideshow. Central font management is a later optional ZMPlugin integration.', 'zmblocks' ); ?></p>
            <h2><?php esc_html_e( 'Environment', 'zmblocks' ); ?></h2>
            <table class="widefat striped">
                <caption class="screen-reader-text"><?php esc_html_e( 'ZMBlocks environment information', 'zmblocks' ); ?></caption>
                <tbody>
                <?php foreach ( $rows as $label => $value ) : ?>
                    <tr><th scope="row"><?php echo esc_html( $label ); ?></th><td><?php echo esc_html( $value ); ?></td></tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <h2><?php esc_html_e( 'Independent by design', 'zmblocks' ); ?></h2>
            <p><?php esc_html_e( 'ZMBlocks works without ZMPlugin or ZMPro. No license is required. Layout styles are supplied by the theme or a small local fallback. Icons are bundled locally. No external services are contacted.', 'zmblocks' ); ?></p>
        </div>
        <?php
    }
}
