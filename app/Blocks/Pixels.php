<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;
final class Pixels {
    public static function radius( array $v ): string {
        return ! empty( $v['radiusIndividual'] ) ? implode( ' ', array_map( static fn( $key ) => self::value( '' === $v[$key] ? $v['radius'] : $v[$key] ) . 'px', array( 'radiusTopLeft', 'radiusTopRight', 'radiusBottomRight', 'radiusBottomLeft' ) ) ) : self::value( $v['radius'] ) . 'px';
    }
    public static function value( string $value, float $fallback = 0, float $min = 0 ): string {
        $value = array( 'none' => '0', 'small' => '4', 'large' => '12' )[$value] ?? $value;
        return is_numeric( $value ) && is_finite( (float) $value ) && (float) $value >= $min ? (string) (float) $value : (string) $fallback;
    }
}
