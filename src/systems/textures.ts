export function makeTextures(scene: Phaser.Scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const tile = (key: string, draw: (gr: Phaser.GameObjects.Graphics) => void, w = 16, h = 16) => {
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };
  const solid = (key: string, c: number, d?: [number, number, number, number][]) =>
    tile(key, (gr) => {
      gr.fillStyle(c);
      gr.fillRect(0, 0, 16, 16);
      for (const q of d ?? []) {
        gr.fillStyle(q[0]);
        gr.fillRect(q[1], q[2], q[3], 2);
      }
    });

  solid("t-water", 0x1d4e6e, [[0x2a6a8a, 1, 4, 6], [0x2a6a8a, 8, 10, 6]]);
  solid("t-water2", 0x1a4866, [[0x3482a4, 4, 2, 7], [0x3482a4, 1, 11, 5]]);
  solid("t-sand", 0xc9b07a, [[0xb89a62, 3, 5, 2], [0xb89a62, 10, 11, 2]]);
  solid("t-dirt", 0x6b4a2b, [[0x7a5634, 2, 3, 3], [0x7a5634, 9, 10, 4]]);
  solid("t-grass", 0x3d6b32, [[0x4e8640, 2, 4, 1], [0x2c4f24, 0, 15, 16]]);
  solid("t-wood", 0x8a5a2b, [[0x6e4520, 0, 4, 16], [0xb07a3c, 0, 0, 16]]);
  tile("t-cobble", (gr) => {
    gr.fillStyle(0x7a7468); gr.fillRect(0, 0, 16, 16);
    gr.fillStyle(0x5c574e); gr.fillRect(0, 0, 7, 7); gr.fillRect(8, 8, 8, 8);
    gr.fillStyle(0x9a9488); gr.fillRect(8, 0, 8, 7); gr.fillRect(0, 8, 7, 8);
  });
  solid("t-block", 0x3a2a1c);
  tile("spr-barrel", (gr) => {
    gr.fillStyle(0x6b3e16); gr.fillRect(4, 3, 8, 12);
    gr.fillStyle(0x8a5420); gr.fillRect(5, 4, 6, 10);
    gr.fillStyle(0x2a1a0c); gr.fillRect(4, 7, 8, 2);
  });
  tile("spr-crate", (gr) => {
    gr.fillStyle(0x9a6a30); gr.fillRect(3, 5, 10, 9);
    gr.fillStyle(0x6e4520); gr.fillRect(7, 5, 2, 9);
  });
  const person = (key: string, shirt: number, hair: number) => {
    g.clear();
    g.fillStyle(0xe6c8a0); g.fillRect(5, 4, 6, 6);
    g.fillStyle(hair); g.fillRect(5, 2, 6, 3);
    g.fillStyle(0x2a1a10); g.fillRect(6, 6, 1, 1); g.fillRect(9, 6, 1, 1);
    g.fillStyle(shirt); g.fillRect(4, 10, 8, 7);
    g.fillStyle(0x3a3a6a); g.fillRect(5, 17, 3, 5); g.fillRect(8, 17, 3, 5);
    g.fillStyle(0x2a2010); g.fillRect(5, 22, 3, 2); g.fillRect(8, 22, 3, 2);
    g.generateTexture(key, 16, 24);
  };
  person("player", 0xc45a3a, 0x3a2414);
  person("npc-a", 0x3a6ea5, 0x5a3a18);
  person("npc-b", 0x6b3a7a, 0x1a1a1a);
  person("npc-c", 0x3d6b32, 0x8a6a30);
  tile("spr-house", (gr) => {
    gr.fillStyle(0x8a4a28); gr.fillRect(6, 20, 36, 22);
    gr.fillStyle(0x7a2a18); gr.fillTriangle(6, 20, 24, 8, 42, 20);
    gr.fillStyle(0x2a1a10); gr.fillRect(20, 30, 8, 14);
    gr.fillStyle(0xffe08a); gr.fillRect(10, 26, 6, 6); gr.fillRect(32, 26, 6, 6);
  }, 48, 48);
  tile("spr-tent", (gr) => {
    gr.fillStyle(0xb83a24); gr.fillTriangle(6, 28, 16, 10, 26, 28);
    gr.fillStyle(0x3a1a10); gr.fillRect(13, 20, 6, 8);
  }, 32, 32);
  tile("spr-ship", (gr) => {
    gr.fillStyle(0x5a3a1c); gr.fillRect(6, 26, 50, 12);
    gr.fillStyle(0xd8d0c0); gr.fillRect(28, 4, 3, 22); gr.fillTriangle(31, 6, 48, 20, 31, 20);
  }, 64, 48);
  tile("spr-tavern", (gr) => {
    gr.fillStyle(0x5a3a22); gr.fillRect(2, 14, 44, 24);
    gr.fillStyle(0x3a2010); gr.fillRect(0, 10, 48, 6);
    gr.fillStyle(0x2a1a10); gr.fillRect(20, 24, 8, 14);
    gr.fillStyle(0xffc85a); gr.fillRect(8, 20, 6, 6); gr.fillRect(34, 20, 6, 6);
  }, 48, 40);
  tile("marker", (gr) => {
    gr.lineStyle(1, 0xffe08a, 1); gr.strokeRect(2, 2, 12, 12);
    gr.fillStyle(0xffe08a, 0.35); gr.fillRect(4, 4, 8, 8);
  });
  tile("dot", (gr) => { gr.fillStyle(0xffe08a, 0.7); gr.fillRect(6, 6, 4, 4); });
  g.destroy();
}
