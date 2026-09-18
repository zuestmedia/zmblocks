/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType, registerBlockVariation} from '@wordpress/blocks';
import {InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, TextControl, SelectControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize} from '../shared/model';
import metadata from './block.json';
import {RadiusControl,radiusStyle} from '../shared/pixels';
import {LinkPicker} from '../shared/link-picker';
import './index.scss';
function Edit({attributes,setAttributes,clientId}) {
 const v=normalize(metadata,attributes);
 const props=useInnerBlocksProps(useBlockProps({style:{...radiusStyle(v)},className:`zmblocks-overlay zmblocks-overlay-${v.visibility} zmblocks-overlay-${v.variant} zmblocks-overlay-${v.position} zmblocks-overlay-${v.transition}`}),{template:[['zmblocks/image'],['core/group',{className:'zmblocks-overlay-content',templateLock:false},[['core/paragraph',{content:__('View more','zmblocks')}]]]],templateLock:false,allowedBlocks:['zmblocks/image','core/post-featured-image','core/group']});
 return <><InspectorControls><PanelBody title={__('Overlay','zmblocks')}>
 <RadiusControl values={v} setAttributes={setAttributes}/>
 <SelectControl help={__('On touch screens, tap once to reveal content and again to follow a link. Tap outside to close.','zmblocks')} label={__('Visibility','zmblocks')} value={v.visibility} options={[{label:__('On hover or keyboard focus','zmblocks'),value:'hover'},{label:__('Always','zmblocks'),value:'always'}]} onChange={visibility=>setAttributes({visibility})}/>
 <SelectControl label={__('Background','zmblocks')} value={v.variant} options={[{label:__('Dark translucent','zmblocks'),value:'primary'},{label:__('Light translucent','zmblocks'),value:'default'},{label:__('None','zmblocks'),value:'none'}]} onChange={variant=>setAttributes({variant})}/>
 <SelectControl label={__('Content position','zmblocks')} value={v.position} options={[{label:__('Center','zmblocks'),value:'center'},{label:__('Top','zmblocks'),value:'top'},{label:__('Bottom','zmblocks'),value:'bottom'}]} onChange={position=>setAttributes({position})}/>
 <SelectControl label={__('Transition','zmblocks')} value={v.transition} options={[{label:__('Fade','zmblocks'),value:'fade'},{label:__('Slide','zmblocks'),value:'slide'}]} onChange={transition=>setAttributes({transition})}/>
 <LinkPicker clientId={clientId} url={v.linkUrl} newTab={v.newTab} onChange={({url,newTab})=>setAttributes({linkUrl:url,newTab})}/>
 <TextControl label={__('Fallback link description','zmblocks')} value={v.linkLabel} onChange={linkLabel=>setAttributes({linkLabel})}/>
 <p>{__('Use ZM Image or the WordPress Featured Image as the first block. Place text, Post Title and Post Excerpt inside the overlay group. Overlay content stays visible in the editor.','zmblocks')}</p>
 </PanelBody></InspectorControls><div {...props}/></>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});

// Core provides the current post through Query Loop context, also through the overlay.
registerBlockVariation('zmblocks/overlay', {
 name: 'post-overlay', title: __('ZM Post Overlay', 'zmblocks'),
 description: __('Featured image with a Read more link to the current post. Insert inside a Query Loop Post Template.', 'zmblocks'),
 scope: ['inserter'], attributes: {position: 'bottom'},
 innerBlocks: [
  ['core/post-featured-image', {isLink: true, aspectRatio: '3/2', scale: 'cover'}],
  ['core/group', {className: 'zmblocks-overlay-content', templateLock: false}, [
   ['core/read-more', {content: __('Read more', 'zmblocks')}],
  ]],
 ],
});
