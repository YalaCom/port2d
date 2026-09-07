function extraArt(sc){
  var g=sc.make.graphics({x:0,y:0,add:false});
  function mk(k,fn,w,h){if(sc.textures.exists(k))return;g.clear();fn(g);g.generateTexture(k,w||16,h||16);}
  function R(gr,c,x,y,w,h){gr.fillStyle(c);gr.fillRect(x,y,w,h);}
  mk("t-farm2",function(gr){R(gr,0x7a5230,0,0,16,16);R(gr,0x6e4628,0,3,16,1);R(gr,0x6e4628,0,8,16,1);R(gr,0x3a7a30,3,5,2,2);R(gr,0xd0b24a,12,6,1,4);});
  mk("t-farm3",function(gr){R(gr,0x8a5e38,0,0,16,16);R(gr,0x6e4628,0,4,16,2);R(gr,0x4a8a3a,4,6,2,2);});
  mk("spr-wheat",function(gr){R(gr,0x6a4a22,0,14,16,2);R(gr,0xd0b24a,3,2,1,12);R(gr,0xd0b24a,7,1,1,13);R(gr,0xe8d06a,2,2,3,2);});
  mk("spr-cabbage",function(gr){R(gr,0x6a4a22,2,12,12,3);R(gr,0x2e6a28,5,6,7,7);R(gr,0x4a8a3a,6,5,5,5);});
  mk("spr-scare",function(gr){R(gr,0x6a4220,7,10,2,14);R(gr,0x3a6ea5,4,8,8,8);R(gr,0xc4a24a,5,3,6,6);R(gr,0x8a5a28,3,2,10,2);},16,24);
  mk("spr-ship2",function(gr){R(gr,0x5a3418,8,26,48,14);R(gr,0xd8d0c0,18,6,3,24);R(gr,0xf6f0e4,21,8,20,16);R(gr,0xc42a22,16,4,8,3);R(gr,0x2a6e96,6,38,50,6);},64,48);
  mk("spr-stall",function(gr){R(gr,0xb83220,6,8,36,10);R(gr,0x8a5a28,8,18,32,18);R(gr,0x4a8a3a,10,22,6,5);R(gr,0xe05070,18,22,6,5);},48,40);
  g.destroy();
}
function extraTown(sc){
  if(!sc||sc._extra)return;sc._extra=1;
  try{extraArt(sc);}catch(e){}
  function has(k){return sc.textures&&sc.textures.exists(k);}
  function put(k,x,y,ox,oy){
    if(!has(k))return;
    sc.add.image(x*T+8,y*T+8,k).setOrigin(ox==null?.5:ox,oy==null?.88:oy).setDepth(y*T+8);
  }
  sc.children.list.forEach(function(im){
    if(!im.texture)return;
    var k=im.texture.key,tx=(im.x/T)|0,ty=(im.y/T)|0;
    if(k==="t-farm"){
      var fk=((tx+ty)&1)?"t-farm2":"t-farm3";
      if(has(fk))im.setTexture(fk);
    }
  });
  put("spr-ship2",10,12,.45,.78);
  put("spr-stall",27,24,.5,.86);
  put("spr-scare",24,41,.5,.9);
  [[21,42],[23,44],[25,41],[27,45],[29,43],[31,42]].forEach(function(p,i){
    put(i%2?"spr-wheat":"spr-cabbage",p[0],p[1],.5,.85);
  });
  [[40,44],[42,46],[44,43],[46,47],[48,45],[50,44]].forEach(function(p,i){
    put(i%3?"spr-wheat":"spr-cabbage",p[0],p[1],.5,.85);
  });
}
if(typeof World!=="undefined"){
  var _c2=World.prototype.create;
  World.prototype.create=function(){_c2.call(this);try{extraTown(this);}catch(e){}};
}
