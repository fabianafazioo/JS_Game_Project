import { FLOWERS, INVENTORY_ITEMS } from "../shared/data.js";
import { money } from "../shared/utils.js";
import { saveAudioSettings } from "../shared/state.js";
import { SCREENS } from "../shared/constants.js";
import { homeScreen, gameScreen, modals } from "./screens.js";
import { invItemRow, trayItem } from "./components.js";

export function createUI({ state, systems }){
  let root;
  let mounted = false;

  // Audio (UI-owned for now)
  const audio = {
    bgm: new Audio("assets/sfx/bgm.mp3"),
    click: new Audio("assets/sfx/click.mp3"),
    cash: new Audio("assets/sfx/cash.mp3"),
    success: new Audio("assets/sfx/success.mp3"),
    error: new Audio("assets/sfx/error.mp3"),
  };
  audio.bgm.loop = true;

  function mount(){
    if(mounted) return;
    mounted = true;

    root = document.getElementById("app");
    root.innerHTML = `
      ${homeScreen()}
      ${gameScreen()}
      ${modals()}
    `;

    spawnFlowers();
    wireHome();
    wireModals();
    wireGameButtons();
    applyAudioSettings();
    autoplayBGM();

    // Show welcome popup on first load (UI-only)
    openModal("modalWelcome");
  }

  function wireHome(){
    byId("btnPlay").addEventListener("click", () => {
      sfxClick();
      systems.actions.goTo(state, SCREENS.GAME);
    });

    byId("btnInventory").addEventListener("click", () => {
      sfxClick();
      openInventory();
    });

    byId("btnSettings").addEventListener("click", () => {
      sfxClick();
      openSettings();
    });

    byId("btnCredits").addEventListener("click", () => {
      sfxClick();
      openModal("modalCredits");
    });
  }

  function wireGameButtons(){
    byId("btnBack").addEventListener("click", () => {
      sfxClick();
      systems.actions.goTo(state, SCREENS.MENU);
    });

    byId("btnOpenInventory").addEventListener("click", () => {
      sfxClick();
      openInventory();
    });

    byId("btnSettingsInGame").addEventListener("click", () => {
      sfxClick();
      openSettings();
    });

    byId("btnMoney").addEventListener("click", () => {
      sfxClick();
      state.message = `Cash: ${money(state.cash)}`;
    });

    byId("btnQueue").addEventListener("click", () => {
      sfxClick();
      state.message = "Queue is shown on the left + customers walk to tables.";
    });

    byId("btnTakeOrder").addEventListener("click", () => {
      sfxClick();
      const r = systems.actions.tryTakeOrder(state);
      if(!r.ok) { sfxError(); state.message = r.reason || "Can't take order."; }
      else { sfxSuccess(); }
    });

    byId("btnServe").addEventListener("click", () => {
      sfxClick();
      const r = systems.actions.tryDeliver(state);
      if(!r.ok){ sfxError(); state.message = r.reason || "Can't serve yet."; }
      else { sfxCash(); }
    });
  }

  function wireModals(){
    // welcome
    byId("welcomeClose").onclick = () => { sfxClick(); closeModal("modalWelcome"); };
    byId("welcomeOk").onclick = () => { sfxClick(); closeModal("modalWelcome"); };
    byId("welcomeGoInventory").onclick = () => { sfxClick(); closeModal("modalWelcome"); openInventory(); };

    // inventory
    byId("invClose").onclick = () => { sfxClick(); closeModal("modalInventory"); };
    byId("invDone").onclick = () => { sfxClick(); closeModal("modalInventory"); };

    // settings
    byId("settingsClose").onclick = () => { sfxClick(); closeModal("modalSettings"); };
    byId("settingsOk").onclick = () => { sfxClick(); closeModal("modalSettings"); };

    // credits
    byId("creditsClose").onclick = () => { sfxClick(); closeModal("modalCredits"); };
    byId("creditsOk").onclick = () => { sfxClick(); closeModal("modalCredits"); };

    // settings controls
    byId("musicVol").addEventListener("input", (e) => {
      state.audio.musicVolume = Number(e.target.value);
      applyAudioSettings();
      saveAudioSettings(state);
    });

    byId("sfxVol").addEventListener("input", (e) => {
      state.audio.sfxVolume = Number(e.target.value);
      applyAudioSettings();
      saveAudioSettings(state);
    });

    byId("toggleMusic").addEventListener("click", () => {
      sfxClick();
      state.audio.musicEnabled = !state.audio.musicEnabled;
      applyAudioSettings();
      saveAudioSettings(state);
      byId("toggleMusic").textContent = state.audio.musicEnabled ? "On" : "Off";
    });

    byId("toggleSfx").addEventListener("click", () => {
      sfxClick();
      state.audio.sfxEnabled = !state.audio.sfxEnabled;
      applyAudioSettings();
      saveAudioSettings(state);
      byId("toggleSfx").textContent = state.audio.sfxEnabled ? "On" : "Off";
    });
  }

  function render(state){
    // screen toggles
    const menu = byId("screenMenu");
    const game = byId("screenGame");
    const top = byId("topbar");

    menu.classList.toggle("hidden", state.screen !== SCREENS.MENU);
    game.classList.toggle("hidden", state.screen !== SCREENS.GAME);
    top.classList.toggle("hidden", state.screen !== SCREENS.GAME);

    if(state.screen === SCREENS.GAME){
      renderGame(state);
    }
  }

  function renderGame(state){
    byId("dayNum").textContent = state.day;
    byId("timeText").textContent = "Brew Time";
    byId("cashText").textContent = state.cash.toFixed(2);

    byId("goalText").textContent = `${state.goalDone}/${state.goalTotal}`;
    byId("goalFill").style.width = `${Math.round((state.goalDone/state.goalTotal)*100)}%`;

    byId("timerText").textContent = `${Math.max(0, Math.ceil(state.orderSeconds))}s`;
    byId("msgText").textContent = state.message || "";

    // queue list (simple)
    const q = byId("queueList");
    q.innerHTML = state.customers.map(c => {
      const icon = c.order ? c.order.emoji : "💬";
      const txt = c.order ? c.order.name : (c.seated ? "Ready to order" : "Walking to table");
      return `<div class="muted" style="padding:6px 0;"><strong>${c.name}</strong> ${icon} — ${txt}</div>`;
    }).join("") || `<div class="muted">No customers yet… they’ll walk in soon.</div>`;

    // ingredient tray UI
    const tray = byId("tray");
    tray.innerHTML = `
      ${trayItem("milk", "Milk", "🥛", state.inventory.milk || 0)}
      ${trayItem("beans", "Beans", "🫘", state.inventory.beans || 0)}
      ${trayItem("sugar", "Sugar", "🍬", state.inventory.sugar || 0)}
      ${trayItem("croissant", "Croissant", "🥐", state.inventory.croissant || 0)}
      ${trayItem("muffin", "Muffin", "🧁", state.inventory.muffin || 0)}
      ${trayItem("cookie", "Cookie", "🍪", state.inventory.cookie || 0)}
    `;

    // clicking tray items just gives feedback (UI fun)
    tray.querySelectorAll(".ing").forEach(el => {
      el.onclick = () => {
        sfxClick();
        state.message = `Selected ingredient: ${el.dataset.ing}`;
      };
    });

    // canvas render
    drawCafe(state);
  }

  function openInventory(){
    renderInventory();
    openModal("modalInventory");
  }

  function renderInventory(){
    byId("invCash").textContent = state.cash.toFixed(2);

    const grid = byId("invGrid");
    grid.innerHTML = INVENTORY_ITEMS.map(item => {
      const qty = state.inventory[item.id] || 0;
      return invItemRow(item, qty);
    }).join("");

    // clicking inventory items just gives feedback (UI fun)
    grid.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-buy");
        const item = INVENTORY_ITEMS.find(x => x.id === id);

        const res = systems.actions.buyInventory(state, id, item.price);
        if(res.ok) sfxCash();
        else sfxError();

        // ✅ refresh cash + quantities
        renderInventory();
    });
    });

  }

  function openSettings(){
    byId("musicVol").value = state.audio.musicVolume;
    byId("sfxVol").value = state.audio.sfxVolume;
    byId("toggleMusic").textContent = state.audio.musicEnabled ? "On" : "Off";
    byId("toggleSfx").textContent = state.audio.sfxEnabled ? "On" : "Off";
    openModal("modalSettings");
  }

  function openModal(id){ byId(id).classList.remove("hidden"); }
  function closeModal(id){ byId(id).classList.add("hidden"); }

  function spawnFlowers(){
    const bg = byId("homeBg");
    if(!bg) return;

    bg.innerHTML = "";
    const count = 42; // "many flowers everywhere"

    for(let i=0;i<count;i++){
      const f = document.createElement("div");
      f.className = "flower";
      f.textContent = FLOWERS[Math.floor(Math.random()*FLOWERS.length)];

      const left = Math.random()*100;
      const delay = -Math.random()*18;
      const dur = 10 + Math.random()*18;
      const scale = (0.6 + Math.random()*1.3).toFixed(2);

      f.style.left = `${left}%`;
      f.style.animationDuration = `${dur}s`;
      f.style.animationDelay = `${delay}s`;
      f.style.setProperty("--s", scale);
      f.style.opacity = `${0.35 + Math.random()*0.6}`;
      f.style.filter = `drop-shadow(0 10px 10px rgba(0,0,0,${0.08+Math.random()*0.12}))`;

      bg.appendChild(f);
    }
  }

  function applyAudioSettings(){
    audio.bgm.volume = state.audio.musicEnabled ? state.audio.musicVolume : 0;
    [audio.click,audio.cash,audio.success,audio.error].forEach(a => {
      a.volume = state.audio.sfxEnabled ? state.audio.sfxVolume : 0;
    });
  }

  async function autoplayBGM(){
    try {
      if(state.audio.musicEnabled){
        audio.bgm.volume = state.audio.musicVolume;
        await audio.bgm.play();
      }
    } catch {
      // Browser blocks autoplay until user interacts.
      // We'll start on first click.
      const startOnClick = async () => {
        try { await audio.bgm.play(); } catch {}
        window.removeEventListener("pointerdown", startOnClick);
      };
      window.addEventListener("pointerdown", startOnClick);
    }
  }

  function sfxClick(){ safePlay(audio.click); }
  function sfxCash(){ safePlay(audio.cash); }
  function sfxSuccess(){ safePlay(audio.success); }
  function sfxError(){ safePlay(audio.error); }

  function safePlay(a){
    if(!state.audio.sfxEnabled) return;
    try { a.currentTime = 0; a.play(); } catch {}
  }

  // ====== CANVAS SCENE (TOP-DOWN) ======
  function drawCafe(state){
    const canvas = byId("cafeCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // floor
    ctx.fillStyle = "rgba(214,191,167,0.55)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // counter area
    ctx.fillStyle = "rgba(90,62,43,0.65)";
    ctx.fillRect(0,0,canvas.width,60);
    ctx.fillStyle = "rgba(246,239,231,0.85)";
    ctx.font = "bold 16px system-ui";
    ctx.fillText("☕ Counter / Coffee Stand", 14, 36);

    // tables
    for(const t of state.tables){
      drawTable(ctx, t.x, t.y, `T${t.id}`);
    }

    // customers
    for(const c of state.customers){
      drawPerson(ctx, c.x, c.y, "rgba(59,42,30,0.92)");
      // bubble with $
      if(c.seated){
        drawBubble(ctx, c.x, c.y-22, c.order ? `${c.order.emoji} $` : "$");
      }
    }

    // server (gold)
    drawPerson(ctx, state.server.x, state.server.y, "rgba(212,175,55,0.95)");
    drawBubble(ctx, state.server.x, state.server.y-22, "YOU");

    // little instructions
    ctx.fillStyle = "rgba(59,42,30,0.85)";
    ctx.font = "900 13px system-ui";
    ctx.fillText("Move: Arrow keys. Walk near a customer → Take Order → Serve.", 14, canvas.height-14);
  }

  function drawTable(ctx, x, y, label){
    ctx.fillStyle = "rgba(90,62,43,0.9)";
    roundRect(ctx, x-26, y-16, 52, 32, 12, true);
    ctx.fillStyle = "rgba(246,239,231,0.92)";
    ctx.font = "900 12px system-ui";
    ctx.fillText(label, x-10, y+4);
  }

  function drawPerson(ctx, x, y, color){
    ctx.fillStyle = color;
    roundRect(ctx, x-10, y-10, 20, 20, 7, true);
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.beginPath();
    ctx.ellipse(x, y+14, 12, 5, 0, 0, Math.PI*2);
    ctx.fill();
  }

  function drawBubble(ctx, x, y, text){
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    roundRect(ctx, x-20, y-18, 40, 22, 10, true);
    ctx.fillStyle = "rgba(59,42,30,0.9)";
    ctx.font = "900 11px system-ui";
    ctx.fillText(text, x-14, y-3);
  }

  function roundRect(ctx, x, y, w, h, r, fill){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
    if(fill) ctx.fill();
  }

  function byId(id){ return root.querySelector(`#${id}`); }

  return { mount, render };
}
