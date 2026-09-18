<?php
defined( 'ABSPATH' ) || exit;
// Renderer escapes attributes, URLs and labels; $content is WordPress-rendered InnerBlocks HTML.
// A blanket KSES pass would remove valid child-block markup and the vetted local SVG catalog.
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Contextual escaping is performed by the block renderer.
echo \ZMP\Blocks\Blocks\Card::render( $attributes, $content ); // Escaping is owned by the renderer.
