=== ZMBlocks ===
Contributors: zuestmedia
Tags: blocks, gutenberg, uikit, layout
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 8.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Build responsive layouts with UIkit blocks, filterable showcases, overlays and a WordPress Query Loop grid.

== Description ==

ZMBlocks adds modular UIkit layout blocks to the WordPress block editor. Combine them with standard WordPress blocks to build responsive pages and post grids.

No ZuestMedia theme, ZMPlugin, ZMPro, license or external service is required.

= Layout blocks =

* Section: backgrounds, content width, spacing, viewport height and vertical alignment.
* Grid and Column: responsive columns and widths, gaps, flex alignment and ordering, dividers, Scrollspy and optional Masonry. Columns accept any blocks.
* Card: editable inner blocks, style variants, colors, background images, shadows, individual corner radii and links.
* Image: WordPress media library, resolution and display size, alignment, spacing, captions, links and optional full-screen lightbox.
* Icon: local UIkit SVG icons with adjustable size and alignment.
* Button: directly editable text, native WordPress link selection, alignment and optional icon.
* Filter: custom categories and filtering for grid columns.
* Overlay: image and editable overlay content, positioning, transitions and link options.

= WordPress blocks and patterns =

* UIkit typography controls extend the standard Heading and Paragraph blocks.
* ZM Query Grid extends the WordPress Query Loop using responsive Post Template columns. WordPress handles queries, post content and pagination.
* Showcase and post patterns provide editable starting layouts. Replace their images, text, links and categories with your content.

= Assets and integration =

Compatible themes and plugins can provide UIkit. Otherwise, ZMBlocks loads bundled component styles as needed. Interactive components use a local UIkit runtime. Styles, scripts and icons are included in the plugin.

When an updated ZMPlugin without extension quotas is active, ZMBlocks registers automatically in its dashboard. The overview appears under ZMPlugin > ZMBlocks, or under Tools > ZMBlocks when no compatible parent menu is available. All included blocks remain available independently of ZMPlugin and ZMPro.

== Installation ==

1. In Plugins > Add New > Upload Plugin, select the ZMBlocks ZIP and install it. Alternatively, copy the zmblocks directory to /wp-content/plugins/.
2. Activate ZMBlocks. WordPress 6.5 and PHP 8.2 or newer are required.
3. Open a page or post in the block editor and find the ZM Blocks category.
4. Insert a Section, Grid or another block, or start with a pattern. Select your own media and edit the content.
5. For filterable grids, define categories in Filter and assign matching categories to its Columns.

The ZIP includes compiled assets. Node.js and a build command are not required to install or run it.

== Frequently Asked Questions ==

= Do I need ZMPlugin, ZMPro or a particular theme? =

No. ZMBlocks works independently. Framework integration is automatic when a compatible ZMPlugin is active; it does not unlock or restrict the included blocks.

= Can I use standard WordPress blocks inside these layouts? =

Yes. Section, Column, Card and overlay content accept inner blocks. The Query Grid uses WordPress post blocks for featured images, titles and excerpts.

= Does ZMBlocks contact external services? =

ZMBlocks does not require an external service or add telemetry. Its bundled styles, scripts and icons are local. Images use the WordPress media library. Other installed plugins and media/CDN configurations may make their own requests.

= What happens when I deactivate the plugin? =

Saved inner blocks and media attachments remain. ZMBlocks layout wrappers and dynamic Image, Icon and Button output require the plugin to be active. Keep the plugin active on pages using these blocks.

= How do I build the included sources? =

Readable JavaScript and SCSS sources are in src/. Build configuration is in webpack.config.cjs and uikit-webpack.cjs. package.json and package-lock.json specify the build dependencies, including UIkit.

Use Node.js 22.19 or newer and npm 10 or newer. Run npm ci, then npm run build. For development, npm run start watches for changes. WordPress loads runtime files from app/ and build/, not src/.

The ZIP uses the same package.json as the full development checkout. The check, test and package commands require tools and tests from that checkout; these are not needed to rebuild or run the installed plugin.

= Which WordPress version was tested? =

The Tested up to value records testing on a local WordPress 7.1 development installation. It is not a claim of testing every theme or multisite configuration. Recheck against the current stable WordPress release before WordPress.org submission.

== Third-party resources ==

UIkit 3.23.12, including its icons, is developed by YOOtheme and distributed under the MIT license.
Source: https://github.com/uikit/uikit/tree/v3.23.12
License text: build/uikit/LICENSE-UIKIT.txt
The pinned UIkit sources are obtained with npm ci; ZMBlocks includes its integration sources and build configuration.

WordPress editor packages are used through WordPress's registered script dependencies. The plugin itself is licensed under GPLv2 or later; see LICENSE.

== Changelog ==

= 1.0.0 =
* Initial stable release with Section, Grid, Column, Card, Image, Icon, Button, Filter and Overlay blocks.
* Responsive layout controls, Masonry, Scrollspy, lightbox, native link controls and editable patterns.
* UIkit typography for WordPress Heading and Paragraph, plus Query Grid and post patterns.
* Local component assets with compatible UIkit provider support.
* Automatic ZMPlugin registration while preserving standalone operation.
* Include readable sources, build configuration and third-party license notices.

== Upgrade Notice ==

= 1.0.0 =
First stable release. Users of early development versions should review existing test layouts; removed Container, Card Area and Grid Cell blocks have no automatic migration.
