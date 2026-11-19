/* Экран: Кабинет — господдержка (C07-Support) */
DC.page(function (DCLogic) {
var P=[
 {name:'Льготный кредит для МСП на оборотные средства',desc:'Ставка ниже рыночной для общепита; рефинансирование действующего кредита',m:5,of:5,amt:'до 2,5 млн ₽',ben:'≈ 14 600 ₽/мес экономии',eff:14600,dl:'31 декабря',left:'42 дня',dlc:'small muted',tags:[{t:'ОКВЭД 56.10',c:'chip chip-gain'},{t:'выручка до 120 млн',c:'chip chip-gain'},{t:'регион',c:'chip chip-gain'}],why:'Ваш кредит плавающий — перевод на льготную ставку снимает риск по ЦБ.',docs:[['Выписка ЕГРЮЛ/ЕГРИП','автоматически',1],['Бухотчётность за 2025','из профиля',1],['Справка об отсутствии долгов ФНС','госуслуги',0],['Кредитный договор','загрузить',1],['Бизнес-план на 1 стр.','шаблон радара',0]]},
 {name:'Региональная субсидия на оборудование',desc:'Компенсация части затрат на кофемашину и холодильное оборудование',m:4,of:5,amt:'до 300 000 ₽',ben:'разово, 50% стоимости',eff:0,dl:'5 декабря',left:'16 дней',dlc:'small loss',tags:[{t:'регион',c:'chip chip-gain'},{t:'общепит',c:'chip chip-gain'},{t:'нужен договор',c:'chip chip-warn'}],why:'Не хватает договора на покупку оборудования — можно добавить позже.',docs:[['Выписка ЕГРЮЛ/ЕГРИП','автоматически',1],['Договор поставки оборудования','загрузить',0],['Счёт на оплату','загрузить',0]]},
 {name:'Компенсация процентов по кредиту',desc:'Частичное возмещение процентов для малого бизнеса в сфере услуг',m:4,of:5,amt:'до 5% годовых',ben:'≈ 10 400 ₽/мес',eff:10400,dl:'1 марта',left:'102 дня',dlc:'small muted',tags:[{t:'кредит в банке-партнёре',c:'chip chip-warn'},{t:'ОКВЭД',c:'chip chip-gain'}],why:'Работает, если банк кредита входит в список партнёров программы.',docs:[['Кредитный договор','загрузить',1],['График платежей','загрузить',0],['Справка ФНС','госуслуги',0]]},
 {name:'Обучение и консультации для предпринимателей',desc:'Бесплатные курсы по финансам и ценообразованию от центра «Мой бизнес»',m:5,of:5,amt:'бесплатно',ben:'не влияет на прибыль напрямую',eff:0,dl:'круглый год',left:'без срока',dlc:'small muted',tags:[{t:'регион',c:'chip chip-gain'},{t:'МСП',c:'chip chip-gain'}],why:'Подходит всем субъектам МСП региона.',docs:[['Заявка на сайте центра','онлайн',0]]},
 {name:'Грант для молодых предпринимателей',desc:'Для собственников до 25 лет, первые 2 года бизнеса',m:2,of:5,amt:'до 500 000 ₽',ben:'не подходит по возрасту',eff:0,dl:'15 февраля',left:'не подходит',dlc:'small muted',tags:[{t:'возраст',c:'chip chip-loss'},{t:'срок бизнеса',c:'chip chip-loss'}],why:'Не подходит: бизнесу больше 2 лет.',docs:[]}];
function fm(v){ return new Intl.NumberFormat('ru-RU').format(v); }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={i:0, d:P.map(function(p){ return p.docs.map(function(d){ return !!d[2]; }); })}; }
 renderVals(){ var self=this, s=this.state, cur=P[s.i], C=2*Math.PI*26;
  var all=0, done=0; s.d.forEach(function(a){ all+=a.length; a.forEach(function(x){ if(x) done++; }); });
  var eff=cur.eff, Y=function(v){ return 110-(v-100000)/50000*90; };
  return {
   progs:P.map(function(p,i){ var f=p.m/p.of; return {name:p.name, desc:p.desc, m:p.m+'/'+p.of, aria:'Совпадение '+p.m+' из '+p.of, rc:f>=1?'#0E8A43':f>=0.8?'#1F5EFF':'#D92D33', dash:(C*f).toFixed(1)+' '+C.toFixed(1), tags:p.tags, amt:p.amt, ben:p.ben, dl:p.dl, left:p.left, dlCls:p.dlc, cls:'pr'+(i===s.i?' on':''), pick:function(){ self.setState({i:i}); }}; }),
   sel:{name:cur.name, m:cur.m+' из '+cur.of, why:cur.why},
   docs:cur.docs.map(function(d,k){ var on=s.d[s.i][k]; return {t:d[0], src:d[1], cls:'box'+(on?' on':''), tog:function(){ var nd=s.d.map(function(a){ return a.slice(); }); nd[s.i][k]=!on; self.setState({d:nd}); }}; }),
   docDone:done, docAll:all, docPct:(done/all*100).toFixed(0)+'%',
   e1y:Y(129000).toFixed(0), e1h:(110-Y(129000)).toFixed(0), e1t:(Y(129000)-6).toFixed(0),
   e2y:Y(129000+eff).toFixed(0), e2h:(110-Y(129000+eff)).toFixed(0), e2t:(Y(129000+eff)-6).toFixed(0),
   effV:fm(129000+eff), effD:eff?'+'+fm(eff)+' ₽':'±0 ₽'
  };
 }
}
return Component;
}, {});
