/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement,Fragment} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';
import {InspectorControls} from '@wordpress/block-editor';
import {PanelBody,SelectControl,Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import schema from './schema.json';
const supported=name=>['core/heading','core/paragraph'].includes(name);
export function classes(name,a) {
 if(!supported(name))return '';
 const valid=key=>schema[key].includes(a[key])?a[key]:'';
 const result=[];
 for(const [key,prefix] of (name==='core/heading'?[['zmHeadingSize','uk-heading-'],['zmHeadingDecoration','uk-heading-']]:[['zmTextStyle','uk-text-'],['zmTextSize','uk-text-']]).concat([['zmTextWeight','uk-text-'],['zmTextTransform','uk-text-']]))if(valid(key))result.push(prefix+valid(key));
 if(!result.length)return '';
 if(a.fontSize||a.style?.typography?.fontSize)result.push('zmblocks-core-font-size');
 return ['zmblocks-typography',...result].join(' ');
}
addFilter('blocks.registerBlockType','zmblocks/typography-attributes',(settings,name)=>supported(name)?{...settings,attributes:{...settings.attributes,...Object.fromEntries(Object.entries(schema).map(([key,values])=>[key,{type:'string',enum:values,default:''}]))}}:settings);
addFilter('editor.BlockEdit','zmblocks/typography-controls',BlockEdit=>props=>{
 if(!supported(props.name))return <BlockEdit {...props}/>;
 const fields=props.name==='core/heading'?[['zmHeadingSize',__('Heading appearance','zmblocks')],['zmHeadingDecoration',__('Decoration','zmblocks')]]:[['zmTextStyle',__('Text style','zmblocks')],['zmTextSize',__('Text size','zmblocks')]];
 return <><BlockEdit {...props}/><InspectorControls><PanelBody title={__('UIkit typography','zmblocks')} initialOpen={false}>
 {fields.concat([['zmTextWeight',__('Font weight','zmblocks')],['zmTextTransform',__('Text transform','zmblocks')]]).map(([key,label])=><SelectControl key={key} label={label} value={props.attributes[key]||''} options={schema[key].map(value=>({value,label:value||__('Theme default','zmblocks')}))} onChange={value=>props.setAttributes({[key]:value})}/>)}
 {(props.attributes.fontSize||props.attributes.style?.typography?.fontSize)&&<p>{__('The WordPress font size takes priority over the UIkit size. Clear it in Typography to use the UIkit size.','zmblocks')}</p>}
 <Button variant="tertiary" onClick={()=>props.setAttributes(Object.fromEntries(Object.keys(schema).map(key=>[key,''])))}>{__('Reset UIkit typography','zmblocks')}</Button>
 </PanelBody></InspectorControls></>;
});
addFilter('editor.BlockListBlock','zmblocks/typography-preview',Block=>props=>{
 const extra=classes(props.name,props.attributes||{});
 return <Block {...props} className={[props.className,extra].filter(Boolean).join(' ')}/>;
});
