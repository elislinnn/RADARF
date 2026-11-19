/* Экран: Кабинет — рынок (C13-Market) */
DC.page(function (DCLogic) {
function walk(seed,n,start,end,vol){ var a=[], x=seed; for(var i=0;i<n;i++){ x=(x*9301+49297)%233280; var r=x/233280-0.5; var t=i/(n-1); a.push(start+(end-start)*t+r*vol*(1-Math.abs(2*t-1)*0.3)); } a[n-1]=end; return a; }
var IND=[
 {k:'cny',name:'Юань, ₽',val:'12,38',chg:'+15,4% с мая',up:true,impact:'42% закупок',src:'Курс Банка России · 11.11.2026',s:walk(7,26,10.73,12.38,0.25),thr:12.35,fmt:2,how:'Юань — 42% вашей себестоимости. Поставщики перекладывают курс в прайс через 2–4 недели.',per1:'−2 460 ₽',thrTxt:'±2,5% за 30 дней',thrNote:'При таком пороге за последний год радар выдал бы 4 сигнала по юаню.',sig:'Последний — 12 ноября: юань +2,8%, закупка зерна зафиксирована.',sg:[14,24]},
 {k:'rate',name:'Ключевая ставка',val:'14%',chg:'заседание 18.12',up:false,impact:'кредит 2,5 млн',src:'Банк России · решение 23.10.2026',s:walk(3,26,15.5,14,0.2),thr:13.5,fmt:1,how:'Кредит 2,5 млн ₽ с плавающей ставкой: каждые −1 п.п. — около +2 100 ₽ в месяц.',per1:'−2 080 ₽ за 1 п.п.',thrTxt:'±0,5 п.п.',thrNote:'Сигнал приходит после каждого решения ЦБ, если ставка изменилась на 0,5 п.п. и больше.',sig:'Перед заседанием 18 декабря — сигнал-возможность «не фиксировать ставку».',sg:[20]},
 {k:'inf',name:'Инфляция, г/г',val:'6,98%',chg:'09.11.2026',up:false,impact:'зарплаты, аренда',src:'Минэкономразвития',s:walk(5,26,8.2,6.98,0.25),thr:8,fmt:2,how:'Через 6–12 месяцев инфляция доходит до зарплат и аренды — 40% ваших расходов.',per1:'−6 000 ₽',thrTxt:'±1 п.п. за квартал',thrNote:'Медленный фактор: сигнал раз в квартал, а не каждую неделю.',sig:'Сигналов пока не было: инфляция снижается.',sg:[]},
 {k:'coffee',name:'Кофе в зёрнах',val:'+4,2%',chg:'за 3 месяца',up:true,impact:'себестоимость',src:'Росстат, потребительские цены · демо',s:walk(11,26,100,104.2,0.6),thr:103,fmt:1,how:'Цены на кофе в рознице подтверждают, что поставщики уже перекладывают курс.',per1:'−2 460 ₽',thrTxt:'+3% за квартал',thrNote:'Проверочный ряд: подтверждает сигнал по юаню.',sig:'Подтвердил сигнал по юаню 12 ноября.',sg:[22]},
 {k:'milk',name:'Молочная продукция',val:'+3,1%',chg:'за месяц',up:true,impact:'закупки в ₽',src:'Росстат, регион · демо',s:walk(13,26,100,103.1,0.5),thr:102.5,fmt:1,how:'Молоко — заметная часть рублёвых закупок; рост на 3,1% ≈ −1 800 ₽ в месяц.',per1:'−580 ₽',thrTxt:'+2,5% за месяц',thrNote:'Порог из отраслевых значений; можно поменять.',sig:'10 ноября: сравнить прайс второго поставщика — применено.',sg:[23]},
 {k:'rent',name:'Аренда, Новосибирск',val:'+8%',chg:'за год',up:true,impact:'аренда',src:'Объявления, центр города · демо',s:walk(17,26,100,108,0.8),thr:106,fmt:0,how:'Ваш договор индексируется 1 января: радар заранее посчитал −11 000 ₽ в месяц.',per1:'−1 800 ₽',thrTxt:'индексация по договору',thrNote:'Напоминание за 30 дней до даты индексации из профиля.',sig:'Сигнал «обсудить индексацию до 15 декабря» ждёт решения.',sg:[25]}];
var MX=[{name:'Зарплаты (инфляция)',ch:'ФОТ 28% выручки',v:4200,st:'медленно',c:'chip chip-grey'},{name:'Цены поставщиков в ₽',ch:'закупки 23% выручки',v:3393,st:'следим',c:'chip chip-warn'},{name:'Юань',ch:'закупки 16% выручки',v:2457,st:'выше порога',c:'chip chip-loss'},{name:'Ключевая ставка (1 п.п.)',ch:'кредит 2,5 млн, плавающая',v:2083,st:'ЦБ 18.12',c:'chip'},{name:'Аренда',ch:'12% выручки',v:1800,st:'1 января',c:'chip chip-warn'},{name:'Спрос (−1% чеков)',ch:'валовая маржа 61%',v:9150,st:'спокойно',c:'chip chip-gain'}];
class Component extends DCLogic {
 constructor(p){ super(p); this.state={i:0, per:1}; }
 renderVals(){ var self=this, s=this.state, cur=IND[s.i];
  var n=s.per===0?13:26, data=cur.s.slice(26-n);
  var mn=Math.min.apply(null,data.concat([cur.thr])), mx=Math.max.apply(null,data.concat([cur.thr])), pad=(mx-mn)*0.15||1; mn-=pad; mx+=pad;
  var X=function(i){ return 50+i*(650/(n-1)); }, Y=function(v){ return 250-(v-mn)/(mx-mn)*230; };
  var line='M'+data.map(function(v,i){ return X(i).toFixed(1)+' '+Y(v).toFixed(1); }).join(' L');
  var f=function(v){ return v.toFixed(cur.fmt).replace('.',','); };
  var sp=function(a){ var lo=Math.min.apply(null,a), hi=Math.max.apply(null,a); return 'M'+a.map(function(v,i){ return (i*140/(a.length-1)).toFixed(1)+' '+(32-(v-lo)/(hi-lo||1)*28).toFixed(1); }).join(' L'); };
  var months=s.per===0?['авг','сен','окт','ноя']:['май','июн','июл','авг','сен','окт','ноя'];
  return {
   periods:['3 месяца','6 месяцев'].map(function(t,i){ return {t:t, cls:'pill'+(s.per===i?' on':''), pick:function(){ self.setState({per:i}); }}; }),
   tiles: IND.map(function(t,i){ return {name:t.name, val:t.val, chg:t.chg, chgCls:'small '+(t.up?'loss':'muted'), spark:sp(t.s), sc:i===s.i?'#1F5EFF':'#93B4FF', impact:'влияет: '+t.impact, cls:'tile'+(i===s.i?' on':''), pick:function(){ self.setState({i:i}); }}; }),
   cur:{name:cur.name, src:cur.src, how:cur.how, per1:cur.per1, thr:cur.thrTxt, thrNote:cur.thrNote, sig:cur.sig},
   chartKey:[{aria:cur.name+': динамика и порог реакции'}],
   grid:[0,1,2,3].map(function(k){ var v=mn+(mx-mn)*(1-k/3); return {y:(20+k*76.7).toFixed(1), ty:(24+k*76.7).toFixed(1), t:f(v)}; }),
   thrY:Y(cur.thr).toFixed(1), bandY:Math.min(Y(mx),Y(cur.thr)).toFixed(1), bandH:Math.max(0,Y(cur.thr)-20).toFixed(1),
   line:line, area:line+' L'+X(n-1)+' 250 L50 250 Z',
   sigs: cur.sg.map(function(k){ return k-(26-n); }).filter(function(k){ return k>=0; }).map(function(k){ var x=X(k), y=Y(data[k])-16; return {d:'M'+x+' '+(y-7)+'l7 7-7 7-7-7z'}; }),
   lastX:X(n-1).toFixed(1), lastY:Y(data[n-1]).toFixed(1),
   xl: months.map(function(t,i){ return {t:t, x:(50+i*650/(months.length-1)).toFixed(0)}; }),
   matrix: MX.map(function(m){ return {name:m.name, ch:m.ch, v:'−'+new Intl.NumberFormat('ru-RU').format(m.v)+' ₽', w:(m.v/9150*100).toFixed(0)+'%', st:m.st, stCls:m.c}; })
  };
 }
}
return Component;
}, {});
