var root,onWake=function(){};
function hud(hint){if(!root)root=document.getElementById("ui-root");if(!root)return;
  var ww={clear:"ясно",cloud:"пасмурно",rain:"дождь",storm:"шторм"}[S.w]||S.w;
  var hh=("0"+S.h).slice(-2),mm=("0"+Math.floor(S.min)).slice(-2);
  if(hint==null)hint=S.tut===0?"ЛКМ — идти к пирсу. WASD тоже.":S.h>=23?"Пора спать — идите в дом.":"Корабль до 19:00. У палатки день идёт быстрее.";
  var keep=root.querySelector(".modal-back");
  root.innerHTML='<div class="hud"><div class="chip">День '+S.day+' · '+hh+':'+mm+'<br/>'+ww+'<\/div><div class="chip">'+S.gold+' монет<\/div><div class="hud-right"><button class="px" id="btn-inv">Сумка<\/button><button class="px" id="btn-pause">Меню<\/button><\/div><\/div>'+(hint?'<div class="hint">'+hint+'<\/div>':'')+'<div id="modal-slot"><\/div>';
  if(keep){var sl=root.querySelector("#modal-slot");if(sl)sl.appendChild(keep);}
  root.querySelector("#btn-inv").onclick=function(){openInv();};
  root.querySelector("#btn-pause").onclick=function(){openPause();};}
function setAct(lab,fn){var o=root&&root.querySelector("#interact-fixed");if(o)o.remove();if(!lab)return;var b=document.createElement("div");b.id="interact-fixed";b.className="interact-btn";b.innerHTML='<button class="px">'+lab+' <span class="enter-prompt">(E)<\/span><\/button>';b.querySelector("button").onclick=fn;root.appendChild(b);}
function toast(m){if(!root)return;var t=document.createElement("div");t.className="toast";t.textContent=m;root.appendChild(t);setTimeout(function(){t.remove();},2000);}
function modal(html){var sl=root.querySelector("#modal-slot")||root;sl.innerHTML='<div class="modal-back"><div class="modal">'+html+"<\/div><\/div>";var c=sl.querySelector("[data-close]");if(c)c.onclick=closeM;}
function closeM(){var sl=root.querySelector("#modal-slot");if(sl)sl.innerHTML="";}
function isM(){return !!(root&&root.querySelector(".modal-back"));}
function line(lot,ex){var i=it(lot.id),st="★".repeat(lot.q)+"☆".repeat(3-lot.q),rot=lot.left!=null?" · "+lot.left+"д":"",g=lot.legal!=="white"?" · серое":"";
  return '<div class="good"><div class="ico" style="background:#'+i.color.toString(16).padStart(6,"0")+'"><\/div><div><b>'+i.name+"<\/b> ×"+lot.qty+"<br/>"+st+rot+g+'<\/div><div>'+(ex||"")+"<\/div><\/div>";}
function openShip(){if(!S.ship.here){toast("Корабль отчалил.");return;}
  var rows=S.ship.off.map(function(o,i){return line(o.lot,'<div class="row" style="flex-direction:column;align-items:flex-end"><div>'+o.ask+' /шт<\/div><button class="px" data-b="'+i+'">Купить<\/button><button class="px ghost" data-h="'+i+'">Торг<\/button><\/div>');}).join("");
  modal("<h2>"+S.ship.name+"<\/h2><p>"+S.ship.cap+" · "+S.ship.mood+"<\/p><div class=\"goods\">"+(rows||"<p>Пусто.<\/p>")+'<\/div><button class="px ghost" data-close>Уйти<\/button>');
  root.querySelectorAll("[data-b]").forEach(function(el){el.onclick=function(){buy(Number(el.getAttribute("data-b")),null);};});
  root.querySelectorAll("[data-h]").forEach(function(el){el.onclick=function(){hag(Number(el.getAttribute("data-h")));};});}
function buy(i,pr){var o=S.ship.off[i];if(!o)return;var p=pr==null?o.ask:pr,tot=p*o.lot.qty;if(S.gold<tot){toast("Мало монет.");return;}
  S.gold-=tot;addInv(Object.assign({},o.lot,{buy:p}));S.ship.off.splice(i,1);S.today.cost+=tot;S.today.deals++;if(S.tut<2)S.tut=1;save(S);toast("Куплено за "+tot);hud();if(S.ship.off.length)openShip();else closeM();}
