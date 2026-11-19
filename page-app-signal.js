/* Экран: Кабинет — сигнал и «Почему?» (C03-Why) */
DC.page(function (DCLogic) {
class Component extends DCLogic { renderVals(){ var b=[]; for(var i=0;i<36;i++){ var z=i-17.5, h=Math.exp(-z*z/(2*5.5*5.5)); b.push({h:Math.max(4,Math.round(h*150))+'px', c:Math.abs(z)<=7?'#1F5EFF':'#C9D4E8', d:(i*0.02).toFixed(2)+'s'}); } return {bars:b}; } }
return Component;
}, {});
