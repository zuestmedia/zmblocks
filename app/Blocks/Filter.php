<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Filter {
    public static function render( array $attributes, string $content ): string {
        $v = Attributes::normalize( 'filter', $attributes );
        $categories = array_unique( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', $v['categories'] ) ), static fn( $label ) => '' !== $label ) );
        $extra = array( 'class' => 'zmblocks-filter zmblocks-filter-' . $v['appearance'], 'data-zmblocks-filter' => '', 'data-zmblocks-animation' => $v['animation'] ? 'true' : 'false' );
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $controls = '<li class="uk-active" uk-filter-control=""><button type="button" aria-pressed="true">' . esc_html( $v['allLabel'] ?: __( 'All', 'zmblocks' ) ) . '</button></li>';
        foreach ( $categories as $label ) {
            // Encode labels into selector-safe tokens; never accept CSS selectors from content.
            $selector = '[data-zmblocks-tags~="' . bin2hex( $label ) . '"]';
            $controls .= '<li uk-filter-control="' . esc_attr( $selector ) . '"><button type="button" aria-pressed="false">' . esc_html( $label ) . '</button></li>';
        }
        return '<div ' . get_block_wrapper_attributes( $extra ) . '><ul class="zmblocks-filter-controls" aria-label="' . esc_attr__( 'Filter items', 'zmblocks' ) . '">' . $controls . '</ul>' . $content . '<p class="zmblocks-filter-empty" role="status" aria-live="polite" hidden>' . esc_html( $v['emptyLabel'] ) . '</p></div>';
    }
}
