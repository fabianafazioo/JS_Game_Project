import { money } from "../shared/utils.js";

export function invItemRow(item, qty){
  return `
    <div class="slider-row" style="align-items:center;">
      <div style="display:flex; gap:10px; align-items:center;">
        <div style="
          width:44px; height:44px; border-radius:16px;
          background: rgba(212,175,55,.22);
          border: 2px solid rgba(212,175,55,.35);
          display:grid; place-items:center; font-size:22px;
        ">${item.emoji}</div>
        <div>
          <div style="font-weight:950;">${item.name}</div>
          <div class="muted">${money(item.price)} each</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="pill">Qty: ${qty}</div>
        <button class="btn btn-primary" data-buy="${item.id}">Buy</button>
      </div>
    </div>
  `;
}

export function trayItem(id, name, emoji, qty){
  return `
    <div class="ing" data-ing="${id}">
      <div class="emoji">${emoji}</div>
      <div class="name">${name}</div>
      <div class="qty">In stock: ${qty}</div>
    </div>
  `;
}
