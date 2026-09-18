/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, RichText, InspectorControls, BlockControls, HeadingLevelDropdown, AlignmentToolbar, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize} from '../shared/model';
import metadata from './block.json';
import './index.scss';
import {titleKeys,hasCustomTitle,TitleFields,TitleToolbar} from '../shared/accordion-title';
function Edit({attributes,setAttributes,context={}}) {
 const own=normalize(metadata,attributes);
 const custom=hasCustomTitle(own);
 const inherited=normalize(metadata,Object.fromEntries(titleKeys.map(key=>[key,context['zmblocks/accordion/'+key]])));
 const v=custom?own:{...own,...Object.fromEntries(titleKeys.map(key=>[key,inherited[key]]))};
 const props=useBlockProps({className:'zmblocks-accordion-item uk-open'});
 const content=useInnerBlocksProps({className:'uk-accordion-content'},{renderAppender:InnerBlocks.ButtonBlockAppender});
 const styleClass=['accordion','heading'].includes(v.titleStyle)?(v.titleStyle==='accordion'?'uk-accordion-title':''):('uk-'+(['lead','meta'].includes(v.titleStyle)?'text-':'heading-')+v.titleStyle);
 const classes=['zmblocks-accordion-heading','zmblocks-typography',styleClass,v.decoration&&'uk-heading-'+v.decoration,v.weight&&'uk-text-'+v.weight,v.transform&&'uk-text-'+v.transform].filter(Boolean).join(' ');
 return <><InspectorControls><PanelBody title={__('Title design','zmblocks')}>
 <ToggleControl label={__('Custom title design','zmblocks')} checked={custom} onChange={enabled=>setAttributes(enabled?{...Object.fromEntries(titleKeys.map(key=>[key,v[key]])),titleDesign:'custom'}:{titleDesign:'inherit'})} help={__('By default, titles use the parent Accordion settings.','zmblocks')}/>
 {custom&&<TitleFields values={v} setAttributes={setAttributes}/>}
 </PanelBody></InspectorControls>
 <div {...props}><RichText tagName={v.headingLevel} className={classes} style={{textAlign:v.textAlign||undefined}} value={v.title} allowedFormats={[]} disableLineBreaks placeholder={__('Accordion title','zmblocks')} onChange={title=>setAttributes({title})}/><div {...content}/></div>
 {custom&&<TitleToolbar values={v} setAttributes={setAttributes}/>}</>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
