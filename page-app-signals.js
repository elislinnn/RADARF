/* Экран: Кабинет — лента сигналов (C02-Signals) */
DC.page(function (DCLogic) {
var S=[
 {id:1,kind:'risk',ic:'%',ev:'Индексация аренды с 1 января по договору',eff:-11000,fork:'по условиям договора',act:'Обсудить индексацию с арендодателем до 15 декабря',urg:'Срок 15.12',u:'warn',conf:'0,90',src:'ваш профиль',date:'сегодня',st:'new'},
 {id:2,kind:'opp',ic:'₽',ev:'Заседание ЦБ 18 декабря · кредит 2,5 млн ₽, плавающая ставка',eff:2100,fork:'если ставку снизят на 1 п.п.',act:'Не фиксировать ставку по кредиту до решения ЦБ',urg:'Фон',u:'grey',conf:'0,75',src:'Банк России',date:'вчера',st:'new'},
 {id:3,kind:'risk',ic:'¥',ev:'Юань вырос на 2,8% за 30 дней (12,05 → 12,39 ₽)',eff:-6900,fork:'скорее всего −5 500…−8 800 ₽',act:'Зафиксировать закупку зерна на 2 месяца по текущему прайсу',urg:'Срочно',u:'loss',conf:'0,82',src:'Банк России, Мосбиржа',date:'12 ноября',st:'applied'},
 {id:4,kind:'risk',ic:'↑',ev:'Молочная продукция +3,1% за месяц по региону (демо)',eff:-1800,fork:'скорее всего −1 200…−2 500 ₽',act:'Сравнить прайс у второго поставщика молока',urg:'Средняя',u:'warn',conf:'0,64',src:'Росстат',date:'10 ноября',st:'applied'},
 {id:5,kind:'opp',ic:'✓',ev:'Подходящая программа поддержки (пример)',eff:0,fork:'льготная ставка по кредиту на оборудование',act:'Собрать 6 документов до 1 декабря',urg:'Средняя',u:'warn',conf:'0,70',src:'портал господдержки',date:'8 ноября',st:'applied'},
 {id:6,kind:'risk',ic:'¥',ev:'Новый год в Китае: поставщики закрыты около 2 недель',eff:-3500,fork:'если закупки встанут без запаса',act:'Сделать запас зерна на февраль',urg:'Фон',u:'grey',conf:'0,60',src:'календарь',date:'7 ноября',st:'snoozed'},
 {id:7,kind:'risk',ic:'%',ev:'Минимальный налог УСН: выручка близко к порогу (демо)',eff:0,fork:'проверить с бухгалтером',act:'Не актуально — бухгалтер уже учёл',urg:'Фон',u:'grey',conf:'0,55',src:'ФНС',date:'6 ноября',st:'dismissed'}];
var F=[{k:'all',t:'Все'},{k:'risk',t:'Риски'},{k:'opp',t:'Возможности'},{k:'applied',t:'Применено'},{k:'snoozed',t:'Отложено'}];
function fmt(v){ if(!v) return '—'; return (v<0?'−':'+')+new Intl.NumberFormat('ru-RU').format(Math.abs(v))+' ₽/мес'; }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={f:'all', st:{}, toast:null}; }
 componentWillUnmount(){ clearTimeout(this.tt); }
 renderVals(){
  var self=this, st=this.state;
  var cur=S.map(function(s){ return Object.assign({},s,{st:st.st[s.id]||s.st}); });
  var show=function(s){ if(s.st==='dismissed') return false; if(st.f==='all') return true; if(st.f==='applied'||st.f==='snoozed') return s.st===st.f; return s.kind===st.f; };
  var set=function(id,v,msg){ var m=Object.assign({},self.state.st); m[id]=v; self.setState({st:m, toast:{id:id, prev:(self.state.st[id]||S.filter(function(x){return x.id===id;})[0].st), msg:msg}}); clearTimeout(self.tt); self.tt=setTimeout(function(){ self.setState({toast:null}); },5000); };
  var found=cur.filter(function(s){ return s.st==='applied'; }).reduce(function(a,s){ return a+Math.abs(s.eff); },0);
  var list=cur.filter(show).map(function(s){ var ucls={loss:'chip chip-loss',warn:'chip chip-warn',grey:'chip chip-grey'}[s.u];
   return Object.assign({},s,{eff:fmt(s.eff), effCls:'eff num '+(s.eff<0?'loss':(s.eff>0?'gain':'')), cls:'sig'+(s.st==='applied'?' applied':'')+(s.st==='snoozed'?' snoozed':''), urgCls:ucls,
    icBg: s.kind==='opp'?'#E3F5EA':'#EEF3FF', icC: s.kind==='opp'?'#0E8A43':'#1F5EFF',
    isApplied:s.st==='applied', isSnoozed:s.st==='snoozed', canAct:s.st==='new',
    apply:function(){ set(s.id,'applied','Применено. Радар нашёл для вас ещё '+fmt(Math.abs(s.eff)).replace('+','')); }, snooze:function(){ set(s.id,'snoozed','Отложено на неделю'); }}); });
  var cnt=function(k){ return cur.filter(function(x){ return x.st===k; }).length; };
  var SB=[['новые','new','#1F5EFF'],['применено','applied','#0E8A43'],['отложено','snoozed','#F5A524'],['скрыто','dismissed','#C9D3E3']];
  var stBar=SB.map(function(b){ var n=cnt(b[1]); return {t:b[0], n:n, c:b[2], w:(n/cur.length*100).toFixed(1)+'%'}; });
  var CHN=[['Аренда',[1],'#1F5EFF'],['Юань и Китай',[3,6],'#D92D33'],['Цены поставщиков',[4],'#F5A524'],['Ставка (возможность)',[2],'#0E8A43']];
  var Cc=2*Math.PI*46, tot=0, vals=CHN.map(function(c){ var v=c[1].reduce(function(a,id){ return a+Math.abs(S.filter(function(x){return x.id===id;})[0].eff); },0); tot+=v; return v; }), acc=0;
  var donut=CHN.map(function(c,i){ var len=vals[i]/tot*Cc, d={t:c[0], c:c[2], v:new Intl.NumberFormat('ru-RU').format(vals[i]), da:Math.max(0,len-2).toFixed(1)+' '+Cc.toFixed(1), off:(-acc).toFixed(1)}; acc+=len; return d; });
  var WK=[[2,0],[1,1800],[3,1800],[2,3200],[1,3200],[3,4800],[2,6200],[3,9000]], WT=['30.09','7.10','14.10','21.10','28.10','4.11','11.11','18.11'];
  var wk=WK.map(function(w,i){ var x=12+i*36, h=w[0]*26; return {x:x, cx:x+11, y:132-h, h:h, ty:126-h, n:w[0], t:i%2===1?WT[i]:''}; });
  var yl=function(v){ return 120-v/9000*104; };
  var wkLine='M'+WK.map(function(w,i){ return (23+i*36)+' '+yl(w[1]).toFixed(1); }).join(' L');
  return {
   stBar:stBar, donut:donut, riskSum:new Intl.NumberFormat('ru-RU').format(tot-2100), wk:wk, wkLine:wkLine, wkLx:23+7*36, wkLy:yl(9000).toFixed(1),
   filters: F.map(function(f){ var n=cur.filter(function(s){ if(s.st==='dismissed') return false; if(f.k==='all') return true; if(f.k==='applied'||f.k==='snoozed') return s.st===f.k; return s.kind===f.k; }).length; return {t:f.t, n:n, cls:'pill'+(st.f===f.k?' on':''), pick:function(){ self.setState({f:f.k}); }}; }),
   list: list, empty: list.length===0, found: new Intl.NumberFormat('ru-RU').format(found),
   toast: !!st.toast, toastText: st.toast?st.toast.msg:'',
   undo: function(){ var t=self.state.toast; if(!t) return; var m=Object.assign({},self.state.st); m[t.id]=t.prev; self.setState({st:m, toast:null}); }
  };
 }
}
return Component;
}, {});
