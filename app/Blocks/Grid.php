<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;
final class Grid {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'grid', $attributes );
        $classes = array( 'zmblocks-grid' );
        $classes[] = 'uk-grid';
        foreach ( array( 'justify', 'alignItems', 'direction', 'wrap' ) as $key ) { $classes[] = 'uk-flex-' . $v[$key]; }
        $classes[] = 'uk-flex-wrap-' . $v['alignContent'];
        foreach ( array( 'columns' => '', 'columnsSmall' => 's-', 'columnsMedium' => 'm-', 'columnsLarge' => 'l-' ) as $key => $prefix ) { if ( '' !== $v[$key] ) { $classes[] = 'zmblocks-cols-' . $prefix . $v[$key]; } }
        if ( 'default' !== $v['gap'] ) { $classes[] = 'uk-grid-' . $v['gap']; }
        if ( $v['divider'] && 'none' === $v['masonry'] ) { $classes[] = 'zmblocks-grid-dividers'; }
        if ( $v['equalHeight'] && 'none' === $v['masonry'] ) { $classes[] = 'zmblocks-grid-equal'; }
        if ( 'none' !== $v['masonry'] ) { $classes[] = 'zmblocks-masonry-' . $v['masonry']; }
        $extra = array( 'class' => implode( ' ', $classes ) );
        if ( $v['divider'] && 'none' === $v['masonry'] ) { $extra['data-zmblocks-grid-lines'] = ''; }
        if ( 'none' !== $v['scrollspy'] && 'none' === $v['masonry'] ) { $extra['data-zmblocks-scrollspy'] = $v['scrollspy']; $extra['data-zmblocks-scrollspy-delay'] = (string) min( 1000, $v['scrollspyDelay'] ); $extra['data-zmblocks-scrollspy-repeat'] = $v['scrollspyRepeat'] ? 'true' : 'false'; }
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $tag = $v['tagName'] ?? 'div';
        return '<' . $tag . ' ' . get_block_wrapper_attributes( $extra ) . '>' . $content . '</' . $tag . '>';
    }
}
