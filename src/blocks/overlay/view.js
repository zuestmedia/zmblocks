import './view.scss';

// First touch reveals hover content; a subsequent tap can activate its links.
let opened;
function close() {
 if (!opened) return;
 opened.removeAttribute('data-zmblocks-touch-open');
 if (opened.contains(document.activeElement)) document.activeElement.blur();
 opened = undefined;
}
document.addEventListener('pointerdown', event => {
 if (opened && !opened.contains(event.target)) close();
}, true);
document.addEventListener('click', event => {
 const overlay = event.target.closest('.zmblocks-overlay-hover');
 if (!overlay || event.detail === 0 || (event.pointerType !== 'touch' && !matchMedia('(hover:none)').matches)) return;
 if (opened === overlay) return;
 close();
 opened = overlay;
 overlay.setAttribute('data-zmblocks-touch-open', '');
 event.preventDefault();
 event.stopPropagation();
}, true);
document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
