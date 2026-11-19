/* Экран: Снимок бизнеса — первый показ (A07-Snapshot) */
DC.page(function (DCLogic) {
class Component extends DCLogic {
 constructor(p){ super(p); this.state={show:true}; }
 renderVals(){ var self=this; return { show: this.state.show, replay: function(){ self.setState({show:false}); setTimeout(function(){ self.setState({show:true}); },40); } }; }
}
return Component;
}, {});
