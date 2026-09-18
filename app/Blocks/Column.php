<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;
final class Column {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'column', $attributes );
        $classes = array( 'zmblocks-column' );
        foreach ( array( '' => '', 'Small' => '@s', 'Medium' => '@m', 'Large' => '@l', 'XLarge' => '@xl' ) as $key => $suffix ) {
            $width = $v['width' . $key];
            if ( '' !== $width ) { $classes[] = ( 'grid' === $width ? 'zmblocks-width-grid' : 'uk-width-' . $width ) . $suffix; }
        }
        foreach ( array( '' => '', 'Small' => '@s', 'Medium' => '@m', 'Large' => '@l', 'XLarge' => '@xl' ) as $key => $suffix ) { if ( '' !== $v['order' . $key] ) { $classes[] = 'uk-flex-' . $v['order' . $key] . $suffix; } }
        
        $extra = array( 'class' => implode( ' ', $classes ) );
        $tags = array_filter( array_map( 'trim', explode( ',', $v['filterTags'] ) ), static fn( $tag ) => '' !== $tag );
        if ( $tags ) { $extra['data-zmblocks-tags'] = implode( ' ', array_map( 'bin2hex', array_unique( $tags ) ) ); }
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $tag = $v['tagName'] ?? 'div';
        return '<' . $tag . ' ' . get_block_wrapper_attributes( $extra ) . '>' . $content . '</' . $tag . '>';
    }
}
