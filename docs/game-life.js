W=88;H=60;Z=2.5;
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
      else if(x>=68||y<=4||y>=54)t="darkg";
      ground[y][x]=t;col[y][x]=(t==="water")?1:0;
    }
  }
  function set(x,y,tt){if(y>=0&&x>=0&&y<H&&x<W&&ground[y][x]!=="water")ground[y][x]=tt;}
  function fill(x0,y0,x1,y1,tt){for(y=y0;y<=y1;y++)for(x=x0;x<=x1;x++)set(x,y,tt);}
  function br(x0,y0,w,h){for(y=y0;y<y0+h;y++)for(x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<W&&y<H)col[y][x]=1;}
  fill(16,16,22,34,"wood");
  fill(16,20,26,24,"wood");
  fill(14,21,16,23,"wood");
  fill(24,14,46,30,"cobble");
  fill(22,20,24,24,"cobble");
  fill(30,8,34,14,"cobble");
  fill(32,6,34,8,"cobble");
  fill(44,18,62,22,"cobble");
  fill(58,22,62,36,"cobble");
  fill(34,30,36,48,"cobble");
  fill(20,36,36,38,"cobble");
  fill(46,28,48,40,"cobble");
  fill(48,38,70,40,"cobble");
  fill(26,10,44,13,"side");
  fill(23,13,26,16,"side");
  fill(22,24,48,26,"side");
  fill(36,16,38,32,"side");
  fill(50,16,58,18,"path");
  fill(62,20,70,22,"path");
  fill(40,32,46,36,"path");
  fill(20,40,34,46,"farm");
  fill(38,42,52,50,"farm");
  fill(64,24,78,34,"darkg");
  fill(70,8,86,20,"darkg");
  fill(16,6,28,12,"path");
  for(y=0;y<H;y++)for(x=0;x<W;x++){
    if(ground[y][x]!=="grass")continue;
    var n=0,dx,dy;
    for(dy=-1;dy<=1;dy++)for(dx=-1;dx<=1;dx++){
      var nx=x+dx,ny=y+dy;
      if(ny>=0&&nx>=0&&ny<H&&nx<W&&(ground[ny][nx]==="cobble"||ground[ny][nx]==="side"))n++;
    }
    if(n>=2)ground[y][x]="path";
  }
  br(28,6,5,5);br(34,16,5,4);br(41,12,4,4);br(48,14,5,5);
  br(54,10,4,4);br(60,16,4,4);br(66,12,4,4);br(52,24,4,4);
  br(46,22,4,4);br(58,28,4,4);br(70,18,3,3);br(24,8,3,3);
  [[17,18],[18,22],[19,16],[21,19],[22,23],[23,17],[25,21],[16,26],[20,28],[27,19],[31,21],[38,20]].forEach(function(p){if(col[p[1]])col[p[1]][p[0]]=1;});
  return {ground:ground,col:col,act:[
    {id:"ship",type:"ship",x:18,y:22,l:"Трап корабля"},
    {id:"stall",type:"stall",x:24,y:22,l:"Ваша палатка"},
    {id:"home",type:"door",x:30,y:12,l:"Дом"},
    {id:"tavern",type:"tavern",x:36,y:20,l:"Таверна"}
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
    im.setDepth(d!=null?d:y*T+8);
    return im;
  }
  function block(x,y){if(sc.grid[y])sc.grid[y][x]=1;}
  function blockFoot(x,y,w,h){for(var j=0;j<h;j++)for(var i=0;i<w;i++)block(x+i,y+j);}
  sc.children.list.forEach(function(im){
    if(!im.texture)return;
    var k=im.texture.key,tx=(im.x/T)|0,ty=(im.y/T)|0,v=(tx*13+ty*7)&3;
    if(k==="t-grass"){
      var nk="t-grass"+v;
      if(has(nk))im.setTexture(nk);
    }else if(k==="t-cobble"&&has("t-cobble2")&&((tx+ty)&1))im.setTexture("t-cobble2");
    else if(k==="t-wood"&&has("t-wood2")&&((tx+ty)&1))im.setTexture("t-wood2");
    else if(k==="t-sand"&&has("t-sand2")&&((tx+ty)&1))im.setTexture("t-sand2");
    else if(k==="t-water"||k==="t-water2"){
      if(has("t-water3")&&((tx*3+ty)&2)===2)im.setTexture("t-water3");
    }
  });
  var trees=[
    [22,3],[25,2],[28,2],[31,3],[35,2],[38,3],[42,2],[46,3],[50,2],[54,3],[58,2],[62,3],[66,4],[70,3],[74,5],[78,4],[82,6],
    [20,5],[24,6],[27,5],[40,5],[44,6],[48,5],[56,6],[64,7],[72,8],[80,9],
    [76,12],[80,14],[84,16],[82,20],[84,24],[80,28],[84,32],[78,36],[82,40],[76,44],[80,48],[72,50],[66,52],[60,54],[54,55],[48,54],[42,56],[36,55],[30,54],[24,52],[20,50],
    [86,10],[86,18],[86,26],[86,34],[86,42],[70,46],[64,48],[58,50],[50,52],
    [21,8],[26,7],[33,5],[39,7],[45,8],[51,7],[57,9],[63,11],[69,14],[73,18],
    [16,8],[15,6],[17,4],[19,3],[23,9],[29,8]
  ];
  trees.forEach(function(p,i){
    var k=i%5===0?"spr-tree2":(i%2?"spr-tree1":"spr-tree0");
    put(k,p[0],p[1],.5,.92);
    block(p[0],p[1]);
  });
  var bushes=[
    [17,10],[19,12],[21,11],[23,10],[26,11],[29,10],[32,11],[35,13],[38,12],[41,16],
    [44,15],[47,17],[50,16],[53,18],[56,17],[59,19],[62,18],[18,30],[20,32],[22,34],
    [25,33],[28,32],[31,34],[34,33],[37,35],[40,34],[43,36],[16,28],[27,26],[33,25],
    [39,24],[45,23],[49,26],[55,22],[61,24],[67,22],[19,14],[30,28],[36,29],[42,31]
  ];
  bushes.forEach(function(p,i){put(i%2?"spr-bush2":"spr-bush",p[0],p[1],.5,.8);});
  var fl=[[19,15],[21,14],[23,16],[25,15],[27,14],[29,16],[31,15],[22,18],[26,19],[28,21],[32,20],[34,22],[38,21],[20,25],[24,27],[30,26],[18,13],[33,18],[37,17],[41,19],[27,23],[35,27]];
  fl.forEach(function(p,i){put(["spr-flower","spr-flower2","spr-flower3"][i%3],p[0],p[1],.5,.7);});
  [[16,12],[18,36],[22,40],[28,44],[48,44],[56,42],[64,38],[12,16],[15,32],[70,30]].forEach(function(p){put("spr-weeds",p[0],p[1],.5,.8);});
  [[15,18],[16,32],[17,40],[19,48],[21,52],[25,54],[33,56],[14,26],[18,44]].forEach(function(p){put("spr-rock",p[0],p[1],.5,.8);});
  [[23,7],[37,8],[49,10],[65,16],[71,26],[43,40]].forEach(function(p){put("spr-stump",p[0],p[1]);});
  for(var fx=26;fx<=34;fx++)put("spr-fenceh",fx,6,.5,.6);
  for(fx=40;fx<=46;fx++)put("spr-fenceh",fx,11,.5,.6);
  for(fx=52;fx<=58;fx++)put("spr-fenceh",fx,9,.5,.6);
  for(fx=20;fx<=32;fx++)put("spr-fenceh",fx,40,.5,.6);
  for(fx=38;fx<=50;fx++)put("spr-fenceh",fx,42,.5,.6);
  for(var fy=7;fy<=10;fy++)put("spr-fencev",26,fy,.5,.7);
  for(fy=7;fy<=10;fy++)put("spr-fencev",34,fy,.5,.7);
  for(fy=41;fy<=46;fy++)put("spr-fencev",20,fy,.5,.7);
  for(fy=41;fy<=46;fy++)put("spr-fencev",32,fy,.5,.7);
  [[17,17],[20,19],[24,16],[28,15],[32,17],[36,22],[40,18],[44,17],[48,20],[52,19],[30,24],[34,28],[42,26],[26,22],[22,26],[58,21],[62,23]].forEach(function(p){put("spr-lamp",p[0],p[1],.5,.95);});
  put("spr-well",28,20);put("spr-sign",22,16);put("spr-sign",46,21);
  put("spr-bench",32,19);put("spr-bench",38,21);put("spr-bench",26,24);put("spr-bench",44,23);put("spr-bench",30,27);
  put("spr-cart",26,18,.5,.8);
  put("spr-tent",24,21,.5,.82);
  put("spr-house",30,10,.5,.84);blockFoot(29,8,3,3);
  put("spr-tavern",36,18,.5,.84);blockFoot(35,17,3,3);
  put("spr-house2",24,8,.5,.86);blockFoot(23,7,3,2);
  put("spr-hut",42,13,.5,.88);blockFoot(41,12,3,2);
  put("spr-house",48,15,.5,.84);blockFoot(47,13,3,3);
  put("spr-house2",54,11,.5,.84);blockFoot(53,10,3,2);
  put("spr-hut",60,17,.5,.88);blockFoot(59,16,3,2);
  put("spr-house",66,13,.5,.84);blockFoot(65,12,3,2);
  put("spr-shop",52,25,.5,.86);blockFoot(51,24,3,2);
  put("spr-tavern",46,23,.45,.84);blockFoot(45,22,3,2);
  put("spr-ware",58,29,.5,.84);blockFoot(57,28,3,2);
  put("spr-hut",70,19,.5,.88);block(70,19);
  put("spr-light",16,8,.5,.95);block(16,8);block(16,7);
  put("spr-hut",36,8,.5,.88);blockFoot(35,7,3,2);
  put("spr-crate",19,16);put("spr-crate",21,21);put("spr-crate",23,19);put("spr-crate",37,18);
  put("spr-crate",25,23);put("spr-crate",47,27);put("spr-crate",17,24);
  put("spr-fishbox",16,20);put("spr-fishbox",15,23);put("spr-fishbox",17,28);
  put("spr-barrel",18,18);put("spr-barrel",19,25);put("spr-barrel",22,17);put("spr-barrel",40,19);put("spr-barrel",29,22);
  if(has("spr-cat")){sc.cat=sc.add.image(27*T+8,21*T+8,"spr-cat").setOrigin(.5,.8).setDepth(21*T);sc.cat.baseX=27*T+8;}
  sc.chicks=[];
  if(has("spr-chicken")){
    [[22,42],[24,43],[26,42],[23,45]].forEach(function(p){
      var c=sc.add.image(p[0]*T+8,p[1]*T+8,"spr-chicken").setOrigin(.5,.8).setDepth(p[1]*T);
      c.hx=p[0];c.hy=p[1];c.wait=200+Math.random()*600;sc.chicks.push(c);
    });
  }
  sc.gulls=[];
  if(has("spr-gull")){
    for(var i=0;i<9;i++){
      var gu=sc.add.image(8+i*80,18+i*11,"spr-gull").setDepth(900).setAlpha(.95);
      gu.vx=14+i*4;sc.gulls.push(gu);
    }
  }
  sc.smokes=[];
  if(has("spr-smoke")){
    [[30,6],[36,15],[48,13],[54,9],[66,11],[46,21],[52,23]].forEach(function(p){
      var sm=sc.add.image(p[0]*T+8,p[1]*T,"spr-smoke").setDepth(p[1]*T+60).setAlpha(.5);
      sm.bx=p[0]*T+8;sm.by=p[1]*T;sc.smokes.push(sm);
    });
  }
  if(!sc.npcs)sc.npcs=[];
  var extra=[[18,23,"npc-d"],[28,18,"npc-a"],[34,23,"npc-b"],[24,21,"npc-c"],[40,20,"npc-d"],[46,19,"npc-a"],[30,21,"npc-b"],[52,21,"npc-c"],[38,26,"npc-e"],[44,24,"npc-a"],[22,23,"npc-e"],[60,22,"npc-b"],[33,16,"npc-c"],[48,30,"npc-d"]];
  extra.forEach(function(n){
    if(!has(n[2]))return;
    var s=sc.add.sprite(n[0]*T+8,n[1]*T+8,n[2]).setOrigin(.5,.8);
    s.homeX=n[0];s.homeY=n[1];s.wait=120+Math.random()*700;
    sc.npcs.push(s);
  });
  sc.npcs.forEach(function(n,i){n.homeX=n.homeX||Math.floor(n.x/T);n.homeY=n.homeY||Math.floor(n.y/T);n.wait=n.wait||80*i;});
  sc.wf=0;sc.waterImgs=[];
  sc.children.list.forEach(function(im){
    if(im.texture&&(im.texture.key==="t-water"||im.texture.key==="t-water2"||im.texture.key==="t-water3"))sc.waterImgs.push(im);
  });
  if(sc.cameras&&sc.cameras.main){
    sc.cameras.main.setBounds(0,0,W*T,H*T);
    if(sc.cameras.main.setZoom)sc.cameras.main.setZoom(Z);
  }
  if(sc.tint&&sc.tint.setSize)sc.tint.setPosition(W*T/2,H*T/2).setSize(W*T,H*T);
  if(sc.add&&sc.add.image){
    sc.add.image(17*T,20*T,"spr-ship").setOrigin(.45,.72).setDepth(18*T);
  }
}
function animateTown(sc,t,dt){
  if(!sc||!sc._lived)return;
  sc.wf=(sc.wf||0)+dt;
  if(sc.wf>380&&sc.waterImgs){
    sc.wf=0;
    var fr=Math.floor(t/380)%3;
    var keys=["t-water","t-water2","t-water3"];
    sc.waterImgs.forEach(function(im,i){
      var k=keys[(fr+i)%3];
      if(sc.textures.exists(k))im.setTexture(k);
    });
  }
  if(sc.gulls)sc.gulls.forEach(function(g){
    g.x+=g.vx*dt/1000;g.y+=Math.sin(t/380+g.x*0.02)*0.18;
    if(g.x>W*T+24){g.x=-24;g.y=12+Math.random()*110;}
  });
  if(sc.smokes)sc.smokes.forEach(function(s,i){
    var k=(t/900+i)%1;s.y=s.by-k*20;s.x=s.bx+Math.sin(t/480+i)*3;s.setAlpha(.48*(1-k));
  });
  if(sc.cat){sc.cat.x=sc.cat.baseX+Math.sin(t/900)*14;sc.cat.setFlipX(Math.cos(t/900)<0);sc.cat.setDepth(sc.cat.y);}
  if(sc.chicks)sc.chicks.forEach(function(c){
    c.wait=(c.wait||0)-dt;
    if(c.wait<=0){
      c.wait=300+Math.random()*900;
      var dx=((Math.random()*3)|0)-1,dy=((Math.random()*3)|0)-1;
      var tx=Math.floor(c.x/T)+dx,ty=Math.floor(c.y/T)+dy;
      if(ty>=40&&ty<=47&&tx>=20&&tx<=32&&sc.grid[ty]&&sc.grid[ty][tx]===0){c.tx=tx*T+8;c.ty=ty*T+8;}
    }
    if(c.tx!=null){
      var ddx=c.tx-c.x,ddy=c.ty-c.y,dist=Math.hypot(ddx,ddy),step=22*dt/1000;
      if(dist<=step){c.x=c.tx;c.y=c.ty;c.tx=null;}
      else{c.x+=ddx/dist*step;c.y+=ddy/dist*step;c.setFlipX(ddx<0);}
    }
    c.setDepth(c.y);
  });
  if(sc.npcs&&sc.grid){
    sc.npcs.forEach(function(n){
      n.wait=(n.wait||0)-dt;
      if(n.wait<=0){
        n.wait=420+Math.random()*1100;
        var dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]];
        var d=dirs[(Math.random()*dirs.length)|0];
        var tx=Math.floor(n.x/T)+d[0],ty=Math.floor(n.y/T)+d[1];
        if(ty>=0&&ty<H&&tx>=0&&tx<W&&sc.grid[ty][tx]===0&&Math.abs(tx-(n.homeX||tx))<6&&Math.abs(ty-(n.homeY||ty))<6){
          n.tx=tx*T+8;n.ty=ty*T+8;
        }
      }
      if(n.tx!=null){
        var dx=n.tx-n.x,dy=n.ty-n.y,dist=Math.hypot(dx,dy),step=28*dt/1000;
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
