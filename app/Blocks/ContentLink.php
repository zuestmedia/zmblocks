<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

/** Conservative eligibility check: arbitrary InnerBlocks may contain interactive HTML. */
final class ContentLink {
    /** Only remove focus attributes that our own unlinked Overlay generated.
     * The caller must discard this candidate if other interactive content prevents wrapping.
     */
    public static function withParentFocus( string $content ): string {
        return preg_replace_callback( '/<div\b(?:[^>"\']|"[^"]*"|\'[^\']*\')*>/i', static function ( array $match ): string {
            $tag = $match[0];
            if ( ! preg_match( '/\sdata-zmblocks-focus-proxy=""/', $tag ) || ! preg_match( '/\sclass="[^"]*\bzmblocks-overlay-hover\b/', $tag ) ) { return $tag; }
            return preg_replace( '/\s(?:data-zmblocks-focus-proxy|tabindex|role|aria-label)="[^"]*"/', '', $tag );
        }, $content );
    }

    public static function canWrap( string $content ): bool {
        return ! preg_match( '/<\s*(?:a|button|input|select|textarea|label|details|summary|iframe|object|embed|audio|video|script|style)\b|\b(?:tabindex|contenteditable|role|aria-hidden|hidden)(?:\s*=|\s|>)/i', $content );
    }

    public static function hasName( string $content ): bool {
        if ( '' !== trim( html_entity_decode( wp_strip_all_tags( $content ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ) ) { return true; }
        preg_match_all( '/<img\b[^>]*\balt\s*=\s*(["\'])(.*?)\1/is', $content, $matches );
        foreach ( $matches[2] as $alt ) {
            if ( '' !== trim( html_entity_decode( $alt, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ) ) { return true; }
        }
        return false;
    }
}
