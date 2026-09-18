import {createElement} from '@wordpress/element';
import {__} from '@wordpress/i18n';

// Decorative SVGs inherit the editor's foreground color, including selection states.
// The picker supplies the accessible title and description on its button.
function preview(count=0) {
 const columns=Array.from({length:count},(_,i)=>createElement('rect',{
  key:i,x:4+i*(42/count),y:5,width:42/count-2,height:25,rx:1,
  fill:'currentColor',fillOpacity:.16,stroke:'currentColor',strokeWidth:1,
 }));
 return createElement('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 48 48',width:48,height:48,fill:'none','aria-hidden':true,focusable:false},
  ...(count?columns:[
   createElement('rect',{key:'frame',x:4,y:5,width:40,height:25,rx:2,stroke:'currentColor',strokeWidth:1.5,strokeDasharray:'3 3'}),
   createElement('path',{key:'plus',d:'M18 17.5h12M24 11.5v12',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}),
  ]),
  count?createElement('text',{x:24,y:43,textAnchor:'middle',fill:'currentColor',fontSize:8,fontFamily:'sans-serif'},`1 / ${Math.min(count,2)} / ${Math.min(count,3)} / ${count}`):null,
 );
}
export const gridPresets=[
 {name:'empty',title:__('Empty grid','zmblocks'),description:__('One empty column; a common column count for all screen sizes.','zmblocks'),icon:preview(),attributes:{columns:'1',columnsSmall:'',columnsMedium:'',columnsLarge:''}},
 ...[2,3,4,5,6].map(count=>({name:'responsive-'+count,title:__('Responsive grid','zmblocks')+' '+count,description:__('Responsive grid','zmblocks')+' '+count+': 1 / '+Math.min(count,2)+' / '+Math.min(count,3)+' / '+count,icon:preview(count),attributes:{columns:'1',columnsSmall:String(Math.min(count,2)),columnsMedium:String(Math.min(count,3)),columnsLarge:String(count)}}))
];
