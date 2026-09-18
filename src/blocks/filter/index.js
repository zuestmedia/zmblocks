/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, TextControl, TextareaControl, SelectControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize} from '../shared/model';
import metadata from './block.json';
import './index.scss';
function Edit({attributes,setAttributes}) {
 const v=normalize(metadata,attributes);
 const props=useBlockProps({className:`zmblocks-filter zmblocks-filter-${v.appearance}`});
 const inner=useInnerBlocksProps({className:'zmblocks-filter-editor-content'},{allowedBlocks:['zmblocks/grid'],template:[['zmblocks/grid',{columnsLarge:'3'}]],renderAppender:InnerBlocks.ButtonBlockAppender});
 const categories=[...new Set(v.categories.split(/\r\n|\r|\n/).map(value=>value.trim()).filter(Boolean))];
 return <><InspectorControls><PanelBody title={__('Filter','zmblocks')}>
 <TextareaControl label={__('Categories: one name per line','zmblocks')} value={v.categories} onChange={categories=>setAttributes({categories})} help={__('Choose any names. Assign matching categories to the grid columns. Commas separate categories on cards, so use names without commas.','zmblocks')}/>
 <TextControl label={__('Show all label','zmblocks')} value={v.allLabel} onChange={allLabel=>setAttributes({allLabel})}/>
 <TextControl label={__('Empty result message','zmblocks')} value={v.emptyLabel} onChange={emptyLabel=>setAttributes({emptyLabel})}/>
 <SelectControl label={__('Appearance','zmblocks')} value={v.appearance} options={[{label:__('Pills','zmblocks'),value:'pill'},{label:__('Text','zmblocks'),value:'text'}]} onChange={appearance=>setAttributes({appearance})}/>
 <ToggleControl label={__('Animate filtering','zmblocks')} checked={v.animation} onChange={animation=>setAttributes({animation})}/>
 <p>{__('The editor shows all items so hidden cards remain editable. Filtering runs on the website.','zmblocks')}</p>
 </PanelBody></InspectorControls><div {...props}><ul className="zmblocks-filter-controls">{[v.allLabel || __('All','zmblocks'),...categories].map((label,index)=><li key={index} className={index===0?'uk-active':undefined}><button type="button" disabled>{label}</button></li>)}</ul><div {...inner}/></div></>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
