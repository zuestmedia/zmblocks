/** @jsxRuntime classic */
/** @jsx createElement */
import {createElement} from '@wordpress/element';
import {SelectControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
export const breakpoints=[['','',__('Phone','zmblocks')],['Small','@s',__('From 640px','zmblocks')],['Medium','@m',__('From 960px','zmblocks')],['Large','@l',__('From 1200px','zmblocks')],['XLarge','@xl',__('From 1600px','zmblocks')]];
export function columnClasses(v) {
 return ['zmblocks-column',...breakpoints.map(([key,suffix])=>v['width'+key] ? (v['width'+key]==='grid'?'zmblocks-width-grid':'uk-width-'+v['width'+key])+suffix : ''),...breakpoints.map(([key,suffix])=>v['order'+key] && v['order'+key]!=='normal' ? 'uk-flex-'+v['order'+key]+suffix : v['order'+key]==='normal' ? 'uk-flex-normal'+suffix : '')].filter(Boolean).join(' ');
}
export function flexClasses(v) {
 return ['uk-flex-'+v.justify,'uk-flex-'+v.alignItems,'uk-flex-'+v.direction,'uk-flex-'+v.wrap,'uk-flex-wrap-'+v.alignContent].join(' ');
}
export function FlexControls({values:v,setAttributes}) {
 const controls=[['justify',__('Horizontal distribution','zmblocks'),[['left',__('Start','zmblocks')],['center',__('Center','zmblocks')],['right',__('End','zmblocks')],['between',__('Space between','zmblocks')],['around',__('Space around','zmblocks')]]],['alignItems',__('Align items','zmblocks'),[['stretch',__('Stretch','zmblocks')],['top',__('Top','zmblocks')],['middle',__('Middle','zmblocks')],['bottom',__('Bottom','zmblocks')],['baseline',__('Baseline','zmblocks')]]],['direction',__('Direction','zmblocks'),[['row',__('Row','zmblocks')],['row-reverse',__('Row reversed','zmblocks')],['column',__('Column','zmblocks')],['column-reverse',__('Column reversed','zmblocks')]]],['wrap',__('Wrapping','zmblocks'),[['wrap',__('Wrap','zmblocks')],['nowrap',__('No wrap','zmblocks')],['wrap-reverse',__('Wrap reversed','zmblocks')]]],['alignContent',__('Align wrapped rows','zmblocks'),[['stretch',__('Stretch','zmblocks')],['top',__('Start','zmblocks')],['middle',__('Center','zmblocks')],['bottom',__('End','zmblocks')],['between',__('Space between','zmblocks')],['around',__('Space around','zmblocks')]]]].map(([key,label,options])=><SelectControl key={key} label={label} value={v[key]} options={options.map(([value,label])=>({value,label}))} onChange={value=>setAttributes({[key]:value})}/>);
 return <div>{controls.slice(0,2)}<details className="zmblocks-layout-advanced"><summary>{__('Advanced','zmblocks')}</summary>{controls.slice(2)}</details></div>;
}
