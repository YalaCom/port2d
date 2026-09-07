import Phaser from "phaser";
import { makeTextures } from "./systems/textures";
import { WorldScene } from "./scenes/WorldScene";
import { HomeScene } from "./scenes/HomeScene";
import { getState } from "./save/state";

class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  create() {
    this.scene.start("preload");
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  create() {
    makeTextures(this);
    const start = getState().scene === "home" ? "home" : "world";
    this.scene.start(start);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#0c1218",
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  scene: [BootScene, PreloadScene, WorldScene, HomeScene],
};

new Phaser.Game(config);
