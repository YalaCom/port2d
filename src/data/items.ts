export type Legal = "white" | "gray" | "black";
export type Category = "food" | "fish" | "spice" | "textile" | "tool" | "drink" | "rare" | "contraband";

export interface ItemDef {
  id: string; name: string; icon: string; category: Category;
  baseBuy: number; baseSell: number; volatility: number;
  perishDays: number | null; legal: Legal; tags: string[];
  description: string; color: number;
}

export const ITEMS: ItemDef[] = [
  { id: "salt", name: "Соль", icon: "S", category: "food", baseBuy: 6, baseSell: 9, volatility: 0.15, perishDays: null, legal: "white", tags: ["staple"], description: "Белая, сухая, всегда нужна.", color: 0xf2f0e6 },
  { id: "grain", name: "Зерно", icon: "Z", category: "food", baseBuy: 5, baseSell: 8, volatility: 0.2, perishDays: 8, legal: "white", tags: ["staple"], description: "Мешки гудят зерном.", color: 0xd4b46a },
  { id: "flour", name: "Мука", icon: "M", category: "food", baseBuy: 7, baseSell: 11, volatility: 0.18, perishDays: 6, legal: "white", tags: ["staple"], description: "Пылит, если дышать рядом.", color: 0xe8dcc0 },
  { id: "tea", name: "Чай", icon: "C", category: "spice", baseBuy: 14, baseSell: 22, volatility: 0.28, perishDays: null, legal: "white", tags: ["import"], description: "Пахнет дальними пристанями.", color: 0x3d6b3a },
  { id: "coffee", name: "Кофе", icon: "K", category: "spice", baseBuy: 16, baseSell: 26, volatility: 0.3, perishDays: null, legal: "white", tags: ["import"], description: "Горький и дорогой.", color: 0x5a3318 },
  { id: "sugar", name: "Сахар", icon: "U", category: "spice", baseBuy: 11, baseSell: 17, volatility: 0.22, perishDays: null, legal: "white", tags: ["import"], description: "Кристаллы как мелкий лёд.", color: 0xf7f4ea },
  { id: "sprat", name: "Килька", icon: "F", category: "fish", baseBuy: 4, baseSell: 7, volatility: 0.25, perishDays: 2, legal: "white", tags: ["fresh"], description: "Дешёвая и быстро киснет.", color: 0x6a8aa0 },
  { id: "cod", name: "Треска", icon: "T", category: "fish", baseBuy: 9, baseSell: 14, volatility: 0.27, perishDays: 2, legal: "white", tags: ["fresh"], description: "Рабочая рыба причала.", color: 0x9bb3c4 },
  { id: "tuna", name: "Тунец", icon: "N", category: "fish", baseBuy: 18, baseSell: 28, volatility: 0.32, perishDays: 2, legal: "white", tags: ["fresh"], description: "Тяжёлая серебряная туша.", color: 0x4a6d88 },
  { id: "crab", name: "Краб", icon: "R", category: "fish", baseBuy: 15, baseSell: 24, volatility: 0.35, perishDays: 1, legal: "white", tags: ["fresh"], description: "Щипается даже мёртвый.", color: 0xc45a3a },
  { id: "cloth", name: "Ткань", icon: "W", category: "textile", baseBuy: 10, baseSell: 16, volatility: 0.2, perishDays: null, legal: "white", tags: ["dry"], description: "Рулоны на полку.", color: 0xc9b8a0 },
  { id: "sail", name: "Парусное полотно", icon: "P", category: "textile", baseBuy: 13, baseSell: 20, volatility: 0.24, perishDays: null, legal: "white", tags: ["ship"], description: "Плотное, с запахом смолы.", color: 0xe6d8b8 },
  { id: "rope", name: "Канат", icon: "Q", category: "tool", baseBuy: 8, baseSell: 12, volatility: 0.12, perishDays: null, legal: "white", tags: ["ship"], description: "Всегда расходится у моряков.", color: 0xa67c4e },
  { id: "nails", name: "Гвозди", icon: "G", category: "tool", baseBuy: 6, baseSell: 10, volatility: 0.1, perishDays: null, legal: "white", tags: ["ship"], description: "Коробка стучит железом.", color: 0x8a8a8a },
  { id: "resin", name: "Смола", icon: "L", category: "tool", baseBuy: 9, baseSell: 14, volatility: 0.16, perishDays: null, legal: "white", tags: ["ship"], description: "Липкая и полезная.", color: 0x3a2414 },
  { id: "rum", name: "Ром", icon: "O", category: "drink", baseBuy: 12, baseSell: 19, volatility: 0.22, perishDays: null, legal: "white", tags: ["tavern"], description: "Легальный. Почти.", color: 0x8b3a1f },
  { id: "wine", name: "Вино", icon: "V", category: "drink", baseBuy: 15, baseSell: 24, volatility: 0.26, perishDays: null, legal: "white", tags: ["tavern"], description: "Пыльная бутылка с юга.", color: 0x6b1d3a },
  { id: "pearl", name: "Жемчуг", icon: "*", category: "rare", baseBuy: 40, baseSell: 70, volatility: 0.45, perishDays: null, legal: "white", tags: ["rare"], description: "Холодный шарик удачи.", color: 0xe8f0f4 },
  { id: "idol", name: "Статуэтка", icon: "I", category: "rare", baseBuy: 35, baseSell: 62, volatility: 0.5, perishDays: null, legal: "white", tags: ["rare"], description: "Глаза слишком живые.", color: 0xb89848 },
  { id: "fake_tea", name: "Чай «как настоящий»", icon: "?", category: "contraband", baseBuy: 8, baseSell: 20, volatility: 0.4, perishDays: null, legal: "gray", tags: ["fake"], description: "Пахнет правильно. Листья — нет.", color: 0x2d4a2a },
  { id: "spawn_fish", name: "Запретный улов", icon: "X", category: "contraband", baseBuy: 10, baseSell: 22, volatility: 0.38, perishDays: 1, legal: "black", tags: ["illegal"], description: "Нерестовая рыба. Игровой контрабандный товар.", color: 0x2a3a28 },
  { id: "box", name: "Коробка без вопросов", icon: "#", category: "contraband", baseBuy: 25, baseSell: 48, volatility: 0.55, perishDays: null, legal: "black", tags: ["illegal"], description: "Тяжёлая. Не трясти.", color: 0x2a2218 }
];

export const ITEM_MAP = Object.fromEntries(ITEMS.map((i) => [i.id, i])) as Record<string, ItemDef>;
export function itemById(id: string): ItemDef {
  const it = ITEM_MAP[id];
  if (!it) throw new Error("Unknown item " + id);
  return it;
}
