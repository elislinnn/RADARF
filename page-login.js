/* Экран: Вход — Антикризисный радар (A01-Login) */
DC.page(function (DCLogic) {
class Component extends DCLogic {
 constructor(p){ super(p); this.state={step:0, phone:'+7 (913) 555-24-18', code:['','','',''], err:false, ok:false, t:59}; }
 componentDidMount(){ var s=this; this.iv=setInterval(function(){ if(s.state.step===1 && s.state.t>0) s.setState({t:s.state.t-1}); },1000); }
 componentWillUnmount(){ clearInterval(this.iv); }
 renderVals(){
  var self=this, st=this.state, digits=st.phone.replace(/\D/g,'');
  var cells=st.code.map(function(v,i){ return {v:v, label:'Цифра '+(i+1), cls:'otp'+(st.err?' err':''), on:function(e){ var c=self.state.code.slice(); c[i]=e.target.value.replace(/\D/g,'').slice(-1); var full=c.join('').length===4; var ok=c.join('')==='1812'; self.setState({code:c, err:full&&!ok, ok:full&&ok}); var n=e.target.nextElementSibling; if(c[i]&&n&&n.focus) n.focus(); }}; });
  return {
   phoneStep: st.step===0, codeStep: st.step===1, phone: st.phone, noPhone: digits.length<11, btnOp: digits.length<11?'.5':'1',
   onPhone: function(e){ self.setState({phone:e.target.value}); },
   sendCode: function(e){ e.preventDefault(); self.setState({step:1, t:59}); },
   back: function(){ self.setState({step:0, code:['','','',''], err:false, ok:false}); },
   cells: cells, err: st.err, ok: st.ok, timer: '0:'+(st.t<10?'0':'')+st.t
  };
 }
}
return Component;
}, {});
