/* Экран: Предложение тарифа — день 14 (P01-Tariff) */
DC.page(function (DCLogic) {
var P=[{k:'free',name:'Радар Free',m:'0 ₽',y:'0 ₽',pm:'',py:'',desc:'Индекс раз в неделю, 1 сигнал без суммы'},{k:'biz',name:'Бизнес',m:'790 ₽',y:'7 900 ₽',pm:'в месяц',py:'в год · 658 ₽/мес',desc:'Сигналы в ₽, «Что если», пороги, календарь, чат 30 вопросов, господдержка'},{k:'plus',name:'Бизнес+',m:'1 990 ₽',y:'19 900 ₽',pm:'в месяц',py:'в год · 1 658 ₽/мес',desc:'Всё из «Бизнес» + выписка, 1С, МойСклад, до 5 точек, чат без лимита'}];
class Component extends DCLogic {
 constructor(p){ super(p); this.state={y:false, sel:'biz'}; }
 renderVals(){ var s=this.state, self=this, cur=P.filter(function(p){ return p.k===s.sel; })[0];
  return { mCls:'pill'+(s.y?'':' on'), yCls:'pill'+(s.y?' on':''), setM:function(){ self.setState({y:false}); }, setY:function(){ self.setState({y:true}); },
   plans: P.map(function(p){ return {name:p.name, price:s.y?p.y:p.m, per:s.y?p.py:p.pm, desc:p.desc, cls:'plan'+(s.sel===p.k?' sel':''), pressed:s.sel===p.k?'true':'false', pick:function(){ self.setState({sel:p.k}); }}; }),
   cta: s.sel==='free' ? 'Продолжить на Free' : ('Перейти на «'+cur.name+'» · '+(s.y?cur.y:cur.m)) };
 }
}
return Component;
}, {});
