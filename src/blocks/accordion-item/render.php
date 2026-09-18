<?php
defined( 'ABSPATH' ) || exit;
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes attributes and title; content is WordPress-rendered InnerBlocks.
echo \ZMP\Blocks\Blocks\Accordion::item( $attributes, $content, $block->context ?? array() );
