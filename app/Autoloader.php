<?php
namespace ZMP\Blocks;

defined( 'ABSPATH' ) || exit;

/** Independent namespace mapping; never uses the companion plugin's loader. */
final class Autoloader {
    private static bool $registered = false;

    public static function register(): void {
        if ( self::$registered ) {
            return;
        }
        self::$registered = true;
        spl_autoload_register( static function ( string $class ): void {
            $prefix = __NAMESPACE__ . '\\';
            if ( ! str_starts_with( $class, $prefix ) ) {
                return;
            }
            $relative = substr( $class, strlen( $prefix ) );
            if ( ! preg_match( '/^[A-Za-z_][A-Za-z0-9_]*(?:\\\\[A-Za-z_][A-Za-z0-9_]*)*$/D', $relative ) ) {
                return;
            }
            $file = __DIR__ . '/' . str_replace( '\\', '/', $relative ) . '.php';
            if ( is_file( $file ) ) {
                require_once $file;
            }
        } );
    }
}