function hag(i){var o=S.ship.off[i],item=it(o.lot.id),fairP=Math.round(o.ask*(.82+S.ship.pride*.05)),pat=4,askP=o.ask;
  modal("<h2>Торг · "+item.name+"<\/h2><p>Их цена: <b id=ask>"+askP+'<\/b><\/p><div class="row"><input class="px" id=bid type=number value="'+Math.round(askP*.9)+'"><button class="px" id=off>Предложить<\/button><button class="px ghost" id=take>Их цена<\/button><\/div><p>Терпение: <span id=pat>'+pat+'<\/span><\/p><div class="log" id=log>«Ну давайте.»<\/div><button class="px ghost" data-close>Уйти<\/button>');
  root.querySelector("#take").onclick=function(){buy(i,askP);};
  root.querySelector("#off").onclick=function(){var bid=Number(root.querySelector("#bid").value);if(!isFinite(bid)||bid<=0)return;var min=Math.round(fairP*(.92+S.ship.pride*.08));
    if(bid>=askP){buy(i,askP);return;}if(bid>=min&&Math.random()<1-(askP-bid)/Math.max(1,askP-min+4)){buy(i,bid);return;}
    pat--;askP=Math.max(min,Math.round(askP-(askP-bid)*.25));root.querySelector("#ask").textContent=askP;root.querySelector("#pat").textContent=pat;root.querySelector("#log").innerHTML="Теперь "+askP+".";if(pat<=0){S.today.fail++;toast("Сорвалось.");closeM();}};}
function openStall(){var inv=S.inv.map(function(l){return line(l,'<button class="px" data-p="'+l.uid+'">На витрину<\/button>');}).join("")||"<p>Сумка пуста.<\/p>";
  var slots=S.stall.map(function(s,i){if(!s.lot)return '<div class="good"><div><\/div><div>Слот '+(i+1)+': пусто<\/div><div><\/div><\/div>';var f=fair(s.lot.id,S.m,s.lot.q);return line(s.lot,'<div class="row" style="flex-direction:column;align-items:flex-end"><input class="px" data-pr="'+i+'" type=number value="'+s.price+'"><div>'+demand(s.price,f)+'<\/div><button class="px ghost" data-t="'+i+'">Убрать<\/button><\/div>');}).join("");
  modal("<h2>Палатка<\/h2><div class=\"goods\">"+slots+'<\/div><h2 style="font-size:15px">Сумка<\/h2><div class="goods">'+inv+'<\/div><button class="px ghost" data-close>Закрыть<\/button>');
  root.querySelectorAll("[data-p]").forEach(function(el){el.onclick=function(){var empty=S.stall.find(function(x){return !x.lot;});if(!empty){toast("Нет слотов.");return;}var found=S.inv.find(function(l){return l.uid===el.getAttribute("data-p");});var lot=takeInv(el.getAttribute("data-p"),found?found.qty:0);if(!lot)return;empty.lot=lot;empty.price=Math.round(fair(lot.id,S.m,lot.q)*1.15);empty.on=true;if(S.tut<3)S.tut=2;save(S);openStall();};});
  root.querySelectorAll("[data-t]").forEach(function(el){el.onclick=function(){var i=+el.getAttribute("data-t");if(S.stall[i].lot)addInv(S.stall[i].lot);S.stall[i].lot=null;S.stall[i].on=false;save(S);openStall();};});
  root.querySelectorAll("[data-pr]").forEach(function(el){el.onchange=function(){var i=+el.getAttribute("data-pr");S.stall[i].price=Math.max(1,+el.value|0);S.stall[i].on=true;save(S);openStall();};});}
function openTav(){modal("<h2>Таверна «Мокрая снасть»<\/h2><ul>"+S.rum.map(function(r){return "<li>"+r+"<\/li>";}).join("")+'<\/ul><div class="row"><button class="px" id=food>Еда за 8<\/button><button class="px ghost" data-close>Выйти<\/button><\/div>');
  root.querySelector("#food").onclick=function(){if(S.gold<8)return toast("Нет денег.");S.gold-=8;save(S);toast("Горячее.");closeM();hud();};}
