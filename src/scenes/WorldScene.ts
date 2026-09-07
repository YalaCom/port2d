import Phaser from "phaser";
import { BALANCE, MAP_H, MAP_W, PLAYER_SPEED, TILE, ZOOM } from "../data/balance";
import { clearPathCache, findPath } from "../systems/pathfinding";
import { generateWorld, type Interact } from "../systems/worldMap";
import { getState, mutate, saveGame } from "../save/state";
import { closeModal, isModalOpen, mountUi, openShip, openSleepReport, openStall, openTavern, renderHud, setInteract, toast, tryNpcBuy } from "../ui/dom";

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private grid!: number[][];
  private interacts: Interact[] = [];
  private path: { x: number; y: number }[] = [];
  private dest: { x: number; y: number } | null = null;
  private marker!: Phaser.GameObjects.Image;
  private tintRect!: Phaser.GameObjects.Rectangle;
  private hourAcc = 0; private buyAcc = 0;
  private near: Interact | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private npcs: Phaser.GameObjects.Sprite[] = [];
  constructor() { super("world"); }
  create() {
    const world = generateWorld(); this.grid = world.collision; this.interacts = world.interacts;
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      const kind = world.ground[y][x];
      const key = kind === "water" ? ((x + y) % 2 === 0 ? "t-water" : "t-water2") : `t-${kind}`;
      this.add.image(x * TILE + 8, y * TILE + 8, key);
    }
    this.add.image(9 * TILE, 16 * TILE, "spr-ship").setOrigin(0.5, 0.7).setDepth(6);
    this.add.image(20 * TILE + 8, 16 * TILE, "spr-tent").setOrigin(0.5, 0.75).setDepth(6);
    this.add.image(29 * TILE + 8, 9 * TILE + 8, "spr-house").setOrigin(0.5, 0.7).setDepth(6);
    this.add.image(36 * TILE, 17 * TILE + 8, "spr-tavern").setOrigin(0.5, 0.7).setDepth(6);
    for (const [x, y] of [[14,12],[15,20],[18,14],[24,12],[26,21],[19,22],[31,19],[13,24],[21,11]] as [number, number][]) {
      this.add.image(x * TILE + 8, y * TILE + 8, "spr-barrel").setDepth(5);
    }
    const labels: [number, number, string][] = [[13,16,"ПИРС"],[20,15,"ПАЛАТКА"],[29,6,"ДОМ"],[36,15,"ТАВЕРНА"]];
    for (const [x,y,t] of labels) this.add.text(x*TILE+8, y*TILE, t, { fontFamily: "monospace", fontSize: "7px", color: "#ffe7a3", stroke: "#1a1008", strokeThickness: 2 }).setOrigin(0.5).setDepth(7);
    const s = getState();
    this.player = this.add.sprite((s.px+0.5)*TILE, (s.py+0.5)*TILE, "player").setOrigin(0.5, 0.8).setDepth(20);
    this.marker = this.add.image(0,0,"marker").setVisible(false).setDepth(8);
    this.cameras.main.setBounds(0,0,MAP_W*TILE,MAP_H*TILE).setZoom(ZOOM).startFollow(this.player,true,0.12,0.12).setRoundPixels(true);
    this.tintRect = this.add.rectangle((MAP_W*TILE)/2,(MAP_H*TILE)/2,MAP_W*TILE,MAP_H*TILE,0x000000,0).setDepth(40);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (isModalOpen() || p.button !== 0) return;
      const w = this.cameras.main.getWorldPoint(p.x, p.y);
      this.goTo(Math.floor(w.x/TILE), Math.floor(w.y/TILE));
    });
    this.input.keyboard?.on("keydown-E", () => this.useNear());
    this.input.keyboard?.on("keydown-ESC", () => closeModal());
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.npcs = [[22,20],[25,18],[18,19],[30,21]].map(([x,y],i) => this.add.sprite(x*TILE+8,y*TILE+8,["npc-a","npc-b","npc-c"][i%3]).setOrigin(0.5,0.8).setDepth(15));
    this.applyTint();
    mountUi({ onClose: () => undefined, onSleepDone: () => { const st = getState(); this.player.setPosition((st.px+0.5)*TILE,(st.py+0.5)*TILE); this.applyTint(); renderHud(); }, toast: () => undefined });
    renderHud();
  }
  private tileOf() { return { x: Math.floor(this.player.x/TILE), y: Math.floor(this.player.y/TILE) }; }
  private goTo(tx: number, ty: number) {
    const from = this.tileOf();
    const it = this.interacts.find((i) => Math.abs(i.tileX-tx) <= 1 && Math.abs(i.tileY-ty) <= 1);
    const gx = it ? it.tileX : tx, gy = it ? it.tileY : ty;
    clearPathCache();
    const path = findPath(this.grid, from.x, from.y, gx, gy);
    if (!path.length) { toast("Не дойти."); return; }
    this.path = path.slice(1); this.dest = { x: gx, y: gy };
    this.marker.setPosition(gx*TILE+8, gy*TILE+8).setVisible(true);
  }
  private openInteract(it: Interact) {
    if (it.type === "ship") openShip();
    if (it.type === "stall") openStall();
    if (it.type === "tavern") openTavern();
    if (it.type === "door") {
      const tile = this.tileOf();
      mutate((s) => { s.scene = "home"; s.px = tile.x; s.py = tile.y; });
      saveGame(getState());
      this.cameras.main.fadeOut(220,0,0,0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("home"));
    }
  }
  private useNear() { if (this.near && !isModalOpen()) this.openInteract(this.near); }
  private applyTint() {
    const h = getState().hour + getState().minute/60; let color = 0x000000, a = 0;
    if (h < 7) { color = 0x2a3a66; a = 0.28; } else if (h < 8) { color = 0xffc080; a = 0.1; }
    else if (h < 17) { a = 0; } else if (h < 20) { color = 0xff8a3a; a = 0.16; } else { color = 0x102040; a = 0.38; }
    if (getState().weather === "storm") { color = 0x1a2838; a = Math.max(a, 0.22); }
    this.tintRect.setFillStyle(color, a);
  }
  update(_t: number, dt: number) {
    if (!this.player) return;
    const modal = isModalOpen();
    if (this.path.length) {
      const n = this.path[0]; const nx = n.x*TILE+8, ny = n.y*TILE+8;
      const dx = nx-this.player.x, dy = ny-this.player.y; const dist = Math.hypot(dx,dy); const step = PLAYER_SPEED*dt/1000;
      if (dist <= step) { this.player.setPosition(nx,ny); this.path.shift(); if (!this.path.length && this.dest) { this.marker.setVisible(false); const it = this.interacts.find(i => i.tileX===this.dest!.x && i.tileY===this.dest!.y); if (it) this.openInteract(it); this.dest = null; } }
      else { this.player.x += dx/dist*step; this.player.y += dy/dist*step; this.player.setFlipX(dx < -0.2); }
      const tile = this.tileOf(); mutate((s) => { s.px = tile.x; s.py = tile.y; s.scene = "world"; });
    } else if (!modal) {
      let kx = 0, ky = 0;
      if (this.cursors.left.isDown || this.wasd.A.isDown) kx = -1;
      if (this.cursors.right.isDown || this.wasd.D.isDown) kx = 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) ky = -1;
      if (this.cursors.down.isDown || this.wasd.S.isDown) ky = 1;
      if (kx || ky) {
        const nx = this.player.x + kx * PLAYER_SPEED * dt/1000, ny = this.player.y + ky * PLAYER_SPEED * dt/1000;
        const tx = Math.floor(nx/TILE), ty = Math.floor(ny/TILE);
        if (this.grid[ty] && this.grid[ty][tx] === 0) { this.player.setPosition(nx,ny); this.player.setFlipX(kx<0); }
      }
    }
    if (!modal) this.buyAcc += dt * (this.near?.type === "stall" ? BALANCE.stallAfkMultiplier : 1);
    if (this.buyAcc > BALANCE.npcBuyIntervalMs) { this.buyAcc = 0; const msg = tryNpcBuy(); if (msg) { toast(msg); renderHud(); } }
    this.hourAcc += dt * (!modal && this.near?.type === "stall" ? BALANCE.stallAfkMultiplier : 1);
    if (this.hourAcc >= BALANCE.msPerGameHour / 60) {
      this.hourAcc = 0;
      mutate((s) => { s.minute += 1; if (s.minute >= 60) { s.minute = 0; s.hour += 1; } });
      const s = getState();
      if (s.hour >= 19 && s.ship.present) { mutate((st) => { st.ship.present = false; }); toast("Корабль отчалил."); }
      if (s.hour >= 24) { toast("Усталость. Вас дотащили до кровати."); mutate((st)=>{st.hour=23;st.minute=50;}); this.scene.start("home"); this.time.delayedCall(400, () => openSleepReport()); }
      if (Math.floor(s.minute) % 15 === 0) { this.applyTint(); renderHud(); if (s.minute < 1) saveGame(s); }
    }
    const tile = this.tileOf();
    const found = this.interacts.find((it) => Math.abs(it.tileX-tile.x)+Math.abs(it.tileY-tile.y) <= 1) ?? null;
    if (found?.id !== this.near?.id) { this.near = found; found ? setInteract(found.label + " · открыть", () => this.openInteract(found)) : setInteract(null); }
    const t = this.time.now/800; this.npcs.forEach((n,i) => n.setFlipX(Math.sin(t+i)>0));
  }
}
