<?php
namespace ZMP\Blocks\Blocks;

defined( 'ABSPATH' ) || exit;

/** Server-side validation is also applied when content bypasses the editor. */
final class Section {
    public static function attributes( array $attributes ): array {
        return Attributes::normalize( 'section', $attributes );
    }

    public static function classes( array $attributes ): string {
        $values = self::attributes( $attributes );
        $classes = array( 'zmblocks-section', 'uk-section' );
        if ( preg_match( '/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i', $values['textColor'] ) ) { $classes[] = 'zmblocks-custom-text'; }
        if ( 'none' !== $values['background'] ) { $classes[] = 'uk-section-' . $values['background']; }
        if ( 'default' !== $values['size'] ) {
            $classes[] = 'none' === $values['size'] ? 'uk-padding-remove-vertical' : 'uk-section-' . $values['size'];
        }
        if ( $values['preserveColor'] ) { $classes[] = 'uk-preserve-color'; }
        if ( 'auto' !== $values['viewportHeight'] ) { $classes[] = 'zmblocks-viewport-' . $values['viewportHeight']; }
        if ( 'top' !== $values['verticalAlignment'] ) { $classes[] = 'zmblocks-vertical-' . $values['verticalAlignment']; }
        return implode( ' ', $classes );
    }

    public static function render( array $attributes, string $content ): string {
        $values = self::attributes( $attributes );
        $extra = array( 'class' => self::classes( $values ) );
        $style = Surface::styles( $values );
        if ( '' !== $style ) { $extra['style'] = $style; }
        if ( '' !== $values['anchor'] ) { $extra['id'] = $values['anchor']; }
        $wrapper = get_block_wrapper_attributes( $extra );
        if ( 'none' !== $values['contentWidth'] ) {
            $classes = 'zmblocks-section-content zmblocks-container uk-container';
            if ( 'default' !== $values['contentWidth'] ) { $classes .= ' uk-container-' . $values['contentWidth']; }
            $content = '<div class="' . esc_attr( $classes ) . '">' . $content . '</div>';
        }
        // $content is the result of WordPress rendering InnerBlocks, not a raw attribute.
        return '<' . $values['tagName'] . ' ' . $wrapper . '>' . $content . '</' . $values['tagName'] . '>';
    }
}
