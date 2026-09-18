/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {createElement, Fragment} from '@wordpress/element';
import {registerBlockType} from '@wordpress/blocks';
import {BlockControls, AlignmentToolbar, InspectorControls, RichText, useBlockProps} from '@wordpress/block-editor';
import {create, getTextContent, toHTMLString} from '@wordpress/rich-text';
import {PanelBody, SelectControl, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {normalize} from '../shared/model';
import icons from '../icon/icons.json';
import metadata from './block.json';
import {LinkPicker} from '../shared/link-picker';
import './index.scss';

export function Edit({attributes, setAttributes, clientId}) {
  const v = normalize(metadata, attributes);
  const props = useBlockProps({className:`zmblocks-button zmblocks-button-align-${v.alignment}${v.fullWidth ? ' zmblocks-button-full' : ''}`});
  const controlClasses = ['zmblocks-button-control','uk-button',`uk-button-${v.variant}`,v.size !== 'default' && `uk-button-${v.size}`].filter(Boolean).join(' ');
  const icon = v.iconEnabled && <span className="zmblocks-button-icon" aria-hidden="true" dangerouslySetInnerHTML={{__html:icons[v.icon].replace('<svg ', '<svg focusable="false" ')}}/>;
  return <>
    <InspectorControls>
      <PanelBody title={__('Button', 'zmblocks')}>
        <SelectControl label={__('Style', 'zmblocks')} value={v.variant} options={[
          {label:__('Default', 'zmblocks'),value:'default'}, {label:__('Primary', 'zmblocks'),value:'primary'},
          {label:__('Secondary', 'zmblocks'),value:'secondary'}, {label:__('Danger', 'zmblocks'),value:'danger'},
          {label:__('Text', 'zmblocks'),value:'text'}, {label:__('Link', 'zmblocks'),value:'link'}
        ]} onChange={variant=>setAttributes({variant})}/>
        <SelectControl label={__('Size', 'zmblocks')} value={v.size} options={[
          {label:__('Default', 'zmblocks'),value:'default'}, {label:__('Small', 'zmblocks'),value:'small'}, {label:__('Large', 'zmblocks'),value:'large'}
        ]} onChange={size=>setAttributes({size})}/>
        <ToggleControl label={__('Full width', 'zmblocks')} checked={v.fullWidth} onChange={fullWidth=>setAttributes({fullWidth})}/>
      </PanelBody>
      <PanelBody title={__('Icon', 'zmblocks')}>
        <ToggleControl label={__('Add icon', 'zmblocks')} checked={v.iconEnabled} onChange={iconEnabled=>setAttributes({iconEnabled})}/>
        {v.iconEnabled && <>
          <SelectControl label={__('Icon', 'zmblocks')} value={v.icon} options={Object.keys(icons).map(value=>({label:value,value}))} onChange={icon=>setAttributes({icon})}/>
          <SelectControl label={__('Icon position', 'zmblocks')} value={v.iconPosition} options={[
            {label:__('Before text', 'zmblocks'),value:'before'}, {label:__('After text', 'zmblocks'),value:'after'}
          ]} onChange={iconPosition=>setAttributes({iconPosition})}/>
        </>}
      </PanelBody>
    </InspectorControls>
    <div {...props}>
      {/* Editable label inside a non-navigating preview; icons remain separate. */}
      <span className={controlClasses}>
        {v.iconPosition === 'before' && icon}
        <RichText tagName="span" className="zmblocks-button-label"
          value={toHTMLString({value:create({text:v.label})})}
          onChange={html=>setAttributes({label:getTextContent(create({html})).replace(/[\r\n]+/g,' ')})}
          allowedFormats={[]} disableLineBreaks
          aria-label={__('Button text', 'zmblocks')} placeholder={__('Button text…', 'zmblocks')}/>
        {v.iconPosition === 'after' && icon}
      </span>
    </div>
    <BlockControls group="block"><AlignmentToolbar value={v.alignment} onChange={alignment=>setAttributes({alignment:alignment||'left'})}/><LinkPicker toolbar clientId={clientId} url={v.url} newTab={v.newTab} onChange={({url,newTab})=>setAttributes({url,newTab})}/></BlockControls>
  </>;
}
registerBlockType(metadata, {edit:Edit, save:()=>null});
