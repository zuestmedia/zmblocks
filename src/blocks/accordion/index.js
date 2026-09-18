/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, ToggleControl, RangeControl} from '@wordpress/components';
import {useSelect} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import './index.scss';
import {TitleFields,TitleToolbar} from '../shared/accordion-title';
import {normalize} from '../shared/model';
function Edit({attributes,setAttributes,clientId}) {
 const v=normalize(metadata,attributes);
 const count=useSelect(select=>select('core/block-editor').getBlockCount(clientId),[clientId]);
 const props=useInnerBlocksProps(useBlockProps({className:'zmblocks-accordion uk-accordion'}),{allowedBlocks:['zmblocks/accordion-item'],template:[['zmblocks/accordion-item'],['zmblocks/accordion-item']],renderAppender:InnerBlocks.ButtonBlockAppender});
 return <><InspectorControls><PanelBody title={__('Accordion','zmblocks')}>
 <ToggleControl label={__('Allow multiple open items','zmblocks')} checked={v.multiple} onChange={multiple=>setAttributes({multiple})}/>
 <ToggleControl label={__('Allow all items to close','zmblocks')} checked={v.collapsible} onChange={collapsible=>setAttributes({collapsible})}/>
 <RangeControl label={__('Initially open item','zmblocks')} help={__('0 opens no item. If closing all items is disabled, the first item opens instead.','zmblocks')} value={v.active} min={0} max={Math.max(1,count)} onChange={active=>setAttributes({active:active??0})}/>
 <ToggleControl label={__('Animate','zmblocks')} checked={v.animation} onChange={animation=>setAttributes({animation})}/>
 <p>{__('All items stay open in the editor so their content can be edited.','zmblocks')}</p>
 </PanelBody><PanelBody title={__('Title design (all items)','zmblocks')}><TitleFields values={v} setAttributes={setAttributes}/></PanelBody></InspectorControls><div {...props}/><TitleToolbar values={v} setAttributes={setAttributes}/></>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
