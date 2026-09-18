/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement,Fragment} from '@wordpress/element';
import {BlockControls,HeadingLevelDropdown,AlignmentToolbar} from '@wordpress/block-editor';
import {SelectControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import metadata from '../accordion-item/block.json';
export const titleKeys=['headingLevel','titleStyle','textAlign','decoration','weight','transform'];
export function hasCustomTitle(v){return v.titleDesign==='custom'||(v.titleDesign==='auto'&&titleKeys.some(key=>v[key]!==metadata.attributes[key].default));}
export function TitleFields({values:v,setAttributes}) {
 const choices={accordion:__('UIkit accordion title','zmblocks'),heading:__('Heading (theme default)','zmblocks'),small:'Heading Small',medium:'Heading Medium',large:'Heading Large',xlarge:'Heading XLarge','2xlarge':'Heading 2XLarge','3xlarge':'Heading 3XLarge',lead:'Text Lead',meta:'Text Meta'};

 return <> <SelectControl label={__('Appearance','zmblocks')} value={v.titleStyle} options={metadata.attributes.titleStyle.enum.map(value=>({value,label:choices[value]}))} onChange={titleStyle=>setAttributes({titleStyle})}/>
 {[['decoration',__('Decoration','zmblocks')],['weight',__('Font weight','zmblocks')],['transform',__('Text transform','zmblocks')]].map(([key,label])=><SelectControl key={key} label={label} value={v[key]} options={metadata.attributes[key].enum.map(value=>({value,label:value||__('Default','zmblocks')}))} onChange={value=>setAttributes({[key]:value})}/>)}
</>;
}
export function TitleToolbar({values:v,setAttributes}) {
 return <BlockControls group="block"><HeadingLevelDropdown value={Number(v.headingLevel.slice(1))} onChange={level=>setAttributes({headingLevel:'h'+level})}/><AlignmentToolbar value={v.textAlign||undefined} onChange={textAlign=>setAttributes({textAlign:textAlign||''})}/></BlockControls>;
}
