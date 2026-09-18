<?php
namespace ZMP\Blocks;

use ZMP\Blocks\Admin\StatusPage;

defined( 'ABSPATH' ) || exit;

/** Compose plugin services without starting any licensing or remote services. */
final class Init {
    private bool $registered = false;

    public function __construct( private string $pluginFile ) {}

    public function register(): void {
        if ( $this->registered ) {
            return;
        }
        $this->registered = true;
        ( new Integrations\ZMPlugin( $this->pluginFile ) )->register();
        add_action( 'init', array( $this, 'translations' ) );
        add_filter( 'wp_theme_json_data_theme', array( $this, 'spacingSettings' ) );
        $environment = new UIkit\Environment();
        ( new Assets\Registry( $this->pluginFile, $environment ) )->register();
        ( new Blocks\Registry( $this->pluginFile ) )->register();
        ( new Blocks\Typography( $this->pluginFile ) )->register();
        ( new Blocks\QueryGrid( $this->pluginFile ) )->register();
        if ( is_admin() ) {
            ( new StatusPage( $this->pluginFile ) )->register();
        }

        /** Fires once services have registered their hooks, before theme setup. */
        do_action( 'zmblocks_loaded', $this );
    }

    public function translations(): void {
        // Retain bundled translations for private/offline installs without WordPress.org language packs.
        // phpcs:ignore PluginCheck.CodeAnalysis.DiscouragedFunctions.load_plugin_textdomainFound -- Required for local language files on supported older WordPress installations.
        load_plugin_textdomain( 'zmblocks', false, dirname( plugin_basename( $this->pluginFile ) ) . '/languages' );
    }

    /** Enable native spacing controls only for the layout and image blocks, also in classic themes. */
    public function spacingSettings( $themeJson ) {
        $settings = array( 'spacing' => array( 'padding' => true, 'margin' => true ) );
        return $themeJson->update_with( array( 'version' => 2, 'settings' => array( 'blocks' => array(
            'zmblocks/grid' => $settings,
            'zmblocks/card' => $settings,
            'zmblocks/image' => $settings,
        ) ) ) );
    }
}
