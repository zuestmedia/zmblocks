/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {BlockControls, AlignmentToolbar, InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, SelectControl, ToggleControl, TextControl, Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize, layoutClasses} from '../shared/model';
import {SurfaceControls, surfaceStyle} from '../shared/surface';
import metadata from './block.json';
import {RadiusControl,radiusStyle} from '../shared/pixels';
import {LinkPicker} from '../shared/link-picker';
import './index.scss';
function Edit({attributes,setAttributes,clientId}) {
 const v=normalize(metadata,attributes);
 const props=useInnerBlocksProps(useBlockProps({className:layoutClasses('card',v),style:{...surfaceStyle(v),...radiusStyle(v),textAlign:v.textAlign||undefined}}),{renderAppender:InnerBlocks.ButtonBlockAppender});
 const Tag=v.tagName;
 return <><InspectorControls>
 <PanelBody title={__('Card','zmblocks')}>
 <SelectControl label={__('Style','zmblocks')} value={v.variant} options={[{label:__('None','zmblocks'),value:'none'},{label:__('Default','zmblocks'),value:'default'},{label:__('Primary','zmblocks'),value:'primary'},{label:__('Secondary','zmblocks'),value:'secondary'}]} onChange={variant=>setAttributes({variant})}/>
 <SelectControl label={__('UIkit padding preset','zmblocks')} help={__('Custom padding in Dimensions overrides this preset on the configured sides.','zmblocks')} value={v.size} options={[{label:__('None','zmblocks'),value:'none'},{label:__('Default','zmblocks'),value:'default'},{label:__('Small','zmblocks'),value:'small'},{label:__('Large','zmblocks'),value:'large'}]} onChange={size=>setAttributes({size})}/>
 <ToggleControl label={__('Hover style','zmblocks')} checked={v.hover} onChange={hover=>setAttributes({hover})}/>
 <SelectControl label={__('Shadow','zmblocks')} value={v.shadow} options={['none','small','medium','large'].map(value=>({label:value,value}))} onChange={shadow=>setAttributes({shadow})}/>
 <RadiusControl values={v} setAttributes={setAttributes}/>
 <SelectControl label={__('HTML element','zmblocks')} value={v.tagName} options={[{label:'div',value:'div'},{label:'article',value:'article'}]} onChange={tagName=>setAttributes({tagName})}/>
 </PanelBody>
 <SurfaceControls values={v} setAttributes={setAttributes}/>
 <PanelBody title={__('Card link','zmblocks')} initialOpen={false}>
 <LinkPicker clientId={clientId} url={v.linkUrl} newTab={v.newTab} onChange={({url,newTab})=>setAttributes({linkUrl:url,newTab})}/>
 <TextControl label={__('Fallback link description','zmblocks')} help={__('Used when content cannot name the link or contains other links/controls. Otherwise the content supplies the link name.','zmblocks')} value={v.linkLabel} onChange={linkLabel=>setAttributes({linkLabel})}/>
 </PanelBody>
 </InspectorControls><Tag {...props}/><BlockControls group="block"><AlignmentToolbar value={v.textAlign} onChange={textAlign=>setAttributes({textAlign:textAlign||''})}/></BlockControls></>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
