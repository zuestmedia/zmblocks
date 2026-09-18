<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Button {
    public static function render( array $attributes, string $content = '' ): string {
        $v = Attributes::normalize( 'button', $attributes );
        $label = trim( $v['label'] );
        if ( '' === $label ) { $label = __( 'Button', 'zmblocks' ); }
        $text = '<span class="zmblocks-button-label">' . esc_html( $label ) . '</span>';
        $icon = '';
        if ( $v['iconEnabled'] ) {
            $svg = str_replace( '<svg ', '<svg focusable="false" ', Icon::svg( $v['icon'] ) );
            $icon = '<span class="zmblocks-button-icon" aria-hidden="true">' . $svg . '</span>';
        }
        $inner = 'before' === $v['iconPosition'] ? $icon . $text : $text . $icon;
        $classes = 'zmblocks-button-control uk-button uk-button-' . $v['variant'];
        if ( 'default' !== $v['size'] ) { $classes .= ' uk-button-' . $v['size']; }
        $url = esc_url( trim( $v['url'] ), array( 'http', 'https', 'mailto', 'tel' ) );
        if ( '' !== $url ) {
            $target = $v['newTab'] ? ' target="_blank" rel="noopener noreferrer"' : '';
            $control = '<a class="' . esc_attr( $classes ) . '" href="' . $url . '"' . $target . '>' . $inner . '</a>';
        } else {
            $control = '<span class="' . esc_attr( $classes . ' zmblocks-button-unlinked' ) . '">' . $inner . '</span>';
        }
        $extra = array( 'class' => 'zmblocks-button zmblocks-button-align-' . $v['alignment'] . ( $v['fullWidth'] ? ' zmblocks-button-full' : '' ) );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        return '<div ' . get_block_wrapper_attributes( $extra ) . '>' . $control . '</div>';
    }
}
