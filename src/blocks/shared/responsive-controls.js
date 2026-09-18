/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment, useState} from '@wordpress/element';
import {TabPanel, Button, SelectControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {breakpoints} from './grid-options';
import './responsive-controls.scss';

export function ResponsiveTabs({count=5,hasOverride,children}) {
 const titles=[__('Base','zmblocks'),'S','M','L','XL'];
 return <TabPanel className="zmblocks-responsive" tabs={breakpoints.slice(0,count).map(([key,,label],i)=>({name:key||'base',title:titles[i]+(i&&hasOverride(key)?' •':''),className:i&&hasOverride(key)?'has-override':'',label}))}>
 {tab=><div className="zmblocks-responsive-content"><p className="description">{tab.label}</p>{children(tab.name==='base'?'':tab.name)}</div>}
 </TabPanel>;
}

export function Choices({label,value,options,onChange}) {
 return <fieldset className="zmblocks-choices"><legend>{label}</legend><div>{options.map(option=><Button key={option.value} size="small" variant={value===option.value?'primary':'secondary'} aria-pressed={value===option.value} onClick={()=>onChange(option.value)}>{option.label}</Button>)}</div></fieldset>;
}

export function ColumnResponsiveControls({values:v,setAttributes,schema}) {
 const common=['grid','1-1','1-2','1-3','2-3','auto','expand'];
 const label=value=>value==='grid'?__('Grid','zmblocks'):value==='auto'?__('Auto','zmblocks'):value==='expand'?__('Expand','zmblocks'):value.replace(/^(\d)-(\d)$/,'$1/$2');
 return <ResponsiveTabs hasOverride={key=>!!(v['width'+key]||v['order'+key])}>{key=>{
  const width='width'+key,order='order'+key;
  return <div>
   <Choices label={__('Width','zmblocks')} value={v[width]} options={[...(key?[{value:'',label:__('Inherit','zmblocks')}]:[]),...common.map(value=>({value,label:label(value)}))]} onChange={value=>setAttributes({[width]:value})}/>
   <SelectControl label={__('More widths','zmblocks')} value={common.includes(v[width])||!v[width]?'':v[width]} options={[{value:'',label:__('Other fractions and fixed widths…','zmblocks')},...schema[width].enum.filter(value=>value&&!common.includes(value)).map(value=>({value,label:label(value)}))]} onChange={value=>{if(value)setAttributes({[width]:value});}}/>
   <Choices label={__('Visual order','zmblocks')} value={v[order]} options={[...(key?[{value:'',label:__('Inherit','zmblocks')}]:[]),{value:'normal',label:__('Normal','zmblocks')},{value:'first',label:__('First','zmblocks')},{value:'last',label:__('Last','zmblocks')}]} onChange={value=>setAttributes({[order]:value})}/>
   {key&&<><p className="description">{__('Inherit uses the setting from the smaller breakpoint. A dot marks custom settings.','zmblocks')}</p><Button variant="tertiary" disabled={!v[width]&&!v[order]} onClick={()=>setAttributes({[width]:'',[order]:''})}>{__('Reset breakpoint to inherit','zmblocks')}</Button></>}
  </div>;
 }}</ResponsiveTabs>;
}

export function GridResponsiveControls({values:v,setAttributes}) {
 return <ResponsiveTabs count={4} hasOverride={key=>!!v['columns'+key]}>{key=><Choices label={__('Columns per row','zmblocks')} value={v['columns'+key]} options={[...(key?[{value:'',label:__('Inherit','zmblocks')}]:[]),...['1','2','3','4','5','6'].map(value=>({value,label:value}))]} onChange={value=>setAttributes({['columns'+key]:value})}/>}</ResponsiveTabs>;
}

/** Compact controls for the layout Grid; Query Grid retains its own controls. */
export function GridColumnCountControls({values:v,setAttributes}) {
 const [expanded,setExpanded]=useState(()=>['Small','Medium','Large'].some(key=>!!v['columns'+key]));
 const numbers=['1','2','3','4','5','6'].map(value=>({value,label:value}));
 return <div><ToggleControl label={__('Responsive columns per row','zmblocks')} checked={expanded} onChange={enabled=>{setExpanded(enabled);if(!enabled)setAttributes({columnsSmall:'',columnsMedium:'',columnsLarge:''});}} help={__('When disabled, the common count applies to all screen sizes. Individual column widths still take precedence.','zmblocks')}/>
 {expanded?<div>{breakpoints.slice(0,4).map(([key,,label])=><SelectControl key={key||'base'} label={label} value={v['columns'+key]} options={key?[{value:'',label:__('Inherit','zmblocks')},...numbers]:numbers} onChange={value=>setAttributes({['columns'+key]:value})}/>)}<p>{__('Inherit uses the setting from the smaller screen size.','zmblocks')}</p></div>:<Choices label={__('Columns per row (all sizes)','zmblocks')} value={v.columns} options={numbers} onChange={columns=>setAttributes({columns,columnsSmall:'',columnsMedium:'',columnsLarge:''})}/>}
 </div>;
}
