if(typeof fitZoom!=="function"){
  fitZoom=function(){
    var w=window.innerWidth||390,h=window.innerHeight||700;
    var z=Math.min(w/(26*16),h/(18*16));
    if(z<0.85)z=0.85;if(z>1.35)z=1.35;
    return Math.round(z*100)/100;
  };
}
Z=fitZoom();
if(typeof Boot!=="undefined") Boot.prototype.preload=function(){};
function extraTown(sc){
  if(!sc||sc._extra)return;sc._extra=1;
  sc.children.list.slice().forEach(function(im){
    if(!im)return;
    if(im.type==="Text"||im.type==="text")im.destroy();
  });
  if(sc.cameras&&sc.cameras.main&&sc.cameras.main.setZoom)sc.cameras.main.setZoom(fitZoom());
  if(sc.tint&&S&&S.w==="storm")sc.tint.setFillStyle(0x243848,.07);
  function has(k){return sc.textures&&sc.textures.exists(k);}
  function put(k,x,y,ox,oy){
    if(!has(k))return;
    sc.add.image(x*T+8,y*T+8,k).setOrigin(ox==null?.5:ox,oy==null?.88:oy).setDepth(y*T+8);
  }
  sc.children.list.forEach(function(im){
    if(!im.texture)return;
    var k=im.texture.key,tx=(im.x/T)|0,ty=(im.y/T)|0;
    if(k==="t-farm"&&has("t-farm2"))im.setTexture(((tx+ty)&1)?"t-farm2":"t-farm3");
    if(k==="t-cobble"&&has("t-cobble2")&&((tx+ty)&1))im.setTexture("t-cobble2");
    if(k==="t-grass"){var gk="t-grass"+((tx*13+ty*7)&3);if(has(gk))im.setTexture(gk);}
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
  if(World.prototype.tintDay){
    var _td=World.prototype.tintDay;
    World.prototype.tintDay=function(){
      _td.call(this);
      if(this.tint&&S&&S.w==="storm")this.tint.setFillStyle(0x243848,.07);
    };
  }
}
