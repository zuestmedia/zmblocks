/** @jsxRuntime classic */
/** @jsx createElement */
import {createElement} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks,RichText,useBlockProps,useInnerBlocksProps} from '@wordpress/block-editor';
import {create,getTextContent,toHTMLString} from '@wordpress/rich-text';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import './index.scss';
function Edit({attributes,setAttributes}) {
 const props=useBlockProps({className:'zmblocks-tab-item'});
 const inner=useInnerBlocksProps({className:'zmblocks-tab-content'},{renderAppender:InnerBlocks.ButtonBlockAppender});
 return <div {...props}><RichText tagName="div" className="zmblocks-tab-title" value={toHTMLString({value:create({text:attributes.title||''})})} allowedFormats={[]} disableLineBreaks placeholder={__('Tab title','zmblocks')} onChange={html=>setAttributes({title:getTextContent(create({html})).replace(/[\r\n]+/g,' ')})}/><div {...inner}/></div>;
}
registerBlockType(metadata,{edit:Edit,save:()=> <InnerBlocks.Content/>});
