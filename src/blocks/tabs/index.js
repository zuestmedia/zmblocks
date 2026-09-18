/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType,createBlock} from '@wordpress/blocks';
import {useSelect,useDispatch} from '@wordpress/data';
import {InnerBlocks,InspectorControls,useBlockProps,useInnerBlocksProps,store as blockEditorStore} from '@wordpress/block-editor';
import {PanelBody,SelectControl,TextControl,RangeControl,Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import {normalize} from '../shared/model';
import './index.scss';
function Edit({attributes,setAttributes,clientId}) {
 const v=normalize(metadata,attributes);
 const children=useSelect(select=>select(blockEditorStore).getBlocks(clientId),[clientId]);
 const {replaceInnerBlocks,insertBlocks,selectBlock}=useDispatch(blockEditorStore);
 const resize=value=>{if(String(value).trim()==='')return;const count=Number(value);if(!Number.isInteger(count)||count<1||count>50)return;const next=children.slice(0,count);while(next.length<count)next.push(createBlock('zmblocks/tab-item'));replaceInnerBlocks(clientId,next,false);};
 const props=useBlockProps({className:'zmblocks-tabs zmblocks-tabs-'+v.position});
 const content=useInnerBlocksProps({className:'zmblocks-tabs-panels'},{allowedBlocks:['zmblocks/tab-item'],templateLock:false,renderAppender:false});
 return <><InspectorControls><PanelBody title={__('Tabs','zmblocks')}>
 <TextControl label={__('Number of tabs','zmblocks')} type="number" min={1} max={50} value={children.length} onChange={resize} help={__('New tabs are empty. Reducing removes the last tabs and their content; Undo restores them.','zmblocks')}/>
 <SelectControl label={__('Tab position','zmblocks')} value={v.position} options={[{value:'top',label:__('Top','zmblocks')},{value:'left',label:__('Left','zmblocks')},{value:'right',label:__('Right','zmblocks')}]} onChange={position=>setAttributes({position})}/>
 <RangeControl label={__('Initially active tab','zmblocks')} min={1} max={Math.max(1,children.length)} value={v.active} onChange={active=>setAttributes({active:active||1})}/>
 <SelectControl label={__('Animation','zmblocks')} value={v.animation} options={metadata.attributes.animation.enum.map(value=>({value,label:value==='none'?__('None','zmblocks'):value}))} onChange={animation=>setAttributes({animation})}/>
 <TextControl label={__('Accessible navigation label','zmblocks')} value={v.label} onChange={label=>setAttributes({label})}/>
 <p>{__('Side tabs move above the content below 960px. All content stays open in the editor; click a tab to select its title and content.','zmblocks')}</p>
 </PanelBody></InspectorControls><div {...props}>
 <div className="zmblocks-tabs-navigation"><div className="zmblocks-tabs-editor-nav">{children.map((child,i)=><Button key={child.clientId} variant="secondary" onClick={()=>selectBlock(child.clientId)}>{child.attributes.title||__('Tab','zmblocks')+' '+(i+1)}</Button>)}</div></div>
 <div {...content}/><div className="zmblocks-tabs-appender"><Button variant="secondary" onClick={()=>insertBlocks(createBlock('zmblocks/tab-item'),undefined,clientId)}>{__('Add empty tab','zmblocks')}</Button></div>
 </div></>;
}
registerBlockType(metadata,{edit:Edit,variations:[{name:'three-tabs',isDefault:true,innerBlocks:[['zmblocks/tab-item'],['zmblocks/tab-item'],['zmblocks/tab-item']]}],save:()=> <InnerBlocks.Content/>});
