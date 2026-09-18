<?php
namespace ZMP\Blocks\Integrations;

use ZMP\Blocks\Admin\StatusPage;

defined( 'ABSPATH' ) || exit;

// This file is autoloaded only after the optional parent class is available.
class ZMPluginMenu extends \ZMP\Plugin\AdminMenu {
    public function __construct( private StatusPage $page ) {
        parent::__construct( 'zmblocks' );
    }

    public function getSubMenuPage() {
        $this->page->render();
    }
}
