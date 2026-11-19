/* Экран: Кабинет — что если (C04-WhatIf) */
DC.page(function (DCLogic) {
var D={yuan:0,rate:14,rent:0,fot:0,price:230};
var REV=1500000, COGS=585000, CNY=0.42, RENT=180000, FOT=420000, LOAN=2500000, P0=129000, CASH0=1.5;
function f(v){ return new Intl.NumberFormat('ru-RU').format(Math.abs(Math.round(v))); }
function pm(v){ v=Math.round(v/100)*100; return (v>0?'+':(v<0?'−':''))+f(v); }
class Component extends DCLogic {
 constructor(p){ super(p); this.state=Object.assign({sc:-1, saved:false},D); }
 componentWillUnmount(){ cancelAnimationFrame(this.raf); }
 tween(t){ var self=this, from=Object.assign({},this.state), k=0; cancelAnimationFrame(this.raf); var step=function(){ k=Math.min(1,k+0.08); var e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2, up={}; Object.keys(t).forEach(function(key){ up[key]=from[key]+(t[key]-from[key])*e; if(key!=='rate') up[key]=Math.round(up[key]); else up[key]=Math.round(up[key]*2)/2; }); self.setState(up); if(k<1) self.raf=requestAnimationFrame(step); }; step(); }
 renderVals(){
  var s=this.state, self=this;
  var priceK=s.price/230, rev=REV*priceK*(1-0.6*(priceK-1)); // спрос падает при росте цены (эластичность 0,6, демо)
  var dC=COGS*CNY*s.yuan/100, dR=LOAN*(s.rate-14)/100/12, dRe=RENT*s.rent/100, dF=FOT*s.fot/100, dRev=rev-REV;
  var profit=P0-dC-dR-dRe-dF+dRev*0.61, costs=rev-profit, be=s.price*costs/rev, cash=Math.max(0,CASH0*(profit/P0));
  var mx=Math.max(15000,Math.abs(dC),Math.abs(dR),Math.abs(dRe),Math.abs(dF),Math.abs(dRev*0.61));
  var fl=function(t,v){ return {t:t, v:pm(v)+' ₽', w:(Math.abs(v)/mx*100).toFixed(1)+'%', c:v<0?'#D92D33':(v>0?'#0E8A43':'#8A97AD')}; };
  var SL=[['yuan','Юань к сегодняшнему курсу',-10,20,1,function(v){return (v>0?'+':'')+v+'%';}],['rate','Ключевая ставка',8,20,0.5,function(v){return String(v).replace('.',',')+'%';}],['rent','Индексация аренды',0,20,1,function(v){return '+'+v+'%';}],['fot','Рост зарплат',0,20,1,function(v){return '+'+v+'%';}],['price','Ваша цена капучино',200,280,5,function(v){return v+' ₽';}]];
  var SC=[{t:'Базовый',v:{yuan:5,rate:12,rent:6}},{t:'Жёсткий',v:{yuan:12,rate:16,rent:8}},{t:'Мягкий',v:{yuan:0,rate:10,rent:4}}];
  var MM=['дек','янв','фев','мар','апр','май'], BASEM=[125000,114000,108000,110000,112000,115000];
  var ph=[[0.5,0,0.3,0],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]; // доля эффекта: юань, аренда, ставка, ФОТ
  var scenM=BASEM.map(function(b,i){ var k=ph[i]; return b-dC*k[0]-dRe*k[1]-dR*k[2]-dF*k[3]+dRev*0.61; });
  var all=BASEM.concat(scenM), lo=Math.min.apply(null,all)-8000, hi=Math.max.apply(null,all)+8000;
  var mX=function(i){ return 90+i*118; }, mY=function(v){ return 196-(v-lo)/(hi-lo)*176; };
  var mp=function(a){ return 'M'+a.map(function(v,i){ return mX(i)+' '+mY(v).toFixed(1); }).join(' L'); };
  var sum6=scenM.reduce(function(a,v,i){ return a+v-BASEM[i]; },0);
  return {
   mGrid:[0,1,2,3].map(function(k){ var v=hi-(hi-lo)*k/3; return {y:(20+k*58.7).toFixed(1), ty:(24+k*58.7).toFixed(1), t:Math.round(v/1000)+' тыс'}; }),
   mBase:mp(BASEM), mScen:mp(scenM), mArea:mp(scenM)+' L'+BASEM.slice().reverse().map(function(v,i){ return mX(5-i)+' '+mY(v).toFixed(1); }).join(' L')+' Z', mAreaC:sum6<0?'#D92D33':'#0E8A43',
   mPts:scenM.map(function(v,i){ return {x:mX(i), y:mY(v).toFixed(1), ty:(mY(v)-12).toFixed(1), v:Math.round(v/1000)+' тыс', m:MM[i]}; }),
   sum6:pm(sum6), sum6Cls:'chip '+(sum6<-500?'chip-loss':(sum6>500?'chip-gain':'chip-grey')),
   scen: SC.map(function(c,i){ return {t:c.t, cls:'pill'+(s.sc===i?' on':''), pick:function(){ self.setState({sc:i}); self.tween(c.v); }}; }),
   sliders: SL.map(function(x){ return {t:x[1], min:x[2], max:x[3], step:x[4], v:s[x[0]], lbl:x[5](s[x[0]]), on:function(e){ cancelAnimationFrame(self.raf); var u={sc:-1}; u[x[0]]=+e.target.value; self.setState(u); }}; }),
   profit: f(Math.round(profit/100)*100), delta: pm(profit-P0), dCls: 'chip '+(profit<P0-50?'chip-loss':(profit>P0+50?'chip-gain':'chip-grey')),
   be: f(be), price: s.price, cash: (Math.round(cash*10)/10).toString().replace('.',','),
   flows: [fl('Закупки в юанях',-dC), fl('Платёж по кредиту',-dR), fl('Аренда',-dRe), fl('Зарплаты',-dF), fl('Выручка от цены',dRev*0.61)],
   reset: function(){ cancelAnimationFrame(self.raf); self.setState(Object.assign({sc:-1},D)); },
   save: function(){ self.setState({saved:true}); }, saveLbl: s.saved?'✓ Сохранено':'Сохранить'
  };
 }
}
return Component;
}, {});
