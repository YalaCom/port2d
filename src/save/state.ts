import { BALANCE, CAPTAINS, SHIP_NAMES } from "../data/balance";
import { ITEMS, itemById, type Legal } from "../data/items";

export interface Lot { uid: string; itemId: string; qty: number; quality: 1|2|3; origin: string; legal: Legal; daysLeft: number|null; buyPrice: number }
export interface StallSlot { lot: Lot|null; price: number; selling: boolean }
export interface ShipOffer { lot: Lot; ask: number }
export interface ShipState { name: string; captain: string; mood: string; pride: number; relationship: number; offers: ShipOffer[]; present: boolean }
export interface DayStats { revenue: number; cost: number; deals: number; failedDeals: number; boughtQty: number; soldQty: number; rotLoss: number; bestDeal: string; notes: string[] }
export interface SaveData {
  version: 1; day: number; hour: number; minute: number; weather: "clear"|"cloud"|"rain"|"storm";
  gold: number; scene: "world"|"home"; px: number; py: number; inventory: Lot[]; stall: StallSlot[];
  ship: ShipState; market: Record<string, number>; seed: number; rumours: string[];
  townRep: number; captainRep: number; underRep: number;
  statsAll: { maxGold: number; totalProfit: number; daysPlayed: number; caught: number; goldHistory: number[] };
  today: DayStats; tutorialStep: number; playerName: string;
}
const SAVE_KEY = "prichal_save_v1";
const uid = () => Math.random().toString(36).slice(2, 9);
function mulberry32(a: number) {
  return () => { let t = (a += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pick = <T,>(rng: () => number, arr: T[]) => arr[Math.floor(rng() * arr.length)];
export const emptyToday = (): DayStats => ({ revenue: 0, cost: 0, deals: 0, failedDeals: 0, boughtQty: 0, soldQty: 0, rotLoss: 0, bestDeal: "—", notes: [] });
export function rollWeather(rng: () => number): SaveData["weather"] { const r = rng(); return r < 0.55 ? "clear" : r < 0.78 ? "cloud" : r < 0.93 ? "rain" : "storm"; }
export function buildMarket(day: number, weather: SaveData["weather"], seed: number) {
  const rng = mulberry32(seed + day * 997); const m: Record<string, number> = {};
  for (const c of ["food","fish","spice","textile","tool","drink","rare","contraband"]) {
    let v = 0.85 + rng() * 0.4; if (weather === "storm" && c === "fish") v += 0.25; m[c] = Math.round(v * 100) / 100;
  }
  return m;
}
export function fairPrice(itemId: string, market: Record<string, number>, quality: number) {
  const it = itemById(itemId); return Math.max(1, Math.round(it.baseSell * (market[it.category] ?? 1) * (0.85 + quality * 0.08)));
}
export function captainAsk(itemId: string, market: Record<string, number>, quality: number, pride: number) {
  const it = itemById(itemId); return Math.max(1, Math.round(it.baseBuy * (market[it.category] ?? 1) * (0.9 + quality * 0.06 + pride * 0.12)));
}
function rollShip(day: number, seed: number, market: Record<string, number>): ShipState {
  const rng = mulberry32(seed + day * 1337 + 42); const cap = pick(rng, CAPTAINS); const name = pick(rng, SHIP_NAMES);
  const pool = ITEMS.filter((i) => i.legal === "white" || rng() < 0.1); const offers: ShipOffer[] = [];
  for (let i = 0; i < 3 + Math.floor(rng() * 3); i++) {
    const def = pick(rng, pool); const quality = (rng() < 0.15 ? 3 : rng() < 0.45 ? 2 : 1) as 1|2|3;
    const qty = 2 + Math.floor(rng() * (def.category === "rare" ? 3 : 8));
    const lot: Lot = { uid: uid(), itemId: def.id, qty, quality, origin: name, legal: def.legal, daysLeft: def.perishDays, buyPrice: 0 };
    offers.push({ lot, ask: captainAsk(def.id, market, quality, cap.pride) });
  }
  return { name, captain: cap.name, mood: cap.mood, pride: cap.pride, relationship: 0, offers, present: true };
}
export function rumoursFor(day: number, _seed: number, market: Record<string, number>, weather: SaveData["weather"]) {
  const labels: Record<string, string> = { fish: "рыба", spice: "пряности", food: "зерно", textile: "ткани", tool: "скобянка", drink: "ром", rare: "редкости", contraband: "серый груз" };
  const hot = Object.entries(market).sort((a,b)=>b[1]-a[1])[0]; const cold = Object.entries(market).sort((a,b)=>a[1]-b[1])[0];
  const lines = [`В таверне шепчут: ${labels[hot[0]]} сегодня в цене.`, `А вот ${labels[cold[0]]} почти никто не спрашивает.`];
  if (weather === "storm") lines.push("Шторм. Свежая рыба дорожает."); if (day === 1) lines.push("Капитан у пирса ждёт скупщика.");
  return lines;
}
export function newGame(): SaveData {
  const seed = (Math.random() * 1e9) | 0; const weather = rollWeather(mulberry32(seed)); const market = buildMarket(1, weather, seed);
  return { version: 1, day: 1, hour: 6, minute: 10, weather, gold: BALANCE.startGold, scene: "world", px: 22, py: 18,
    inventory: [], stall: Array.from({ length: BALANCE.stallSlots }, () => ({ lot: null, price: 0, selling: false })),
    ship: rollShip(1, seed, market), market, seed, rumours: rumoursFor(1, seed, market, weather),
    townRep: 0, captainRep: 0, underRep: 0,
    statsAll: { maxGold: BALANCE.startGold, totalProfit: 0, daysPlayed: 0, caught: 0, goldHistory: [BALANCE.startGold] },
    today: emptyToday(), tutorialStep: 0, playerName: "Перекуп" };
}
export const saveGame = (data: SaveData) => localStorage.setItem(SAVE_KEY, JSON.stringify(data));
export function loadGame(): SaveData | null { try { const p = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); return p?.version === 1 ? p : null; } catch { return null; } }
export function exportSave(data: SaveData) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = `prichal-day${data.day}.json`; a.click();
}
export function advanceDay(data: SaveData): SaveData {
  const profit = data.today.revenue - data.today.cost - data.today.rotLoss; const next = { ...data };
  next.day += 1; next.hour = 6; next.minute = 0;
  next.weather = rollWeather(mulberry32(next.seed + next.day * 17));
  next.market = buildMarket(next.day, next.weather, next.seed);
  next.ship = rollShip(next.day, next.seed, next.market);
  next.rumours = rumoursFor(next.day, next.seed, next.market, next.weather);
  next.inventory = rotLots(next.inventory, next);
  next.stall = next.stall.map((s) => { if (!s.lot) return s; const rot = rotLots([s.lot], next); return rot.length ? { ...s, lot: rot[0] } : { lot: null, price: 0, selling: false }; });
  next.statsAll = { ...next.statsAll, daysPlayed: next.statsAll.daysPlayed + 1, totalProfit: next.statsAll.totalProfit + profit, maxGold: Math.max(next.statsAll.maxGold, next.gold), goldHistory: [...next.statsAll.goldHistory, next.gold].slice(-30) };
  next.today = emptyToday(); next.scene = "world"; next.px = 22; next.py = 18; saveGame(next); return next;
}
function rotLots(lots: Lot[], data: SaveData): Lot[] {
  const out: Lot[] = [];
  for (const lot of lots) {
    if (lot.daysLeft == null) { out.push(lot); continue; }
    const left = lot.daysLeft - 1;
    if (left <= 0) { data.today.rotLoss += lot.buyPrice * lot.qty; data.today.notes.push(`${itemById(lot.itemId).name} испортилась.`); continue; }
    out.push({ ...lot, daysLeft: left });
  }
  return out;
}
export function demandLabel(price: number, fair: number) { const r = price / Math.max(1, fair); return r <= 0.85 ? "дёшево" : r <= 1.15 ? "в рынке" : r <= 1.45 ? "дорого" : "люди обходят"; }
export function buyChance(price: number, fair: number, quality: number, hour: number, townRep: number) {
  const r = price / Math.max(1, fair); let p = r < 0.9 ? 0.92 : r > 1.6 ? 0.04 : 0.72 - Math.abs(r - 1) * 0.7;
  p += (quality - 1) * 0.06 + townRep * 0.02; if (hour < 8 || hour >= 18) p *= 0.55; if (hour >= 21) p = 0; return Math.max(0, Math.min(0.95, p));
}
export function addToInventory(data: SaveData, lot: Lot) {
  const same = data.inventory.find((l) => l.itemId === lot.itemId && l.quality === lot.quality && l.buyPrice === lot.buyPrice);
  if (same) same.qty += lot.qty; else data.inventory.push({ ...lot, uid: uid() });
}
export function takeFromInventory(data: SaveData, uidOrItem: string, qty: number): Lot | null {
  const idx = data.inventory.findIndex((l) => l.uid === uidOrItem || l.itemId === uidOrItem); if (idx < 0) return null;
  const lot = data.inventory[idx]; const take = Math.min(qty, lot.qty); lot.qty -= take; const out = { ...lot, qty: take, uid: uid() }; if (lot.qty <= 0) data.inventory.splice(idx, 1); return out;
}
let current: SaveData = loadGame() ?? newGame();
export const getState = () => current;
export const setState = (n: SaveData) => { current = n; };
export function mutate(fn: (s: SaveData) => void) { fn(current); current.statsAll.maxGold = Math.max(current.statsAll.maxGold, current.gold); }
