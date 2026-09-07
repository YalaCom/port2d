W=70;H=50;
function genWorld(){
  var ground=[],col=[],y,x,t;
  for(y=0;y<H;y++){ground[y]=[];col[y]=[];
    for(x=0;x<W;x++){
      t="grass";
      if(x<12)t="water";
      else if(x===12)t="sand";
      else if(x<15)t="sand";
      else if(y>=40&&x<42)t="sand";
      else if(x>=15&&x<=18&&y>=10&&y<=32)t="wood";
      else if(x>=19&&x<=40&&y>=13&&y<=27)t="cobble";
      ground[y][x]=t;col[y][x]=t==="water"?1:0;
    }
  }
  function fill(x0,y0,x1,y1,tt){for(y=y0;y<=y1;y++)for(x=x0;x<=x1;x++)if(y>=0&&x>=0&&y<H&&x<W&&ground[y][x]!=="water")ground[y][x]=tt;}
  function road(x0,y0,x1,y1){fill(x0,y0,x1,y1,"cobble");}
  road(15,17,19,19);
  road(20,11,30,12);
  road(29,8,31,13);
  road(34,18,46,20);
  road(24,27,26,40);
  road(40,14,48,16);
  road(46,16,48,28);
  function br(x0,y0,w,h){for(y=y0;y<y0+h;y++)for(x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<W&&y<H)col[y][x]=1;}
  br(28,6,4,4);br(34,16,4,3);br(41,12,3,3);br(46,22,3,3);br(52,18,3,3);br(58,14,3,3);
  [[14,12],[15,20],[18,14],[24,12],[26,21],[19,22],[31,19],[13,24],[21,11],[17,26],[22,25]].forEach(function(p){if(col[p[1]])col[p[1]][p[0]]=1;});
  return {ground:ground,col:col,act:[
    {id:"ship",type:"ship",x:16,y:18,l:"Трап корабля"},
    {id:"stall",type:"stall",x:20,y:17,l:"Ваша палатка"},
    {id:"home",type:"door",x:29,y:12,l:"Дом"},
    {id:"tavern",type:"tavern",x:35,y:19,l:"Таверна"}
  ]};
}
var _texLife=typeof tex==="function"?tex:null;
tex=function(sc){
  if(_texLife)_texLife(sc);
  var g=sc.make.graphics({x:0,y:0,add:false});
  g.clear();g.fillStyle(0xb8a078);g.fillRect(0,0,16,16);g.fillStyle(0x8a6a40);g.fillRect(0,7,16,2);g.fillStyle(0xd4c09a);g.fillRect(3,3,2,1);if(sc.textures.exists("t-path"))sc.textures.remove("t-path");g.generateTexture("t-path",16,16);
  g.destroy();
};
function decorateTown(sc){
  if(!sc||sc._lived)return;sc._lived=1;
  function has(k){return sc.textures&&sc.textures.exists(k);}
  function put(k,x,y,ox,oy){if(!has(k)||y<0||x<0)return null;return sc.add.image(x*T+8,y*T+8,k).setOrigin(ox||.5,oy||.85).setDepth(y*T);}
  function block(x,y){if(sc.grid[y])sc.grid[y][x]=1;}
  var trees=[[22,4],[25,3],[28,3],[32,4],[36,5],[40,6],[44,8],[48,7],[52,9],[56,8],[60,10],[63,16],[64,22],[62,28],[58,32],[54,36],[50,38],[46,40],[42,42],[38,44],[34,45],[30,44],[26,42],[20,38],[18,34],[21,8],[27,7],[33,8],[39,10],[45,12],[51,14],[57,18],[61,24],[55,26],[49,30],[43,34],[37,36],[31,38],[23,32],[14,8],[12,6],[47,24],[53,22],[59,20],[24,2],[30,2],[35,3],[41,4]];
  trees.forEach(function(p,i){put(i%2?"spr-tree1":"spr-tree0",p[0],p[1],.5,.9);block(p[0],p[1]);});
  var bushes=[[17,9],[19,11],[23,10],[26,9],[30,10],[34,12],[38,13],[42,17],[44,21],[48,19],[50,23],[54,21],[16,23],[18,27],[22,29],[28,29],[32,28],[36,30],[40,32],[14,28],[27,24],[33,23],[37,22]];
  bushes.forEach(function(p){put("spr-bush",p[0],p[1]);});
  var flowers=[[18,13],[21,12],[23,14],[26,15],[28,13],[31,15],[33,16],[22,22],[25,24],[29,23],[32,25],[35,24],[38,21],[19,24],[27,18],[30,20]];
  flowers.forEach(function(p){put("spr-flower",p[0],p[1],.5,.7);});
  for(var fx=27;fx<=33;fx++)put("spr-fenceh",fx,6,.5,.6);
  for(fx=41;fx<=45;fx++)put("spr-fenceh",fx,11,.5,.6);
  [[16,15],[19,16],[27,14],[32,16],[34,21],[39,19],[43,16],[47,18],[24,20],[29,26]].forEach(function(p){put("spr-lamp",p[0],p[1],.5,.95);});
  put("spr-well",24,18);put("spr-sign",22,15);put("spr-bench",32,18);put("spr-bench",38,20);put("spr-bench",25,22);
  put("spr-hut",42,13,.5,.88);block(42,13);block(42,12);
  put("spr-house",48,15,.5,.82);block(48,14);block(47,14);block(49,14);
  put("spr-hut",54,19,.5,.88);block(54,19);
  put("spr-house",58,13,.5,.82);block(58,13);block(57,13);
  put("spr-tavern",47,24,.45,.82);block(47,24);block(46,24);
  put("spr-hut",62,20,.5,.88);block(62,20);
  put("spr-crate",19,13);put("spr-crate",21,21);put("spr-crate",23,19);put("spr-crate",37,17);
  put("spr-fishbox",15,18);put("spr-fishbox",14,21);
  put("spr-barrel",17,22);put("spr-barrel",18,16);
  if(has("spr-cat")){sc.cat=sc.add.image(23*T+8,20*T+8,"spr-cat").setOrigin(.5,.8).setDepth(20*T);sc.cat.baseX=23*T+8;}
  sc.gulls=[];
  if(has("spr-gull")){
    for(var i=0;i<6;i++){
      var gu=sc.add.image(10+i*70,24+i*14,"spr-gull").setDepth(800).setAlpha(.95);
      gu.vx=16+i*5;sc.gulls.push(gu);
    }
  }
  sc.smokes=[];
  if(has("spr-smoke")){
    [[29,6],[36,15],[48,13],[58,11],[47,22]].forEach(function(p){
      var sm=sc.add.image(p[0]*T+8,p[1]*T,"spr-smoke").setDepth(p[1]*T+50).setAlpha(.5);
      sm.bx=p[0]*T+8;sm.by=p[1]*T;sc.smokes.push(sm);
    });
  }
  var extra=[[16,21,"npc-d"],[28,17,"npc-a"],[33,22,"npc-b"],[19,17,"npc-c"],[38,19,"npc-d"],[44,18,"npc-a"],[25,19,"npc-b"],[50,20,"npc-c"]];
  extra.forEach(function(n){
    if(!has(n[2]))return;
    var s=sc.add.sprite(n[0]*T+8,n[1]*T+8,n[2]).setOrigin(.5,.8);
    s.homeX=n[0];s.homeY=n[1];s.wait=200+Math.random()*800;
    if(!sc.npcs)sc.npcs=[];sc.npcs.push(s);
  });
  if(sc.npcs)sc.npcs.forEach(function(n,i){n.homeX=n.homeX||Math.floor(n.x/T);n.homeY=n.homeY||Math.floor(n.y/T);n.wait=80*i;});
  sc.wf=0;sc.waterImgs=[];
  sc.children.list.forEach(function(im){
    if(im.texture&&(im.texture.key==="t-water"||im.texture.key==="t-water2"))sc.waterImgs.push(im);
  });
  if(sc.cameras&&sc.cameras.main)sc.cameras.main.setBounds(0,0,W*T,H*T);
}
function animateTown(sc,t,dt){
  if(!sc||!sc._lived)return;
  sc.wf=(sc.wf||0)+dt;
  if(sc.wf>420&&sc.waterImgs){
    sc.wf=0;var on=Math.floor(t/420)%2;
    sc.waterImgs.forEach(function(im){im.setTexture(on?"t-water2":"t-water");});
  }
  if(sc.gulls)sc.gulls.forEach(function(g){
    g.x+=g.vx*dt/1000;g.y+=Math.sin(t/400+g.x)*0.16;
    if(g.x>W*T+20){g.x=-20;g.y=16+Math.random()*90;}
  });
  if(sc.smokes)sc.smokes.forEach(function(s,i){
    var k=(t/900+i)%1;s.y=s.by-k*18;s.x=s.bx+Math.sin(t/500+i)*3;s.setAlpha(.45*(1-k));
  });
  if(sc.cat){sc.cat.x=sc.cat.baseX+Math.sin(t/900)*12;sc.cat.setFlipX(Math.cos(t/900)<0);sc.cat.setDepth(sc.cat.y);}
  if(sc.npcs&&sc.grid){
    sc.npcs.forEach(function(n){
      n.wait=(n.wait||0)-dt;
      if(n.wait<=0){
        n.wait=500+Math.random()*1200;
        var dirs=[[1,0],[-1,0],[0,1],[0,-1]];
        var d=dirs[(Math.random()*4)|0];
        var tx=Math.floor(n.x/T)+d[0],ty=Math.floor(n.y/T)+d[1];
        if(ty>=0&&ty<H&&tx>=0&&tx<W&&sc.grid[ty][tx]===0&&Math.abs(tx-(n.homeX||tx))<5&&Math.abs(ty-(n.homeY||ty))<5){
          n.tx=tx*T+8;n.ty=ty*T+8;
        }
      }
      if(n.tx!=null){
        var dx=n.tx-n.x,dy=n.ty-n.y,dist=Math.hypot(dx,dy),step=30*dt/1000;
        if(dist<=step){n.x=n.tx;n.y=n.ty;n.tx=null;}
        else{n.x+=dx/dist*step;n.y+=dy/dist*step;n.setFlipX(dx<0);}
      }
      n.setDepth(n.y);
    });
  }
  if(sc.player)sc.player.setDepth(sc.player.y);
}
if(typeof World!=="undefined"){
  var _wc=World.prototype.create,_wu=World.prototype.update;
  World.prototype.create=function(){_wc.call(this);try{decorateTown(this);}catch(e){}};
  World.prototype.update=function(t,dt){_wu.call(this,t,dt);try{animateTown(this,t,dt);}catch(e){}};
}
