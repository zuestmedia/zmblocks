import UIkit from 'uikit/src/js/api/index';
import {registerTabs,tabs} from './tabs';
import Accordion from 'uikit/src/js/core/accordion';
import Scrollspy from 'uikit/src/js/core/scrollspy';
import Filter from 'uikit/src/js/components/filter';
import Lightbox from 'uikit/src/js/components/lightbox';
import './index.scss';
import {gridLines} from './grid-lines';
import {masonrySelector, registerMasonry, masonry} from './masonry';

// No UIkit boot/global: only explicitly marked ZMBlocks elements are initialized.
UIkit.component('accordion',Accordion);
UIkit.component('filter',Filter);
UIkit.component('scrollspy',Scrollspy);
UIkit.component('lightbox',Lightbox);
registerMasonry(UIkit);
registerTabs(UIkit);
const initialized=new WeakSet();
let filterId=0;
function initialize(root=document) {
 const selector='[data-zmblocks-tabs],[data-zmblocks-accordion],[data-zmblocks-filter],[data-zmblocks-lightbox],[data-zmblocks-scrollspy],[data-zmblocks-grid-lines],'+masonrySelector;
 const nodes=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
 for(const el of nodes) {
  if(initialized.has(el)) continue;
  initialized.add(el);
  if(el.hasAttribute('data-zmblocks-tabs')) tabs(UIkit,el);
  if(el.hasAttribute('data-zmblocks-accordion')) {
   const active=Number(el.dataset.zmblocksActive)||0;
   UIkit.accordion(el,{targets:'> .zmblocks-accordion-item',toggle:'> .zmblocks-accordion-heading > .uk-accordion-title',content:'> .uk-accordion-content',multiple:el.dataset.zmblocksMultiple==='true',collapsible:el.dataset.zmblocksCollapsible!=='false',active:active>0?active-1:false,animation:el.dataset.zmblocksAnimation!=='false'&&!matchMedia('(prefers-reduced-motion: reduce)').matches});
  }
  if(el.matches(masonrySelector)) masonry(UIkit,el);
  if(el.hasAttribute('data-zmblocks-grid-lines')) gridLines(el);
  if(el.hasAttribute('data-zmblocks-scrollspy')) {
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const effect=el.dataset.zmblocksScrollspy;
    if(['fade','slide-top-small','slide-bottom-small','slide-left-small','slide-right-small','scale-up','scale-down'].includes(effect)) UIkit.scrollspy(el,{target:':scope > .zmblocks-column',cls:'uk-animation-'+effect,delay:Math.min(1000,Math.max(0,Number(el.dataset.zmblocksScrollspyDelay)||0)),repeat:el.dataset.zmblocksScrollspyRepeat==='true'});
   }
  } else if(el.hasAttribute('data-zmblocks-filter')) {
   const grids=[...el.children].filter(child=>child.matches('.zmblocks-grid'));
   if(!grids.length) continue;
   const attrItem=`data-zmblocks-control-${++filterId}`;
   for(const control of el.querySelectorAll(':scope > .zmblocks-filter-controls > li')) {
    control.setAttribute(attrItem,control.getAttribute('uk-filter-control') || '');
    control.removeAttribute('uk-filter-control');
   }
   const update=()=>{
    for(const grid of grids) if(grid.matches(masonrySelector)) UIkit.update(grid,'resize');
    for(const control of el.querySelectorAll(':scope > .zmblocks-filter-controls > li')) control.querySelector('button')?.setAttribute('aria-pressed',String(control.classList.contains('uk-active')));
    const empty=el.querySelector(':scope > .zmblocks-filter-empty');
    if(empty) empty.hidden=grids.some(grid=>[...grid.children].some(child=>!child.matches('link,style,script') && child.style.display!=='none'));
   };
   el.addEventListener('afterFilter',update);
   UIkit.filter(el,{attrItem,target:':scope > .zmblocks-grid',animation:el.dataset.zmblocksAnimation==='false'||matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 'slide',duration:250});
   el.dataset.zmblocksReady='true';
  } else if(el.hasAttribute('data-zmblocks-lightbox')) {
   const template=document.createElement('div');
   template.className='uk-lightbox zmblocks-lightbox';
   template.setAttribute('aria-label',el.querySelector('img')?.alt || el.dataset.zmblocksCloseLabel || 'Image');
   template.innerHTML='<div class="uk-lightbox-items"></div><button class="uk-close-large zmblocks-lightbox-close" type="button"></button>';
   template.querySelector('button').textContent=el.dataset.zmblocksCloseLabel || 'Close';
   const trigger=el.querySelector('[data-zmblocks-lightbox-link]');
   // UIkit manages modal focus trapping/Escape. Restore the specific opener on close.
   el.addEventListener('click',event=>{
    if(!event.target.closest('[data-zmblocks-lightbox-link]')) return;
    const closed=event=>{
     if(!event.target.matches('.zmblocks-lightbox')) return;
     trigger?.focus();document.removeEventListener('hidden',closed);
    };
    document.addEventListener('hidden',closed);
   });
   UIkit.lightbox(el,{toggle:'a[data-zmblocks-lightbox-link]',template:template.outerHTML,slidenav:false,nav:false,animation:'fade',delayControls:0});
  }
 }
}
const start=()=>{
 initialize();
 document.addEventListener('keydown',event=>{
  if(event.key!=='Tab') return;
  const panel=document.querySelector('.zmblocks-lightbox.uk-open');
  if(!panel) return;
  const focusable=[...panel.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length);
  const first=focusable[0] || panel,last=focusable.at(-1) || panel;
  if(event.shiftKey && (document.activeElement===first || !focusable.includes(document.activeElement))) {event.preventDefault();last.focus();}
  else if(!event.shiftKey && (document.activeElement===last || !focusable.includes(document.activeElement))) {event.preventDefault();first.focus();}
 });
 new MutationObserver(records=>{
  for(const record of records) for(const node of record.addedNodes) if(node.nodeType===1) initialize(node);
 }).observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});else start();
