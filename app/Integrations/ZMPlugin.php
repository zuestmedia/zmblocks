<?php
namespace ZMP\Blocks\Integrations;

defined( 'ABSPATH' ) || exit;

/** Register the companion without making the standalone services depend on it. */
final class ZMPlugin {
    private bool $connected = false;

    public function __construct( private string $pluginFile ) {}

    public function register(): void {
        // Bind during plugins_loaded, before ZMPlugin binds its dashboard callback at init.
        // Check classes in the callback: plugin file order must not determine integration.
        add_action( 'zmplugin_loaded', array( $this, 'connect' ), 10 );
    }

    public function connect(): void {
        global $zmplugin;

        if ( $this->connected || ! class_exists( '\\ZMP\\Plugin\\Plugin' )
            || ! class_exists( '\\ZMP\\Plugin\\PluginHelper' )
            || ! isset( $zmplugin['zmplugin'] ) ) {
            return;
        }

        $basename = plugin_basename( $this->pluginFile );
        $slug = \ZMP\Plugin\PluginHelper::getPluginSlug( $basename );
        if ( isset( $zmplugin[ $slug ] ) ) {
            return;
        }

        $plugin = new \ZMP\Plugin\Plugin( $basename );
        $plugin->setDisplayName( 'ZMBlocks' );
        $plugin->setConfigVersion( ZMBLOCKS_VERSION );
        //phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Register in ZMPlugin's existing global registry.
        $zmplugin[ $slug ] = $plugin;
        \ZMP\Plugin\PluginHelper::registerExtension( $basename );
        $this->connected = true;
    }
}
