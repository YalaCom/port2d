import Phaser from "phaser";
import { PLAYER_SPEED, TILE, ZOOM } from "../data/balance";
import { clearPathCache, findPath } from "../systems/pathfinding";
import { generateHome, HOME_H, HOME_W } from "../systems/worldMap";
import { getState, mutate, saveGame } from "../save/state";
import { isModalOpen, openSleepConfirm, openSleepReport, renderHud, setInteract } from "../ui/dom";

export class HomeScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private grid!: number[][];
  private path: { x: number; y: number }[] = [];
  private near: "bed" | "exit" | null = null;
  constructor() { super("home"); }
  create() {
    const home = generateHome();
    this.grid = home.collision;
    for (let y = 0; y < HOME_H; y++) for (let x = 0; x < HOME_W; x++) {
      this.add.image(x * TILE + 8, y * TILE + 8, this.grid[y][x] === 1 ? "t-block" : "t-wood");
    }
    this.add.rectangle(4 * TILE + 8, 6 * TILE + 8, 16, 20, 0x6b3a7a).setStrokeStyle(1, 0x1a1008);
    this.add.text(4 * TILE + 8, 5 * TILE, "КРОВАТЬ", { fontSize: "6px", color: "#ffe7a3", fontFamily: "monospace" }).setOrigin(0.5);
    this.add.rectangle(10 * TILE + 8, 4 * TILE + 8, 14, 12, 0x6b4a2b).setStrokeStyle(1, 0x1a1008);
    this.add.text(10 * TILE + 8, 3 * TILE, "СУНДУК", { fontSize: "6px", color: "#ffe7a3", fontFamily: "monospace" }).setOrigin(0.5);
    this.add.text(8 * TILE + 8, (HOME_H - 1) * TILE + 2, "ДВЕРЬ", { fontSize: "6px", color: "#ffe7a3", fontFamily: "monospace" }).setOrigin(0.5);
    this.player = this.add.sprite(8 * TILE + 8, 8 * TILE + 8, "player").setOrigin(0.5, 0.8).setDepth(10);
    this.cameras.main.setBounds(0, 0, HOME_W * TILE, HOME_H * TILE);
    this.cameras.main.setZoom(ZOOM + 1);
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.fadeIn(220, 0, 0, 0);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (isModalOpen()) return;
      const w = this.cameras.main.getWorldPoint(p.x, p.y);
      const from = { x: Math.floor(this.player.x / TILE), y: Math.floor(this.player.y / TILE) };
      clearPathCache();
      this.path = findPath(this.grid, from.x, from.y, Math.floor(w.x / TILE), Math.floor(w.y / TILE)).slice(1);
    });
    this.input.keyboard?.on("keydown-E", () => this.use());
    renderHud("Дом. Кровать завершает день. Дверь — на улицу.");
  }
  private use() {
    if (this.near === "bed") openSleepConfirm(() => { saveGame(getState()); openSleepReport(); });
    if (this.near === "exit") this.leave();
  }
  private leave() {
    mutate((s) => { s.scene = "world"; s.px = 29; s.py = 13; });
    saveGame(getState());
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("world"));
  }
  update(_t: number, dt: number) {
    if (this.path.length) {
      const n = this.path[0];
      const nx = n.x * TILE + 8, ny = n.y * TILE + 8;
      const dx = nx - this.player.x, dy = ny - this.player.y;
      const dist = Math.hypot(dx, dy);
      const step = (PLAYER_SPEED * dt) / 1000;
      if (dist <= step) { this.player.setPosition(nx, ny); this.path.shift(); }
      else { this.player.x += (dx / dist) * step; this.player.y += (dy / dist) * step; }
    }
    const tx = Math.floor(this.player.x / TILE), ty = Math.floor(this.player.y / TILE);
    const n: typeof this.near = tx <= 5 && ty <= 8 && ty >= 5 ? "bed" : tx === 8 && ty >= HOME_H - 3 ? "exit" : null;
    if (n !== this.near) {
      this.near = n;
      if (n === "bed") setInteract("Спать", () => this.use());
      else if (n === "exit") setInteract("Выйти", () => this.use());
      else setInteract(null);
    }
  }
}
