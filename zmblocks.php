<?php
/**
 * Plugin Name: ZMBlocks
 * Description: Independent UIkit layout blocks for WordPress, with optional ZuestMedia integration and modular fallback styles.
 * Version: 1.2.4
 * Requires at least: 6.5
 * Requires PHP: 8.2
 * Author: ZuestMedia
 * Author URI: https://zuestmedia.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: zmblocks
 * Domain Path: /languages
 * ZMDLID: q8c3651pw4ihrtrkhuzmfbe46ju907iqfr0y
 * ZMUPDAPI: zm
 *
 * @package ZMBlocks
 */

defined( 'ABSPATH' ) || exit;

// Keep this entry point parseable on older PHP versions for a graceful refusal.
if ( version_compare( PHP_VERSION, '8.2', '<' ) || version_compare( $GLOBALS['wp_version'], '6.5', '<' ) ) {
    add_action( 'admin_notices', static function () {
        if ( current_user_can( 'activate_plugins' ) ) {
            echo '<div class="notice notice-error"><p>';
            echo esc_html__( 'ZMBlocks requires WordPress 6.5 and PHP 8.2 or newer.', 'zmblocks' );
            echo '</p></div>';
        }
    } );
    return;
}

define( 'ZMBLOCKS_VERSION', '1.2.4' );
define( 'ZMBLOCKS_FILE', __FILE__ );

require_once __DIR__ . '/app/Autoloader.php';
\ZMP\Blocks\Autoloader::register();

add_action( 'plugins_loaded', static function () {
    $plugin = new \ZMP\Blocks\Init( ZMBLOCKS_FILE );
    $plugin->register();
} );
