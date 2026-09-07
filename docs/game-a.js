/* prichal compact */
(function(){
function fail(m){var e=document.getElementById("boot");if(e)e.innerHTML="<div id=err>"+m+"<\/div>";}
window.onerror=function(m){fail("Ошибка: "+m);};
if(!window.Phaser){fail("Phaser не загрузился. Проверьте интернет.");return;}
var T=16,W=48,H=36,Z=3,SP=72,HW=16,HH=12,KEY="prichal_save_v1";
var ITEMS=[
["salt","Соль","food",6,9,null,"white",0xf2f0e6],
["grain","Зерно","food",5,8,8,"white",0xd4b46a],
["tea","Чай","spice",14,22,null,"white",0x3d6b3a],
["coffee","Кофе","spice",16,26,null,"white",0x5a3318],
["sprat","Килька","fish",4,7,2,"white",0x6a8aa0],
["cod","Треска","fish",9,14,2,"white",0x9bb3c4],
["crab","Краб","fish",15,24,1,"white",0xc45a3a],
["cloth","Ткань","textile",10,16,null,"white",0xc9b8a0],
["rope","Канат","tool",8,12,null,"white",0xa67c4e],
["nails","Гвозди","tool",6,10,null,"white",0x8a8a8a],
["rum","Ром","drink",12,19,null,"white",0x8b3a1f],
["pearl","Жемчуг","rare",40,70,null,"white",0xe8f0f4],
["box","Коробка без вопросов","contraband",25,48,null,"black",0x2a2218]
];
var IMAP={};ITEMS.forEach(function(a){IMAP[a[0]]={id:a[0],name:a[1],cat:a[2],buy:a[3],sell:a[4],perish:a[5],legal:a[6],color:a[7]};});
function it(id){return IMAP[id];}
function uid(){return Math.random().toString(36).slice(2,9);}
function rng(s){return function(){var t=s+=0x6d2b79f5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function pick(r,a){return a[Math.floor(r()*a.length)];}
var SHIPS=["Серая чайка","Пьяный компас","Северная соль","Без флага"];
var CAPS=[{n:"Капитан Рорк",m:"скупой",p:.7},{n:"Мадам Лена",m:"весёлый",p:.35},{n:"Старик Пётр",m:"молчаливый",p:.5},{n:"Пьяный Уле",m:"пьяный",p:.2}];
function market(day,w,seed){var r=rng(seed+day*997),m={};["food","fish","spice","textile","tool","drink","rare","contraband"].forEach(function(c){var v=.85+r()*.4;if(w==="storm"&&c==="fish")v+=.25;m[c]=Math.round(v*100)/100;});return m;}
function weather(r){var x=r();return x<.55?"clear":x<.78?"cloud":x<.93?"rain":"storm";}
function fair(id,m,q){var i=it(id);return Math.max(1,Math.round(i.sell*(m[i.cat]||1)*(.85+q*.08)));}
function ask(id,m,q,p){var i=it(id);return Math.max(1,Math.round(i.buy*(m[i.cat]||1)*(.9+q*.06+p*.12)));}
function rollShip(day,seed,m){var r=rng(seed+day*1337+42),c=pick(r,CAPS),nm=pick(r,SHIPS),off=[],n=3+Math.floor(r()*3);
  for(var i=0;i<n;i++){var d=pick(r,ITEMS),q=r()<.15?3:r()<.45?2:1,qty=2+Math.floor(r()*(d[2]==="rare"?3:8));
    off.push({lot:{uid:uid(),id:d[0],qty:qty,q:q,legal:d[6],left:d[5],buy:0},ask:ask(d[0],m,q,c.p)});}
  return {name:nm,cap:c.n,mood:c.m,pride:c.p,off:off,here:true};}
function rumours(m,w,day){var L={fish:"рыба",spice:"пряности",food:"зерно",textile:"ткани",tool:"скобянка",drink:"ром",rare:"редкости",contraband:"серый груз"};
  var e=Object.keys(m).map(function(k){return[k,m[k]];});
  var hot=e.slice().sort(function(a,b){return b[1]-a[1];})[0];
  var cold=e.slice().sort(function(a,b){return a[1]-b[1];})[0];
  var a=["Сегодня в цене: "+(L[hot[0]]||hot[0])+".","Слабый спрос: "+(L[cold[0]]||cold[0])+"."];
  if(w==="storm")a.push("Шторм. Рыба дорожает."); if(day===1)a.push("Капитан ждёт у пирса."); return a;}
function emptyDay(){return {rev:0,cost:0,deals:0,fail:0,sold:0,rot:0};}
function newGame(){var seed=(Math.random()*1e9)|0,w=weather(rng(seed)),m=market(1,w,seed),st=[];
  for(var i=0;i<4;i++)st.push({lot:null,price:0,on:false});
  return {v:1,day:1,h:6,min:10,w:w,gold:250,scene:"world",px:22,py:18,inv:[],stall:st,ship:rollShip(1,seed,m),m:m,seed:seed,rum:rumours(m,w,1),rep:0,today:emptyDay(),tut:0};}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
function load(){try{var p=JSON.parse(localStorage.getItem(KEY)||"null");return p&&p.v===1?p:null;}catch(e){return null;}}
var S=load()||newGame();
function addInv(lot){var x=S.inv.find(function(l){return l.id===lot.id&&l.q===lot.q&&l.buy===lot.buy;});if(x)x.qty+=lot.qty;else S.inv.push(Object.assign({},lot,{uid:uid()}));}
function takeInv(u,qty){var i=S.inv.findIndex(function(l){return l.uid===u||l.id===u;});if(i<0)return null;var l=S.inv[i],t=Math.min(qty,l.qty);l.qty-=t;var o=Object.assign({},l,{qty:t,uid:uid()});if(l.qty<=0)S.inv.splice(i,1);return o;}
function rot(arr){var o=[];arr.forEach(function(l){if(l.left==null){o.push(l);return;}var n=l.left-1;if(n<=0){S.today.rot+=l.buy*l.qty;}else o.push(Object.assign({},l,{left:n}));});return o;}
function nextDay(){S.day++;S.h=6;S.min=0;S.w=weather(rng(S.seed+S.day*17));S.m=market(S.day,S.w,S.seed);S.ship=rollShip(S.day,S.seed,S.m);S.rum=rumours(S.m,S.w,S.day);S.inv=rot(S.inv);
  S.stall=S.stall.map(function(s){if(!s.lot)return s;var r=rot([s.lot]);return r.length?Object.assign({},s,{lot:r[0]}):{lot:null,price:0,on:false};});
  S.today=emptyDay();S.scene="world";S.px=22;S.py=18;save(S);}
function demand(p,f){var r=p/Math.max(1,f);return r<=.85?"дёшево":r<=1.15?"в рынке":r<=1.45?"дорого":"обходят";}
function chance(p,f,q,h,rep){var r=p/Math.max(1,f),c=r<.9?.92:r>1.6?.04:.72-Math.abs(r-1)*.7;c+=(q-1)*.06+rep*.02;if(h<8||h>=18)c*=.55;if(h>=21)c=0;return Math.max(0,Math.min(.95,c));}
function findPath(g,sx,sy,tx,ty){
  var h=g.length,w=g[0].length;if(sx<0||sy<0||tx<0||ty<0||sx>=w||tx>=w||sy>=h||ty>=h)return[];
  if(g[sy][sx]>0)return[];
  if(g[ty][tx]>0){var found=null;for(var r=1;r<=6&&!found;r++)for(var dy=-r;dy<=r&&!found;dy++)for(var dx=-r;dx<=r&&!found;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;var nx=tx+dx,ny=ty+dy;if(ny>=0&&ny<h&&nx>=0&&nx<w&&g[ny][nx]===0)found={x:nx,y:ny};}if(!found)return[];tx=found.x;ty=found.y;}
  if(sx===tx&&sy===ty)return[{x:sx,y:sy}];
  var open=[{x:sx,y:sy,g:0,f:0}],omap={},cl={},par={};omap[sx+","+sy]=open[0];
  var D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while(open.length){var b=0;for(var i=1;i<open.length;i++)if(open[i].f<open[b].f)b=i;var c=open.splice(b,1)[0];delete omap[c.x+","+c.y];cl[c.x+","+c.y]=1;
    if(c.x===tx&&c.y===ty){var path=[{x:c.x,y:c.y}],cx=c.x,cy=c.y;while(!(cx===sx&&cy===sy)){var p=par[cx+","+cy];if(!p)break;cx=p.x;cy=p.y;path.push({x:cx,y:cy});}path.reverse();return path;}
    D.forEach(function(d){var nx=c.x+d[0],ny=c.y+d[1];if(nx<0||ny<0||nx>=w||ny>=h||g[ny][nx]>0)return;
      if(d[0]&&d[1]&&(g[c.y][nx]>0||g[ny][c.x]>0))return;var k=nx+","+ny;if(cl[k])return;
      var gg=c.g+(d[0]&&d[1]?1.41:1),ex=omap[k];if(!ex||gg<ex.g){var node={x:nx,y:ny,g:gg,f:gg+Math.max(Math.abs(nx-tx),Math.abs(ny-ty))};par[k]={x:c.x,y:c.y};if(!ex){open.push(node);omap[k]=node;}else{ex.g=gg;ex.f=node.f;}}});}
  return[];}
function genWorld(){var ground=[],col=[];
  for(var y=0;y<H;y++){ground[y]=[];col[y]=[];for(var x=0;x<W;x++){var t="dirt";if(x<9)t="water";else if(x<12)t="sand";else if(x>=16&&x<=33&&y>=10&&y<=24)t="cobble";else if(x>=12&&x<=16&&y>=8&&y<=26)t="wood";else if(y>28)t="sand";else if(x>36||y<8)t="grass";ground[y][x]=t;col[y][x]=t==="water"?1:0;}}
  function br(x0,y0,w,h){for(var y=y0;y<y0+h;y++)for(var x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<W&&y<H)col[y][x]=1;}
  br(28,6,3,3);br(34,16,3,2);[[14,12],[15,20],[18,14],[24,12],[26,21],[19,22],[31,19],[13,24],[21,11]].forEach(function(p){col[p[1]][p[0]]=1;});
  return {ground:ground,col:col,act:[
    {id:"ship",type:"ship",x:13,y:17,l:"Трап корабля"},
    {id:"stall",type:"stall",x:20,y:17,l:"Ваша палатка"},
    {id:"home",type:"door",x:29,y:12,l:"Дом"},
    {id:"tavern",type:"tavern",x:35,y:19,l:"Таверна"}
  ]};}
function genHome(){var col=[];for(var y=0;y<HH;y++){col[y]=[];for(var x=0;x<HW;x++)col[y][x]=(x===0||y===0||x===HW-1||y===HH-1)?1:0;}col[8][4]=1;col[4][10]=1;col[HH-1][8]=0;return col;}
function tex(sc){var g=sc.make.graphics({x:0,y:0,add:false});
  function tile(k,fn,w,h){g.clear();fn(g);g.generateTexture(k,w||16,h||16);}
  function sol(k,c,d){tile(k,function(gr){gr.fillStyle(c);gr.fillRect(0,0,16,16);(d||[]).forEach(function(q){gr.fillStyle(q[0]);gr.fillRect(q[1],q[2],q[3],2);});});}
  sol("t-water",0x1d4e6e,[[0x2a6a8a,1,4,6],[0x2a6a8a,8,10,6]]);sol("t-water2",0x1a4866,[[0x3482a4,4,2,7]]);
  sol("t-sand",0xc9b07a,[[0xb89a62,3,5,2]]);sol("t-dirt",0x6b4a2b,[[0x7a5634,2,3,3]]);sol("t-grass",0x3d6b32,[[0x4e8640,2,4,1]]);sol("t-wood",0x8a5a2b,[[0x6e4520,0,4,16]]);sol("t-block",0x3a2a1c);
  tile("t-cobble",function(gr){gr.fillStyle(0x7a7468);gr.fillRect(0,0,16,16);gr.fillStyle(0x5c574e);gr.fillRect(0,0,7,7);gr.fillRect(8,8,8,8);gr.fillStyle(0x9a9488);gr.fillRect(8,0,8,7);gr.fillRect(0,8,7,8);});
  tile("spr-barrel",function(gr){gr.fillStyle(0x6b3e16);gr.fillRect(4,3,8,12);gr.fillStyle(0x8a5420);gr.fillRect(5,4,6,10);gr.fillStyle(0x2a1a0c);gr.fillRect(4,7,8,2);});
  function person(k,sh,hair){g.clear();g.fillStyle(0xe6c8a0);g.fillRect(5,4,6,6);g.fillStyle(hair);g.fillRect(5,2,6,3);g.fillStyle(0x2a1a10);g.fillRect(6,6,1,1);g.fillRect(9,6,1,1);g.fillStyle(sh);g.fillRect(4,10,8,7);g.fillStyle(0x3a3a6a);g.fillRect(5,17,3,5);g.fillRect(8,17,3,5);g.fillStyle(0x2a2010);g.fillRect(5,22,3,2);g.fillRect(8,22,3,2);g.generateTexture(k,16,24);}
  person("player",0xc45a3a,0x3a2414);person("npc-a",0x3a6ea5,0x5a3a18);person("npc-b",0x6b3a7a,0x1a1a1a);person("npc-c",0x3d6b32,0x8a6a30);
  tile("spr-house",function(gr){gr.fillStyle(0x8a4a28);gr.fillRect(6,20,36,22);gr.fillStyle(0x7a2a18);gr.fillTriangle(6,20,24,8,42,20);gr.fillStyle(0x2a1a10);gr.fillRect(20,30,8,14);gr.fillStyle(0xffe08a);gr.fillRect(10,26,6,6);gr.fillRect(32,26,6,6);},48,48);
  tile("spr-tent",function(gr){gr.fillStyle(0xb83a24);gr.fillTriangle(6,28,16,10,26,28);gr.fillStyle(0x3a1a10);gr.fillRect(13,20,6,8);},32,32);
  tile("spr-ship",function(gr){gr.fillStyle(0x5a3a1c);gr.fillRect(6,26,50,12);gr.fillStyle(0xd8d0c0);gr.fillRect(28,4,3,22);gr.fillTriangle(31,6,48,20,31,20);},64,48);
  tile("spr-tavern",function(gr){gr.fillStyle(0x5a3a22);gr.fillRect(2,14,44,24);gr.fillStyle(0x3a2010);gr.fillRect(0,10,48,6);gr.fillStyle(0x2a1a10);gr.fillRect(20,24,8,14);gr.fillStyle(0xffc85a);gr.fillRect(8,20,6,6);},48,40);
  tile("marker",function(gr){gr.lineStyle(1,0xffe08a,1);gr.strokeRect(2,2,12,12);gr.fillStyle(0xffe08a,.35);gr.fillRect(4,4,8,8);});
  g.destroy();}
