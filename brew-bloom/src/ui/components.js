import { PREP_VIEW } from "../shared/constants.js";
import { MENU_ITEMS } from "../shared/data.js";

export function renderQueue(queue){
  return queue.map(c => `
    <div class="customer">
      <div class="customer-head">
        <div class="avatar">🙂</div>
        <div class="cname">${c.name}</div>
        <div class="cicons">${c.icons}</div>
      </div>
      <div class="bar">
        <div class="bar-fill ${c.patience < 0.25 ? "danger":""}" style="width:${Math.max(0,Math.min(1,c.patience))*100}%"></div>
      </div>
    </div>
  `).join("");
}

export function prepMenuView(){
  const coffeeCards = MENU_ITEMS.coffee.map(item => menuCard("coffee", item)).join("");
  const pastryCards = MENU_ITEMS.pastry.map(item => menuCard("pastry", item)).join("");

  return `
    <div style="width:min(860px,98%);">
      <div class="muted" style="font-weight:900; margin-bottom:10px;">
        Choose what to prep (more interactive than clicking — you’ll play a mini-game).
      </div>
      <div class="menu-grid">
        ${coffeeCards}
        ${pastryCards}
      </div>
    </div>
  `;
}

function menuCard(type, item){
  return `
    <div class="menu-card" data-prep-type="${type}" data-item-id="${item.id}">
      <div class="top">
        <div class="food-emoji">${item.emoji}</div>
        <div>
          <div class="name">${item.name}</div>
          <div class="desc">${item.desc}</div>
        </div>
        <div class="badge">$${item.price}</div>
      </div>
    </div>
  `;
}

export function coffeeMinigameView(state){
  return `
    <div class="minigame">
      <h3>☕ Coffee Station — Pour to the Sweet Spot</h3>
      <p class="muted">Hold <kbd>Space</kbd> to pour. Release and click “Submit” when the fill is inside the gold zone.</p>
      <div class="pour-meter">
        <div class="zone"></div>
        <div class="pour-fill" id="pourFill" style="width:${Math.round(state.coffeePour.fill)}%"></div>
      </div>
      <div class="row gap">
        <button class="btn btn-secondary" id="coffeeCancel">Back</button>
        <button class="btn btn-primary" id="coffeeSubmit">Submit Pour</button>
      </div>
      <div class="mini-hint" id="coffeeHint">Aim for the gold zone.</div>
    </div>
  `;
}

export function pastryMinigameView(state){
  const keys = state.pastryQTE.seq.map((k,i) => `
    <div class="key ${i < state.pastryQTE.index ? "done":""}">${k}</div>
  `).join("");

  const pct = Math.max(0, (state.pastryQTE.timer/6.0))*100;

  return `
    <div class="minigame">
      <h3>🥐 Pastry Station — Quick-Time Prep</h3>
      <p class="muted">Hit the sequence before time runs out, then bake.</p>

      <div class="qte">
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="qte-keys" id="qteKeys">${keys}</div>
      </div>

      <div class="row gap" style="margin-top:12px;">
        <button class="btn btn-secondary" id="pastryCancel">Back</button>
        <button class="btn btn-primary" id="pastryBake" ${state.pastryQTE.canBake ? "" : "disabled"}>Start Baking</button>
      </div>

      <div class="mini-hint" id="pastryHint">
        ${state.pastryQTE.canBake ? "Nice! Bake it." : "Use W/A/S/D to complete the sequence."}
      </div>
    </div>
  `;
}

export function deliveryMinigameView(state){
  return `
    <div class="minigame">
      <h3>🧍 Delivery — Walk to the Table</h3>
      <p class="muted">Use <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk to the highlighted table. Press <kbd>E</kbd> to serve.</p>

      <div class="room" id="room">
        <div class="barista" id="barista" style="left:${state.delivery.x}%; top:${state.delivery.y}%"></div>
        <div class="table" data-table="1" style="left: 75%; top: 20%;">T1</div>
        <div class="table" data-table="2" style="left: 70%; top: 65%;">T2</div>
        <div class="table" data-table="3" style="left: 25%; top: 60%;">T3</div>
      </div>

      <div class="mini-hint" id="deliveryHint">Deliver to the highlighted table and press E.</div>
      <div class="row gap">
        <button class="btn btn-secondary" id="deliveryBack">Back</button>
      </div>
    </div>
  `;
}

export function getPrepStageHTML(state){
  switch(state.prepView){
    case PREP_VIEW.MENU: return prepMenuView();
    case PREP_VIEW.COFFEE: return coffeeMinigameView(state);
    case PREP_VIEW.PASTRY: return pastryMinigameView(state);
    case PREP_VIEW.DELIVERY: return deliveryMinigameView(state);
    default: return `<div class="prep-placeholder">Select a station…</div>`;
  }
}
