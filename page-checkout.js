/* Экран: Оплата тарифа и успех (P02-Checkout) */
DC.page(function (DCLogic) {
class Component extends DCLogic {
 constructor(p){ super(p); this.state={m:'card', st:0, failed:false}; }
 componentWillUnmount(){ clearTimeout(this.t); }
 renderVals(){ var s=this.state, self=this;
  return { isCard:s.m==='card', isSbp:s.m==='sbp', cardCls:'m'+(s.m==='card'?' on':''), sbpCls:'m'+(s.m==='sbp'?' on':''),
   pickCard:function(){ self.setState({m:'card'}); }, pickSbp:function(){ self.setState({m:'sbp'}); },
   notDone:s.st<2, done:s.st===2, failed:s.failed, payLbl: s.st===1?'Ждём подтверждения банка…':'Оплатить 790 ₽',
   pay:function(){ if(self.state.st) return; self.setState({st:1, failed:false}); self.t=setTimeout(function(){ self.setState({st:2}); },1500); },
   fail:function(){ self.setState({failed:true, st:0}); } };
 }
}
return Component;
}, {});
