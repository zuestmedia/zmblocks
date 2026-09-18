/** @jsxRuntime classic */
/** @jsx createElement */
import {createElement,useMemo} from '@wordpress/element';
import {__experimentalLinkControl as LinkControl} from '@wordpress/block-editor';
import {Dropdown,Button,ToolbarButton} from '@wordpress/components';
import {__} from '@wordpress/i18n';

/** Use the editor's own page/post suggestions and link settings. */
export function LinkPicker({url,newTab,onChange,clientId,toolbar=false}) {
 const value=useMemo(()=>({url:url||'',opensInNewTab:!!newTab}),[url,newTab]);
 const Toggle=toolbar?ToolbarButton:Button;
 return <Dropdown popoverProps={{placement:'bottom-start'}}
  renderToggle={({isOpen,onToggle})=><Toggle icon="admin-links" label={__('Edit link','zmblocks')} aria-expanded={isOpen} onClick={onToggle} {...(toolbar?{isActive:!!url}:{variant:'secondary'})}>{!toolbar&&(url?__('Edit link','zmblocks'):__('Add link','zmblocks'))}</Toggle>}
  renderContent={({onClose})=><LinkControl key={clientId} value={value} withCreateSuggestion={false}
   onChange={next=>onChange({url:next.url||'',newTab:!!next.opensInNewTab})}
   onRemove={()=>{onChange({url:'',newTab:false});onClose();}}/>}/>;
}
