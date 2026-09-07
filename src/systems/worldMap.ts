import { MAP_H, MAP_W } from "../data/balance";

export type TileKind = "water" | "sand" | "dirt" | "grass" | "wood" | "cobble";

export interface Interact {
  id: string;
  type: "ship" | "stall" | "door" | "tavern" | "bed" | "plot";
  tileX: number;
  tileY: number;
  label: string;
}

export interface WorldGen {
  ground: TileKind[][];
  collision: number[][];
  interacts: Interact[];
}

export function generateWorld(): WorldGen {
  const ground: TileKind[][] = [];
  const collision: number[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    ground[y] = [];
    collision[y] = [];
    for (let x = 0; x < MAP_W; x++) {
      let t: TileKind = "grass";
      if (x < 9) t = "water";
      else if (x < 12) t = "sand";
      else if (x >= 16 && x <= 33 && y >= 10 && y <= 24) t = "cobble";
      else if (x >= 12 && x <= 16 && y >= 8 && y <= 26) t = "wood";
      else if (y > 28) t = "sand";
      else t = "dirt";
      ground[y][x] = t;
      collision[y][x] = t === "water" ? 1 : 0;
    }
  }

  const blockRect = (x0: number, y0: number, w: number, h: number) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (inb(x, y)) collision[y][x] = 1;
  };
  const inb = (x: number, y: number) => x >= 0 && y >= 0 && x < MAP_W && y < MAP_H;

  blockRect(28, 6, 3, 3);
  blockRect(34, 16, 3, 2);

  const barrels: [number, number][] = [
    [14, 12], [15, 20], [18, 14], [24, 12], [26, 21], [19, 22], [31, 19], [13, 24], [21, 11],
  ];
  for (const [x, y] of barrels) if (inb(x, y)) collision[y][x] = 1;

  const interacts: Interact[] = [
    { id: "ship", type: "ship", tileX: 13, tileY: 17, label: "Трап корабля" },
    { id: "stall", type: "stall", tileX: 20, tileY: 17, label: "Ваша палатка" },
    { id: "home", type: "door", tileX: 29, tileY: 12, label: "Дом" },
    { id: "tavern", type: "tavern", tileX: 35, tileY: 19, label: "Таверна «Мокрая снасть»" },
  ];

  return { ground, collision, interacts };
}

export const HOME_W = 16;
export const HOME_H = 12;

export function generateHome(): WorldGen {
  const ground: TileKind[][] = [];
  const collision: number[][] = [];
  for (let y = 0; y < HOME_H; y++) {
    ground[y] = [];
    collision[y] = [];
    for (let x = 0; x < HOME_W; x++) {
      ground[y][x] = "wood";
      const wall = x === 0 || y === 0 || x === HOME_W - 1 || y === HOME_H - 1;
      collision[y][x] = wall ? 1 : 0;
    }
  }
  collision[8][4] = 1;
  collision[4][10] = 1;
  collision[HOME_H - 1][8] = 0;
  const interacts: Interact[] = [
    { id: "bed", type: "bed", tileX: 4, tileY: 7, label: "Кровать" },
    { id: "exit", type: "door", tileX: 8, tileY: HOME_H - 2, label: "Выход" },
  ];
  return { ground, collision, interacts };
}
