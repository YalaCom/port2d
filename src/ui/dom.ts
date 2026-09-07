import { itemById } from "../data/items";
import { addToInventory, advanceDay, buyChance, demandLabel, exportSave, fairPrice, getState, mutate, newGame, saveGame, setState, takeFromInventory, type Lot, type SaveData } from "../save/state";

type Hooks = { onClose: () => void; onSleepDone: () => void; toast: (msg: string) => void };
let hooks: Hooks; let root: HTMLElement;

export function mountUi(h: Hooks) { hooks = h; root = document.getElementById("ui-root")!; renderHud(); }
export function renderHud(extraHint?: string) {
  const s = getState();
  const weather = { clear: "ясно", cloud: "пасмурно", rain: "дождь", storm: "шторм" }[s.weather];
  const hh = String(s.hour).padStart(2,"0"); const mm = String(Math.floor(s.minute)).padStart(2,"0");
  const hint = extraHint ?? (s.tutorialStep === 0 ? "Кликните по пирсу — идите к кораблю. ЛКМ = путь." : s.tutorialStep === 1 ? "Купите товар, затем откройте палатку." : s.hour >= 23 ? "Пора спать. Идите в дом." : "");
  const keep = root.querySelector(".modal-back");
  root.innerHTML = `<div class="hud"><div class="chip">День ${s.day} · ${hh}:${mm}<br/>${weather}</div><div class="chip">${s.gold} монет</div><div class="chip">Реп. ${s.townRep>=0?"+":""}${s.townRep}</div><div class="hud-right"><button class="px" id="btn-inv">Сумка</button><button class="px" id="btn-pause">Меню</button></div></div>${hint?`<div class="hint">${hint}</div>`:""}<div id="modal-slot"></div>`;
  if (keep) root.querySelector("#modal-slot")?.appendChild(keep);
  root.querySelector("#btn-inv")?.addEventListener("click", () => openInventory());
  root.querySelector("#btn-pause")?.addEventListener("click", () => openPause());
}
export function setInteract(label: string | null, onUse?: () => void) {
  root.querySelector("#interact-fixed")?.remove();
  if (!label) return;
  const b = document.createElement("div"); b.id = "interact-fixed"; b.className = "interact-btn";
  b.innerHTML = `<button class="px">${label} <span class="enter-prompt">(E)</span></button>`;
  b.querySelector("button")?.addEventListener("click", () => onUse?.()); root.appendChild(b);
}
export function toast(msg: string) {
  hooks.toast(msg);
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; root.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
function modal(html: string) {
  const slot = root.querySelector("#modal-slot") || root;
  slot.innerHTML = `<div class="modal-back"><div class="modal">${html}</div></div>`;
  slot.querySelector("[data-close]")?.addEventListener("click", closeModal);
}
export function closeModal() { const slot = root.querySelector("#modal-slot"); if (slot) slot.innerHTML = ""; hooks.onClose(); }
export function isModalOpen() { return !!root.querySelector(".modal-back"); }
function lotLine(lot: Lot, extra = "") {
  const it = itemById(lot.itemId); const stars = "★".repeat(lot.quality) + "☆".repeat(3-lot.quality);
  const rot = lot.daysLeft != null ? ` · ${lot.daysLeft}д` : ""; const gray = lot.legal !== "white" ? " · серое" : "";
  return `<div class="good"><div class="ico" style="background:#${it.color.toString(16).padStart(6,"0")}"></div><div><b>${it.name}</b> ×${lot.qty}<br/>${stars}${rot}${gray} · ${it.description}</div><div>${extra}</div></div>`;
}
export function openShip() {
  const s = getState(); if (!s.ship.present) { toast("Корабль уже отчалил."); return; }
  const rows = s.ship.offers.map((o,i) => lotLine(o.lot, `<div class="row" style="flex-direction:column;align-items:flex-end"><div>${o.ask} монет/шт</div><button class="px" data-buy="${i}">Купить всё</button><button class="px ghost" data-hag="${i}">Торг</button></div>`)).join("");
  modal(`<h2>${s.ship.name}</h2><p>${s.ship.captain} · ${s.ship.mood}. «Груз не хранится.»</p><div class="goods">${rows || "<p>Трюм пуст.</p>"}</div><button class="px ghost" data-close>Уйти</button>`);
  root.querySelectorAll("[data-buy]").forEach((el) => el.addEventListener("click", () => buyOffer(Number((el as HTMLElement).dataset.buy), false)));
  root.querySelectorAll("[data-hag]").forEach((el) => el.addEventListener("click", () => openHaggle(Number((el as HTMLElement).dataset.hag))));
}
function buyOffer(index: number, haggle: boolean, customPrice?: number) {
  const s = getState(); const offer = s.ship.offers[index]; if (!offer) return;
  const price = customPrice ?? offer.ask; const total = price * offer.lot.qty;
  if (s.gold < total) { toast("Не хватает монет."); return; }
  mutate((st) => { st.gold -= total; addToInventory(st, { ...offer.lot, buyPrice: price }); st.ship.offers.splice(index,1); st.today.cost += total; st.today.boughtQty += offer.lot.qty; st.today.deals += 1; if (st.tutorialStep < 2) st.tutorialStep = 1; });
  saveGame(getState()); toast(`Куплено за ${total}`); renderHud();
  if (getState().ship.offers.length) openShip(); else closeModal();
}
function openHaggle(index: number) {
  const s = getState(); const offer = s.ship.offers[index]; const it = itemById(offer.lot.itemId);
  const fair = Math.round(offer.ask * (0.82 + s.ship.pride * 0.05)); let patience = 4; let ask = offer.ask;
  modal(`<h2>Торг · ${it.name}</h2><p>${s.ship.captain}. Партия ×${offer.lot.qty}. Их цена: <b id="ask">${ask}</b></p><div class="row"><input class="px" id="bid" type="number" value="${Math.round(ask*0.9)}" /><button class="px" id="offer">Предложить</button><button class="px ghost" id="take">Взять по их цене</button></div><p>Терпение: <span id="pat">${patience}</span></p><div class="log" id="log">«Ну давайте. Только быстро.»</div><button class="px ghost" data-close>Уйти</button>`);
  const log = (t: string) => { const el = root.querySelector("#log")!; el.innerHTML = t + "<br/>" + el.innerHTML; };
  root.querySelector("#take")?.addEventListener("click", () => buyOffer(index, false, ask));
  root.querySelector("#offer")?.addEventListener("click", () => {
    const bid = Number((root.querySelector("#bid") as HTMLInputElement).value); if (!Number.isFinite(bid) || bid <= 0) return;
    const minAccept = Math.round(fair * (0.92 + s.ship.pride * 0.08));
    if (bid >= ask) { buyOffer(index, true, ask); return; }
    if (bid >= minAccept && Math.random() < 1 - (ask-bid)/Math.max(1, ask-minAccept+4)) { log(`«Ладно. ${bid}.»`); buyOffer(index, true, bid); return; }
    patience -= 1; ask = Math.max(minAccept, Math.round(ask - (ask-bid)*0.25));
    (root.querySelector("#ask") as HTMLElement).textContent = String(ask);
    (root.querySelector("#pat") as HTMLElement).textContent = String(patience);
    log(`Капитан сплёвывает за борт. Теперь ${ask}.`);
    if (patience <= 0) { mutate((st) => { st.today.failedDeals += 1; }); toast("Сделка сорвалась."); closeModal(); }
  });
}
export function openStall() {
  const s = getState();
  const inv = s.inventory.map((lot) => lotLine(lot, `<button class="px" data-put="${lot.uid}">На витрину</button>`)).join("") || "<p>Сумка пуста.</p>";
  const slots = s.stall.map((slot,i) => {
    if (!slot.lot) return `<div class="good"><div></div><div>Слот ${i+1}: пусто</div><div></div></div>`;
    const fair = fairPrice(slot.lot.itemId, s.market, slot.lot.quality);
    return lotLine(slot.lot, `<div class="row" style="flex-direction:column;align-items:flex-end"><input class="px" data-price="${i}" type="number" value="${slot.price}" /><div>${demandLabel(slot.price, fair)}</div><button class="px ghost" data-take="${i}">Убрать</button></div>`);
  }).join("");
  modal(`<h2>Палатка</h2><p>Цена и подсказка спроса — не формула.</p><h2 style="font-size:11px">Витрина</h2><div class="goods">${slots}</div><h2 style="font-size:11px">Сумка</h2><div class="goods">${inv}</div><button class="px ghost" data-close>Закрыть</button>`);
  root.querySelectorAll("[data-put]").forEach((el) => el.addEventListener("click", () => {
    const id = (el as HTMLElement).dataset.put!;
    mutate((st) => { const empty = st.stall.find((x) => !x.lot); if (!empty) { toast("Нет слотов."); return; } const lot = takeFromInventory(st, id, st.inventory.find((l)=>l.uid===id)?.qty ?? 0); if (!lot) return; empty.lot = lot; empty.price = Math.round(fairPrice(lot.itemId, st.market, lot.quality)*1.15); empty.selling = true; if (st.tutorialStep < 3) st.tutorialStep = 2; });
    saveGame(getState()); openStall();
  }));
  root.querySelectorAll("[data-take]").forEach((el) => el.addEventListener("click", () => { const i = Number((el as HTMLElement).dataset.take); mutate((st) => { const slot = st.stall[i]; if (slot.lot) addToInventory(st, slot.lot); slot.lot = null; slot.selling = false; }); saveGame(getState()); openStall(); }));
  root.querySelectorAll("[data-price]").forEach((el) => el.addEventListener("change", () => { const i = Number((el as HTMLElement).dataset.price); const v = Number((el as HTMLInputElement).value); mutate((st) => { st.stall[i].price = Math.max(1, v|0); st.stall[i].selling = true; }); saveGame(getState()); openStall(); }));
}
export function openTavern() {
  const s = getState();
  modal(`<h2>Таверна «Мокрая снасть»</h2><ul>${s.rumours.map((r)=>`<li>${r}</li>`).join("")}</ul><div class="row"><button class="px" id="food">Еда за 8</button><button class="px ghost" data-close>Выйти</button></div>`);
  root.querySelector("#food")?.addEventListener("click", () => { if (getState().gold < 8) return toast("Нет денег."); mutate((st)=>{st.gold-=8; st.today.notes.push("Поели в таверне.");}); saveGame(getState()); toast("Горячее."); closeModal(); });
}
export function openInventory() { const s = getState(); modal(`<h2>Сумка</h2><div class="goods">${s.inventory.map((l)=>lotLine(l)).join("")||"<p>Пусто.</p>"}</div><button class="px ghost" data-close>Закрыть</button>`); }
export function openPause() {
  modal(`<h2>Пауза</h2><p>Офлайн. Сейв в браузере.</p><div class="row"><button class="px" id="sv">Сохранить</button><button class="px" id="dl">JSON</button><button class="px danger" id="ng">Новая игра</button><button class="px ghost" data-close>Дальше</button></div><input class="px" id="file" type="file" accept="application/json" style="width:auto" />`);
  root.querySelector("#sv")?.addEventListener("click", () => { saveGame(getState()); toast("Сохранено."); });
  root.querySelector("#dl")?.addEventListener("click", () => exportSave(getState()));
  root.querySelector("#ng")?.addEventListener("click", () => { setState(newGame()); saveGame(getState()); location.reload(); });
  root.querySelector("#file")?.addEventListener("change", async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return; setState(JSON.parse(await f.text()) as SaveData); saveGame(getState()); location.reload(); });
}
export function openSleepConfirm(onYes: () => void) {
  modal(`<h2>Завершить день ${getState().day}?</h2><div class="row"><button class="px" id="yes">Спать</button><button class="px ghost" data-close>Ещё похожу</button></div>`);
  root.querySelector("#yes")?.addEventListener("click", onYes);
}
export function openSleepReport() {
  const before = getState(); const t = before.today; const profit = t.revenue - t.cost - t.rotLoss;
  modal(`<h2>Книга учёта · ночь ${before.day}</h2><p>Выручка ${t.revenue} · Себес ${t.cost} · Чисто ${profit}</p><p>Сделок ${t.deals} · Сорвано ${t.failedDeals} · Продано ${t.soldQty}</p><p>Порча ${t.rotLoss} · ${t.bestDeal}</p><p>Капитал ${before.gold} · Макс ${before.statsAll.maxGold}</p><button class="px" id="nd">Наступил новый день</button>`);
  root.querySelector("#nd")?.addEventListener("click", () => { setState(advanceDay(getState())); closeModal(); hooks.onSleepDone(); toast(`День ${getState().day}.`); renderHud(); });
}
export function tryNpcBuy(): string | null {
  const s = getState(); if (s.hour < 8 || s.hour >= 21) return null;
  const selling = s.stall.map((sl,i)=>({sl,i})).filter((x)=>x.sl.lot && x.sl.selling); if (!selling.length) return null;
  const pick = selling[Math.floor(Math.random()*selling.length)]; const lot = pick.sl.lot!;
  const fair = fairPrice(lot.itemId, s.market, lot.quality);
  if (Math.random() > buyChance(pick.sl.price, fair, lot.quality, s.hour, s.townRep)) return null;
  const qty = Math.min(lot.qty, 1 + Math.floor(Math.random()*2)); const gold = qty * pick.sl.price;
  mutate((st) => { st.gold += gold; st.today.revenue += gold; st.today.soldQty += qty; st.today.deals += 1; lot.qty -= qty; if (lot.qty <= 0) { st.stall[pick.i].lot = null; st.stall[pick.i].selling = false; } if (st.tutorialStep < 4) st.tutorialStep = 3; });
  saveGame(getState()); return `Купили ${itemById(lot.itemId).name} ×${qty} за ${gold}`;
}
