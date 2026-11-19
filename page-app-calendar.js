/* Экран: Кабинет — календарь (C05-Calendar) */
DC.page(function (DCLogic) {
var EV={15:[{t:'Аренда: срок',cls:'tag t-idx'}],17:[{t:'Напоминание ЦБ',cls:'tag t-cb'}],18:[{t:'Заседание ЦБ',cls:'tag t-cb'}],21:[{t:'Дайджест',cls:'tag t-sup'}]};
class Component extends DCLogic { renderVals(){ var d=[{n:30,cls:'day out',tags:[]}]; for(var i=1;i<=31;i++){ d.push({n:i, cls:'day', tags:EV[i]||[]}); } for(var j=1;j<=3;j++) d.push({n:j,cls:'day out',tags:j===1?[{t:'Аренда +%',cls:'tag t-idx'}]:[]}); return {days:d}; } }
return Component;
}, {});
