/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { createElement, Fragment } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { normalize, sectionClasses } from './model';
import './index.scss';
import {SurfaceControls, surfaceStyle} from '../shared/surface';

export function Edit({ attributes, setAttributes }) {
  const values = normalize(attributes);
  const blockProps = useBlockProps({ className: sectionClasses(values), style:surfaceStyle(values) });
  const contained = values.contentWidth !== 'none';
  const innerProps = useInnerBlocksProps(contained ? {className:'zmblocks-section-content zmblocks-container uk-container' + (values.contentWidth !== 'default' ? ' uk-container-' + values.contentWidth : '')} : blockProps, { renderAppender: InnerBlocks.ButtonBlockAppender });
  const Tag = values.tagName;
  return <>
    <InspectorControls>
      <PanelBody title={__('Section', 'zmblocks')}>
        <SelectControl label={__('Background', 'zmblocks')} value={values.background}
          options={[
            { label: __('None', 'zmblocks'), value: 'none' },
            { label: __('Default', 'zmblocks'), value: 'default' },
            { label: __('Muted', 'zmblocks'), value: 'muted' },
            { label: __('Primary', 'zmblocks'), value: 'primary' },
            { label: __('Secondary', 'zmblocks'), value: 'secondary' },
          ]} onChange={(background) => setAttributes({ background })} />
        <SelectControl label={__('Vertical spacing', 'zmblocks')} value={values.size}
          options={[
            { label: __('Default', 'zmblocks'), value: 'default' },
            { label: __('None', 'zmblocks'), value: 'none' },
            { label: __('Extra small', 'zmblocks'), value: 'xsmall' },
            { label: __('Small', 'zmblocks'), value: 'small' },
            { label: __('Large', 'zmblocks'), value: 'large' },
            { label: __('Extra large', 'zmblocks'), value: 'xlarge' },
          ]} onChange={(size) => setAttributes({ size })} />
        {['primary', 'secondary'].includes(values.background) &&
          <ToggleControl label={__('Preserve content colors', 'zmblocks')} checked={values.preserveColor}
            help={__('Keep existing text colors instead of the section contrast colors.', 'zmblocks')}
            onChange={(preserveColor) => setAttributes({ preserveColor })} />}
        <SelectControl label={__('Minimum viewport height', 'zmblocks')} value={values.viewportHeight}
          help={__('Content can grow beyond this minimum height.', 'zmblocks')}
          options={[{label: __('Auto', 'zmblocks'), value:'auto'}, ...['25','50','75','100'].map(value => ({label: value + '%', value}))]}
          onChange={viewportHeight => setAttributes({viewportHeight})} />
        <SelectControl label={__('Vertical alignment', 'zmblocks')} value={values.verticalAlignment}
          help={__('Alignment becomes visible when the section has spare height.', 'zmblocks')}
          options={[{label:__('Top', 'zmblocks'),value:'top'}, {label:__('Center', 'zmblocks'),value:'center'}, {label:__('Bottom', 'zmblocks'),value:'bottom'}]}
          onChange={verticalAlignment => setAttributes({verticalAlignment})} />
        <SelectControl label={__('HTML element', 'zmblocks')} value={values.tagName}
          help={__('Use section for a distinct topic with a heading. Use div for general layout.', 'zmblocks')}
          options={[{ label: 'div', value: 'div' }, { label: 'section', value: 'section' }]}
          onChange={(tagName) => setAttributes({ tagName })} />
        <SelectControl label={__('Content width','zmblocks')} value={values.contentWidth} options={[
          {label:__('Unrestricted, no side padding','zmblocks'),value:'none'}, {label:__('Default','zmblocks'),value:'default'},
          {label:__('Extra small','zmblocks'),value:'xsmall'},{label:__('Small','zmblocks'),value:'small'},
          {label:__('Large','zmblocks'),value:'large'},{label:__('Extra large','zmblocks'),value:'xlarge'}, {label:__('Full width with side padding','zmblocks'),value:'expand'}
        ]} onChange={contentWidth=>setAttributes({contentWidth})}/>
      </PanelBody>
      <SurfaceControls values={values} setAttributes={setAttributes}/>
    </InspectorControls>
    {contained ? <Tag {...blockProps}><div {...innerProps}/></Tag> : <Tag {...innerProps} />}
  </>;
}

export function Save() {
  // Store core content only. PHP owns the section wrapper; children survive deactivation.
  return <InnerBlocks.Content />;
}

registerBlockType(metadata, { edit: Edit, save: Save });
