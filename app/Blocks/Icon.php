<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

/** Server-side validation is also applied when content bypasses the editor. */
final class Icon {
    public static function attributes( array $attributes ): array {
        static $schema;
        if ( null === $schema ) {
            $metadata = json_decode( file_get_contents( dirname( __DIR__, 2 ) . '/build/blocks/icon/block.json' ), true );
            $schema = $metadata['attributes'];
        }
        $result = array();
        foreach ( $schema as $name => $definition ) {
            $value = $attributes[$name] ?? null;
            $valid = 'boolean' === $definition['type'] ? is_bool( $value ) : is_string( $value );
            if ( isset( $definition['enum'] ) ) {
                $valid = $valid && in_array( $value, $definition['enum'], true );
            }
            $result[$name] = $valid ? $value : $definition['default'];
        }
        return $result;
    }

    /** Only return assets from the bundled catalog, never a user-provided path or SVG. */
    public static function svg( string $name ): string {
        static $icons;
        if ( null === $icons ) { $icons = json_decode( file_get_contents( dirname( __DIR__, 2 ) . '/build/blocks/icon/icons.json' ), true ); }
        return $icons[$name] ?? $icons['star'];
    }

    public static function render( array $attributes, string $content = '' ): string {
        $values = self::attributes( $attributes );
        $svg = self::svg( $values['icon'] );
        $extra = array( 'class' => 'zmblocks-icon', 'style' => '--zmblocks-icon-size:' . Pixels::value( $values['size'], 20, 1 ) . 'px' );
        if ( '' !== $values['textAlign'] ) { $extra['style'] .= ';text-align:' . $values['textAlign']; }
        if ( '' !== $values['anchor'] ) { $extra['id'] = $values['anchor']; }
        $label = trim( $values['label'] );
        $accessibility = '' === $label ? ' aria-hidden="true"' : ' role="img" aria-label="' . esc_attr( $label ) . '"';
        // SVG comes exclusively from the checked-in, validated UIkit catalog. User input only selects an enum key.
        return '<div ' . get_block_wrapper_attributes( $extra ) . '><span' . $accessibility . '>' . $svg . '</span></div>';
    }
}
