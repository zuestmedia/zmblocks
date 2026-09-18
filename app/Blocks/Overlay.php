<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Overlay {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'overlay', $attributes );
        $extra = array( 'class' => 'zmblocks-overlay zmblocks-overlay-' . $v['visibility'] . ' zmblocks-overlay-' . $v['variant'] . ' zmblocks-overlay-' . $v['position'] . ' zmblocks-overlay-' . $v['transition'] );
        $extra['style'] = 'border-radius:' . Pixels::radius( $v );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $url = esc_url( trim( $v['linkUrl'] ), array( 'http', 'https', 'mailto', 'tel' ) );
        if ( '' !== $url ) {
            $target = $v['newTab'] ? ' target="_blank" rel="noopener noreferrer"' : '';
            if ( ContentLink::canWrap( $content ) ) {
                $extra['class'] .= ' zmblocks-content-link';
                $name = ContentLink::hasName( $content ) ? '' : ' aria-label="' . esc_attr( trim( $v['linkLabel'] ) ?: __( 'Open link', 'zmblocks' ) ) . '"';
                return '<a ' . get_block_wrapper_attributes( $extra ) . ' href="' . $url . '"' . $target . $name . '>' . $content . '</a>';
            }
            $content .= '<a class="zmblocks-overlay-link" href="' . $url . '" aria-label="' . esc_attr( trim( $v['linkLabel'] ) ?: __( 'Open link', 'zmblocks' ) ) . '"' . $target . '></a>';
        } elseif ( 'hover' === $v['visibility'] ) {
            $extra['data-zmblocks-focus-proxy'] = '';
            $extra['tabindex'] = '0';
            $extra['role'] = 'group';
            $extra['aria-label'] = __( 'Image with overlay', 'zmblocks' );
        }
        return '<div ' . get_block_wrapper_attributes( $extra ) . '>' . $content . '</div>';
    }
}
