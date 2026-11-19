/* Экран: Кабинет — прогноз прибыли и денег (C14-Forecast) */
DC.page(function (DCLogic) {
var M=['дек','янв','фев','мар','апр','май'];
var BASE=[125,114,108,110,112,115], W50=[6,8,9,10,11,12], W80=[12,15,19,21,23,25];
var SH=[0,-6,6]; var NEG=['< 1%','3%','< 1%'];
function fm(v){ return new Intl.NumberFormat('ru-RU').format(Math.round(v)); }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={sc:0}; }
 renderVals(){ var self=this, s=this.state, sh=SH[s.sc];
  var med=BASE.map(function(v,i){ return v+(i===0?sh*0.3:sh*(1+i*0.15)); });
  var X=function(i){ return 110+i*170; }, Y=function(v){ return 270-(v-60)*2.4; };
  var path=function(a){ return 'M'+a.map(function(v,i){ return X(i)+' '+Y(v).toFixed(1); }).join(' L'); };
  var band=function(w,k){ var hi=med.map(function(v,i){ return v+w[i]*k; }), lo=med.map(function(v,i){ return v-w[i]*k; }); return path(hi)+' L'+lo.slice().reverse().map(function(v,i){ return X(med.length-1-i)+' '+Y(v).toFixed(1); }).join(' L')+' Z'; };
  var sum=med.reduce(function(a,b){return a+b;},0)*1000;
  var wmin=med.indexOf(Math.min.apply(null,med));
  var WF=[{t:'Сейчас',v:129,type:'tot'},{t:'Аренда',v:-11},{t:'Юань',v:-6.9},{t:'Молоко',v:-1.8},{t:'Сезон',v:-1.3},{t:'Февраль',v:108,type:'tot'}];
  var yW=function(v){ return 230-(v-80)*4; }, run=0, wf=[], wfl=[];
  WF.forEach(function(w,i){ var x=20+i*90, cx=x+32, r;
   if(w.type==='tot'){ run=w.v; r={x:x, y:yW(w.v), h:230-yW(w.v), c:i===0?'#93B4FF':'#1F5EFF', v:fm(w.v*1000), ty:yW(w.v)-8}; }
   else { var top=run, bot=run+w.v; r={x:x, y:yW(top), h:yW(bot)-yW(top), c:'#D92D33', v:'−'+fm(-w.v*1000), ty:yW(top)-8}; run=bot; }
   r.cx=cx; r.t=w.t; r.d=(i*0.1)+'s'; wf.push(r);
   if(i<WF.length-1) wfl.push({x1:x+64, x2:x+90, y:yW(run).toFixed(1)}); });
  var CASH=[2.05,2.08,1.59,1.62,1.65,1.48,1.51,1.54,1.57,1.44,1.47,1.50,1.53], W=['23.11','30.11','7.12','14.12','21.12','28.12','4.01','11.01','18.01','25.01','1.02','8.02','15.02'];
  var yC=function(v){ return 230-(v-1.0)*200; };
  var cash=CASH.map(function(v,i){ var x=34+i*40; return {x:x, y:yC(v).toFixed(1), h:(230-yC(v)).toFixed(1), c:v<1.5?'#F5A524':'#1F5EFF', cx:x+15, t:i%2===0?W[i]:'', d:(i*0.04)+'s'}; });
  var rows=[{t:'Выручка',v:[1510,1460,1430,1470,1490,1520]},{t:'Расходы',v:med.map(function(v,i){ return [1510,1460,1430,1470,1490,1520][i]-v; })},{t:'Прибыль (медиана)',v:med,cls:'tot'},{t:'Прибыль, вилка 80%',v:med.map(function(v,i){ return fm(v-W80[i])+'–'+fm(v+W80[i]); })}];
  return {
   scen:['Базовый','Жёсткий','Мягкий'].map(function(t,i){ return {t:t, cls:'pill'+(s.sc===i?' on':''), pick:function(){ self.setState({sc:i}); }}; }),
   sum:fm(sum), sumLo:fm(sum-60000), sumHi:fm(sum+55000), worst:M[wmin]+' · '+fm(med[wmin]*1000)+' ₽', pNeg:NEG[s.sc],
   fanKey:[{k:s.sc}], grid:[160,130,100,70].map(function(v){ return {y:Y(v).toFixed(1), ty:(Y(v)+4).toFixed(1), t:v+' тыс'}; }),
   b80:band(W80,1), b50:band(W50,1), mid:path(med), base:'M60 '+Y(129).toFixed(1)+' L1000 '+Y(129).toFixed(1),
   pts:med.map(function(v,i){ return {x:X(i), y:Y(v).toFixed(1), ty:(Y(v)-14).toFixed(1), v:fm(v*1000), m:M[i]}; }),
   evs:[{i:-0.15,t:'ЦБ 18.12',c:'#0E8A43'},{i:0.55,t:'аренда +%',c:'#D92D33'},{i:1.55,t:'Китай, курс в прайсе',c:'#B76E00'}].map(function(e){ var x=X(0)+e.i*170, w=e.t.length*6.6+20; return {x:x.toFixed(0), rx:(x-w/2).toFixed(0), w:w.toFixed(0), t:e.t, c:e.c}; }),
   wf:wf, wfl:wfl, cash:cash, minY:yC(1.37).toFixed(1), minTy:(yC(1.37)-6).toFixed(1),
   months:M, rows:rows.map(function(r){ return {t:r.t, cls:r.cls||'', v:r.v.map(function(x){ return typeof x==='number'?fm(x):x; })}; })
  };
 }
}
return Component;
}, {});
