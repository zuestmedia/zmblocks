<?php
defined( 'ABSPATH' ) || exit;
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes attributes and labels; content is WordPress-rendered InnerBlocks.
echo \ZMP\Blocks\Blocks\Tabs::item( $attributes, $content );
