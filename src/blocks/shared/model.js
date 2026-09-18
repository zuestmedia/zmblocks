export function normalize(metadata, attributes = {}) {
  return Object.fromEntries(Object.entries(metadata.attributes).map(([name, schema]) => {
    const value = attributes[name];
    const valid = schema.type === 'integer' ? Number.isInteger(value) && value >= (schema.minimum ?? 0) : typeof value === schema.type;
    return [name, valid && (!schema.enum || schema.enum.includes(value)) ? value : schema.default];
  }));
}
export function layoutClasses(name, v) {
  const classes = ['zmblocks-' + name];
  if (name === 'card' && /^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(v.textColor)) classes.push('zmblocks-custom-text');
  if(name === 'grid') classes.push('uk-grid', 'zmblocks-cols-' + v.columns, v.columnsSmall && 'zmblocks-cols-s-' + v.columnsSmall, v.columnsMedium && 'zmblocks-cols-m-' + v.columnsMedium, v.columnsLarge && 'zmblocks-cols-l-' + v.columnsLarge, v.gap !== 'default' && 'uk-grid-' + v.gap, v.divider && 'zmblocks-grid-dividers', v.equalHeight && 'zmblocks-grid-equal');
  if(name === 'card') classes.push(v.size !== 'none' && 'uk-card-body', 'zmblocks-card-direct', 'zmblocks-shadow-' + v.shadow, 'uk-card', v.variant !== 'none' && 'uk-card-' + v.variant, v.size !== 'default' && 'uk-card-' + v.size, v.hover && 'uk-card-hover');
  if(name === 'image') classes.push('zmblocks-image-ratio-' + v.ratio, 'zmblocks-image-fit-' + v.fit, 'zmblocks-image-position-' + v.position);
  return classes.filter(Boolean).join(' ');
}
