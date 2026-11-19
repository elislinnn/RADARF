/* Экран: Сигналы — телефон, свайп (M-C02) */
DC.page(function (DCLogic) {
var S=[{id:1,ev:'Аренда с 1 января',urg:'Срок 15.12',u:'chip chip-warn',eff:-11000,act:'Обсудить индексацию с арендодателем'},{id:2,ev:'ЦБ 18 декабря · кредит',urg:'Фон',u:'chip chip-grey',eff:2100,act:'Не фиксировать ставку до решения'},{id:3,ev:'Новый год в Китае',urg:'Фон',u:'chip chip-grey',eff:-3500,act:'Сделать запас зерна на февраль'}];
function fm(v){ return (v<0?'−':'+')+new Intl.NumberFormat('ru-RU').format(Math.abs(v))+' ₽/мес'; }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={gone:{}, drag:null, dx:0, toast:null, found:8700}; }
 componentWillUnmount(){ clearTimeout(this.t); }
 finish(id,kind){ var self=this, g=Object.assign({},this.state.gone); g[id]=kind; var s=S.filter(function(x){return x.id===id;})[0];
  this.setState({gone:g, drag:null, dx:0, toast:{id:id, kind:kind, msg:kind==='a'?'Применено':'Отложено на неделю'}, found:this.state.found+(kind==='a'?Math.abs(s.eff):0)});
  try{ if(navigator.vibrate) navigator.vibrate(10); }catch(e){}
  clearTimeout(this.t); this.t=setTimeout(function(){ self.setState({toast:null}); },5000); }
 renderVals(){ var st=this.state, self=this, W=358;
  var items=S.filter(function(s){ return !st.gone[s.id]; }).map(function(s){ var me=st.drag&&st.drag.id===s.id, dx=me?st.dx:0;
   return {ev:s.ev, urg:s.urg, urgCls:s.u, eff:fm(s.eff), effCls:'num '+(s.eff<0?'loss':'gain'), act:s.act, dx:dx, tr:me?'none':'transform .3s cubic-bezier(.22,1,.36,1)',
    under: dx>0?'#0E8A43':'#6B7A93',
    down:function(e){ try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(er){} self.setState({drag:{id:s.id, x:e.clientX}, dx:0}); },
    move:function(e){ if(!self.state.drag||self.state.drag.id!==s.id) return; self.setState({dx:e.clientX-self.state.drag.x}); },
    up:function(){ if(!self.state.drag||self.state.drag.id!==s.id) return; var d=self.state.dx; if(d>W*0.4) self.finish(s.id,'a'); else if(d<-W*0.4) self.finish(s.id,'s'); else self.setState({drag:null, dx:0}); },
    apply:function(){ self.finish(s.id,'a'); }}; });
  return { items:items, empty:items.length===0, found:new Intl.NumberFormat('ru-RU').format(st.found), toast:!!st.toast, toastText:st.toast?st.toast.msg:'',
   undo:function(){ var t=self.state.toast; if(!t) return; var g=Object.assign({},self.state.gone); delete g[t.id]; var s=S.filter(function(x){return x.id===t.id;})[0]; self.setState({gone:g, toast:null, found:self.state.found-(t.kind==='a'?Math.abs(s.eff):0)}); } };
 }
}
return Component;
}, {});
