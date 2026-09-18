/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment, useEffect} from '@wordpress/element';
import {registerBlockType, createBlock} from '@wordpress/blocks';
import {useSelect, useDispatch} from '@wordpress/data';
import {InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps, __experimentalBlockVariationPicker as BlockVariationPicker, store as blockEditorStore} from '@wordpress/block-editor';
import {PanelBody, SelectControl, ToggleControl, TextControl, RangeControl, Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize, layoutClasses} from '../shared/model';
import metadata from './block.json';
import {FlexControls,flexClasses} from '../shared/grid-options';
import {GridColumnCountControls} from '../shared/responsive-controls';
import './index.scss';
import {gridPresets} from './presets';
function Edit({attributes,setAttributes,clientId}) {
 const v=normalize(metadata,attributes);
 const children=useSelect(select=>select(blockEditorStore).getBlocks(clientId),[clientId]);
 const {insertBlocks,replaceInnerBlocks}=useDispatch(blockEditorStore);
 useEffect(()=>{if(children.length&&!v.layoutChosen)setAttributes({layoutChosen:true});},[children.length,v.layoutChosen,setAttributes]);
 const choose=preset=>{setAttributes({...preset.attributes,layoutChosen:true});replaceInnerBlocks(clientId,[createBlock('zmblocks/column')],false);};
 const resize=value=>{if(String(value).trim()==='')return;const count=Number(value);if(!Number.isInteger(count)||count<0||count>100)return;const next=children.slice(0,count);while(next.length<count)next.push(createBlock('zmblocks/column'));setAttributes({layoutChosen:true});replaceInnerBlocks(clientId,next,false);};
 const addColumn=()=>insertBlocks(createBlock('zmblocks/column'),undefined,clientId);
 const props=useInnerBlocksProps(useBlockProps({className:layoutClasses('grid',v)+' '+flexClasses(v)}),{renderAppender:false,orientation:'horizontal',allowedBlocks:['zmblocks/column'],templateLock:false});
 if(!children.length&&!v.layoutChosen)return <div {...props}><BlockVariationPicker label={__('ZM Grid','zmblocks')} instructions={__('Choose a layout. Every layout starts with one empty column.','zmblocks')} variations={gridPresets} onSelect={choose} onSkip={()=>choose(gridPresets[0])}/></div>;
 return <><InspectorControls><PanelBody title={__('Columns','zmblocks')}>
 <TextControl label={__('Number of columns','zmblocks')} type="number" min={0} max={100} step={1} value={children.length} onChange={resize} help={__('Increasing adds empty columns. Reducing removes the last columns and their content; use Undo to restore them.','zmblocks')}/>
 <Button variant="secondary" onClick={addColumn}>{__('Add empty column','zmblocks')}</Button>
 <p>{__('Use the column block menu to delete or duplicate. Responsive columns change the layout only.','zmblocks')}</p>
 <GridColumnCountControls values={v} setAttributes={setAttributes}/>
 </PanelBody><PanelBody title={__('Spacing','zmblocks')} initialOpen={false}>
 <SelectControl label={__('Gap','zmblocks')} value={v.gap} options={[{label:__('Default','zmblocks'),value:'default'},{label:__('None','zmblocks'),value:'collapse'},{label:__('Small','zmblocks'),value:'small'},{label:__('Medium','zmblocks'),value:'medium'},{label:__('Large','zmblocks'),value:'large'}]} onChange={gap=>setAttributes({gap})}/>
 <ToggleControl label={__('Dividers','zmblocks')} checked={v.divider} onChange={divider=>setAttributes({divider})}/>
 <ToggleControl label={__('Equal height content','zmblocks')} checked={v.equalHeight} onChange={equalHeight=>setAttributes({equalHeight})}/>
 </PanelBody><PanelBody title={__('Masonry','zmblocks')} initialOpen={false}>
 <SelectControl label={__('Masonry layout','zmblocks')} value={v.masonry} options={[{value:'none',label:__('Off','zmblocks')},{value:'pack',label:__('Pack into the shortest column','zmblocks')},{value:'next',label:__('Keep column order','zmblocks')}]} onChange={masonry=>setAttributes({masonry})}/>
 <p>{__('Runs on the website. Use equal column widths. Masonry takes priority over equal heights, dividers, flex arrangement and Scrollspy. The editor keeps regular rows.','zmblocks')}</p>
 </PanelBody><PanelBody title={__('Flex layout','zmblocks')} initialOpen={false}><FlexControls values={v} setAttributes={setAttributes}/><p>{__('Wrapped-row alignment needs available height. Visual reversal does not change keyboard reading order.','zmblocks')}</p></PanelBody><PanelBody title={__('Scrollspy animation','zmblocks')} initialOpen={false}><ToggleControl label={__('Enable animation','zmblocks')} checked={v.scrollspy!=='none'} onChange={enabled=>setAttributes({scrollspy:enabled?'fade':'none'})}/>{v.scrollspy!=='none'&&<><SelectControl label={__('Animation','zmblocks')} value={v.scrollspy} options={metadata.attributes.scrollspy.enum.filter(value=>value!=='none').map(value=>({label:value,value}))} onChange={scrollspy=>setAttributes({scrollspy})}/><RangeControl label={__('Delay between columns (ms)','zmblocks')} min={0} max={1000} step={50} value={v.scrollspyDelay} onChange={scrollspyDelay=>setAttributes({scrollspyDelay})}/><ToggleControl label={__('Repeat when entering the viewport','zmblocks')} checked={v.scrollspyRepeat} onChange={scrollspyRepeat=>setAttributes({scrollspyRepeat})}/><p>{__('Runs on the website only. Reduced-motion preferences disable the animation.','zmblocks')}</p></>}</PanelBody></InspectorControls><div {...props}/></>;
}
registerBlockType(metadata,{edit:Edit,variations:gridPresets.map(preset=>({...preset,scope:['block'],attributes:{...preset.attributes,layoutChosen:true},innerBlocks:[['zmblocks/column']]})),save:()=> <InnerBlocks.Content/>});
