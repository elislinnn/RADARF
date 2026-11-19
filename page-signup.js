/* Экран: Онбординг, шаг 1 — Расскажите о бизнесе (A03-Phrase) */
DC.page(function (DCLogic) {
var EX=['две кофейни, зерно из Китая, кредит 2,5 млн плавающий','магазин автозапчастей, 70% товара из Китая','салон красоты, косметика импортная'];
var KEY=['кофейни','Новосибирске','зерно','Китая','кредит','2,5','млн','плавающей','ставкой'];
class Component extends DCLogic {
 constructor(p){ super(p); this.state={text:'Две кофейни в Новосибирске, зерно из Китая, кредит 2,5 млн с плавающей ставкой', mode:0, k:0, sph:false}; }
 componentWillUnmount(){ clearInterval(this.iv); }
 renderVals(){
  var self=this, st=this.state, ws=st.text.trim().split(/\s+/).filter(Boolean);
  return {
   text: st.text, editing: st.mode===0, reading: st.mode>0, notDone: st.mode<2, done: st.mode===2,
   wc: ws.length, short: st.mode===0 && ws.length>0 && ws.length<5,
   words: ws.map(function(w,i){ var key=KEY.some(function(k){ return w.indexOf(k)===0; }); return {t:w, cls:(key && i<st.k)?'hl':''}; }),
   onText: function(e){ self.setState({text:e.target.value}); },
   examples: EX.map(function(t){ return {t:t, pick:function(){ self.setState({text:t, mode:0}); }}; }),
   toggleSph: function(){ self.setState({sph:!self.state.sph}); }, sph: st.sph,
   parseLabel: st.mode===1?'Читаем…':'Разобрать',
   parse: function(){ if(ws.length<5){ return; } self.setState({mode:1, k:0}); clearInterval(self.iv); self.iv=setInterval(function(){ var k=self.state.k+1; if(k>ws.length+2){ clearInterval(self.iv); self.setState({mode:2}); } else self.setState({k:k}); },120); }
  };
 }
}
return Component;
}, {});
