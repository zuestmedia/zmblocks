<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

final class Accordion {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'accordion', $attributes );
        $extra = array(
            'class' => 'zmblocks-accordion uk-accordion',
            'data-zmblocks-accordion' => '',
            'data-zmblocks-multiple' => $v['multiple'] ? 'true' : 'false',
            'data-zmblocks-collapsible' => $v['collapsible'] ? 'true' : 'false',
            'data-zmblocks-animation' => $v['animation'] ? 'true' : 'false',
            'data-zmblocks-active' => (string) $v['active'],
        );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        return '<div ' . get_block_wrapper_attributes( $extra ) . '>' . $content . '</div>';
    }

    public static function item( array $attributes, string $content, array $context = array() ): string {
        $v = Attributes::normalize( 'accordion-item', $attributes );
        $keys = array( 'headingLevel', 'titleStyle', 'textAlign', 'decoration', 'weight', 'transform' );
        $defaults = Attributes::normalize( 'accordion-item', array() );
        $custom = 'custom' === $v['titleDesign'];
        if ( 'auto' === $v['titleDesign'] ) {
            foreach ( $keys as $key ) {
                if ( $v[$key] !== $defaults[$key] ) { $custom = true; break; }
            }
        }
        if ( ! $custom ) {
            $inherited = array();
            foreach ( $keys as $key ) { $inherited[$key] = $context['zmblocks/accordion/' . $key] ?? $defaults[$key]; }
            $inherited = Attributes::normalize( 'accordion-item', $inherited );
            foreach ( $keys as $key ) { $v[$key] = $inherited[$key]; }
        }
        $extra = array( 'class' => 'zmblocks-accordion-item' );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $heading = $v['headingLevel'];
        $classes = array( 'zmblocks-accordion-heading', 'zmblocks-typography' );
        if ( 'accordion' !== $v['titleStyle'] ) { $classes[] = 'zmblocks-custom-title'; }
        if ( ! in_array( $v['titleStyle'], array( 'accordion', 'heading' ), true ) ) {
            $classes[] = ( in_array( $v['titleStyle'], array( 'lead', 'meta' ), true ) ? 'uk-text-' : 'uk-heading-' ) . $v['titleStyle'];
        }
        foreach ( array( 'decoration' => 'uk-heading-', 'weight' => 'uk-text-', 'transform' => 'uk-text-' ) as $key => $prefix ) {
            if ( '' !== $v[$key] ) { $classes[] = $prefix . $v[$key]; }
        }
        $align = '' !== $v['textAlign'] ? ' style="text-align:' . esc_attr( $v['textAlign'] ) . '"' : '';
        $title = trim( wp_strip_all_tags( $v['title'] ) );
        if ( '' === $title ) { $title = __( 'Accordion item', 'zmblocks' ); }
        // Content stays readable without JS. UIkit manages panel visibility and ARIA relationships.
        return '<div ' . get_block_wrapper_attributes( $extra ) . '><' . $heading . ' class="' . esc_attr( implode( ' ', $classes ) ) . '"' . $align . '><button type="button" class="uk-accordion-title">'
            . esc_html( $title ) . '</button></' . $heading . '><div class="uk-accordion-content">' . $content . '</div></div>';
    }
}
