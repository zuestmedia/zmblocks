import metadata from './block.json';

import {normalize as normalizeAttributes} from '../shared/model';
export function normalize(attributes = {}) { return normalizeAttributes(metadata, attributes); }

export function sectionClasses(attributes) {
  const { background, size, preserveColor, viewportHeight, verticalAlignment } = normalize(attributes);
  return [
    'zmblocks-section', 'uk-section',
    /^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(attributes.textColor) && 'zmblocks-custom-text',
    background !== 'none' && `uk-section-${background}`,
    size !== 'default' && (size === 'none' ? 'uk-padding-remove-vertical' : `uk-section-${size}`),
    preserveColor && 'uk-preserve-color',
    viewportHeight !== 'auto' && `zmblocks-viewport-${viewportHeight}`,
    verticalAlignment !== 'top' && `zmblocks-vertical-${verticalAlignment}`,
  ].filter(Boolean).join(' ');
}
