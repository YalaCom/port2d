function tex(sc){
if(typeof PACK_FRAMES==="object"&&sc.textures.exists("pack")){
  var src=sc.textures.get("pack").getSourceImage();
  Object.keys(PACK_FRAMES).forEach(function(k){
    var f=PACK_FRAMES[k];
    if(!f||!src)return;
    try{
      var c=document.createElement("canvas");
      c.width=f.w;c.height=f.h;
      var ctx=c.getContext("2d");
      ctx.imageSmoothingEnabled=false;
      ctx.drawImage(src,f.x,f.y,f.w,f.h,0,0,f.w,f.h);
      if(sc.textures.exists(k))sc.textures.remove(k);
      sc.textures.addCanvas(k,c);
    }catch(e){}
  });
}
var g=sc.make.graphics({x:0,y:0,add:false});
function tile(k,fn,w,h){if(sc.textures.exists(k))return;g.clear();fn(g);g.generateTexture(k,w||16,h||16);}
function R(gr,c,x,y,w,h){gr.fillStyle(c);gr.fillRect(x,y,w,h);}
tile("t-water",function(gr){R(gr,0x2a6e96,0,0,16,16);R(gr,0x246488,0,7,16,2);R(gr,0x3b84aa,2,4,5,1);});
tile("t-water2",function(gr){R(gr,0x276890,0,0,16,16);R(gr,0x3b84aa,4,3,6,1);});
tile("t-water3",function(gr){R(gr,0x2d749c,0,0,16,16);R(gr,0x3b84aa,8,6,6,1);});
tile("t-shore",function(gr){R(gr,0x2a6e96,0,0,7,16);R(gr,0xd4bc86,7,0,9,16);});
tile("t-sand",function(gr){R(gr,0xd8c08a,0,0,16,16);R(gr,0xccb47c,4,6,3,1);});
tile("t-sand2",function(gr){R(gr,0xd4bc86,0,0,16,16);});
tile("t-dirt",function(gr){R(gr,0x8a6240,0,0,16,16);});
tile("t-path",function(gr){R(gr,0xb08a58,0,0,16,16);});
tile("t-farm",function(gr){R(gr,0x8a5e38,0,0,16,16);R(gr,0x7a5230,0,5,16,1);});
tile("t-grass",function(gr){R(gr,0x4a8c3c,0,0,16,16);R(gr,0x5a9c48,11,9,1,2);});
tile("t-grass0",function(gr){R(gr,0x4a8c3c,0,0,16,16);});
tile("t-grass1",function(gr){R(gr,0x4e9040,0,0,16,16);});
tile("t-grass2",function(gr){R(gr,0x468838,0,0,16,16);});
tile("t-grass3",function(gr){R(gr,0x4a8c3c,0,0,16,16);});
tile("t-darkg",function(gr){R(gr,0x3a6e32,0,0,16,16);});
tile("t-wood",function(gr){R(gr,0x9a6a3c,0,0,16,16);R(gr,0x8a5c32,0,6,16,1);});
tile("t-wood2",function(gr){R(gr,0x946436,0,0,16,16);});
tile("t-block",function(gr){R(gr,0x4a3a28,0,0,16,16);});
tile("t-cobble",function(gr){R(gr,0x8a8680,0,0,16,16);R(gr,0x929088,1,1,7,7);});
tile("t-cobble2",function(gr){R(gr,0x8a8680,0,0,16,16);});
tile("t-side",function(gr){R(gr,0xb08a58,0,0,16,16);});
tile("spr-barrel",function(gr){R(gr,0x6b3e16,4,2,8,13);R(gr,0x8a5420,5,3,6,11);R(gr,0x2a1a0c,4,6,8,2);});
tile("spr-crate",function(gr){R(gr,0x7a4a20,2,3,12,12);R(gr,0x9a6230,3,4,10,10);});
tile("spr-bush",function(gr){R(gr,0x3a7a30,2,6,12,7);R(gr,0x4e8e3c,5,4,7,6);});
tile("spr-bush2",function(gr){R(gr,0x428638,3,6,10,7);});
tile("spr-flower",function(gr){R(gr,0x2a6a24,7,10,2,6);R(gr,0xe05070,7,7,2,2);});
tile("spr-flower2",function(gr){R(gr,0x2a6a24,7,10,2,6);R(gr,0x6a9ae8,6,6,4,4);});
tile("spr-flower3",function(gr){R(gr,0xe87830,5,6,6,5);});
tile("spr-weeds",function(gr){R(gr,0x3a7a32,4,8,1,8);});
tile("spr-rock",function(gr){R(gr,0x7a7870,3,8,10,7);});
tile("spr-stump",function(gr){R(gr,0x6a4220,5,8,6,8);});
tile("spr-fenceh",function(gr){R(gr,0x8a5a28,0,8,16,3);R(gr,0xb07838,2,4,3,10);});
tile("spr-fencev",function(gr){R(gr,0x8a5a28,6,0,4,16);});
tile("spr-lamp",function(gr){R(gr,0x4a3a2a,7,16,2,16);R(gr,0xffd27a,5,7,6,9);},16,32);
tile("spr-well",function(gr){R(gr,0x7a7670,3,8,10,8);R(gr,0x3a5a72,5,10,6,4);});
tile("spr-sign",function(gr){R(gr,0xc4a06a,2,2,12,8);});
tile("spr-bench",function(gr){R(gr,0xb07838,1,6,14,3);});
tile("spr-cat",function(gr){R(gr,0x4a4a4a,4,8,9,5);});
tile("spr-gull",function(gr){R(gr,0xf2f0e8,2,7,12,2);});
tile("spr-fishbox",function(gr){R(gr,0x6a4a22,1,8,14,7);});
tile("spr-chicken",function(gr){R(gr,0xf2f0e8,5,8,8,6);R(gr,0xc42a22,8,6,3,3);});
tile("spr-cart",function(gr){R(gr,0x8a5a28,2,6,12,7);});
function person(k,sh,hair,hat){if(sc.textures.exists(k))return;g.clear();R(g,0xe6c8a0,5,3,6,7);R(g,hair,5,1,6,4);R(g,sh,4,10,8,8);R(g,0x3a3a6a,5,18,3,6);g.generateTexture(k,16,26);}
person("player",0xc45a3a,0x3a2414,0);person("npc-a",0x3a6ea5,0x5a3a18,0);person("npc-b",0x6b3a7a,0x1a1a1a,0);person("npc-c",0x3d6b32,0x8a6a30,0);person("npc-d",0xc4a24a,0x4a2010,0);person("npc-e",0x8a3a2a,0xe8d0a0,0);
tile("spr-house",function(gr){R(gr,0x8a2a20,6,12,36,12);R(gr,0xe8d8b4,8,22,32,22);R(gr,0x6a3a18,20,32,8,12);},48,48);
tile("spr-house2",function(gr){R(gr,0x3a5a86,6,12,36,12);R(gr,0xd8d0be,8,22,32,22);},48,48);
tile("spr-hut",function(gr){R(gr,0x8a5a28,8,4,16,12);R(gr,0xc8b078,6,18,20,18);},32,40);
tile("spr-tent",function(gr){R(gr,0xb83220,6,16,20,14);R(gr,0xd04428,16,8,10,22);},32,32);
tile("spr-ship",function(gr){R(gr,0x6a3a18,6,30,52,12);R(gr,0xf6f0e4,31,6,22,18);},64,48);
tile("spr-tavern",function(gr){R(gr,0x8a4e2a,6,18,40,24);R(gr,0xffc85a,10,22,7,7);},52,48);
tile("spr-shop",function(gr){R(gr,0xc45a3a,8,8,32,8);R(gr,0xe8d2a0,6,20,36,20);},48,44);
tile("spr-ware",function(gr){R(gr,0x6a5a48,2,8,44,28);},48,40);
tile("spr-light",function(gr){R(gr,0xd8d0c4,8,18,8,42);R(gr,0xc42a22,6,8,12,12);},24,64);
tile("spr-tree0",function(gr){R(gr,0x6a4220,10,20,4,17);R(gr,0x3a8234,5,5,14,14);},24,40);
tile("spr-tree1",function(gr){R(gr,0x6a4220,10,20,4,17);R(gr,0x2e702c,3,7,18,16);},24,40);
tile("spr-tree2",function(gr){R(gr,0x5a3418,11,26,3,19);R(gr,0x245824,5,16,14,14);},24,48);
tile("spr-smoke",function(gr){R(gr,0xd0d4d8,2,6,5,5);});
tile("marker",function(gr){gr.lineStyle(1,0xffe08a,1);gr.strokeRect(2,2,12,12);});
g.destroy();
}
