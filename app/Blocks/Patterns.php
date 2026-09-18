<?php
namespace ZMP\Blocks\Blocks;
defined( 'ABSPATH' ) || exit;

final class Patterns {
    public static function register(): void {
        if ( ! function_exists( 'register_block_pattern' ) ) { return; }
        register_block_pattern_category( 'zmblocks', array( 'label' => __( 'ZM Blocks', 'zmblocks' ) ) );
        register_block_pattern( 'zmblocks/query-grid-cards', array(
            'title' => __( 'ZM Query Grid – Cards with post details', 'zmblocks' ),
            'description' => __( 'Eight posts, skipping the first three, with linked featured images, date, author, categories, title, excerpt and pagination. Responsive columns: 1/1/2/3.', 'zmblocks' ),
            'categories' => array( 'zmblocks' ),
            'blockTypes' => array( 'core/query' ),
            'content' => self::queryCards(),
        ) );
        $cards = '';
        for ( $i = 1; $i <= 3; $i++ ) {
            $category = $i % 2 ? __( 'Category A', 'zmblocks' ) : __( 'Category B', 'zmblocks' );
            $cards .= '<!-- wp:zmblocks/column ' . wp_json_encode( array( 'filterTags' => $category ) ) . ' --><!-- wp:zmblocks/card {"variant":"primary","size":"none","hover":true,"tagName":"article","shadow":"large","radius":"25"} -->';
            $cards .= '<!-- wp:zmblocks/overlay {"visibility":"hover","variant":"default","position":"bottom","transition":"fade","radius":"0"} --><!-- wp:zmblocks/image /-->';
            $cards .= '<!-- wp:group {"className":"zmblocks-overlay-content","templateLock":false} --><div class="wp-block-group zmblocks-overlay-content"><!-- wp:paragraph --><p>' . esc_html__( 'View more', 'zmblocks' ) . '</p><!-- /wp:paragraph --></div><!-- /wp:group --><!-- /wp:zmblocks/overlay -->';
            $cards .= '<!-- wp:group {"style":{"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}}}} --><div class="wp-block-group" style="padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">' . esc_html__( 'Project', 'zmblocks' ) . ' ' . $i . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>' . esc_html__( 'Add your description here.', 'zmblocks' ) . '</p><!-- /wp:paragraph --></div><!-- /wp:group --><!-- /wp:zmblocks/card --><!-- /wp:zmblocks/column -->';
        }
        register_block_pattern( 'zmblocks/filterable-showcase', array(
            'title' => __( 'Filterable showcase', 'zmblocks' ),
            'description' => __( 'Editable Filter, Grid, Card, Overlay and Image blocks. Define your own categories and select media.', 'zmblocks' ),
            'categories' => array( 'zmblocks' ),
            'content' => '<!-- wp:zmblocks/filter ' . wp_json_encode( array( 'categories' => __( 'Category A', 'zmblocks' ) . "\n" . __( 'Category B', 'zmblocks' ) ) ) . ' --><!-- wp:zmblocks/grid {"columnsLarge":"3","columnsMedium":"2","equalHeight":true} -->' . $cards . '<!-- /wp:zmblocks/grid --><!-- /wp:zmblocks/filter -->',
        ) );
    }

    private static function queryCards(): string {
        // No fixed queryId or post date: Core supplies the instance ID and current post date.
        $content = '<!-- wp:query {"query":{"perPage":8,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"namespace":"zmblocks/query-grid"} -->';
        $content .= '<div class="wp-block-query"><!-- wp:post-template {"className":"zmblocks-query-grid zmblocks-query-cols-1 zmblocks-query-cols-large-3 zmblocks-query-cols-medium-2 zmblocks-query-cols-small-1 zmblocks-query-gap-large","layout":{"type":"default"}} -->';
        $content .= '<!-- wp:zmblocks/card {"size":"none","hover":true,"tagName":"article","shadow":"large","radius":"10"} -->';
        $content .= '<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2"} /-->';
        $content .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"var:preset|spacing|40","left":"var:preset|spacing|40"},"margin":{"bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->';
        $content .= '<div class="wp-block-group" style="margin-bottom:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:group {"style":{"border":{"width":"0px","style":"none"},"spacing":{"blockGap":"var:preset|spacing|40"}},"fontSize":"small","layout":{"type":"flex","flexWrap":"nowrap"}} -->';
        $content .= '<div class="wp-block-group has-small-font-size" style="border-style:none;border-width:0px"><!-- wp:post-date {"format":null} /-->';
        $content .= '<!-- wp:post-author-name {"isLink":true} /-->';
        $content .= '<!-- wp:post-terms {"term":"category"} /--></div>';
        $content .= '<!-- /wp:group -->';
        $content .= '<!-- wp:post-title {"isLink":true,"className":"uk-link-reset","fontSize":"medium"} /-->';
        $content .= '<!-- wp:post-excerpt ' . wp_json_encode( array( 'moreText' => __( 'Read more', 'zmblocks' ), 'excerptLength' => 15, 'style' => array( 'typography' => array( 'fontSize' => '15px' ) ) ) ) . ' /--></div>';
        $content .= '<!-- /wp:group -->';
        $content .= '<!-- /wp:zmblocks/card -->';
        $content .= '<!-- /wp:post-template -->';
        $content .= '<!-- wp:query-pagination -->';
        $content .= '<!-- wp:query-pagination-previous /-->';
        $content .= '<!-- wp:query-pagination-numbers /-->';
        $content .= '<!-- wp:query-pagination-next /-->';
        $content .= '<!-- /wp:query-pagination -->';
        $content .= '<!-- wp:query-no-results -->';
        $content .= '<!-- wp:paragraph -->';
        $content .= '<p>' . esc_html__( 'No posts found.', 'zmblocks' ) . '</p>';
        $content .= '<!-- /wp:paragraph -->';
        $content .= '<!-- /wp:query-no-results --></div>';
        $content .= '<!-- /wp:query -->';
        return $content;
    }
}
