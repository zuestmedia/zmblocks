import Tab from 'uikit/src/js/core/tab';
import Toggle from 'uikit/src/js/core/toggle';

let nextId=0;
export function registerTabs(UIkit) {
 UIkit.component('toggle',Toggle);
 UIkit.component('tab',Tab);
}
export function tabs(UIkit,root) {
 const navigation=root.querySelector(':scope > .zmblocks-tabs-navigation');
 const list=navigation?.querySelector(':scope > .uk-tab');
 const panels=root.querySelector(':scope > .zmblocks-tabs-panels');
 if(!list||!panels)return;
 const items=[...panels.children].filter(el=>el.classList.contains('zmblocks-tab-item'));
 if(!items.length)return;
 // Late WordPress style output must not become an extra switcher panel.
 for(const child of [...panels.children])if(!items.includes(child))root.insertBefore(child,navigation);
 let id;
 do {id='zmblocks-switcher-'+(++nextId);} while(document.getElementById(id));
 panels.id=id;
 const position=root.dataset.zmblocksPosition;
 if(['left','right'].includes(position))list.classList.add('uk-tab-'+position);
 items.forEach((panel,index)=>{
  const li=document.createElement('li');
  const link=document.createElement('a');
  if(!panel.id)panel.id=id+'-panel-'+index;
  link.id=id+'-tab-'+index;
  link.setAttribute('role','tab');
  link.setAttribute('aria-controls',panel.id);
  panel.setAttribute('role','tabpanel');
  panel.setAttribute('aria-labelledby',link.id);
  link.href='#';
  link.textContent=panel.dataset.zmblocksTabTitle||(root.dataset.zmblocksTabLabel||'Tab')+' '+(index+1);
  li.append(link);list.append(li);
 });
 const motion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const effect=root.dataset.zmblocksAnimation;
 navigation.hidden=false;
 list.setAttribute('role','tablist');
 UIkit.tab(list,{
  connect:'#'+id,
  media:960,
  active:Math.min(items.length-1,Math.max(0,(Number(root.dataset.zmblocksActive)||1)-1)),
  animation:!motion&&['fade','slide-left-small','slide-bottom-small'].includes(effect)?'uk-animation-'+effect:false,
  swiping:false,
 });
 panels.classList.add('uk-switcher');
 navigation.hidden=false;
 root.setAttribute('data-zmblocks-tabs-ready','');
}
