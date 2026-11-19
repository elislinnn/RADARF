/* Экран: Антикризисный радар — лендинг (Main) */
DC.page(function (DCLogic) {
var PHRASE = 'Две кофейни в Новосибирске, зерно из Китая, кредит 2,5 млн с плавающей ставкой';
var ANSWER = 'Юань вырос на 2,8% за месяц. Зерно — 42% вашей себестоимости, а поставщик обычно меняет прайс через 2–4 недели. Если ничего не делать, прибыль снизится примерно на 6 900 ₽ в месяц (скорее всего на 5 500–8 800 ₽). Что сделать: зафиксируйте закупку зерна на 2 месяца по текущему прайсу.'.split(' ');
var NOTES = [
 {t:'Юань +2,8% за 30 дней', s:'−6 900 ₽/мес · зафиксируйте закупку зерна'},
 {t:'ЦБ 18.12: возможно снижение ставки', s:'до +2 100 ₽/мес по кредиту'},
 {t:'Аренда: индексация с 1 января', s:'−11 000 ₽/мес · обсудите до 15.12'},
 {t:'Индекс давления 64/100', s:'+3 за неделю, главное — валюта'}];
var BIZ = [
 {name:'Кофейня', tag:'Кофейня · 2 точки', title:'Закупки зерна подорожают', chan:'Закупки в юанях — 42% себестоимости, себестоимость — 39% выручки. 1 500 000 × 0,39 × 0,42 × 0,05.', v:-12300, act:'Зафиксируйте закупку зерна на 2 месяца по текущему прайсу', note:'расчёт по профилю кофейни', bg:'linear-gradient(135deg,#1F5EFF,#5B8CFF)', glyph:'¥'},
 {name:'Магазин запчастей', tag:'Магазин автозапчастей', title:'Прайс поставщика обновится', chan:'Товар из Китая — 70% себестоимости. Поставщик пересчитывает прайс раз в месяц.', v:-38000, act:'Закупите ходовые позиции до обновления прайса', note:'демо-расчёт', bg:'linear-gradient(135deg,#0F3BC0,#2F8CFF)', glyph:'¥'},
 {name:'Салон красоты', tag:'Салон красоты · 4 мастера', title:'Влияние небольшое', chan:'Импортная косметика — 15% расходов. Рост курса почти не трогает прибыль.', v:-2100, act:'Цены на услуги не меняйте: рост меньше 0,5% выручки', note:'демо-расчёт', bg:'linear-gradient(135deg,#3A4FD8,#8B7CFF)', glyph:'¥'}];
var FAQ = [
 {q:'Нужен ли ИНН?', a:'Нет. Достаточно одной фразы о бизнесе. ИНН — по желанию: он подставит отрасль, регион и налоговый режим.'},
 {q:'Откуда цифры?', a:'Курсы и ставка — Банк России и Мосбиржа, цены — Росстат, налоги — ФНС. У каждого числа в сигнале есть ссылка на источник.'},
 {q:'ИИ может ошибиться в сумме?', a:'Сумму считает формула, а не ИИ. ИИ только пересказывает расчёт, и код проверяет, что каждое число в тексте совпадает с расчётом.'},
 {q:'Чем вы лучше новостей и чат-ботов?', a:'Новости говорят «юань вырос». Радар говорит, сколько это стоит вашей кофейне в рублях и что сделать на этой неделе.'},
 {q:'Кто видит мои данные?', a:'Только вы. Данные хранятся в России по 152-ФЗ, их можно выгрузить или удалить в настройках.'},
 {q:'Можно ли отменить подписку?', a:'Да, в 2 клика. Доступ сохраняется до конца оплаченного периода, деньги вернём в течение 14 дней.'}];
var EX = ['две кофейни, зерно из Китая, кредит 2,5 млн плавающий', 'магазин автозапчастей, 70% товара из Китая, аренда растёт', 'салон красоты, косметика импортная, 4 мастера'];
var RATES = [8.5,9.5,20,17,14,11,9.5,8,8,7.5,7.5,7.5, 7.5,7.5,7.5,7.5,7.5,7.5,8.5,12,13,15,15,16, 16,16,16,16,16,16,18,18,19,21,21,21];
var TMTXT = function(i){ if(i<2) return 'Спокойно: ставка низкая, сигналов по кредиту нет.'; if(i<5) return 'Резкий рост ставки: радар предупредил бы о росте платежа по плавающему кредиту и предложил зафиксировать ставку.'; if(i<18) return 'Ставка снижается: сигнал-возможность — можно рефинансировать кредит дешевле.'; if(i<24) return 'Июль–декабрь 2023: ставка растёт с 7,5% до 16%. Радар выдал бы сигнал в июле: «платёж по кредиту вырастет, зафиксируйте ставку».'; return 'Ставка 16–21%: радар считает каждое решение ЦБ в рублях платежа по вашему кредиту.'; };
function fmt(v, d){ var s = new Intl.NumberFormat('ru-RU',{minimumFractionDigits:d||0, maximumFractionDigits:d||0}).format(Math.abs(v)); return (v<0?'−':'') + s; }
function pm(v){ return (v>0?'+':'') + fmt(v); }
class Component extends DCLogic {
 constructor(props){ super(props); this.state = {tick:0, step:0, auto:true, typed:0, biz:0, bizAuto:true, shown:-12300, chat:0, words:0, narrow:false, scen:-1, yuan:0, rate:14, rent:0, year:false, faq:0, ph:0, phTyped:0, focus:false, sent:0, mega:false, scrolled:false, stats:0, sc:0, tm:19}; }
 componentDidMount(){
  var self=this;
  this.i1=setInterval(function(){ self.setState(function(s){return {tick:s.tick+1};}); },2400);
  this.i2=setInterval(function(){ self.frame(); },50);
  this.i3=setInterval(function(){ if(self.state.auto) self.setState(function(s){return {step:(s.step+1)%3, typed:0};}); },4200);
  this.i4=setInterval(function(){ if(self.state.bizAuto) self.setState(function(s){return {biz:(s.biz+1)%3};}); },5000);
  this.i5=setInterval(function(){ if(!self.state.focus) self.setState(function(s){return {ph:(s.ph+1)%3, phTyped:0};}); },4200);
  this.onScroll=function(){ var sc=(window.scrollY||document.documentElement.scrollTop)>24; if(sc!==self.state.scrolled) self.setState({scrolled:sc}); };
  window.addEventListener('scroll',this.onScroll,{passive:true});
  var start=function(key){ if(key==='chat'&&self.state.chat===0){ self.setState({chat:1}); setTimeout(function(){self.setState({chat:2});},900);} if(key==='stats'&&self.state.stats===0) self.setState({stats:0.001}); if(key==='fork'&&self.state.sc===0) self.setState({sc:0.001}); };
  try{ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ start(e.target.__k); io.unobserve(e.target);} }); },{threshold:0.15}); this.io=io;
   [['chat',this.rChat],['stats',this.rStats],['fork',this.rFork]].forEach(function(p){ if(p[1]){ p[1].__k=p[0]; io.observe(p[1]); } else start(p[0]); });
  }catch(e){ start('chat'); start('stats'); start('fork'); }
 }
 componentWillUnmount(){ [this.i1,this.i2,this.i3,this.i4,this.i5].forEach(clearInterval); window.removeEventListener('scroll',this.onScroll); if(this.io) this.io.disconnect(); }
 frame(){
  var s=this.state, up={}, n=0;
  if(s.step===0 && s.typed<PHRASE.length){ up.typed=Math.min(PHRASE.length,s.typed+2); n++; }
  if(s.chat===2){ if(s.words<ANSWER.length){ up.words=s.words+1; } else { up.chat=3; } n++; }
  if(s.stats>0 && s.stats<1){ up.stats=Math.min(1,s.stats+0.045); n++; }
  if(s.sc>0 && s.sc<1){ up.sc=Math.min(1,s.sc+0.035); n++; }
  if(!s.focus && s.phTyped<EX[s.ph].length){ up.phTyped=s.phTyped+1; n++; }
  var target=BIZ[s.biz].v; if(Math.abs(s.shown-target)>40){ up.shown=Math.round(s.shown+(target-s.shown)*0.28); n++; } else if(s.shown!==target){ up.shown=target; n++; }
  if(this.tw){ var t=this.tw; t.k=Math.min(1,t.k+0.1); var e=t.k<.5?2*t.k*t.k:1-Math.pow(-2*t.k+2,2)/2; up.yuan=Math.round(t.f[0]+(t.t[0]-t.f[0])*e); up.rate=Math.round((t.f[1]+(t.t[1]-t.f[1])*e)*2)/2; up.rent=Math.round(t.f[2]+(t.t[2]-t.f[2])*e); if(t.k>=1) this.tw=null; n++; }
  if(n) this.setState(up);
 }
 renderVals(){
  var s=this.state, self=this;
  var ease=function(p){return 1-Math.pow(1-p,3);};
  var p=ease(s.stats);
  var note=NOTES[s.tick%4], prev=NOTES[(s.tick+3)%4];
  var steps=[{n:1,t:'Расскажите о бизнесе одной фразой',d:'ИИ разложит её в профиль из 12 параметров, пустое заполнит отраслевыми значениями.'},{n:2,t:'Радар считает',d:'Модель влияния переводит событие в рубли вашей прибыли — с вилкой.'},{n:3,t:'Получаете действие',d:'В Telegram или на почту, с кнопками «Почему?» и «Применить».'}].map(function(x,i){ return Object.assign({},x,{on:s.step===i, cls:'stepbtn '+(s.step===i?'on':'off'), pick:function(){ self.setState({step:i, auto:false, typed:0}); }}); });
  var sd=s.narrow?3:6, bars=[];
  for(var i=0;i<40;i++){ var z=(i-19.5); var h=Math.exp(-z*z/(2*sd*sd)); var inb=Math.abs(z)<=1.28*sd; bars.push({s:(Math.max(0.03,h)*Math.min(1,s.sc*1.4)).toFixed(3), c:inb?'#1F5EFF':'#C9D4E8'}); }
  var REV=1500000, COGS=585000, CNY=0.42, RENT=180000, LOAN=2500000, P0=129000;
  var dC=COGS*CNY*s.yuan/100, dR=LOAN*(s.rate-14)/100/12, dRe=RENT*s.rent/100;
  var profit=P0-dC-dR-dRe, be=230*(REV-profit)/REV, mx=Math.max(20000,Math.abs(dC),Math.abs(dR),Math.abs(dRe));
  var flow=function(name,v){ return {name:name, v:pm(-Math.round(v))+' ₽', w:(Math.abs(v)/mx*100).toFixed(1)+'%', c:v>0?'#D92D33':(v<0?'#0E8A43':'#8A97AD')}; };
  var SC=[{name:'Базовый',v:[5,12,6]},{name:'Жёсткий',v:[12,16,8]},{name:'Мягкий',v:[0,10,4]}];
  var y=RATES[s.tm];
  var ys=[]; for(var k=0;k<36;k++){ ys.push((k*20)+','+(220-RATES[k]*10)); }
  var months=['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  return {
   rootCls: (this.props.motion===false)?'nomo':'',
   hdrCls: 'hdr'+(s.scrolled?' sc':''),
   mega: s.mega, megaAria: s.mega?'true':'false',
   toggleMega: function(){ self.setState({mega:!self.state.mega}); }, openMega: function(){ self.setState({mega:true}); }, closeMega: function(){ self.setState({mega:false}); },
   s1: fmt(14*p), s2: fmt(15.4*p,1), s3: fmt(6.98*p,2),
   statsRef: function(el){ self.rStats=el; }, chatRef: function(el){ self.rChat=el; }, forkRef: function(el){ self.rFork=el; },
   evenTick: s.tick%2===0, oddTick: s.tick%2===1, note: note, prevNote: prev,
   phoneCls: 'phone '+(s.tick%2===0?'bz-a':'bz-b'),
   steps: steps, step0: s.step===0, step1: s.step===1, step2: s.step===2,
   typedText: PHRASE.slice(0,s.typed), typedDone: s.typed>=PHRASE.length,
   bizTabs: BIZ.map(function(b,i){ return {name:b.name, cls:'pill'+(s.biz===i?' on':''), pick:function(){ self.setState({biz:i, bizAuto:false}); }}; }),
   biz: BIZ[s.biz], shownFmt: fmt(s.shown),
   chat1: s.chat>=1, chatDots: s.chat===1, chat2: s.chat>=2, chat3: s.chat>=3, answerText: ANSWER.slice(0,s.words).join(' '),
   replayChat: function(){ self.setState({chat:1, words:0}); setTimeout(function(){ self.setState({chat:2}); },900); },
   bars: bars, scCount: fmt(Math.round(2000*ease(s.sc))),
   forkLo: s.narrow?'−6 200':'−5 500', forkMid: '−6 900', forkHi: s.narrow?'−7 600':'−8 800',
   toggleNarrow: function(){ self.setState({narrow:!self.state.narrow}); }, narrowLabel: s.narrow?'Вернуть исходную вилку':'Уточнить долю закупок в юанях',
   scenarios: SC.map(function(c,i){ return {name:c.name, cls:'pill'+(s.scen===i?' on':''), color:s.scen===i?'#fff':'rgba(255,255,255,.75)', pick:function(){ self.tw={k:0,f:[self.state.yuan,self.state.rate,self.state.rent],t:c.v}; self.setState({scen:i}); }}; }),
   yuan: s.yuan, rate: s.rate, rent: s.rent,
   yuanLbl: (s.yuan>0?'+':'')+fmt(s.yuan)+'%', rateLbl: fmt(s.rate,s.rate%1?1:0)+'%', rentLbl: '+'+fmt(s.rent)+'%',
   onYuan: function(e){ self.tw=null; self.setState({yuan:+e.target.value, scen:-1}); }, onRate: function(e){ self.tw=null; self.setState({rate:+e.target.value, scen:-1}); }, onRent: function(e){ self.tw=null; self.setState({rent:+e.target.value, scen:-1}); },
   profitFmt: fmt(Math.round(profit/100)*100), deltaFmt: pm(Math.round((profit-P0)/100)*100), deltaCls: 'chip '+(profit<P0?'chip-loss':(profit>P0?'chip-gain':'chip-grey')),
   beFmt: fmt(Math.round(be)), beW: Math.min(100,be/230*100).toFixed(1)+'%',
   flows: [flow('Закупки в юанях',dC), flow('Платёж по кредиту',dR), flow('Аренда',dRe)],
   ratePath: 'M'+ys.join(' L'), tm: s.tm, tmX: s.tm*20, tmY: 220-y*10, tmRate: fmt(y,y%1?1:0)+'%', tmMonth: months[s.tm%12]+' '+(2022+Math.floor(s.tm/12)), tmText: TMTXT(s.tm),
   onTm: function(e){ self.setState({tm:+e.target.value}); },
   faqs: FAQ.map(function(f,i){ var o=s.faq===i; return {q:f.q, a:f.a, cls:'faq-a'+(o?' open':''), chevCls:'chev'+(o?' open':''), aria:o?'true':'false', pick:function(){ self.setState({faq:self.state.faq===i?-1:i}); }}; }),
   year: s.year, month: !s.year, mCls: 'pill'+(s.year?'':' on'), yCls: 'pill'+(s.year?' on':''),
   setMonth: function(){ self.setState({year:false}); }, setYear: function(){ self.setState({year:true}); },
   phPlaceholder: EX[s.ph].slice(0,s.phTyped), phFocus: function(){ self.setState({focus:true}); },
   submit: function(e){ e.preventDefault(); if(self.state.sent) return; self.setState({sent:1}); setTimeout(function(){ self.setState({sent:2}); },1200); },
   submitLabel: s.sent===0?'Получить снимок':(s.sent===1?'Готовим снимок…':'✓ Код отправлен на телефон')
  };
 }
}
return Component;
}, {});
