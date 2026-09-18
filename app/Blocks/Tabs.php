<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

final class Tabs {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'tabs', $attributes );
        $extra = array(
            'class' => 'zmblocks-tabs zmblocks-tabs-' . $v['position'],
            'data-zmblocks-tabs' => '',
            'data-zmblocks-position' => $v['position'],
            'data-zmblocks-active' => (string) $v['active'],
            'data-zmblocks-animation' => $v['animation'],
            'data-zmblocks-tab-label' => __( 'Tab', 'zmblocks' ),
        );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $label = $v['label'] ?: __( 'Tabs', 'zmblocks' );
        // Without JavaScript, all panels and their headings remain readable.
        return '<div ' . get_block_wrapper_attributes( $extra ) . '><div class="zmblocks-tabs-navigation" hidden><ul class="uk-tab" aria-label="'
            . esc_attr( $label ) . '"></ul></div><div class="zmblocks-tabs-panels">' . $content . '</div></div>';
    }

    public static function item( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'tab-item', $attributes );
        $title = trim( wp_strip_all_tags( $v['title'] ) );
        $extra = array( 'class' => 'zmblocks-tab-item', 'data-zmblocks-tab-title' => $title );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        return '<div ' . get_block_wrapper_attributes( $extra ) . '><h3 class="zmblocks-tab-title">'
            . esc_html( $title ?: __( 'Tab', 'zmblocks' ) ) . '</h3><div class="zmblocks-tab-content">' . $content . '</div></div>';
    }
}
