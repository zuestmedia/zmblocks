/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps} from '@wordpress/block-editor';
import {PanelBody, TextControl, SelectControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import {normalize} from '../shared/model';
import {columnClasses} from '../shared/grid-options';
import {ColumnResponsiveControls} from '../shared/responsive-controls';
import './index.scss';
function Edit({attributes,setAttributes}) {
 const v=normalize(metadata,attributes);
 const props=useInnerBlocksProps(useBlockProps({className:columnClasses(v),'data-zmblocks-label':__('Column','zmblocks')}),{renderAppender:InnerBlocks.ButtonBlockAppender});
 return <><InspectorControls><PanelBody title={__('Column width','zmblocks')}><ColumnResponsiveControls values={v} setAttributes={setAttributes} schema={metadata.attributes}/><p>{__('Visual order does not change keyboard or screen-reader order.','zmblocks')}</p></PanelBody><PanelBody title={__('Filter assignment','zmblocks')} initialOpen={false}><TextControl label={__('Categories (comma separated)','zmblocks')} value={attributes.filterTags || ''} onChange={filterTags=>setAttributes({filterTags})} help={__('Use the same freely defined names as in the Filter block. Applies to this entire grid item, with or without a Card.','zmblocks')}/></PanelBody></InspectorControls><div {...props}/></>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
