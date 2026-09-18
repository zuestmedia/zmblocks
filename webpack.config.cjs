const path = require('node:path');
const {DefinePlugin} = require('webpack');
const defaults = require('@wordpress/scripts/config/webpack.config');
const UIkitSectionBuild = require('./uikit-webpack.cjs');

module.exports = {
  ...defaults,
  resolve: {...defaults.resolve, alias: {...defaults.resolve?.alias, 'uikit-util': path.resolve(__dirname, 'node_modules/uikit/src/js/util/index.js')}},
  entry: {
    'blocks/tabs/index': path.resolve(__dirname, 'src/blocks/tabs/index.js'),
    'blocks/tabs/view': path.resolve(__dirname, 'src/blocks/tabs/view.js'),
    'blocks/tab-item/index': path.resolve(__dirname, 'src/blocks/tab-item/index.js'),
    'blocks/tab-item/view': path.resolve(__dirname, 'src/blocks/tab-item/view.js'),
    'blocks/accordion/index': path.resolve(__dirname, 'src/blocks/accordion/index.js'),
    'blocks/accordion/view': path.resolve(__dirname, 'src/blocks/accordion/view.js'),
    'blocks/accordion-item/index': path.resolve(__dirname, 'src/blocks/accordion-item/index.js'),
    'blocks/accordion-item/view': path.resolve(__dirname, 'src/blocks/accordion-item/view.js'),
    'query-grid': path.resolve(__dirname, 'src/query-grid/index.js'),
    typography: path.resolve(__dirname, 'src/typography/index.js'),
    interactive: path.resolve(__dirname, 'src/interactive/index.js'),
    'blocks/filter/index': path.resolve(__dirname, 'src/blocks/filter/index.js'),
    'blocks/filter/view': path.resolve(__dirname, 'src/blocks/filter/view.js'),
    'blocks/overlay/index': path.resolve(__dirname, 'src/blocks/overlay/index.js'),
    'blocks/overlay/view': path.resolve(__dirname, 'src/blocks/overlay/view.js'),
    'blocks/icon/index': path.resolve(__dirname, 'src/blocks/icon/index.js'),
    'blocks/icon/view': path.resolve(__dirname, 'src/blocks/icon/view.js'),
    'blocks/grid/index': path.resolve(__dirname, 'src/blocks/grid/index.js'),
    'blocks/grid/view': path.resolve(__dirname, 'src/blocks/grid/view.js'),
    'blocks/column/index': path.resolve(__dirname, 'src/blocks/column/index.js'),
    'blocks/column/view': path.resolve(__dirname, 'src/blocks/column/view.js'),
    'blocks/card/index': path.resolve(__dirname, 'src/blocks/card/index.js'),
    'blocks/card/view': path.resolve(__dirname, 'src/blocks/card/view.js'),
    'blocks/image/index': path.resolve(__dirname, 'src/blocks/image/index.js'),
    'blocks/image/view': path.resolve(__dirname, 'src/blocks/image/view.js'),
    'blocks/button/index': path.resolve(__dirname, 'src/blocks/button/index.js'),
    'blocks/button/view': path.resolve(__dirname, 'src/blocks/button/view.js'),
    admin: path.resolve(__dirname, 'src/admin/index.js'),
    'blocks/section/index': path.resolve(__dirname, 'src/blocks/section/index.js'),
    'blocks/section/view': path.resolve(__dirname, 'src/blocks/section/view.js'),
  },
  output: { ...defaults.output, path: path.resolve(__dirname, 'build') },
  plugins: [...defaults.plugins, new DefinePlugin({VERSION:JSON.stringify(require('uikit/package.json').version),LOG:'false'}), new UIkitSectionBuild()],
};
