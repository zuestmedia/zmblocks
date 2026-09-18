<?php
defined( 'ABSPATH' ) || exit;
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes attributes and title; content is WordPress-rendered InnerBlocks.
echo \ZMP\Blocks\Blocks\Accordion::render( $attributes, $content );