function openInv(){modal("<h2>Сумка<\/h2><div class=\"goods\">"+(S.inv.map(function(l){return line(l);}).join("")||"<p>Пусто.<\/p>")+'<\/div><button class="px ghost" data-close>Закрыть<\/button>');}
function openPause(){modal('<h2>Пауза<\/h2><p>Сейв в браузере.<\/p><div class="row"><button class="px" id=sv>Сохранить<\/button><button class="px danger" id=ng>Новая игра<\/button><button class="px ghost" data-close>Дальше<\/button><\/div>');
  root.querySelector("#sv").onclick=function(){save(S);toast("Сохранено.");};root.querySelector("#ng").onclick=function(){S=newGame();save(S);location.reload();};}
function openSleep(){var t=S.today,pr=t.rev-t.cost-t.rot;
  modal("<h2>Книга учёта · ночь "+S.day+"<\/h2><p>Выручка "+t.rev+" · Себес "+t.cost+" · Чисто "+pr+"<\/p><p>Сделок "+t.deals+" · Порча "+t.rot+"<\/p><p>Капитал "+S.gold+'<\/p><button class="px" id=nd>Новый день<\/button>');
  root.querySelector("#nd").onclick=function(){nextDay();closeM();onWake();toast("День "+S.day+".");hud();};}
function npcBuy(){if(S.h<8||S.h>=21)return null;var sell=[];S.stall.forEach(function(s,i){if(s.lot&&s.on)sell.push({s:s,i:i});});if(!sell.length)return null;
  var p=sell[Math.floor(Math.random()*sell.length)],lot=p.s.lot,f=fair(lot.id,S.m,lot.q);if(Math.random()>chance(p.s.price,f,lot.q,S.h,S.rep))return null;
  var q=Math.min(lot.qty,1+Math.floor(Math.random()*2)),g=q*p.s.price;S.gold+=g;S.today.rev+=g;S.today.sold+=q;S.today.deals++;lot.qty-=q;if(lot.qty<=0){S.stall[p.i].lot=null;S.stall[p.i].on=false;}if(S.tut<4)S.tut=3;save(S);return "Купили "+it(lot.id).name+" ×"+q+" за "+g;}
