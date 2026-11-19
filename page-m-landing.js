/* Экран: Антикризисный радар — лендинг, телефон (Landing-Mobile) */
DC.page(function (DCLogic) {
var B = [
 {name:'Кофейня', tag:'Кофейня · 2 точки', v:'−12 300', note:'по профилю', act:'Зафиксируйте закупку зерна на 2 месяца', bg:'linear-gradient(135deg,#1F5EFF,#5B8CFF)'},
 {name:'Запчасти', tag:'Магазин автозапчастей', v:'−38 000', note:'демо-расчёт', act:'Закупите ходовые позиции до обновления прайса', bg:'linear-gradient(135deg,#0F3BC0,#2F8CFF)'},
 {name:'Салон', tag:'Салон красоты', v:'−2 100', note:'демо-расчёт', act:'Цены на услуги не меняйте', bg:'linear-gradient(135deg,#3A4FD8,#8B7CFF)'}];
class Component extends DCLogic {
 constructor(p){ super(p); this.state={i:0}; }
 renderVals(){ var self=this, i=this.state.i;
  return { b:B[i], tabs:B.map(function(x,k){ return {name:x.name, cls:'pill'+(k===i?' on':''), pick:function(){ self.setState({i:k}); }}; }) };
 }
}
return Component;
}, {});
