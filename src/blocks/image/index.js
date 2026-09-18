/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {useSelect} from '@wordpress/data';
import {store as coreStore} from '@wordpress/core-data';
import {BlockControls, AlignmentToolbar, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck, RichText, useBlockProps} from '@wordpress/block-editor';
import {Button, PanelBody, SelectControl, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import {normalize, layoutClasses} from '../shared/model';
import {PixelControl,pixels} from '../shared/pixels';
import {LinkPicker} from '../shared/link-picker';
import './index.scss';

export function Edit({attributes, setAttributes, clientId}) {
  const v = normalize(metadata, attributes);
  const attachment = useSelect(select => v.id ? select(coreStore).getMedia(v.id) : null, [v.id]);
  const selectedSize = attachment?.media_details?.sizes?.[v.sizeSlug];
  const naturalWidth = selectedSize?.width || attachment?.media_details?.width;
  const props = useBlockProps({className:layoutClasses('image', v)+' zmblocks-image-align-'+v.imageAlign+' zmblocks-image-width-'+v.widthMode,style:{
    '--zmblocks-image-width':v.widthMode==='custom'?pixels(v.imageWidth,320,1)+'px':undefined,
    '--zmblocks-image-natural-width':v.widthMode==='auto'&&Number.isFinite(naturalWidth)&&naturalWidth>0?naturalWidth+'px':undefined
  }});
  const select = media => {
    if (!Number.isInteger(media?.id) || !media?.url || (media.type && media.type !== 'image')) return;
    setAttributes({id:media.id, url:media.url, alt:media.alt || '', caption:media.caption || ''});
  };
  // The saved URL is an editor preview only; PHP resolves the actual attachment.
  const source = attachment?.media_details?.sizes?.[v.sizeSlug]?.source_url || attachment?.source_url || v.url;
  const safePreview = /^https?:\/\//i.test(source) ? source : '';
  return <>
    <InspectorControls><PanelBody title={__('Image', 'zmblocks')}>
      <MediaUploadCheck><MediaUpload value={v.id} allowedTypes={['image']} onSelect={select}
        render={({open}) => <Button variant="secondary" onClick={open}>{__('Select or replace image', 'zmblocks')}</Button>}/></MediaUploadCheck>
      {v.id > 0 && <Button variant="tertiary" isDestructive onClick={()=>setAttributes({id:0,url:'',alt:'',caption:''})}>{__('Remove image', 'zmblocks')}</Button>}
      <TextControl label={__('Alternative text', 'zmblocks')} value={v.alt} onChange={alt=>setAttributes({alt})}
        help={__('Describe the image. Leave empty only when it is decorative.', 'zmblocks')}/>
      <SelectControl label={__('Display width','zmblocks')} value={v.widthMode} options={[{value:'auto',label:__('Natural size','zmblocks')},{value:'full',label:__('Fill box','zmblocks')},{value:'custom',label:__('Custom width','zmblocks')}]} onChange={widthMode=>setAttributes({widthMode})}/>
      {v.widthMode==='custom'&&<PixelControl label={__('Width (px)','zmblocks')} value={v.imageWidth} min={1} onChange={imageWidth=>setAttributes({imageWidth})}/>}
      <SelectControl label={__('Image resolution', 'zmblocks')} help={__('Selects the image file. Display width controls its visible size. Missing resolutions fall back to the original image.','zmblocks')} value={v.sizeSlug} options={[
        {label:__('Thumbnail', 'zmblocks'),value:'thumbnail'}, {label:__('Medium', 'zmblocks'),value:'medium'},
        {label:__('Medium large', 'zmblocks'),value:'medium_large'}, {label:__('Large', 'zmblocks'),value:'large'}, {label:__('Full', 'zmblocks'),value:'full'}
      ]} onChange={sizeSlug=>setAttributes({sizeSlug})}/>
      <SelectControl label={__('Aspect ratio', 'zmblocks')} value={v.ratio} options={[
        {label:__('Original', 'zmblocks'),value:'auto'}, ...['1-1','4-3','3-2','16-9','3-4'].map(value=>({label:value.replace('-',':'),value}))
      ]} onChange={ratio=>setAttributes({ratio})}/>
      {v.ratio !== 'auto' && <>
        <SelectControl label={__('Image fit', 'zmblocks')} value={v.fit} options={[{label:__('Cover (crop)', 'zmblocks'),value:'cover'},{label:__('Contain (show all)', 'zmblocks'),value:'contain'}]} onChange={fit=>setAttributes({fit})}/>
        <SelectControl label={__('Image position', 'zmblocks')} value={v.position} options={[
          {label:__('Center', 'zmblocks'),value:'center'}, {label:__('Top', 'zmblocks'),value:'top'}, {label:__('Bottom', 'zmblocks'),value:'bottom'},
          {label:__('Left', 'zmblocks'),value:'left'}, {label:__('Right', 'zmblocks'),value:'right'}
        ]} onChange={position=>setAttributes({position})}/>
      </>}
      <SelectControl label={__('Link', 'zmblocks')} value={v.linkDestination} options={[
        {label:__('Full-screen lightbox', 'zmblocks'),value:'lightbox'}, {label:__('None', 'zmblocks'),value:'none'}, {label:__('Media file', 'zmblocks'),value:'media'}, {label:__('Custom URL', 'zmblocks'),value:'custom'}
      ]} onChange={linkDestination=>setAttributes({linkDestination})}/>
      {v.linkDestination === 'custom' && <LinkPicker clientId={clientId} url={v.linkUrl} newTab={v.newTab} onChange={({url,newTab})=>setAttributes({linkUrl:url,newTab})}/>}
      {v.linkDestination === 'media' && <ToggleControl label={__('Open in new tab', 'zmblocks')} checked={v.newTab} onChange={newTab=>setAttributes({newTab})}/>}
    </PanelBody></InspectorControls>
    <figure {...props}>
      {v.id && safePreview ? <>
        <span className="zmblocks-image-media"><img src={safePreview} alt={v.alt}/></span>
        <RichText tagName="figcaption" value={v.caption} allowedFormats={['core/bold','core/italic']} placeholder={__('Add caption…', 'zmblocks')} onChange={caption=>setAttributes({caption})}/>
      </> : <MediaPlaceholder icon="format-image" labels={{title:__('ZM Image', 'zmblocks')}} onSelect={select} accept="image/*" allowedTypes={['image']}/>}
    </figure>
    <BlockControls group="block"><AlignmentToolbar value={v.imageAlign} onChange={imageAlign=>setAttributes({imageAlign:imageAlign||'left'})}/></BlockControls>
  </>;
}
registerBlockType(metadata, {edit:Edit, save:()=>null});
