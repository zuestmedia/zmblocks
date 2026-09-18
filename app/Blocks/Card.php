<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;
final class Card {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'card', $attributes );
        $classes = array( 'zmblocks-card' );
        $classes[] = 'uk-card';
        if ( preg_match( '/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i', $v['textColor'] ) ) { $classes[] = 'zmblocks-custom-text'; }
        $classes[] = 'zmblocks-card-direct';
        if ( 'none' !== $v['size'] ) { $classes[] = 'uk-card-body'; }
        $classes[] = 'zmblocks-shadow-' . $v['shadow'];
        if ( 'none' !== $v['variant'] ) { $classes[] = 'uk-card-' . $v['variant']; }
        if ( 'default' !== $v['size'] ) { $classes[] = 'uk-card-' . $v['size']; }
        if ( $v['hover'] ) { $classes[] = 'uk-card-hover'; }
        $extra = array( 'class' => implode( ' ', $classes ) );
        $tags = array_filter( array_map( 'trim', explode( ',', $v['filterTags'] ) ), static fn( $tag ) => '' !== $tag );
        if ( $tags ) { $extra['data-zmblocks-tags'] = implode( ' ', array_map( 'bin2hex', array_unique( $tags ) ) ); }
        $style = 'border-radius:' . Pixels::radius( $v ) . ';' . Surface::styles( $v );
        if ( '' !== $v['textAlign'] ) { $style .= ';text-align:' . $v['textAlign'] . ';'; }
        if ( '' !== $style ) { $extra['style'] = $style; }
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $tag = $v['tagName'] ?? 'div';
        $url = esc_url( trim( $v['linkUrl'] ), array( 'http', 'https', 'mailto', 'tel' ) );
        if ( '' !== $url ) {
            $label = trim( $v['linkLabel'] ) ?: __( 'Open card', 'zmblocks' );
            $target = $v['newTab'] ? ' target="_blank" rel="noopener noreferrer"' : '';
            $wrappedContent = ContentLink::withParentFocus( $content );
            if ( ContentLink::canWrap( $wrappedContent ) ) {
                $extra['class'] .= ' zmblocks-content-link';
                $name = ContentLink::hasName( $wrappedContent ) ? '' : ' aria-label="' . esc_attr( $label ) . '"';
                return '<a ' . get_block_wrapper_attributes( $extra ) . ' href="' . $url . '"' . $target . $name . '>' . $wrappedContent . '</a>';
            }
            $content .= '<a class="zmblocks-card-link" href="' . $url . '" aria-label="' . esc_attr( $label ) . '"' . $target . '></a>';
        }
        return '<' . $tag . ' ' . get_block_wrapper_attributes( $extra ) . '>' . $content . '</' . $tag . '>';
    }
}
