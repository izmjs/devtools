(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{ZtOD:function(n,t,l){"use strict";l.r(t);var e=l("CcnG"),u=function(){return function(){}}(),i=l("pMnS"),o=l("Ip0R"),c=l("gIcY"),a=l("mDzb"),r=l("RYH6"),s=l("MKl1"),b=l("IDdX"),d=l("rIPa"),p=l("mrSG"),g=[{key:"en",label:"English",name:"English"},{key:"zh",label:"Chinese",name:"中文"},{key:"hi",label:"Hindi",name:"हिन्दी"},{key:"es",label:"Spanish",name:"Español"},{key:"fr",label:"French",name:"Français"},{key:"ar",label:"Arabic",name:"اللغة العربية"},{key:"ru",label:"Russian",name:"Русский"},{key:"bn",label:"Bengali",name:"বাংলা"},{key:"pt",label:"Portuguese",name:"Português"},{key:"id",label:"Indonesian",name:"Indonesian"}],f=function(){function n(){this.lngs=[],this.entries=[],this.working=!1,this.create=new e.m,this.remove=new e.m,this.update=new e.m,this.addLanguage=new e.m,this.removeLanguage=new e.m,this.updateLanguage=new e.m,this.editableEntries=[],this.editableLngs=[],this.isAddLanguage=!1}return n.prototype.ngOnChanges=function(n){var t=this,l=n.lngs;l.currentValue!==l.previousValue&&(this.lngs=n.lngs.currentValue);var e=n.entries,u=e.currentValue,i=e.previousValue;this.rows=Array.isArray(u)&&u!==i?u.map(function(n){return t.sentenceToRow(n)}):[]},n.prototype.onCancel=function(n,t){var l=n.data;n.isNew&&(this.rows=this.rows.filter(function(n,l){return l!==t})),Object.keys(l).forEach(function(n){l[n].current=l[n].origin}),this.editableEntries=this.editableEntries.filter(function(n){return t!==n}),this.focus()},n.prototype.onRemove=function(n,t){return Object(p.__awaiter)(this,void 0,void 0,function(){return Object(p.__generator)(this,function(t){return confirm("Would you like to remove this entry?")&&this.remove.emit(this.rowToSentence(n)),[2]})})},n.prototype.onSave=function(n,t){var l=this.rowToSentence(n);if(n.isNew){if(!n.key)return n.type="danger",n.icon="times circle",n.message="The key can not be empty",void this.focus(t);if(this.rows.findIndex(function(l,e){return l.key===n.key&&e!==t})>=0)return n.type="danger",n.icon="times circle",n.message="Dupplicated key, please choose an other one.",void this.focus(t);this.create.emit(l),delete n.isNew}else{for(var e=!1,u=0,i=this.lngs;u<i.length;u++){var o=n.data[i[u].key];if(o.origin!==o.current){e=!0;break}}e&&this.update.emit(l)}this.editableEntries=this.editableEntries.filter(function(n){return n!==t})},n.prototype.onEdit=function(n,t){this.working||this.editableEntries.includes(t)||(this.editableEntries.push(t),this.focus(t))},n.prototype.onLngCancel=function(n,t){this.rows=this.rows.map(function(n){var l=n.data;return Object.keys(l).forEach(function(n,e){e===t&&(l[n].current=l[n].origin)}),n}),this.editableLngs=this.editableLngs.filter(function(n){return t!==n}),this.focus()},n.prototype.onLngRemove=function(n){return Object(p.__awaiter)(this,void 0,void 0,function(){return Object(p.__generator)(this,function(t){return confirm("Would you like to remove this language?")&&this.removeLanguage.emit(n),[2]})})},n.prototype.onLngSave=function(n,t){var l=!1,e={lng:n,entries:[]};e.entries=this.rows.map(function(t){var e=t.data[n.key],u=e.current,i={key:t.key};return u!==e.origin&&(l=!0),i[n.key]=u,i}),this.editableLngs=this.editableLngs.filter(function(n){return n!==t}),l&&this.updateLanguage.emit(e)},n.prototype.onLngEdit=function(n,t){this.working||this.editableLngs.includes(t)||(this.editableLngs.push(t),this.focus(t,!0))},n.prototype.onAddLanguage=function(n){n&&this.addLanguage.emit(n),this.isAddLanguage=!1},n.prototype.onAddSentence=function(){for(var n="NEW_ENTRY",t=0;this.rows.find(function(t){return t.key===n});)n="NEW_ENTRY_"+t++;var l=this.sentenceToRow({key:n});l.isNew=!0,this.rows=this.rows.concat([l]),this.focus(this.rows.length-1)},n.prototype.onKeyUp=function(n,t,l,e){switch(n.key){case"Escape":this.editableEntries.includes(l)||t.isNew?this.onCancel(t,l):this.editableLngs.includes(e)&&this.onLngCancel(this.lngs[e],e);break;case"Enter":n.ctrlKey&&this.onAddSentence(),this.editableEntries.includes(l)||t.isNew?this.onSave(t,l):this.editableLngs.includes(e)&&this.onLngSave(this.lngs[e],e)}},n.prototype.isCellEditable=function(n,t,l){var e=this.lngs.findIndex(function(n){return n.key===t.key});return this.editableEntries.includes(l)||this.editableLngs.includes(e)||n.isNew},n.prototype.availableLanguages=function(){var n=this;return g.filter(function(t){return n.lngs.findIndex(function(n){return n.key===t.key})<0})},n.prototype.formatter=function(n){return n.label+" ( "+n.name+" )"},n.prototype.focus=function(n,t){var l=this;void 0===t&&(t=!1),setTimeout(function(){var e;l.table&&(e=l.table.nativeElement.querySelector(void 0===n?"input":!0===t?"tr td:nth-child("+(n+2)+") input":"tr:nth-child("+(n+1)+") input"))&&e.select()},0)},n.prototype.rowToSentence=function(n,t){void 0===t&&(t=!1);var l={key:n.key};return this.lngs.forEach(function(e){l[e.key]=n.data[e.key]?!0===t?n.data[e.key].origin:n.data[e.key].current:""}),l},n.prototype.sentenceToRow=function(n){var t={key:n.key,data:{}};return(Array.isArray(this.lngs)&&this.lngs.length>0?this.lngs.map(function(n){return n.key}):Object.keys(n)).forEach(function(l){"key"!==l&&(t.data[l]={origin:n[l]||"",current:n[l]||""})}),t},n}(),v=e.tb({encapsulation:0,styles:[["div.main[_ngcontent-%COMP%]{position:relative}div.main[_ngcontent-%COMP%]   .ui.progress.active[_ngcontent-%COMP%]{margin:0}div.main[_ngcontent-%COMP%]   .ui.progress.active[_ngcontent-%COMP%]   .bar[_ngcontent-%COMP%]{height:10px;width:100%;border-radius:0}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]{margin-top:0}div.main[_ngcontent-%COMP%]   table.ui.table.working[_ngcontent-%COMP%], div.main[_ngcontent-%COMP%]   table.ui.table.working[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{color:#cacaca}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   span.details[_ngcontent-%COMP%]{font-weight:400;font-style:italic;font-size:11px}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   div.actions[_ngcontent-%COMP%]{margin-top:10px}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:not(:last-child){min-width:200px}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child{min-width:100px}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{cursor:pointer}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   div.ui.input[_ngcontent-%COMP%]{width:100%}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   div.ui.input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{text-align:center}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]{color:#556fd6}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border-color:#556fd6}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .danger[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]{color:#fd7474}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .danger[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border-color:#fd7474}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .warning[_ngcontent-%COMP%]{background:initial!important}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .warning[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]{color:#fdc274}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .warning[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border-color:#fdc274}div.main[_ngcontent-%COMP%]   table.ui.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%]{font-style:italic}div.main[_ngcontent-%COMP%]   .add-language[_ngcontent-%COMP%]   sui-select[_ngcontent-%COMP%]{width:200px}div.main[_ngcontent-%COMP%]   .add-language[_ngcontent-%COMP%]   sui-select[_ngcontent-%COMP%]     div.text{font-size:16px;margin-top:16px;margin-left:10px}div.main[_ngcontent-%COMP%]   .add-language[_ngcontent-%COMP%]   .ui.circular.button[_ngcontent-%COMP%]{margin-left:5px;border-radius:10em}"]],data:{}});function m(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,1,"div",[["class","ui indicating progress active"],["data-percent","100"]],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,0,"div",[["class","bar"]],null,null,null,null,null))],null,null)}function h(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,1,"span",[["class","details"]],null,null,null,null,null)),(n()(),e.Pb(1,null,[" (",") "]))],null,function(n,t){n(t,1,0,t.parent.context.$implicit.name)})}function O(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"div",[["class","actions"]],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onLngCancel(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(2,0,null,null,0,"i",[["class","undo icon"]],null,null,null,null,null)),(n()(),e.vb(3,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onLngSave(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(4,0,null,null,0,"i",[["class","check icon"]],null,null,null,null,null))],null,function(n,t){var l=t.component;n(t,1,0,l.working),n(t,3,0,l.working)})}function y(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"div",[["class","actions"]],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onLngEdit(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(2,0,null,null,0,"i",[["class","edit icon"]],null,null,null,null,null)),(n()(),e.vb(3,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onLngRemove(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(4,0,null,null,0,"i",[["class","trash icon"]],null,null,null,null,null))],null,function(n,t){var l=t.component;n(t,1,0,l.working),n(t,3,0,l.working)})}function k(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,7,"th",[],null,[[null,"dblclick"]],function(n,t,l){var e=!0;return"dblclick"===t&&(e=!1!==n.component.onLngEdit(n.context.$implicit,n.context.index,l)&&e),e},null,null)),(n()(),e.Pb(1,null,[" "," "])),(n()(),e.kb(16777216,null,null,1,null,h)),e.ub(3,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,O)),e.ub(5,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,y)),e.ub(7,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){var l=t.component;n(t,3,0,t.context.$implicit.name&&t.context.$implicit.name!==t.context.$implicit.label),n(t,5,0,l.editableLngs.includes(t.context.index)),n(t,7,0,!l.editableLngs.includes(t.context.index))},function(n,t){n(t,1,0,t.context.$implicit.label)})}function _(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,1,"td",[],null,null,null,null,null)),(n()(),e.Pb(1,null,["",""]))],null,function(n,t){n(t,1,0,t.parent.context.$implicit.key)})}function C(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,0,"i",[],[[8,"className",0]],null,null,null,null))],null,function(n,t){n(t,0,0,t.parent.parent.parent.context.$implicit.icon+" icon")})}function P(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,3,"span",[["class","message"]],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,C)),e.ub(2,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.Pb(3,null,[" "," "]))],function(n,t){n(t,2,0,t.parent.parent.context.$implicit.icon)},function(n,t){n(t,3,0,t.parent.parent.context.$implicit.message)})}function M(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,10,"td",[],[[8,"className",0]],null,null,null,null)),(n()(),e.vb(1,0,null,null,6,"div",[["class","ui input"]],null,null,null,null,null)),(n()(),e.vb(2,0,null,null,5,"input",[["oninput","this.value = this.value.toUpperCase()"],["placeholder","Put your key here"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"keyup"],[null,"ngModelChange"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(n,t,l){var u=!0,i=n.component;return"input"===t&&(u=!1!==e.Hb(n,3)._handleInput(l.target.value)&&u),"blur"===t&&(u=!1!==e.Hb(n,3).onTouched()&&u),"compositionstart"===t&&(u=!1!==e.Hb(n,3)._compositionStart()&&u),"compositionend"===t&&(u=!1!==e.Hb(n,3)._compositionEnd(l.target.value)&&u),"keyup"===t&&(u=!1!==i.onKeyUp(l,n.parent.context.$implicit,n.parent.context.index)&&u),"ngModelChange"===t&&(u=!1!==(n.parent.context.$implicit.key=l)&&u),u},null,null)),e.ub(3,16384,null,0,c.e,[e.G,e.k,[2,c.a]],null,null),e.Mb(1024,null,c.j,function(n){return[n]},[c.e]),e.ub(5,671744,null,0,c.o,[[8,null],[8,null],[8,null],[6,c.j]],{model:[0,"model"]},{update:"ngModelChange"}),e.Mb(2048,null,c.k,null,[c.o]),e.ub(7,16384,null,0,c.l,[[4,c.k]],null,null),(n()(),e.vb(8,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,P)),e.ub(10,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){n(t,5,0,t.parent.context.$implicit.key),n(t,10,0,t.parent.context.$implicit.message)},function(n,t){n(t,0,0,t.parent.context.$implicit.type),n(t,2,0,e.Hb(t,7).ngClassUntouched,e.Hb(t,7).ngClassTouched,e.Hb(t,7).ngClassPristine,e.Hb(t,7).ngClassDirty,e.Hb(t,7).ngClassValid,e.Hb(t,7).ngClassInvalid,e.Hb(t,7).ngClassPending)})}function x(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,0,"i",[],[[8,"className",0]],null,null,null,null))],null,function(n,t){n(t,0,0,t.parent.parent.parent.parent.context.$implicit.data[t.parent.parent.parent.context.$implicit.key].icon+" icon")})}function E(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,3,"span",[["class","message"]],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,x)),e.ub(2,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.Pb(3,null,[" "," "]))],function(n,t){n(t,2,0,t.parent.parent.parent.context.$implicit.data[t.parent.parent.context.$implicit.key].icon)},function(n,t){n(t,3,0,t.parent.parent.parent.context.$implicit.data[t.parent.parent.context.$implicit.key].message)})}function R(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,10,"div",[],[[8,"className",0]],null,null,null,null)),(n()(),e.vb(1,0,null,null,6,"div",[["class","ui input"]],null,null,null,null,null)),(n()(),e.vb(2,0,null,null,5,"input",[["placeholder","Put your value here"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"keyup"],[null,"ngModelChange"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(n,t,l){var u=!0,i=n.component;return"input"===t&&(u=!1!==e.Hb(n,3)._handleInput(l.target.value)&&u),"blur"===t&&(u=!1!==e.Hb(n,3).onTouched()&&u),"compositionstart"===t&&(u=!1!==e.Hb(n,3)._compositionStart()&&u),"compositionend"===t&&(u=!1!==e.Hb(n,3)._compositionEnd(l.target.value)&&u),"keyup"===t&&(u=!1!==i.onKeyUp(l,n.parent.parent.context.$implicit,n.parent.parent.context.index,n.parent.context.index)&&u),"ngModelChange"===t&&(u=!1!==(n.parent.parent.context.$implicit.data[n.parent.context.$implicit.key].current=l)&&u),u},null,null)),e.ub(3,16384,null,0,c.e,[e.G,e.k,[2,c.a]],null,null),e.Mb(1024,null,c.j,function(n){return[n]},[c.e]),e.ub(5,671744,null,0,c.o,[[8,null],[8,null],[8,null],[6,c.j]],{model:[0,"model"]},{update:"ngModelChange"}),e.Mb(2048,null,c.k,null,[c.o]),e.ub(7,16384,null,0,c.l,[[4,c.k]],null,null),(n()(),e.vb(8,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,E)),e.ub(10,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){n(t,5,0,t.parent.parent.context.$implicit.data[t.parent.context.$implicit.key].current),n(t,10,0,t.parent.parent.context.$implicit.data[t.parent.context.$implicit.key].message)},function(n,t){n(t,0,0,t.parent.parent.context.$implicit.data[t.parent.context.$implicit.key].type),n(t,2,0,e.Hb(t,7).ngClassUntouched,e.Hb(t,7).ngClassTouched,e.Hb(t,7).ngClassPristine,e.Hb(t,7).ngClassDirty,e.Hb(t,7).ngClassValid,e.Hb(t,7).ngClassInvalid,e.Hb(t,7).ngClassPending)})}function w(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,1,"span",[],null,null,null,null,null)),(n()(),e.Pb(1,null,["",""]))],null,function(n,t){n(t,1,0,null==t.parent.parent.context.$implicit.data[t.parent.context.$implicit.key]?null:t.parent.parent.context.$implicit.data[t.parent.context.$implicit.key].current)})}function I(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"td",[],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,R)),e.ub(2,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,w)),e.ub(4,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){var l=t.component;n(t,2,0,l.isCellEditable(t.parent.context.$implicit,t.context.$implicit,t.parent.context.index)),n(t,4,0,!l.isCellEditable(t.parent.context.$implicit,t.context.$implicit,t.parent.context.index))},null)}function j(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"td",[],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onCancel(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(2,0,null,null,0,"i",[["class","undo icon"]],null,null,null,null,null)),(n()(),e.vb(3,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onSave(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(4,0,null,null,0,"i",[["class","check icon"]],null,null,null,null,null))],null,function(n,t){var l=t.component;n(t,1,0,l.working),n(t,3,0,l.working)})}function L(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"td",[],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onEdit(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(2,0,null,null,0,"i",[["class","edit icon"]],null,null,null,null,null)),(n()(),e.vb(3,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onRemove(n.parent.context.$implicit,n.parent.context.index)&&e),e},null,null)),(n()(),e.vb(4,0,null,null,0,"i",[["class","trash icon"]],null,null,null,null,null))],null,function(n,t){var l=t.component;n(t,1,0,l.working),n(t,3,0,l.working)})}function $(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,10,"tr",[],null,[[null,"dblclick"]],function(n,t,l){var e=!0;return"dblclick"===t&&(e=!1!==n.component.onEdit(n.context.$implicit,n.context.index,l)&&e),e},null,null)),(n()(),e.kb(16777216,null,null,1,null,_)),e.ub(2,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,M)),e.ub(4,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,I)),e.ub(6,278528,null,0,o.j,[e.R,e.O,e.t],{ngForOf:[0,"ngForOf"]},null),(n()(),e.kb(16777216,null,null,1,null,j)),e.ub(8,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,L)),e.ub(10,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){var l=t.component;n(t,2,0,!t.context.$implicit.isNew),n(t,4,0,t.context.$implicit.isNew),n(t,6,0,l.lngs),n(t,8,0,l.editableEntries.includes(t.context.index)||t.context.$implicit.isNew),n(t,10,0,!l.editableEntries.includes(t.context.index)&&!t.context.$implicit.isNew)},null)}function N(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,11,"table",[],[[8,"className",0]],null,null,null,null)),(n()(),e.vb(1,0,null,null,7,"thead",[],null,null,null,null,null)),(n()(),e.vb(2,0,null,null,6,"tr",[],null,null,null,null,null)),(n()(),e.vb(3,0,null,null,1,"th",[],null,null,null,null,null)),(n()(),e.Pb(-1,null,["Key"])),(n()(),e.kb(16777216,null,null,1,null,k)),e.ub(6,278528,null,0,o.j,[e.R,e.O,e.t],{ngForOf:[0,"ngForOf"]},null),(n()(),e.vb(7,0,null,null,1,"th",[["class","tools"]],null,null,null,null,null)),(n()(),e.Pb(-1,null,["Tools"])),(n()(),e.vb(9,0,[[1,0],["table",1]],null,2,"tbody",[],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,$)),e.ub(11,278528,null,0,o.j,[e.R,e.O,e.t],{ngForOf:[0,"ngForOf"]},null)],function(n,t){var l=t.component;n(t,6,0,l.lngs),n(t,11,0,l.rows)},function(n,t){n(t,0,0,"ui striped table "+(t.component.working?"working":""))})}function T(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,5,"div",[["class","ui right floated buttons"]],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,1,"button",[["class","ui yellow button"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=0!=(n.component.isAddLanguage=!0)&&e),e},null,null)),(n()(),e.Pb(-1,null,["Add language"])),(n()(),e.vb(3,0,null,null,0,"div",[["class","or"]],null,null,null,null,null)),(n()(),e.vb(4,0,null,null,1,"button",[["class","ui grey button"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.onAddSentence()&&e),e},null,null)),(n()(),e.Pb(-1,null,["Add sentence"]))],null,function(n,t){var l=t.component;n(t,1,0,l.working),n(t,4,0,l.working)})}function S(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,2,"sui-select-option",[],[[2,"item",null],[2,"active",null]],[[null,"click"]],function(n,t,l){var u=!0;return"click"===t&&(u=!1!==e.Hb(n,1).onClick(l)&&u),u},a.b,a.a)),e.ub(1,49152,[[2,4]],1,r.a,[e.G,e.k,e.h],{value:[0,"value"]},null),e.Nb(335544320,4,{childDropdownMenu:0})],function(n,t){n(t,1,0,t.context.$implicit)},function(n,t){n(t,0,0,e.Hb(t,1)._optionClasses,e.Hb(t,1).isActive)})}function F(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,12,"div",[["class","ui right floated buttons add-language"]],null,null,null,null,null)),(n()(),e.vb(1,0,null,null,7,"sui-select",[["class","selection"]],[[2,"ui",null],[2,"dropdown",null],[2,"active",null],[2,"visible",null],[2,"search",null],[2,"loading",null],[1,"tabindex",0],[2,"disabled",null]],[[null,"click"],[null,"focusin"],[null,"focusout"],[null,"keypress"],[null,"selectedOptionChange"],[null,"touched"]],function(n,t,l){var u=!0;return"click"===t&&(u=!1!==e.Hb(n,3).onClick(l)&&u),"focusin"===t&&(u=!1!==e.Hb(n,3).onFocusIn()&&u),"focusout"===t&&(u=!1!==e.Hb(n,3).onFocusOut(l)&&u),"keypress"===t&&(u=!1!==e.Hb(n,3).onKeyPress(l)&&u),"selectedOptionChange"===t&&(u=!1!==e.Hb(n,6).onChange(l)&&u),"touched"===t&&(u=!1!==e.Hb(n,6).onTouched()&&u),u},s.b,s.a)),e.Mb(5120,null,c.j,function(n){return[n]},[b.b]),e.ub(3,1228800,[["select",4]],2,b.a,[e.k,e.G,d.a],{optionFormatter:[0,"optionFormatter"]},{onTouched:"touched",selectedOptionChange:"selectedOptionChange"}),e.Nb(603979776,2,{_renderedOptions:1}),e.Nb(335544320,3,{_manualSearch:0}),e.ub(6,16384,null,0,b.b,[b.a],null,null),(n()(),e.kb(16777216,null,0,1,null,S)),e.ub(8,278528,null,0,o.j,[e.R,e.O,e.t],{ngForOf:[0,"ngForOf"]},null),(n()(),e.vb(9,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=0!=(n.component.isAddLanguage=!1)&&e),e},null,null)),(n()(),e.vb(10,0,null,null,0,"i",[["class","undo icon"]],null,null,null,null,null)),(n()(),e.vb(11,0,null,null,1,"button",[["class","circular mini ui icon button"],["tabindex","-1"]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var u=!0;return"click"===t&&(u=!1!==n.component.onAddLanguage(e.Hb(n,3).selectedOption)&&u),u},null,null)),(n()(),e.vb(12,0,null,null,0,"i",[["class","check icon"]],null,null,null,null,null))],function(n,t){var l=t.component;n(t,3,0,l.formatter),n(t,8,0,l.availableLanguages())},function(n,t){var l=t.component;n(t,1,0,e.Hb(t,3)._selectClasses,e.Hb(t,3)._selectClasses,e.Hb(t,3).isActive,e.Hb(t,3).isVisible,e.Hb(t,3)._searchClass,e.Hb(t,3).isSearching,e.Hb(t,3).tabIndex,e.Hb(t,3).isDisabled),n(t,9,0,l.working),n(t,11,0,l.working)})}function A(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,4,"div",[["style","margin-bottom: 60px;float: left;"]],null,null,null,null,null)),(n()(),e.kb(16777216,null,null,1,null,T)),e.ub(2,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,F)),e.ub(4,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){var l=t.component;n(t,2,0,!l.isAddLanguage),n(t,4,0,l.isAddLanguage)},null)}function H(n){return e.Rb(0,[e.Nb(671088640,1,{table:0}),(n()(),e.vb(1,0,null,null,9,"div",[["class","main"]],null,null,null,null,null)),e.Mb(512,null,o.z,o.A,[e.k,e.u,e.G]),e.ub(3,278528,null,0,o.n,[o.z],{ngStyle:[0,"ngStyle"]},null),e.Kb(4,{overflow:0}),(n()(),e.kb(16777216,null,null,1,null,m)),e.ub(6,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,N)),e.ub(8,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null),(n()(),e.kb(16777216,null,null,1,null,A)),e.ub(10,16384,null,0,o.k,[e.R,e.O],{ngIf:[0,"ngIf"]},null)],function(n,t){var l=t.component,e=n(t,4,0,l.working?"hidden":"initial");n(t,3,0,e),n(t,6,0,l.working),n(t,8,0,l.rows&&l.rows.length>0),n(t,10,0,!l.working)},null)}var U=l("yGQT"),V=l("K9Ia"),D=Object(U.w)("i18n"),G=function(n){return n.RETRIEVE_LIST="[I18N] Retrieve i18n",n.RETRIEVE_LIST_SUCCESS="[I18N] I18N retrieved successfully",n.RETRIEVE_LIST_ERROR="[I18N] Error while retrieving I18N",n.REMOVE_LANGUAGES="[I18N] Remove one or more languages",n.REMOVE_ENTRIES="[I18N] Remove one or more entries",n.UPDATE_ENTRY="[I18N] Update an entry",n.UPDATE_ENTRIES="[I18N] Update multiple entries",n.ADD_LANGUAGE="[I18N] Add a new language",n}({}),z=function(){return function(){this.type=G.RETRIEVE_LIST}}(),Y=function(){return function(n){this.payload=n,this.type=G.RETRIEVE_LIST_SUCCESS}}(),K=function(){return function(n){this.payload=n,this.type=G.RETRIEVE_LIST_ERROR}}(),W=function(){return function(n){this.payload=n,this.type=G.REMOVE_LANGUAGES}}(),J=function(){return function(n){this.payload=n,this.type=G.REMOVE_ENTRIES}}(),q=function(){return function(n){this.payload=n,this.type=G.UPDATE_ENTRY}}(),Z=function(){return function(n){this.payload=n,this.type=G.UPDATE_ENTRIES}}(),X=function(){return function(n){this.payload=n,this.type=G.ADD_LANGUAGE}}(),B=l("40Tf"),Q=l("ny24"),nn=function(){function n(n){this.store=n,this.languages=[],this.sentences=[],this.unsubscribe$=new V.a}return n.prototype.ngOnDestroy=function(){this.unsubscribe$.next(),this.unsubscribe$.complete()},n.prototype.ngOnInit=function(){var n=this;this.store.pipe(Object(Q.a)(this.unsubscribe$),Object(U.z)(D)).subscribe(function(t){n.sentences=t.entries,n.languages=t.lngs,n.comp&&(n.comp.working=t.loading)}),this.store.pipe(Object(Q.a)(this.unsubscribe$),Object(U.z)(B.a)).subscribe(function(){n.store.dispatch(new z)})},n.prototype.onRemove=function(n){this.store.dispatch(new J([n.key]))},n.prototype.onRemoveLanguage=function(n){this.store.dispatch(new W([n.key]))},n.prototype.onUpdateLanguage=function(n){var t=n.entries.map(function(t){var l={key:t.key};return l[n.lng.key]=t[n.lng.key],l});this.store.dispatch(new Z(t))},n.prototype.onAddLanguage=function(n){this.store.dispatch(new X(n))},n.prototype.onUpdate=function(n){this.store.dispatch(new q(n))},n.prototype.onCreate=function(n){this.store.dispatch(new q(n))},n}(),tn=e.tb({encapsulation:0,styles:[[""]],data:{}});function ln(n){return e.Rb(0,[e.Nb(671088640,1,{comp:0}),(n()(),e.vb(1,0,null,null,1,"app-i18n",[],null,[[null,"remove"],[null,"update"],[null,"create"],[null,"removeLanguage"],[null,"updateLanguage"],[null,"addLanguage"]],function(n,t,l){var e=!0,u=n.component;return"remove"===t&&(e=!1!==u.onRemove(l)&&e),"update"===t&&(e=!1!==u.onUpdate(l)&&e),"create"===t&&(e=!1!==u.onCreate(l)&&e),"removeLanguage"===t&&(e=!1!==u.onRemoveLanguage(l)&&e),"updateLanguage"===t&&(e=!1!==u.onUpdateLanguage(l)&&e),"addLanguage"===t&&(e=!1!==u.onAddLanguage(l)&&e),e},H,v)),e.ub(2,573440,[[1,4],["compo",4]],0,f,[],{lngs:[0,"lngs"],entries:[1,"entries"]},{create:"create",remove:"remove",update:"update",addLanguage:"addLanguage",removeLanguage:"removeLanguage",updateLanguage:"updateLanguage"})],function(n,t){var l=t.component;n(t,2,0,l.languages,l.sentences)},null)}function en(n){return e.Rb(0,[(n()(),e.vb(0,0,null,null,1,"app-i18n-container",[],null,null,null,ln,tn)),e.ub(1,245760,null,0,nn,[U.o],null,null)],function(n,t){n(t,1,0)},null)}var un=e.rb("app-i18n-container",nn,en,{},{},[]),on=l("i154"),cn=l("ZYCi"),an={title:"app.i18n.main.title"},rn=function(){return function(){}}(),sn=l("A4fR"),bn=l("8Vi/"),dn=l("WsAi"),pn=l("tyS4"),gn=l("C6o2"),fn={loading:!1,entries:[],lngs:[],error:null};function vn(n,t){switch(void 0===n&&(n=fn),t.type){case G.RETRIEVE_LIST:return Object(p.__assign)({},n,{loading:!0,error:null});case G.RETRIEVE_LIST_SUCCESS:return Object(p.__assign)({},n,{loading:!1,error:null,entries:t.payload.entries,lngs:t.payload.lngs});case G.RETRIEVE_LIST_ERROR:return Object(p.__assign)({},n,{loading:!1,error:t.payload});default:return n}}var mn="/api/v1/devtools/i18n",hn=function(){function n(n){this.http=n}return n.prototype.retrieve=function(n){return void 0===n&&(n="modules:devtools"),this.http.get(mn,{params:{ns:n}})},n.prototype.set=function(n,t){return void 0===t&&(t="modules:devtools"),this.http.post(mn,n,{params:{ns:t}})},n.prototype.remove=function(n,t){return void 0===t&&(t="modules:devtools"),this.http.post(mn+"/delete",n,{params:{ns:t}})},n.prototype.translate=function(n,t){return void 0===t&&(t="modules:devtools"),this.http.post(mn+"/translate",{code:n},{params:{ns:t}})},n.prototype.removeLanguages=function(n,t){return void 0===t&&(t="modules:devtools"),this.http.post(mn+"/lngs/delete",n,{params:{ns:t}})},n}(),On=l("t/Na"),yn=l("F/XL"),kn=l("jYNz"),_n=l("/PH2"),Cn=l("VnD/"),Pn=l("15JJ"),Mn=l("67Y/"),xn=l("9Z1F"),En=function(){function n(n,t,l){var e=this;this.actions$=n,this.store=t,this.service=l,this.retrieve=this.actions$.pipe(Object(kn.d)(G.RETRIEVE_LIST),Object(_n.a)(this.store.pipe(Object(U.z)(B.a))),Object(Cn.a)(function(n){var t=n[1];return t&&!!t.key}),Object(Pn.a)(function(n){return e.service.retrieve(n[1].key).pipe(Object(Mn.a)(function(n){return new Y(n)}),Object(xn.a)(function(n){return Object(yn.a)(new K(n))}))})),this.removeLanguages=this.actions$.pipe(Object(kn.d)(G.REMOVE_LANGUAGES),Object(_n.a)(this.store.pipe(Object(U.z)(B.a))),Object(Cn.a)(function(n){var t=n[1];return t&&!!t.key}),Object(Pn.a)(function(n){return e.service.removeLanguages(n[0].payload,n[1].key).pipe(Object(Mn.a)(function(){return new z}),Object(xn.a)(function(n){return Object(yn.a)(new K(n))}))})),this.removeEntries=this.actions$.pipe(Object(kn.d)(G.REMOVE_ENTRIES),Object(_n.a)(this.store.pipe(Object(U.z)(B.a))),Object(Cn.a)(function(n){var t=n[1];return t&&!!t.key}),Object(Pn.a)(function(n){return e.service.remove(n[0].payload,n[1].key).pipe(Object(Mn.a)(function(){return new z}),Object(xn.a)(function(n){return Object(yn.a)(new K(n))}))})),this.updateEntry=this.actions$.pipe(Object(kn.d)(G.UPDATE_ENTRY,G.UPDATE_ENTRIES),Object(_n.a)(this.store.pipe(Object(U.z)(B.a))),Object(Cn.a)(function(n){var t=n[1];return t&&!!t.key}),Object(Pn.a)(function(n){return e.service.set(n[0].payload,n[1].key).pipe(Object(Mn.a)(function(){return new z}),Object(xn.a)(function(n){return Object(yn.a)(new K(n))}))})),this.addLanguage=this.actions$.pipe(Object(kn.d)(G.ADD_LANGUAGE),Object(_n.a)(this.store.pipe(Object(U.z)(B.a))),Object(Cn.a)(function(n){var t=n[1];return t&&!!t.key}),Object(Pn.a)(function(n){return e.service.translate(n[0].payload.key,n[1].key).pipe(Object(Mn.a)(function(){return new z}),Object(xn.a)(function(n){return Object(yn.a)(new K(n))}))}))}return Object(p.__decorate)([Object(kn.b)(),Object(p.__metadata)("design:type",Object)],n.prototype,"retrieve",void 0),Object(p.__decorate)([Object(kn.b)(),Object(p.__metadata)("design:type",Object)],n.prototype,"removeLanguages",void 0),Object(p.__decorate)([Object(kn.b)(),Object(p.__metadata)("design:type",Object)],n.prototype,"removeEntries",void 0),Object(p.__decorate)([Object(kn.b)(),Object(p.__metadata)("design:type",Object)],n.prototype,"updateEntry",void 0),Object(p.__decorate)([Object(kn.b)(),Object(p.__metadata)("design:type",Object)],n.prototype,"addLanguage",void 0),n}();l.d(t,"I18nEditorModuleNgFactory",function(){return Rn});var Rn=e.sb(u,[],function(n){return e.Eb([e.Fb(512,e.j,e.db,[[8,[i.a,un]],[3,e.j],e.y]),e.Fb(4608,o.m,o.l,[e.v,[2,o.C]]),e.Fb(4608,c.t,c.t,[]),e.Fb(4608,on.a,on.a,[e.g,e.j,e.r]),e.Fb(4608,d.a,d.a,[]),e.Fb(1073742336,o.c,o.c,[]),e.Fb(1073742336,cn.t,cn.t,[[2,cn.z],[2,cn.p]]),e.Fb(1073742336,rn,rn,[]),e.Fb(1073742336,c.s,c.s,[]),e.Fb(1073742336,c.h,c.h,[]),e.Fb(1073742336,sn.a,sn.a,[]),e.Fb(1073742336,bn.a,bn.a,[]),e.Fb(1073742336,dn.a,dn.a,[]),e.Fb(1073742336,pn.a,pn.a,[]),e.Fb(1073742336,gn.a,gn.a,[]),e.Fb(1024,U.G,function(){return[{}]},[]),e.Fb(1024,U.k,function(){return[{key:"i18n",reducerFactory:U.u,metaReducers:[],initialState:void 0}]},[]),e.Fb(1024,U.H,U.N,[e.r,U.G,U.k]),e.Fb(1024,U.F,function(){return[vn]},[]),e.Fb(1024,U.I,function(n){return[n]},[U.F]),e.Fb(1024,U.b,function(n,t,l){return[U.O(n,t,l)]},[e.r,U.F,U.I]),e.Fb(1073873408,U.p,U.p,[U.H,U.b,U.h,U.q]),e.Fb(512,hn,hn,[On.c]),e.Fb(512,En,En,[kn.a,U.o,hn]),e.Fb(1024,kn.i,function(n){return[kn.e(n)]},[En]),e.Fb(1073742336,kn.g,kn.g,[kn.f,kn.i,[2,U.q],[2,U.p]]),e.Fb(1073742336,u,u,[]),e.Fb(1024,cn.n,function(){return[[{path:"",component:nn,data:an}]]},[])])})}}]);