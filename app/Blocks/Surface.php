<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Surface {
    /** Input has already been normalized against block metadata. */
    public static function styles( array $v ): string {
        $styles = array();
        foreach ( array( 'surfaceColor' => 'background-color', 'textColor' => 'color' ) as $key => $property ) {
            $value = $v[$key] ?? '';
            if ( preg_match( '/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i', $value ) ) { $styles[] = $property . ':' . $value; }
        }
        if ( ! empty( $v['backgroundImageId'] ) && wp_attachment_is_image( $v['backgroundImageId'] ) ) {
            $url = wp_get_attachment_image_url( $v['backgroundImageId'], 'full' );
            if ( $url ) {
                $url = esc_url_raw( $url, array( 'http', 'https' ) );
                if ( $url ) {
                    $styles[] = 'background-image:url(' . wp_json_encode( $url, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ')';
                    $styles[] = 'background-size:' . $v['backgroundSize'];
                    $styles[] = 'background-position:' . $v['backgroundPosition'];
                    $styles[] = 'background-repeat:no-repeat';
                }
            }
        }
        return implode( ';', $styles );
    }
}
