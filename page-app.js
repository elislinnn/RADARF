/* Экран: Кабинет — снимок бизнеса (C01-Snapshot) */
DC.page(function (DCLogic) {
var IDX12=[52,54,55,53,56,58,57,60,61,59,62,64], IDX26=[44,45,47,46,48,47,49,50,49,51,52,51,50,52,52,54,55,53,56,58,57,60,61,59,62,64];
var CNY=[12.05,12.07,12.04,12.08,12.10,12.09,12.12,12.11,12.15,12.14,12.17,12.16,12.20,12.22,12.21,12.24,12.23,12.27,12.29,12.28,12.31,12.33,12.32,12.36,12.37,12.35,12.38,12.37,12.39,12.39];
var FAN=[{m:'ноя',v:129,lo:129,hi:129,o:129},{m:'дек',v:125,lo:112,hi:136,o:125},{m:'янв',v:114,lo:98,hi:128,o:116},{m:'фев',v:108,lo:88,hi:126,o:110},{m:'мар',v:110,lo:88,hi:130,o:112},{m:'апр',v:112,lo:88,hi:134,o:114}];
function fy(v){ return 200-(v-70)*2; }
function fmtk(v){ return v+' тыс'; }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={rng:0}; }
 renderVals(){
  var self=this, s=this.state;
  var data=s.rng===0?IDX12:IDX26, n=data.length, X=function(i){ return 34+i*(600/(n-1)); }, Y=function(v){ return 200-(v-20)*3; };
  var pts=data.map(function(v,i){ return [X(i),Y(v)]; });
  var line='M'+pts.map(function(p){ return p[0].toFixed(1)+' '+p[1].toFixed(1); }).join(' L');
  var area=line+' L'+X(n-1)+' 200 L34 200 Z';
  var sp=function(arr,w,h,pad){ var mn=Math.min.apply(null,arr), mx=Math.max.apply(null,arr); return 'M'+arr.map(function(v,i){ return (i*(w/(arr.length-1))).toFixed(1)+' '+(h-pad-(v-mn)/(mx-mn||1)*(h-2*pad)).toFixed(1); }).join(' L'); };
  var evDefs=s.rng===0?[{i:4,t:'ЦБ 23.10'},{i:9,t:'аренда в профиле'},{i:11,t:'юань > порога'}]:[{i:18,t:'ЦБ 23.10'},{i:23,t:'аренда'},{i:25,t:'юань > порога'}];
  var evs=evDefs.map(function(e,k){ var x=X(e.i), w=e.t.length*6.4+18, y=Y(data[e.i]), dn=(k===1); var lx=Math.min(640-w,Math.max(34,x-w/2)); return {x:x, y:y-8, lx:lx, ly:dn?y+14:Math.max(0,y-44), w:w, tx:lx+w/2, ty:dn?y+29:Math.max(15,y-29), t:e.t}; });
  var wk=s.rng===0?['31 авг','14 сен','28 сен','12 окт','26 окт','9 ноя']:['май','июн','июл','авг','сен','окт','ноя'];
  var weeks=wk.map(function(t,i){ return {t:t, x:(34+i*(600/(wk.length-1))).toFixed(0), a:i===0?'start':(i===wk.length-1?'end':'middle')}; });
  var D=[{t:'Валюта',p:38,c:'#1F5EFF'},{t:'Аренда',p:22,c:'#5B8CFF'},{t:'Ставка',p:18,c:'#93B4FF'},{t:'Цены поставщиков',p:12,c:'#C2D4FF'},{t:'Спрос',p:10,c:'#E3EBFF'}];
  var C=2*Math.PI*46, acc=0;
  var donut=D.map(function(d){ var len=C*d.p/100; var r={t:d.t, p:d.p, c:d.c, da:(len-1.5).toFixed(1)+' '+(C-len+1.5).toFixed(1), off:(-acc).toFixed(1)}; acc+=len; return r; });
  var FX=function(i){ return 70+i*112; };
  var band='M'+FAN.map(function(f,i){ return FX(i)+' '+fy(f.hi); }).join(' L')+' L'+FAN.slice().reverse().map(function(f,i){ return FX(FAN.length-1-i)+' '+fy(f.lo); }).join(' L')+' Z';
  var mid='M'+FAN.map(function(f,i){ return FX(i)+' '+fy(f.v); }).join(' L');
  var opt='M'+FAN.map(function(f,i){ return FX(i)+' '+fy(f.o); }).join(' L');
  var fanPts=FAN.map(function(f,i){ return {x:FX(i), y:fy(f.v), ty:fy(f.v)-12, v:f.v+'', m:f.m}; });
  var fanEv=[{i:0.85,t:'ЦБ 18.12',c:'#0E8A43'},{i:1.5,t:'аренда',c:'#D92D33'},{i:2.4,t:'Китай',c:'#B76E00'}].map(function(e){ var x=70+e.i*112; return {d:'M'+x+' 32l6 6-6 6-6-6z', x:x, ty:58, t:e.t, c:e.c}; });
  var PL=[{t:'Закупки в юанях',v:245700,c:'#1F5EFF'},{t:'Закупки в рублях',v:339300,c:'#5B8CFF'},{t:'Зарплаты',v:420000,c:'#93B4FF'},{t:'Аренда',v:180000,c:'#C2D4FF'},{t:'Кредит и прочее',v:186000,c:'#DCE6FF'},{t:'Прибыль',v:129000,c:'#0E8A43'}];
  var pl=PL.map(function(x){ return {t:x.t, c:x.c, w:(x.v/1500000*100).toFixed(2)+'%', v:new Intl.NumberFormat('ru-RU').format(x.v)+' ₽', p:Math.round(x.v/15000)+'%'}; });
  var cx=function(i){ return i*(360/29); }, cmin=12.0, cmax=12.45, cyy=function(v){ return 120-(v-cmin)/(cmax-cmin)*110; };
  var cl='M'+CNY.map(function(v,i){ return cx(i).toFixed(1)+' '+cyy(v).toFixed(1); }).join(' L');
  var thr=12.35, crossI=CNY.findIndex(function(v){ return v>=thr; });
  var SENS=[{t:'Зарплаты',v:4200},{t:'Цены в рублях',v:3393},{t:'Юань',v:2457},{t:'Ставка, 1 п.п.',v:2083},{t:'Аренда',v:1800}];
  var sens=SENS.map(function(x,i){ return {t:x.t, v:'−'+new Intl.NumberFormat('ru-RU').format(x.v), w:(x.v/4200*100).toFixed(1)+'%', d:(i*0.08)+'s'}; });
  var SB=[{t:'27 окт',a:1,b:1},{t:'3 ноя',a:2,b:1},{t:'10 ноя',a:2,b:1},{t:'17 ноя',a:2,b:0}];
  var sigBars=SB.map(function(b,i){ var x=20+i*72, k=40; return {x:x, x2:x+28, y1:130-b.a*k, h1:b.a*k, y2:130-b.b*k, h2:Math.max(2,b.b*k), lx:x+27, t:b.t}; });
  return {
   ranges:['12 недель','6 месяцев'].map(function(t,i){ return {t:t, cls:'pill'+(s.rng===i?' on':''), pick:function(){ self.setState({rng:i}); }}; }),
   idxLine:line, idxArea:area, idxPts:pts.map(function(p,i){ return {x:p[0].toFixed(1), y:p[1].toFixed(1), r:i===n-1?6:3.5}; }), idxEvents:evs, weeks:weeks,
   sparkIdx: sp(IDX12,220,44,4), sparkProfit: sp(FAN.map(function(f){return f.v;}),220,28,3),
   donut:donut, fanBand:band, fanMid:mid, fanOpt:opt, fanPts:fanPts, fanEv:fanEv, pl:pl,
   cnyLine:cl, cnyArea:cl+' L360 120 L0 120 Z', thrY:cyy(thr).toFixed(1), thrTy:(cyy(thr)-6).toFixed(1), crossX:cx(crossI).toFixed(1),
   sens:sens, sigBars:sigBars
  };
 }
}
return Component;
}, {});
