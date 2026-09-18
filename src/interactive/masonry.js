import Grid from 'uikit/src/js/core/grid';

export const masonrySelector = '.zmblocks-grid.zmblocks-masonry-pack,.zmblocks-grid.zmblocks-masonry-next,.zmblocks-query-grid.zmblocks-masonry-pack,.zmblocks-query-grid.zmblocks-masonry-next';

export function registerMasonry(UIkit) {
 // UIkit's grid normally reserves bottom padding for parallax. Masonry must retain
 // the user's native WordPress padding and include it in border-box heights.
 const update = [...Grid.update];
 update[1] = {...update[1], write({height}) {
  if (height === false) return;
  const style = getComputedStyle(this.$el);
  const extra = style.boxSizing === 'border-box'
   ? ['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,key)=>sum+(parseFloat(style[key])||0),0) : 0;
  this.$el.style.height = height === '' ? '' : `${height + extra}px`;
 }};
 UIkit.component('zmblocksMasonry', {...Grid, update});
}

export function masonry(UIkit, el) {
 el.classList.add('zmblocks-masonry-active');
 UIkit.zmblocksMasonry(el, {
  masonry: el.classList.contains('zmblocks-masonry-next') ? 'next' : true,
  margin: 'zmblocks-masonry-row', firstColumn: 'zmblocks-masonry-first',
 });
}