var World=new Phaser.Class({Extends:Phaser.Scene,initialize:function(){Phaser.Scene.call(this,{key:"world"});},
create:function(){var w=genWorld();this.grid=w.col;this.acts=w.act;this.path=[];this.dest=null;this.ha=0;this.ba=0;this.near=null;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){var k=w.ground[y][x]==="water"?((x+y)%2?"t-water2":"t-water"):"t-"+w.ground[y][x];this.add.image(x*T+8,y*T+8,k);}
  this.add.image(9*T,16*T,"spr-ship").setOrigin(.5,.7).setDepth(6);
  this.add.image(20*T+8,16*T,"spr-tent").setOrigin(.5,.75).setDepth(6);
  this.add.image(29*T+8,9*T+8,"spr-house").setOrigin(.5,.7).setDepth(6);
  this.add.image(36*T,17*T+8,"spr-tavern").setOrigin(.5,.7).setDepth(6);
  [[14,12],[15,20],[18,14],[24,12],[26,21],[19,22],[31,19],[13,24],[21,11]].forEach(function(p){this.add.image(p[0]*T+8,p[1]*T+8,"spr-barrel").setDepth(5);},this);
  [[13,16,"ПИРС"],[20,15,"ПАЛАТКА"],[29,6,"ДОМ"],[36,15,"ТАВЕРНА"]].forEach(function(L){this.add.text(L[0]*T+8,L[1]*T,L[2],{fontFamily:"monospace",fontSize:"7px",color:"#ffe7a3",stroke:"#1a1008",strokeThickness:2}).setOrigin(.5).setDepth(7);},this);
  this.player=this.add.sprite((S.px+.5)*T,(S.py+.5)*T,"player").setOrigin(.5,.8).setDepth(20);
  this.marker=this.add.image(0,0,"marker").setVisible(false).setDepth(8);
  this.cameras.main.setBounds(0,0,W*T,H*T).setZoom(Z).startFollow(this.player,true,.12,.12).setRoundPixels(true);
  this.tint=this.add.rectangle(W*T/2,H*T/2,W*T,H*T,0x000000,0).setDepth(40);
  var self=this;this.input.on("pointerdown",function(p){if(isM()||p.button!==0)return;var wpt=self.cameras.main.getWorldPoint(p.x,p.y);self.go(Math.floor(wpt.x/T),Math.floor(wpt.y/T));});
  if(this.input.keyboard){this.input.keyboard.on("keydown-E",function(){self.use();});this.input.keyboard.on("keydown-ESC",closeM);this.cursors=this.input.keyboard.createCursorKeys();this.wasd=this.input.keyboard.addKeys("W,A,S,D");}
  this.npcs=[[22,20],[25,18],[18,19],[30,21]].map(function(p,i){return self.add.sprite(p[0]*T+8,p[1]*T+8,["npc-a","npc-b","npc-c"][i%3]).setOrigin(.5,.8).setDepth(15);});
  this.tintDay();root=document.getElementById("ui-root");onWake=function(){self.player.setPosition((S.px+.5)*T,(S.py+.5)*T);self.tintDay();hud();};hud();},
go:function(tx,ty){var from={x:Math.floor(this.player.x/T),y:Math.floor(this.player.y/T)};var itc=this.acts.find(function(i){return Math.abs(i.x-tx)<=1&&Math.abs(i.y-ty)<=1;});
  var gx=itc?itc.x:tx,gy=itc?itc.y:ty,path=findPath(this.grid,from.x,from.y,gx,gy);if(!path.length){toast("Не дойти.");return;}this.path=path.slice(1);this.dest={x:gx,y:gy};this.marker.setPosition(gx*T+8,gy*T+8).setVisible(true);},
open:function(itc){if(itc.type==="ship")openShip();if(itc.type==="stall")openStall();if(itc.type==="tavern")openTav();
  if(itc.type==="door"){S.scene="home";S.px=Math.floor(this.player.x/T);S.py=Math.floor(this.player.y/T);save(S);var self=this;this.cameras.main.fadeOut(200,0,0,0);this.cameras.main.once("camerafadeoutcomplete",function(){self.scene.start("home");});}},
use:function(){if(this.near&&!isM())this.open(this.near);},
tintDay:function(){var h=S.h+S.min/60,c=0,a=0;if(h<7){c=0x2a3a66;a=.28;}else if(h<8){c=0xffc080;a=.1;}else if(h<17)a=0;else if(h<20){c=0xff8a3a;a=.16;}else{c=0x102040;a=.38;}if(S.w==="storm"){c=0x1a2838;a=Math.max(a,.22);}this.tint.setFillStyle(c,a);},
update:function(t,dt){if(!this.player)return;var modal=isM();
  if(this.path.length){var n=this.path[0],nx=n.x*T+8,ny=n.y*T+8,dx=nx-this.player.x,dy=ny-this.player.y,dist=Math.hypot(dx,dy),step=SP*dt/1000;
    if(dist<=step){this.player.setPosition(nx,ny);this.path.shift();if(!this.path.length&&this.dest){this.marker.setVisible(false);var d=this.dest,itc=this.acts.find(function(i){return i.x===d.x&&i.y===d.y;});if(itc)this.open(itc);this.dest=null;}}
    else{this.player.x+=dx/dist*step;this.player.y+=dy/dist*step;this.player.setFlipX(dx<-.2);}S.px=Math.floor(this.player.x/T);S.py=Math.floor(this.player.y/T);}
  else if(!modal&&this.cursors&&this.wasd){var kx=0,ky=0;if(this.cursors.left.isDown||this.wasd.A.isDown)kx=-1;if(this.cursors.right.isDown||this.wasd.D.isDown)kx=1;if(this.cursors.up.isDown||this.wasd.W.isDown)ky=-1;if(this.cursors.down.isDown||this.wasd.S.isDown)ky=1;
    if(kx||ky){var px=this.player.x+kx*SP*dt/1000,py=this.player.y+ky*SP*dt/1000,tx=Math.floor(px/T),ty=Math.floor(py/T);if(this.grid[ty]&&this.grid[ty][tx]===0){this.player.setPosition(px,py);this.player.setFlipX(kx<0);}}}
  if(!modal)this.ba+=dt*(this.near&&this.near.type==="stall"?2:1);if(this.ba>4200){this.ba=0;var msg=npcBuy();if(msg){toast(msg);hud();}}
  this.ha+=dt*(!modal&&this.near&&this.near.type==="stall"?2:1);if(this.ha>=22000/60){this.ha=0;S.min++;if(S.min>=60){S.min=0;S.h++;}
    if(S.h>=19&&S.ship.here){S.ship.here=false;toast("Корабль отчалил.");}if(S.h>=24){toast("Усталость.");S.h=23;S.min=50;this.scene.start("home");this.time.delayedCall(400,openSleep);}
    if(Math.floor(S.min)%15===0){this.tintDay();hud();if(S.min<1)save(S);}}
  var tx=Math.floor(this.player.x/T),ty=Math.floor(this.player.y/T);
  var f=this.acts.find(function(i){return Math.abs(i.x-tx)+Math.abs(i.y-ty)<=1;})||null;
  if((f&&f.id)!==(this.near&&this.near.id)){this.near=f;if(f){var self=this;setAct(f.l+" · открыть",function(){self.open(f);});}else setAct(null);}
  var tw=this.time.now/800;this.npcs.forEach(function(n,i){n.setFlipX(Math.sin(tw+i)>0);});}});
