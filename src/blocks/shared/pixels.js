/** @jsxRuntime classic */
/** @jsx createElement */
import {createElement} from '@wordpress/element';
import {RangeControl, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import './pixels.scss';
export function pixels(value, fallback=0, min=0) {
 const legacy={none:0,small:4,large:12};
 const number=Object.hasOwn(legacy,value)?legacy[value]:Number(value);
 return Number.isFinite(number) && number>=min ? number : fallback;
}
export function PixelControl({label,value,onChange,min=0}) {
 const change=next=>{const number=Number(next);if(Number.isFinite(number)&&number>=min)onChange(String(number));};
 return <div className="zmblocks-pixel-control"><RangeControl label={label} value={value} min={min} max={Math.max(200,Math.ceil(value))} step={1} withInputField={false} onChange={change}/><TextControl label={__('Pixels','zmblocks')} hideLabelFromVision type="number" value={value} min={min} step="any" onChange={change}/><span aria-hidden="true">px</span></div>;
}
export function radiusStyle(v) {
 return v.radiusIndividual ? {borderRadius:[v.radiusTopLeft,v.radiusTopRight,v.radiusBottomRight,v.radiusBottomLeft].map(value=>pixels(value === '' ? v.radius : value)+'px').join(' ')} : {borderRadius:pixels(v.radius)+'px'};
}
export function RadiusControl({values:v,setAttributes}) {
 return <div><ToggleControl label={__('Individual corners','zmblocks')} checked={v.radiusIndividual} onChange={radiusIndividual=>setAttributes({radiusIndividual})}/>{v.radiusIndividual ? [['radiusTopLeft',__('Top left','zmblocks')],['radiusTopRight',__('Top right','zmblocks')],['radiusBottomRight',__('Bottom right','zmblocks')],['radiusBottomLeft',__('Bottom left','zmblocks')]].map(([key,label])=><PixelControl key={key} label={label} value={pixels(v[key] === '' ? v.radius : v[key])} onChange={value=>setAttributes({[key]:value})}/>) : <PixelControl label={__('Border radius','zmblocks')} value={pixels(v.radius)} onChange={radius=>setAttributes({radius})}/>}</div>;
}
