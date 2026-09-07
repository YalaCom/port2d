export const TILE = 16;
export const MAP_W = 48;
export const MAP_H = 36;
export const ZOOM = 3;
export const PLAYER_SPEED = 72;

export const BALANCE = {
  startGold: 250,
  stallSlots: 4,
  backpackSlots: 12,
  msPerGameHour: 22000,
  stallAfkMultiplier: 2,
  dayStartHour: 6,
  marketStart: 8,
  marketEnd: 18,
  eveningEnd: 21,
  nightEnd: 23,
  forceSleepHour: 24,
  shipLeaveHour: 19,
  marginFairMin: 1.2,
  marginFairMax: 1.4,
  npcBuyIntervalMs: 4200,
  maxOutdoorNpcs: 6,
};

export const SHIP_NAMES = [
  "Серая чайка",
  "Пьяный компас",
  "Северная соль",
  "Без флага",
  "Тёплая гавань",
  "Ржавый ключ",
];

export const CAPTAINS = [
  { name: "Капитан Рорк", mood: "скупой", pride: 0.7 },
  { name: "Мадам Лена", mood: "весёлый", pride: 0.35 },
  { name: "Старик Пётр", mood: "молчаливый", pride: 0.5 },
  { name: "Ганс с брига", mood: "вельможный", pride: 0.8 },
  { name: "Пьяный Уле", mood: "пьяный", pride: 0.2 },
];

export const NPC_NAMES = ["Кухарка Оля", "Щеголь Тихон", "Бедняк Ефим", "Боцман Илья", "Сплетница Вера", "Писарь"];
