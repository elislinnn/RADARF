/* Экран: Что если — телефон (M-C04) */
DC.page(function (DCLogic) {
function f(v){ return new Intl.NumberFormat('ru-RU').format(Math.abs(Math.round(v))); }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={yuan:10, rate:14, rent:0, sc:-1}; }
 renderVals(){ var s=this.state, self=this, P0=129000;
  var p=P0-585000*0.42*s.yuan/100-2500000*(s.rate-14)/100/12-180000*s.rent/100, be=230*(1500000-p)/1500000, d=Math.round((p-P0)/100)*100;
  var SC=[{t:'Базовый',v:{yuan:5,rate:12,rent:6}},{t:'Жёсткий',v:{yuan:12,rate:16,rent:8}},{t:'Мягкий',v:{yuan:0,rate:10,rent:4}}];
  return { profit:f(Math.round(p/100)*100), delta:(d>0?'+':(d<0?'−':''))+f(d), be:f(be), yuan:s.yuan, rate:s.rate, rent:s.rent,
   yl:(s.yuan>0?'+':'')+s.yuan+'%', rl:String(s.rate).replace('.',',')+'%', al:'+'+s.rent+'%',
   onY:function(e){ self.setState({yuan:+e.target.value, sc:-1}); }, onR:function(e){ self.setState({rate:+e.target.value, sc:-1}); }, onA:function(e){ self.setState({rent:+e.target.value, sc:-1}); },
   scen: SC.map(function(c,i){ return {t:c.t, cls:'pill'+(s.sc===i?' on':''), pick:function(){ self.setState(Object.assign({sc:i},c.v)); }}; }) };
 }
}
return Component;
}, {});
