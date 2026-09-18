/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockVariation} from '@wordpress/blocks';
import {addFilter} from '@wordpress/hooks';
import {InspectorControls} from '@wordpress/block-editor';
import {PanelBody, SelectControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {GridResponsiveControls} from '../blocks/shared/responsive-controls';
import './layout.scss';

// Use Core's className attribute: no replacement renderer, save filter or custom query.
const marker = 'zmblocks-query-grid';
const fields = ['', 'Small', 'Medium', 'Large'];
const gaps = ['collapse', 'small', 'medium', 'default', 'large'];
const tokens = value => (value || '').split(/\s+/).filter(Boolean);
const defaults = `${marker} zmblocks-query-cols-1 zmblocks-query-cols-small-2 zmblocks-query-cols-medium-3 zmblocks-query-cols-large-4 zmblocks-query-gap-default zmblocks-query-equal`;
const prefix = key => `zmblocks-query-cols-${key ? key.toLowerCase() + '-' : ''}`;
function values(className) {
 const classes = tokens(className);
 return Object.fromEntries(fields.map(key => ['columns' + key, ['1','2','3','4','5','6'].find(value => classes.includes(prefix(key) + value)) || (key ? '' : '1')]));
}
function replace(className, pattern, next) {
 return [...tokens(className).filter(value => !pattern.test(value)), ...tokens(next)].join(' ');
}

registerBlockVariation('core/query', {
 name: 'zmblocks/query-grid',
 title: __('ZM Query Grid', 'zmblocks'),
 description: __('WordPress Query Loop with responsive columns and an editable ZM Card for each post.', 'zmblocks'),
 category: 'zmblocks', icon: 'grid-view',
 keywords: [__('posts', 'zmblocks'), __('query', 'zmblocks'), 'UIkit'],
 attributes: {
  namespace: 'zmblocks/query-grid',
  query: {perPage: 8, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: '', inherit: false},
 },
 isActive: ['namespace'], scope: ['inserter'],
 innerBlocks: [
  ['core/post-template', {className: defaults, layout: {type: 'default'}}, [
   ['zmblocks/card', {variant: 'default', tagName: 'article'}, [
    ['core/post-featured-image', {isLink: true, aspectRatio: '3/2', scale: 'cover'}],
    ['core/post-title', {level: 3, isLink: true}],
    ['core/post-excerpt', {moreText: __('Read more', 'zmblocks')}],
   ]],
  ]],
  ['core/query-pagination', {}, [
   ['core/query-pagination-previous'], ['core/query-pagination-numbers'], ['core/query-pagination-next'],
  ]],
  ['core/query-no-results', {}, [
   ['core/paragraph', {content: __('No posts found.', 'zmblocks')}],
  ]],
 ],
});

addFilter('editor.BlockEdit', 'zmblocks/query-grid-controls', BlockEdit => props => {
 const className = props.attributes.className || '';
 if (props.name !== 'core/post-template' || !tokens(className).includes(marker)) return <BlockEdit {...props}/>;
 const classes = tokens(className);
 const updateColumns = changes => {
  let result = className;
  for (const [attribute, value] of Object.entries(changes)) {
   const key = attribute.slice('columns'.length);
   if (!fields.includes(key) || !['','1','2','3','4','5','6'].includes(value)) continue;
   result = replace(result, new RegExp('^' + prefix(key) + '[1-6]$'), value ? prefix(key) + value : '');
  }
  props.setAttributes({className: result});
 };
 return <><BlockEdit {...props}/><InspectorControls><PanelBody title={__('ZM Query Grid', 'zmblocks')}>
  <p>{__('Set responsive columns here. Choose the Query Loop parent to change the post count, filters and order.', 'zmblocks')}</p>
  <GridResponsiveControls values={values(className)} setAttributes={updateColumns}/>
  <SelectControl label={__('Gap', 'zmblocks')} value={gaps.find(gap => classes.includes('zmblocks-query-gap-' + gap)) || 'default'} options={[
   {value:'collapse',label:__('None','zmblocks')}, {value:'small',label:__('Small','zmblocks')}, {value:'medium',label:__('Medium','zmblocks')}, {value:'default',label:__('Default','zmblocks')}, {value:'large',label:__('Large','zmblocks')},
  ]} onChange={gap => props.setAttributes({className: replace(className, /^zmblocks-query-gap-(collapse|small|medium|default|large)$/, 'zmblocks-query-gap-' + gap)})}/>
  <ToggleControl label={__('Equal card heights', 'zmblocks')} checked={classes.includes('zmblocks-query-equal')} onChange={enabled => props.setAttributes({className: replace(className, /^zmblocks-query-equal$/, enabled ? 'zmblocks-query-equal' : '')})}/>
  <SelectControl label={__('Masonry layout','zmblocks')} value={['pack','next'].find(mode=>classes.includes('zmblocks-masonry-'+mode))||'none'} options={[{value:'none',label:__('Off','zmblocks')},{value:'pack',label:__('Pack into the shortest column','zmblocks')},{value:'next',label:__('Keep column order','zmblocks')}]} onChange={mode=>props.setAttributes({className:replace(className,/^zmblocks-masonry-(pack|next)$/,mode==='none'?'':'zmblocks-masonry-'+mode)})}/>
  <p>{__('Masonry runs on the website and takes priority over equal card heights. The editor keeps regular rows.','zmblocks')}</p>
 </PanelBody></InspectorControls></>;
});
