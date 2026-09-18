// Row-aware dividers also work with mixed widths, ordering and filtered items.
export function gridLines(grid) {
 const update=()=>{
  const items=[...grid.children].filter(el=>el.matches('.zmblocks-column')&&el.getClientRects().length&&getComputedStyle(el).display!=='none');
  const rows=[];
  for(const item of items.sort((a,b)=>a.offsetTop-b.offsetTop)) {
   const top=item.offsetTop,bottom=top+Math.max(1,item.offsetHeight);
   let row=rows.find(row=>top<row.bottom&&bottom>row.top);
   if(!row){row={top,bottom,items:[]};rows.push(row);}row.items.push(item);
  }
  const vertical=getComputedStyle(grid).flexDirection.startsWith('column');
  for(const [index,row] of rows.entries()) {
   const first=[...row.items].sort((a,b)=>getComputedStyle(grid).direction==='rtl'?b.offsetLeft-a.offsetLeft:a.offsetLeft-b.offsetLeft)[0];
   for(const item of row.items){item.dataset.zmblocksRowFirst=String(item===first);item.dataset.zmblocksFirstRow=String(index===0);}
  }
  grid.dataset.zmblocksSingleColumn=String(vertical || rows.every(row=>row.items.length===1));
  grid.dataset.zmblocksLinesReady='true';
 };
 let frame;
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};
 const resize=new ResizeObserver(schedule);resize.observe(grid);
 const observeChildren=()=>{for(const child of grid.children)resize.observe(child);schedule();};
 new MutationObserver(observeChildren).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
 observeChildren();
}
