/* Экран: Кабинет — уведомления и пороги (C11-Notify) */
DC.page(function (DCLogic) {
var T=[
 {name:'Минимальный эффект',sub:'сигнал, если влияние больше',o:['1 000 ₽','3 000 ₽','5 000 ₽','10 000 ₽'],f:[64,38,22,9],d:1},
 {name:'Юань',sub:'изменение за 30 дней',o:['±1%','±2,5%','±5%','±10%'],f:[14,4,2,0],d:1},
 {name:'Ключевая ставка',sub:'решение ЦБ',o:['любое','±0,5 п.п.','±1 п.п.','±2 п.п.'],f:[8,5,3,1],d:1},
 {name:'Цены поставщиков',sub:'рост за месяц',o:['+1%','+2,5%','+5%','+10%'],f:[12,6,2,0],d:1},
 {name:'Возможности',sub:'господдержка, снижение цен',o:['все','от 3 000 ₽','от 10 000 ₽','выкл'],f:[16,9,4,0],d:1}];
var SEAS=[0.7,0.8,1.3,0.9,0.8,0.7,0.9,1.0,1.1,1.4,1.2,1.2], MON=['дек','янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя'];
var ICONS=['M3 5h14v10H3zM3 5l7 6 7-6','M4 4h12v9H8l-4 3z','M10 3a5 5 0 015 5v3l2 3H3l2-3V8a5 5 0 015-5zM8 17h4','M3 4h14M3 10h14M3 16h9'];
class Component extends DCLogic {
 constructor(p){ super(p); this.state={sel:T.map(function(t){ return t.d; }), ch:[true,true,true,false], q:22, l:3}; }
 renderVals(){ var self=this, s=this.state;
  var freq=T.map(function(t,i){ return t.f[s.sel[i]]; });
  var risk=freq[0]*0.35+freq[1]+freq[2]+freq[3], opp=freq[4]+freq[0]*0.1, tot=Math.round(risk+opp);
  var mx=Math.max(14, (s.l*4.3)+2), Y=function(v){ return 196-v/mx*176; };
  var bars=SEAS.map(function(k,i){ var r=Math.round(risk/12*k), o=Math.round(opp/12*k), x=40+i*60; return {x:x, cx:x+20, m:MON[i], y1:Y(r).toFixed(1), h1:(196-Y(r)).toFixed(1), y2:Y(r+o).toFixed(1), h2:(Y(r)-Y(r+o)).toFixed(1), ty:(Y(r+o)-6).toFixed(1), v:r+o}; });
  var qTo=7, q=s.q;
  var hours=[]; for(var h=0;h<24;h++){ var inq=q>qTo?(h>=q||h<qTo):(h>=q&&h<qTo); hours.push({c:inq?'q':''}); }
  var CH=[['Telegram-бот','главный канал, кнопки «Применить»'],['Email','отчёт и дайджест'],['Push в браузере','срочные сигналы'],['SMS','только дедлайны · платно в Free']];
  var limM=Math.round(s.l*4.3);
  return {
   thr:T.map(function(t,i){ return {name:t.name, sub:t.sub, freq:freq[i], opts:t.o.map(function(o,k){ return {t:o, cls:'st'+(s.sel[i]===k?' on':''), pick:function(){ var n=s.sel.slice(); n[i]=k; self.setState({sel:n}); }}; })}; }),
   total:tot, bars:bars, lim:s.l, limM:limM, limY:Y(limM).toFixed(1), limTy:(Y(limM)-6).toFixed(1),
   ch:CH.map(function(c,i){ return {t:c[0], sub:c[1], ic:ICONS[i], cls:'sw'+(s.ch[i]?' on':''), tog:function(){ var n=s.ch.slice(); n[i]=!n[i]; self.setState({ch:n}); }}; }),
   hours:hours, qFrom:q, qTo:'0'+qTo,
   qMinus:function(){ self.setState({q:Math.max(19,s.q-1)}); }, qPlus:function(){ self.setState({q:Math.min(23,s.q+1)}); },
   lMinus:function(){ self.setState({l:Math.max(1,s.l-1)}); }, lPlus:function(){ self.setState({l:Math.min(10,s.l+1)}); },
   tip: tot>60?'Сигналов много: часть из них — мелочи до 3 000 ₽. Поднимите минимальный эффект, чтобы не привыкнуть пропускать.':tot<15?'С такими порогами вы бы пропустили сигнал по юаню 12 ноября (−6 900 ₽ в месяц). Попробуйте ±2,5%.':'Баланс хороший: в среднем '+Math.round(tot/52*10)/10+' сигнала в неделю, все важнее 3 000 ₽ в месяц.'
  };
 }
}
return Component;
}, {});
