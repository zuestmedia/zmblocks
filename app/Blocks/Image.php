<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Image {
    public static function render( array $attributes, string $content = '' ): string {
        $v = Attributes::normalize( 'image', $attributes );
        if ( ! $v['id'] || ! wp_attachment_is_image( $v['id'] ) ) { return ''; }
        // WordPress supplies intrinsic dimensions, srcset/sizes and loading optimizations.
        // An explicitly empty alt remains empty, rather than falling back to attachment metadata.
        $image = wp_get_attachment_image( $v['id'], $v['sizeSlug'], false, array( 'alt' => $v['alt'] ) );
        if ( ! $image ) { return ''; }
        $link = match ( $v['linkDestination'] ) {
            'media', 'lightbox' => wp_get_attachment_url( $v['id'] ),
            'custom' => $v['linkUrl'],
            default => '',
        };
        $url = esc_url( (string) $link, array( 'http', 'https' ) );
        if ( '' !== $url ) {
            $target = 'lightbox' !== $v['linkDestination'] && $v['newTab'] ? ' target="_blank" rel="noopener noreferrer"' : '';
            // A linked image needs an accessible link name even when the image is decorative.
            $label = '' === trim( $v['alt'] ) ? ' aria-label="' . esc_attr__( 'Open image link', 'zmblocks' ) . '"' : '';
            $lightbox = 'lightbox' === $v['linkDestination'] ? ' data-zmblocks-lightbox-link data-type="image" data-alt="' . esc_attr( $v['alt'] ) . '"' : '';
            $image = '<a' . $lightbox . ' href="' . $url . '"' . $target . $label . '>' . $image . '</a>';
        }
        $extra = array( 'class' => 'zmblocks-image zmblocks-image-ratio-' . $v['ratio'] . ' zmblocks-image-fit-' . $v['fit'] . ' zmblocks-image-position-' . $v['position'] );
        $extra['class'] .= ' zmblocks-image-align-' . $v['imageAlign'] . ' zmblocks-image-width-' . $v['widthMode'];
        if ( 'custom' === $v['widthMode'] ) {
            $extra['style'] = '--zmblocks-image-width:' . Pixels::value( $v['imageWidth'], 320, 1 ) . 'px';
        } elseif ( 'auto' === $v['widthMode'] ) {
            $source = wp_get_attachment_image_src( $v['id'], $v['sizeSlug'] );
            if ( $source && (int) $source[1] > 0 ) {
                $extra['style'] = '--zmblocks-image-natural-width:' . (int) $source[1] . 'px';
            }
        }
        $image = '<span class="zmblocks-image-media">' . $image . '</span>';
        if ( 'lightbox' === $v['linkDestination'] ) { $extra['data-zmblocks-lightbox'] = ''; $extra['data-zmblocks-close-label'] = __( 'Close image', 'zmblocks' ); }
        if ( '' !== $v['anchor'] ) { $extra['id'] = $v['anchor']; }
        $caption = '' !== trim( $v['caption'] ) ? '<figcaption>' . wp_kses_post( $v['caption'] ) . '</figcaption>' : '';
        return '<figure ' . get_block_wrapper_attributes( $extra ) . '>' . $image . $caption . '</figure>';
    }
}
