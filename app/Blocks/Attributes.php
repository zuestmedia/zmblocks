<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;
/** Validate block input against the same metadata used by Gutenberg. */
final class Attributes {
    public static function normalize( string $name, array $attributes ): array {
        static $schemas = array();
        if ( ! isset( $schemas[$name] ) ) {
            $data = json_decode( file_get_contents( dirname( __DIR__, 2 ) . '/build/blocks/' . $name . '/block.json' ), true );
            $schemas[$name] = $data['attributes'];
        }
        $result = array();
        foreach ( $schemas[$name] as $key => $schema ) {
            $value = $attributes[$key] ?? null;
            $valid = match ( $schema['type'] ) {
                'boolean' => is_bool( $value ),
                'integer' => is_int( $value ) && $value >= ( $schema['minimum'] ?? 0 ),
                default => is_string( $value ),
            };
            if ( isset( $schema['enum'] ) ) { $valid = $valid && in_array( $value, $schema['enum'], true ); }
            $result[$key] = $valid ? $value : $schema['default'];
        }
        return $result;
    }
}
