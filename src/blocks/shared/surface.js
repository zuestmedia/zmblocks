/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {MediaUpload, MediaUploadCheck} from '@wordpress/block-editor';
import {PanelBody, ColorPalette, SelectControl, Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';

export function surfaceStyle(v) {
  const style = {};
  if (/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(v.surfaceColor)) style.backgroundColor = v.surfaceColor;
  if (/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(v.textColor)) style.color = v.textColor;
  if (v.backgroundImageId && /^https?:\/\//i.test(v.backgroundImageUrl)) {
    style.backgroundImage = `url(${JSON.stringify(v.backgroundImageUrl)})`;
    style.backgroundSize = v.backgroundSize;
    style.backgroundPosition = v.backgroundPosition;
    style.backgroundRepeat = 'no-repeat';
  }
  return style;
}
export function SurfaceControls({values:v,setAttributes}) {
  return <PanelBody title={__('Colors and background image','zmblocks')} initialOpen={false}>
    <p>{__('Background color','zmblocks')}</p>
    <ColorPalette aria-label={__('Background color','zmblocks')} value={v.surfaceColor} onChange={surfaceColor=>setAttributes({surfaceColor:surfaceColor || ''})} enableAlpha={false}/>
    <p>{__('Text color','zmblocks')}</p>
    <ColorPalette aria-label={__('Text color','zmblocks')} value={v.textColor} onChange={textColor=>setAttributes({textColor:textColor || ''})} enableAlpha={false}/>
    <MediaUploadCheck><MediaUpload allowedTypes={['image']} value={v.backgroundImageId}
      onSelect={media=>{if(Number.isInteger(media?.id) && media.url) setAttributes({backgroundImageId:media.id,backgroundImageUrl:media.url});}}
      render={({open})=><Button variant="secondary" onClick={open}>{__('Choose background image','zmblocks')}</Button>}/></MediaUploadCheck>
    {v.backgroundImageId > 0 && <>
      <Button variant="tertiary" isDestructive onClick={()=>setAttributes({backgroundImageId:0,backgroundImageUrl:''})}>{__('Remove background image','zmblocks')}</Button>
      <SelectControl label={__('Background size','zmblocks')} value={v.backgroundSize} options={[
        {label:__('Cover','zmblocks'),value:'cover'},{label:__('Contain','zmblocks'),value:'contain'},{label:__('Original size','zmblocks'),value:'auto'}
      ]} onChange={backgroundSize=>setAttributes({backgroundSize})}/>
      <SelectControl label={__('Background position','zmblocks')} value={v.backgroundPosition} options={[
        {label:__('Top left','zmblocks'),value:'top left'},{label:__('Top center','zmblocks'),value:'top center'},{label:__('Top right','zmblocks'),value:'top right'},
        {label:__('Center left','zmblocks'),value:'center left'},{label:__('Center','zmblocks'),value:'center center'},{label:__('Center right','zmblocks'),value:'center right'},
        {label:__('Bottom left','zmblocks'),value:'bottom left'},{label:__('Bottom center','zmblocks'),value:'bottom center'},{label:__('Bottom right','zmblocks'),value:'bottom right'}
      ]} onChange={backgroundPosition=>setAttributes({backgroundPosition})}/>
      <p>{__('Background images are decorative. Use an Image block for meaningful pictures and check text contrast.','zmblocks')}</p>
    </>}
  </PanelBody>;
}
