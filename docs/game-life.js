W=88;H=60;Z=typeof fitZoom==="function"?fitZoom():1;
function genWorld(){
  var ground=[],col=[],y,x,t;
  for(y=0;y<H;y++){ground[y]=[];col[y]=[];
    for(x=0;x<W;x++){
      t="grass";
      if(x<14)t="water";
      else if(x===14)t="shore";
      else if(x<18)t="sand";
      else if(y>=50&&x<48)t="sand";
      else if(y>=52)t="sand";
      else if(x>=70||y<=3||y>=55)t="darkg";
      ground[y][x]=t;col[y][x]=(t==="water")?1:0;
    }
  }
  function set(x,y,tt){if(y>=0&&x>=0&&y<H&&x<W&&ground[y][x]!=="water")ground[y][x]=tt;}
  function fill(x0,y0,x1,y1,tt){for(y=y0;y<=y1;y++)for(x=x0;x<=x1;x++)set(x,y,tt);}
  function br(x0,y0,w,h){for(y=y0;y<y0+h;y++)for(x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<W&&y<H)col[y][x]=1;}
  fill(16,16,22,34,"wood");fill(16,20,26,24,"wood");fill(14,21,16,23,"wood");
  fill(26,14,48,30,"cobble");fill(22,20,26,24,"cobble");
  fill(30,8,36,14,"path");fill(44,16,62,22,"path");fill(58,22,62,36,"path");
  fill(34,30,36,48,"path");fill(20,36,36,38,"path");fill(46,28,48,40,"path");fill(48,38,70,40,"path");
  fill(26,12,44,14,"path");fill(22,24,48,26,"path");fill(36,16,40,32,"path");
  fill(20,40,34,46,"farm");fill(38,42,52,50,"farm");fill(64,24,78,34,"darkg");fill(70,8,86,20,"darkg");fill(16,6,28,12,"path");
  for(y=0;y<H;y++)for(x=0;x<W;x++){
    if(ground[y][x]!=="grass")continue;
    var n=0,dx,dy;
    for(dy=-1;dy<=1;dy++)for(dx=-1;dx<=1;dx++){
      var nx=x+dx,ny=y+dy;
      if(ny>=0&&nx>=0&&ny<H&&nx<W&&(ground[ny][nx]==="cobble"||ground[ny][nx]==="path"))n++;
    }
    if(n>=3)ground[y][x]="path";
  }
  br(31,8,4,4);br(43,16,5,5);br(56,10,4,4);br(64,16,4,4);br(52,24,4,4);br(60,28,4,4);br(70,18,3,3);
  [[17,18],[18,22],[19,16],[21,19],[16,26],[20,28]].forEach(function(p){if(col[p[1]])col[p[1]][p[0]]=1;});
  return {ground:ground,col:col,act:[
    {id:"ship",type:"ship",x:18,y:22,l:"Трап корабля"},
    {id:"stall",type:"stall",x:23,y:22,l:"Ваша палатка"},
    {id:"home",type:"door",x:32,y:12,l:"Дом"},
    {id:"tavern",type:"tavern",x:45,y:21,l:"Таверна"}
  ]};
}
var _texLife=typeof tex==="function"?tex:null;
tex=function(sc){if(_texLife)_texLife(sc);};
function decorateTown(sc){
  if(!sc||sc._lived)return;sc._lived=1;
  function has(k){return sc.textures&&sc.textures.exists(k);}
  function put(k,x,y,ox,oy,d){
    if(!has(k)||y<0||x<0||y>=H||x>=W)return null;
    var im=sc.add.image(x*T+8,y*T+8,k).setOrigin(ox==null?.5:ox,oy==null?.88:oy);
    im.setDepth(d!=null?d:y*T+8);return im;
  }
  function block(x,y){if(sc.grid[y])sc.grid[y][x]=1;}
  function blockFoot(x,y,w,h){for(var j=0;j<h;j++)for(var i=0;i<w;i++)block(x+i,y+j);}
  var kill={"spr-house":1,"spr-house2":1,"spr-tavern":1,"spr-tent":1,"spr-ship":1,"spr-hut":1,"spr-shop":1,"spr-ware":1,"spr-light":1};
  sc.children.list.slice().forEach(function(im){
    if(!im||!im.active)return;
    if(im.type==="Text"||im.type==="text"){im.destroy();return;}
    var k=im.texture&&im.texture.key;if(k&&kill[k])im.destroy();
  });
  sc.children.list.forEach(function(im){
    if(!im.texture)return;
    var k=im.texture.key,tx=(im.x/T)|0,ty=(im.y/T)|0,v=(tx*13+ty*7)&3;
    if(k==="t-grass"){var nk="t-grass"+v;if(has(nk))im.setTexture(nk);}
    else if(k==="t-cobble"&&has("t-cobble2")&&((tx+ty)&1))im.setTexture("t-cobble2");
    else if(k==="t-wood"&&has("t-wood2")&&((tx+ty)&1))im.setTexture("t-wood2");
    else if(k==="t-sand"&&has("t-sand2")&&((tx+ty)&1))im.setTexture("t-sand2");
  });
  [[22,3],[28,2],[35,2],[42,2],[50,2],[58,2],[66,3],[74,4],[82,6],[20,5],[40,5],[56,6],[72,8],[80,14],[84,24],[80,36],[76,48],[66,52],[54,55],[42,56],[30,54],[20,50],[86,18],[86,34],[70,46]].forEach(function(p,i){
    put(i%5===0?"spr-tree2":(i%2?"spr-tree1":"spr-tree0"),p[0],p[1],.5,.92);block(p[0],p[1]);
  });
  [[17,10],[23,10],[29,10],[41,16],[53,18],[18,30],[28,32],[40,34],[16,28]].forEach(function(p,i){put(i%2?"spr-bush2":"spr-bush",p[0],p[1],.5,.8);});
  [[19,15],[27,14],[33,18],[20,25]].forEach(function(p,i){put(["spr-flower","spr-flower2","spr-flower3"][i%3],p[0],p[1],.5,.7);});
  for(var fx=20;fx<=32;fx++)put("spr-fenceh",fx,40,.5,.6);
  for(var fy=41;fy<=46;fy++){put("spr-fencev",20,fy,.5,.7);put("spr-fencev",32,fy,.5,.7);}
  put("spr-lamp",28,22,.5,.95);put("spr-lamp",40,20,.5,.95);put("spr-lamp",22,18,.5,.95);
  put("spr-well",38,22);put("spr-bench",34,21);put("spr-bench",40,24);put("spr-cart",26,18,.5,.8);
  put("spr-ship",17,20,.45,.72);put("spr-tent",23,21,.5,.82);
  put("spr-house",32,10,.5,.86);blockFoot(31,8,3,3);
  put("spr-tavern",45,18,.5,.86);blockFoot(43,17,5,4);
  put("spr-house2",56,11,.5,.86);blockFoot(55,10,3,2);
  put("spr-hut",64,17,.5,.88);blockFoot(63,16,3,2);
  put("spr-shop",52,25,.5,.86);blockFoot(51,24,3,2);
  put("spr-ware",60,29,.5,.84);blockFoot(59,28,3,2);
  put("spr-light",16,8,.5,.95);block(16,8);
  put("spr-crate",19,16);put("spr-crate",21,21);put("spr-fishbox",16,20);put("spr-barrel",18,18);put("spr-barrel",19,25);
  if(has("spr-cat")){sc.cat=sc.add.image(27*T+8,21*T+8,"spr-cat").setOrigin(.5,.8).setDepth(21*T);sc.cat.baseX=27*T+8;}
  sc.chicks=[];
  if(has("spr-chicken"))[[22,42],[24,43],[26,42]].forEach(function(p){var c=sc.add.image(p[0]*T+8,p[1]*T+8,"spr-chicken").setOrigin(.5,.8).setDepth(p[1]*T);c.wait=200;sc.chicks.push(c);});
  sc.gulls=[];
  if(has("spr-gull"))for(var i=0;i<6;i++){var gu=sc.add.image(8+i*90,18+i*11,"spr-gull").setDepth(900).setAlpha(.9);gu.vx=14+i*4;sc.gulls.push(gu);}
  sc.smokes=[];
  if(has("spr-smoke"))[[32,7],[45,15],[56,9]].forEach(function(p){var sm=sc.add.image(p[0]*T+8,p[1]*T,"spr-smoke").setDepth(p[1]*T+60).setAlpha(.45);sm.bx=p[0]*T+8;sm.by=p[1]*T;sc.smokes.push(sm);});
  if(!sc.npcs)sc.npcs=[];
  [[18,23,"npc-d"],[28,18,"npc-a"],[34,23,"npc-b"],[40,20,"npc-d"],[30,21,"npc-b"],[22,23,"npc-e"]].forEach(function(n){
    if(!has(n[2]))return;
    var s=sc.add.sprite(n[0]*T+8,n[1]*T+8,n[2]).setOrigin(.5,.8);s.homeX=n[0];s.homeY=n[1];s.wait=200;sc.npcs.push(s);
  });
  sc.wf=0;sc.waterImgs=[];
  sc.children.list.forEach(function(im){if(im.texture&&String(im.texture.key).indexOf("t-water")===0)sc.waterImgs.push(im);});
  if(sc.cameras&&sc.cameras.main){sc.cameras.main.setBounds(0,0,W*T,H*T);Z=typeof fitZoom==="function"?fitZoom():1;if(sc.cameras.main.setZoom)sc.cameras.main.setZoom(Z);}
  if(sc.tint&&sc.tint.setSize)sc.tint.setPosition(W*T/2,H*T/2).setSize(W*T,H*T);
}
function animateTown(sc,t,dt){
  if(!sc||!sc._lived)return;
  sc.wf=(sc.wf||0)+dt;
  if(sc.wf>380&&sc.waterImgs){sc.wf=0;var fr=Math.floor(t/380)%3,keys=["t-water","t-water2","t-water3"];sc.waterImgs.forEach(function(im,i){var k=keys[(fr+i)%3];if(sc.textures.exists(k))im.setTexture(k);});}
  if(sc.gulls)sc.gulls.forEach(function(g){g.x+=g.vx*dt/1000;g.y+=Math.sin(t/380+g.x*0.02)*0.18;if(g.x>W*T+24){g.x=-24;g.y=12+Math.random()*110;}});
  if(sc.smokes)sc.smokes.forEach(function(s,i){var k=(t/900+i)%1;s.y=s.by-k*20;s.x=s.bx+Math.sin(t/480+i)*3;s.setAlpha(.45*(1-k));});
  if(sc.cat){sc.cat.x=sc.cat.baseX+Math.sin(t/900)*14;sc.cat.setFlipX(Math.cos(t/900)<0);sc.cat.setDepth(sc.cat.y);}
  if(sc.chicks)sc.chicks.forEach(function(c){c.wait=(c.wait||0)-dt;if(c.wait<=0){c.wait=400+Math.random()*800;var tx=Math.floor(c.x/T)+(((Math.random()*3)|0)-1),ty=Math.floor(c.y/T)+(((Math.random()*3)|0)-1);if(ty>=40&&ty<=47&&tx>=20&&tx<=32&&sc.grid[ty]&&sc.grid[ty][tx]===0){c.tx=tx*T+8;c.ty=ty*T+8;}}if(c.tx!=null){var ddx=c.tx-c.x,ddy=c.ty-c.y,dist=Math.hypot(ddx,ddy),step=22*dt/1000;if(dist<=step){c.x=c.tx;c.y=c.ty;c.tx=null;}else{c.x+=ddx/dist*step;c.y+=ddy/dist*step;}}c.setDepth(c.y);});
  if(sc.npcs&&sc.grid)sc.npcs.forEach(function(n){n.wait=(n.wait||0)-dt;if(n.wait<=0){n.wait=420+Math.random()*1100;var dirs=[[1,0],[-1,0],[0,1],[0,-1]],d=dirs[(Math.random()*4)|0],tx=Math.floor(n.x/T)+d[0],ty=Math.floor(n.y/T)+d[1];if(ty>=0&&ty<H&&tx>=0&&tx<W&&sc.grid[ty][tx]===0&&Math.abs(tx-(n.homeX||tx))<6&&Math.abs(ty-(n.homeY||ty))<6){n.tx=tx*T+8;n.ty=ty*T+8;}}if(n.tx!=null){var dx=n.tx-n.x,dy=n.ty-n.y,dist=Math.hypot(dx,dy),step=28*dt/1000;if(dist<=step){n.x=n.tx;n.y=n.ty;n.tx=null;}else{n.x+=dx/dist*step;n.y+=dy/dist*step;n.setFlipX(dx<0);}}n.setDepth(n.y);});
  if(sc.player)sc.player.setDepth(sc.player.y);
}
if(typeof World!=="undefined"){
  var _wc=World.prototype.create,_wu=World.prototype.update;
  World.prototype.create=function(){_wc.call(this);try{decorateTown(this);}catch(e){}};
  World.prototype.update=function(t,dt){_wu.call(this,t,dt);try{animateTown(this,t,dt);}catch(e){}};
}
function parseBid(s){var m=String(s||"").replace(",",".").match(/(\d+)/);return m?Number(m[1]):NaN;}
function hag(i){
  var o=S.ship.off[i],item=it(o.lot.id),askP=o.ask,pat=4,deal=null,done=false;
  var min=Math.max(1,Math.round(o.ask*(.76+S.ship.pride*.1)));
  var cap=S.ship.cap,mood=S.ship.mood,nm=item.name,cat=item.cat;
  var open={"скупой":"Сразу говорю: торговаться со мной — себе дороже.","весёлый":"Ха! Любишь поспорить о цене? Давай, удиви.","молчаливый":"Цена на ящике. Дальше — словами.","пьяный":"Хик... ну давай, сколько дашь."}[mood]||"Ну давайте, сколько дашь.";
  function bubble(who,t){return '<div class="bub '+who+'"><b>'+(who==="npc"?cap:"Вы")+'<\/b><div>'+t+"<\/div><\/div>";}
  function insult(bid){
    if(cat==="fish")return "За "+bid+" не отдам. Я за эту рыбу не спал всю ночь.";
    if(cat==="rare")return "За "+bid+"? Это не базарная пыль.";
    if(cat==="spice")return "С южных складов везли, не за "+bid+".";
    if(cat==="drink")return "Ром сам себя не настоит. За "+bid+" даже не пахнет.";
    return "За "+bid+" даже боцман не отдаст.";
  }
  function yes(bid){
    if(mood==="весёлый")return "Ладно, давай за "+bid+". Бери, пока доброе.";
    if(mood==="скупой")return "Тьфу. Ладно, за "+bid+". И чтоб больше не торговался.";
    if(mood==="пьяный")return "Хик... за "+bid+" так за "+bid+". Забирай.";
    return "Хм. За "+bid+" — твоё, пока не передумал.";
  }
  function mid(bid,next){
    if(cat==="fish")return "Нет, за "+bid+" не отдам. Могу за "+next+", сети сам рвал.";
    if(cat==="drink")return "Не. Ром стоит "+next+", не меньше.";
    return "За "+bid+" не возьму. Последнее слово — "+next+".";
  }
  function view(){
    var takeLab=deal!=null?("Купить за "+deal):("Их цена "+askP);
    modal('<h2>Торг · '+nm+'<\/h2><p>'+cap+' хочет <b>'+askP+'<\/b> /шт · попыток: <b>'+pat+'<\/b><\/p><div class="chat" id="chat"><\/div><div class="row"><input class="px" id="bid" type="text" inputmode="numeric" placeholder="за 4" value="'+(deal||Math.max(1,Math.round(askP*.85)))+'"><button class="px" id="off"'+(done||deal!=null||pat<=0?" disabled":"")+'>Сказать<\/button><button class="px" id="take">'+takeLab+'<\/button><\/div><button class="px ghost" data-close>Уйти<\/button>');
    var ch=root.querySelector("#chat");ch.innerHTML=view.log||"";ch.scrollTop=ch.scrollHeight;
    var inp=root.querySelector("#bid");if(inp){inp.focus();inp.select();}
    root.querySelector("#take").onclick=function(){buy(i,deal!=null?deal:askP);};
    function say(){
      if(done||deal!=null||pat<=0)return;
      var bid=parseBid(root.querySelector("#bid").value);if(!isFinite(bid)||bid<=0)return;
      view.log+=bubble("me","Беру за "+bid+".");
      var ans="",ok=false;
      if(bid>=askP){ans="Так бы сразу. За "+askP+" твоё.";ok=true;deal=askP;}
      else if(bid<Math.round(min*.72)){ans=insult(bid);pat--;}
      else if(bid>=min&&Math.random()<0.5+(bid-min)/Math.max(1,askP-min)*0.45){ans=yes(bid);ok=true;deal=bid;}
      else{askP=Math.max(min,Math.round(askP-(askP-bid)*(.2+Math.random()*.14)));ans=mid(bid,askP);pat--;}
      view.log+=bubble("npc",ans);
      if(pat<=0&&!ok){view.log+=bubble("npc","Всё. Разговор кончен.");S.today.fail++;done=true;}
      view();
    }
    root.querySelector("#off").onclick=say;
    root.querySelector("#bid").onkeydown=function(ev){if(ev.key==="Enter")say();};
  }
  view.log=bubble("npc",open+" За "+nm+" прошу "+askP+".");
  view();
}