var Home=new Phaser.Class({Extends:Phaser.Scene,initialize:function(){Phaser.Scene.call(this,{key:"home"});},
create:function(){this.grid=genHome();this.path=[];this.near=null;
  for(var y=0;y<HH;y++)for(var x=0;x<HW;x++)this.add.image(x*T+8,y*T+8,this.grid[y][x]? "t-block":"t-wood");
  this.add.rectangle(4*T+8,6*T+8,16,20,0x6b3a7a).setStrokeStyle(1,0x1a1008);
  this.add.text(4*T+8,5*T,"КРОВАТЬ",{fontSize:"6px",color:"#ffe7a3",fontFamily:"monospace"}).setOrigin(.5);
  this.add.text(8*T+8,(HH-1)*T+2,"ДВЕРЬ",{fontSize:"6px",color:"#ffe7a3",fontFamily:"monospace"}).setOrigin(.5);
  this.player=this.add.sprite(8*T+8,8*T+8,"player").setOrigin(.5,.8).setDepth(10);
  this.cameras.main.setBounds(0,0,HW*T,HH*T).setZoom(Z+1).startFollow(this.player,true,.14,.14).setRoundPixels(true).fadeIn(200,0,0,0);
  var self=this;this.input.on("pointerdown",function(p){if(isM())return;var w=self.cameras.main.getWorldPoint(p.x,p.y);self.path=findPath(self.grid,Math.floor(self.player.x/T),Math.floor(self.player.y/T),Math.floor(w.x/T),Math.floor(w.y/T)).slice(1);});
  if(this.input.keyboard)this.input.keyboard.on("keydown-E",function(){self.use();});hud("Дом. Кровать — конец дня. Дверь — на улицу.");},
use:function(){var self=this;if(this.near==="bed"){modal('<h2>Завершить день '+S.day+'?<\/h2><div class="row"><button class="px" id=yes>Спать<\/button><button class="px ghost" data-close>Ещё похожу<\/button><\/div>');root.querySelector("#yes").onclick=function(){save(S);openSleep();};}
  if(this.near==="exit"){S.scene="world";S.px=29;S.py=13;save(S);this.cameras.main.fadeOut(200,0,0,0);this.cameras.main.once("camerafadeoutcomplete",function(){self.scene.start("world");});}},
update:function(t,dt){if(this.path.length){var n=this.path[0],nx=n.x*T+8,ny=n.y*T+8,dx=nx-this.player.x,dy=ny-this.player.y,dist=Math.hypot(dx,dy),step=SP*dt/1000;if(dist<=step){this.player.setPosition(nx,ny);this.path.shift();}else{this.player.x+=dx/dist*step;this.player.y+=dy/dist*step;}}
  var tx=Math.floor(this.player.x/T),ty=Math.floor(this.player.y/T),n=(tx<=5&&ty<=8&&ty>=5)?"bed":(tx===8&&ty>=HH-3)?"exit":null;
  if(n!==this.near){this.near=n;var self=this;if(n==="bed")setAct("Спать",function(){self.use();});else if(n==="exit")setAct("Выйти",function(){self.use();});else setAct(null);}}});
var Boot=new Phaser.Class({Extends:Phaser.Scene,initialize:function(){Phaser.Scene.call(this,{key:"boot"});},
create:function(){tex(this);var b=document.getElementById("boot");if(b)b.style.display="none";this.scene.start(S.scene==="home"?"home":"world");}});
try{new Phaser.Game({type:Phaser.AUTO,parent:"game-root",backgroundColor:"#0c1218",pixelArt:true,roundPixels:true,antialias:false,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:true,antialias:false,roundPixels:true},scene:[Boot,World,Home]});}catch(e){fail("Phaser: "+e);}
})();
