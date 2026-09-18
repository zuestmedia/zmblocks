const { readFileSync } = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const sass = require('sass');
const postcss = require('postcss');

module.exports = class UIkitSectionBuild {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('ZMBlocksUIkit', (compilation) => {
      compilation.hooks.processAssets.tap('ZMBlocksUIkit', () => {
        const root = compiler.context;
        for (const component of ['section', 'container', 'grid', 'card', 'button', 'typography']) {
        const result = sass.compile(path.join(root, `src/uikit/${component}.scss`), {
          loadPaths: [path.join(root, 'node_modules')], style: 'compressed',
          // UIkit 3's official entrypoints use imports. Do not silence other warnings.
          silenceDeprecations: ['import'],
        });
        for (const url of result.loadedUrls) compilation.fileDependencies.add(fileURLToPath(url));
        const css = postcss.parse(result.css);
        css.walkRules((rule) => {
          if (component === 'typography') {
            if (rule.selector.startsWith(':where(.zmblocks-typography')) { return; }
            // Only expose the explicitly supported typography utilities.
            if (rule.selector.includes('uk-heading-line >') || !rule.selectors.every(selector => /^\.uk-(heading-(small|medium|large|xlarge|2xlarge|3xlarge|divider|bullet|line)|text-(lead|meta|small|default|large|light|normal|bold|lighter|bolder|uppercase|lowercase|capitalize))(?=\s|:|$)/.test(selector))) { rule.remove(); return; }
            rule.selectors = rule.selectors.map(selector => ':where(.zmblocks-typography)' + selector);
            const sizes = rule.nodes.filter(node => node.type === 'decl' && node.prop === 'font-size');
            if (sizes.length) {
              const sized = rule.clone({nodes: sizes.map(node => node.clone())});
              sized.selectors = sized.selectors.map(selector => selector.replace(':where(.zmblocks-typography)', ':where(.zmblocks-typography:not(.zmblocks-core-font-size))'));
              rule.after(sized);
              sizes.forEach(node => node.remove());
            }
            return;
          }
          // Media-left/right layouts and detached grid-margin utilities are not used by these blocks.
          if (component === 'card' && rule.selector.includes('uk-card-media')) { rule.remove(); return; }
          rule.selectors = rule.selectors.map((selector) => {
            if (component === 'grid' && /^\*\s*\+\s*\.uk-grid-margin/.test(selector)) return ':where(.zmblocks-grid) > ' + selector.replace(/^\*\s*\+\s*/, '');
            if (component === 'card') return ':where(.zmblocks-card)' + selector;
            if (component === 'button') return ':where(.zmblocks-button) ' + selector;
            if (!selector.startsWith(`.uk-${component}`)) throw new Error(`Unexpected global UIkit selector: ${selector}`);
            return `:where(.zmblocks-${component})${selector}`;
          });
        });
        const pkg = JSON.parse(readFileSync(path.join(root, 'node_modules/uikit/package.json'), 'utf8'));
        const { RawSource } = compiler.webpack.sources;
        compilation.emitAsset(`uikit/${component}.css`, new RawSource(`/*! UIkit ${pkg.version} | MIT | see LICENSE-UIKIT.txt */\n${css.toString()}`));
        }
        const pkg = JSON.parse(readFileSync(path.join(root, 'node_modules/uikit/package.json'), 'utf8'));
        const { RawSource } = compiler.webpack.sources;
        const iconCatalog = path.join(root, 'src/blocks/icon/icons.json');
        compilation.fileDependencies.add(iconCatalog);
        compilation.emitAsset('blocks/icon/icons.json', new RawSource(readFileSync(iconCatalog)));
        const typographySchema = path.join(root, 'src/typography/schema.json');
        compilation.fileDependencies.add(typographySchema);
        compilation.emitAsset('typography-schema.json', new RawSource(readFileSync(typographySchema)));
        compilation.emitAsset('uikit/LICENSE-UIKIT.txt', new RawSource(readFileSync(path.join(root, 'node_modules/uikit/LICENSE.md'))));
        compilation.emitAsset('uikit/manifest.json', new RawSource(JSON.stringify({ version: pkg.version, css: ['section', 'container', 'grid', 'card', 'button', 'typography'], js: ['filter', 'lightbox', 'scrollspy', 'grid'], icons: "static-svg" }, null, 2)));
      });
    });
  }
};
