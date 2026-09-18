/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {BlockControls, AlignmentToolbar, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, SelectControl, TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import metadata from './block.json';
import icons from './icons.json';
import {PixelControl,pixels} from '../shared/pixels';
import './index.scss';
function Edit({attributes, setAttributes}) {
  const name = Object.hasOwn(icons, attributes.icon) ? attributes.icon : 'star';
  const size = pixels(attributes.size ?? 20,20,1);
  const label = typeof attributes.label === 'string' ? attributes.label.trim() : '';
  const props = useBlockProps({className:'zmblocks-icon',style:{'--zmblocks-icon-size':size+'px',textAlign:metadata.attributes.textAlign.enum.includes(attributes.textAlign)?attributes.textAlign:undefined}});
  return <><InspectorControls><PanelBody title={__('Icon', 'zmblocks')}>
    <SelectControl label={__('Icon', 'zmblocks')} value={name} options={Object.keys(icons).map(value=>({label:value,value}))} onChange={icon=>setAttributes({icon})}/>
    <PixelControl label={__('Size (px)', 'zmblocks')} value={size} min={1} onChange={size=>setAttributes({size})}/>
    <TextControl label={__('Accessible label', 'zmblocks')} value={label} help={__('Leave empty for decorative icons. Describe meaningful icons for screen readers.', 'zmblocks')} onChange={label=>setAttributes({label})}/>
  </PanelBody></InspectorControls><div {...props}><span role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} dangerouslySetInnerHTML={{__html:icons[name]}} /></div><BlockControls group="block"><AlignmentToolbar value={attributes.textAlign} onChange={textAlign=>setAttributes({textAlign:textAlign||''})}/></BlockControls></>;
}
registerBlockType(metadata, {edit:Edit, save:()=>null});
