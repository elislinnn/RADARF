/* Экран: Кабинет — машина времени (C09-TimeMachine) */
DC.page(function (DCLogic) {
var R=[8.5,9.5,20,17,14,11,9.5,8,8,7.5,7.5,7.5, 7.5,7.5,7.5,7.5,7.5,7.5,8.5,12,13,15,15,16, 16,16,16,16,16,16,18,18,19,21,21,21];
var M=['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
var SIG={2:'Март 2022: ставка 20% — платёж по плавающему кредиту вырастет, зафиксируйте ставку',5:'Июнь 2022: ставка снижается — можно рефинансировать кредит',18:'Июль 2023: ставка растёт — зафиксируйте ставку по кредиту до следующего заседания',19:'Август 2023: внеочередное повышение до 12% — пересчитайте платёж',30:'Июль 2024: ставка 18% — платёж по кредиту растёт',33:'Октябрь 2024: ставка 21% — проверьте запас по кассе'};
function X(i){ return 30+i*20; } function Y(v){ return 230-v*10; }
function txt(i){ if(i<2) return 'Спокойно: ставка низкая, сигналов по кредиту нет.'; if(i<5) return 'Резкий рост ставки: радар предупредил бы о росте платежа и предложил зафиксировать ставку.'; if(i<18) return 'Ставка снижается: сигнал-возможность — рефинансировать кредит дешевле.'; if(i<24) return 'Ставка растёт с 7,5% до 16%: радар выдал бы сигнал в июле 2023 года.'; return 'Ставка 16–21%: радар считает каждое решение ЦБ в рублях платежа по вашему кредиту.'; }
class Component extends DCLogic {
 constructor(p){ super(p); this.state={tm:18, play:false, fast:false, pr:1}; }
 componentWillUnmount(){ clearInterval(this.iv); }
 setPlay(on){ var self=this; clearInterval(this.iv); if(on){ this.iv=setInterval(function(){ var t=self.state.tm+1; if(t>35){ clearInterval(self.iv); self.setState({play:false}); } else self.setState({tm:t}); }, self.state.fast?160:600); } this.setState({play:on}); }
 renderVals(){ var s=this.state, self=this, pts=R.map(function(v,i){ return X(i)+','+Y(v); });
  var feed=Object.keys(SIG).map(Number).filter(function(k){ return k<=s.tm; }).reverse().slice(0,3).map(function(k){ return {d:M[k%12]+' '+(2022+Math.floor(k/12)), t:SIG[k]}; });
  var P=[{t:'Весна 2022',m:2},{t:'Лето 2023',m:18},{t:'Осень 2024',m:33}];
  return { full:'M'+pts.join(' L'), played:'M'+pts.slice(0,s.tm+1).join(' L'), x:X(s.tm), y:Y(R[s.tm]), tm:s.tm,
   marks:[2,18,33].filter(function(k){ return k<=s.tm; }).map(function(k){ var x=X(k), y=Y(R[k])-16; return {d:'M'+x+' '+(y-7)+'l7 7-7 7-7-7z'}; }),
   cur: M[s.tm%12]+' '+(2022+Math.floor(s.tm/12)), rate: String(R[s.tm]).replace('.',',')+'%', text: txt(s.tm), feed: feed.length?feed:[{d:'—', t:'Пока сигналов нет'}],
   presets: P.map(function(p,i){ return {t:p.t, cls:'pill'+(s.pr===i?' on':''), pick:function(){ self.setPlay(false); self.setState({tm:p.m, pr:i}); }}; }),
   toggle: function(){ if(!self.state.play && self.state.tm>=35) self.setState({tm:0}); self.setPlay(!self.state.play); }, playLbl: s.play?'Пауза':'▶ Играть',
   speed: function(){ self.setState({fast:!self.state.fast}); if(self.state.play){ var st=self; setTimeout(function(){ st.setPlay(true); },0); } }, speedLbl: s.fast?'×4':'×1',
   onTm: function(e){ self.setPlay(false); self.setState({tm:+e.target.value, pr:-1}); } };
 }
}
return Component;
}, {});
