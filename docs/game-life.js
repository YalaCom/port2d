function decorateTown(sc){
  if(!sc||sc._lived)return;sc._lived=1;
  function has(k){return sc.textures&&sc.textures.exists(k);}
  function put(k,x,y,ox,oy){if(!has(k))return null;return sc.add.image(x*T+8,y*T+8,k).setOrigin(ox||.5,oy||.85).setDepth(y*T);}
  var trees=[[22,6],[26,5],[32,6],[38,8],[40,12],[41,22],[39,26],[24,28],[16,30],[34,30],[10,8],[43,18]];
  trees.forEach(function(p,i){put(i%2?"spr-tree1":"spr-tree0",p[0],p[1],.5,.9);if(sc.grid[p[1]])sc.grid[p[1]][p[0]]=1;});
  [[17,10],[23,13],[27,23],[32,20],[14,22]].forEach(function(p){put("spr-bush",p[0],p[1]);});
  [[18,12],[23,11],[27,16],[31,13],[22,23],[28,25],[33,18]].forEach(function(p){put("spr-flower",p[0],p[1],.5,.7);});
  for(var fx=27;fx<=32;fx++)put("spr-fenceh",fx,6,.5,.6);
  put("spr-lamp",17,16,.5,.95);put("spr-lamp",27,14,.5,.95);put("spr-lamp",33,20,.5,.95);
  put("spr-well",24,18);put("spr-sign",22,15);put("spr-bench",32,18);put("spr-hut",42,14,.5,.88);
  put("spr-crate",19,13);put("spr-crate",21,21);put("spr-fishbox",15,18);
  if(has("spr-cat")){sc.cat=sc.add.image(23*T+8,20*T+8,"spr-cat").setOrigin(.5,.8).setDepth(20*T);sc.cat.baseX=23*T+8;}
  sc.gulls=[];
  if(has("spr-gull")){
    for(var i=0;i<4;i++){
      var gu=sc.add.image(20+i*90,30+i*18,"spr-gull").setDepth(700).setAlpha(.95);
      gu.vx=18+i*6;gu.vy=4-i;sc.gulls.push(gu);
    }
  }
  sc.smokes=[];
  if(has("spr-smoke")){
    [[29,7],[36,15]].forEach(function(p){
      var sm=sc.add.image(p[0]*T+8,p[1]*T,"spr-smoke").setDepth(p[1]*T+40).setAlpha(.5);
      sm.bx=p[0]*T+8;sm.by=p[1]*T;sc.smokes.push(sm);
    });
  }
  var extra=[[16,21,"npc-d"],[28,17,"npc-a"],[33,22,"npc-b"],[19,17,"npc-c"]];
  extra.forEach(function(n){
    if(!has(n[2]))return;
    var s=sc.add.sprite(n[0]*T+8,n[1]*T+8,n[2]).setOrigin(.5,.8);
    s.homeX=n[0];s.homeY=n[1];s.wait=200+Math.random()*800;
    if(!sc.npcs)sc.npcs=[];sc.npcs.push(s);
  });
  sc.npcs.forEach(function(n,i){n.homeX=n.homeX||Math.floor(n.x/T);n.homeY=n.homeY||Math.floor(n.y/T);n.wait=100*i;n.dir=1;});
  sc.wf=0;sc.waterImgs=[];
  sc.children.list.forEach(function(im){
    if(im.texture&&(im.texture.key==="t-water"||im.texture.key==="t-water2"))sc.waterImgs.push(im);
  });
}
function animateTown(sc,t,dt){
  if(!sc||!sc._lived)return;
  sc.wf=(sc.wf||0)+dt;
  if(sc.wf>420&&sc.waterImgs){
    sc.wf=0;
    var on=Math.floor(t/420)%2;
    sc.waterImgs.forEach(function(im){im.setTexture(on?"t-water2":"t-water");});
  }
  if(sc.gulls)sc.gulls.forEach(function(g){
    g.x+=g.vx*dt/1000;g.y+=Math.sin(t/400+g.x)*0.15;
    if(g.x>W*T+20){g.x=-20;g.y=20+Math.random()*80;}
  });
  if(sc.smokes)sc.smokes.forEach(function(s,i){
    var k=(t/900+i)%1;s.y=s.by-k*18;s.x=s.bx+Math.sin(t/500+i)*3;s.setAlpha(.45*(1-k));
  });
  if(sc.cat){sc.cat.x=sc.cat.baseX+Math.sin(t/900)*10;sc.cat.setFlipX(Math.cos(t/900)<0);sc.cat.setDepth(sc.cat.y);}
  if(sc.npcs&&sc.grid){
    sc.npcs.forEach(function(n){
      n.wait=(n.wait||0)-dt;
      if(n.wait<=0){
        n.wait=600+Math.random()*1400;
        var dirs=[[1,0],[-1,0],[0,1],[0,-1]];
        var d=dirs[(Math.random()*4)|0];
        var tx=Math.floor(n.x/T)+d[0],ty=Math.floor(n.y/T)+d[1];
        if(ty>=0&&ty<H&&tx>=0&&tx<W&&sc.grid[ty][tx]===0&&Math.abs(tx-(n.homeX||tx))<4&&Math.abs(ty-(n.homeY||ty))<4){
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
