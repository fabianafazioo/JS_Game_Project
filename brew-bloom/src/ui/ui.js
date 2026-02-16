import { SCREENS, PREP_VIEW } from "../shared/constants.js";
import { MENU_ITEMS } from "../shared/data.js";
import { renderQueue, getPrepStageHTML } from "./components.js";
import { menuScreen, gameScreen, modals } from "./screens.js";

export function createUI({ state, systems }){
  let root;
  let mounted = false;

  function mount(){
    if(mounted) return;
    mounted = true;

    root = document.getElementById("app");
    root.innerHTML = `
      ${menuScreen()}
      ${gameScreen()}
      ${modals()}
    `;

    wireGlobalButtons();
  }

  function wireGlobalButtons(){
    // Menu
    root.querySelector("#btnPlay").addEventListener("click", () => {
      systems.actions.goToScreen(state, SCREENS.GAME);
    });
    root.querySelector("#btnShop").addEventListener("click", () => {
      // Shop screen not implemented in this version; you can add later
      alert("Shop screen later — systems/upgrades will plug in here.");
    });

    // Modals
    const modalSettings = root.querySelector("#modalSettings");
    const modalCredits  = root.querySelector("#modalCredits");
    const modalUIKit    = root.querySelector("#modalUIKit");

    root.querySelector("#btnSettings").addEventListener("click", () => open(modalSettings));
    root.querySelector("#btnCredits").addEventListener("click", () => open(modalCredits));
    root.querySelector("#btnUIKit").addEventListener("click", () => open(modalUIKit));

    root.querySelector("#settingsClose").addEventListener("click", () => close(modalSettings));
    root.querySelector("#settingsOk").addEventListener("click", () => close(modalSettings));
    root.querySelector("#creditsClose").addEventListener("click", () => close(modalCredits));
    root.querySelector("#creditsOk").addEventListener("click", () => close(modalCredits));
    root.querySelector("#uiClose").addEventListener("click", () => close(modalUIKit));
    root.querySelector("#uiOk").addEventListener("click", () => close(modalUIKit));

    // Back button in topbar
    root.querySelector("#btnBack").addEventListener("click", () => {
      systems.actions.goToScreen(state, SCREENS.MENU);
      systems.actions.openPrepMenu(state);
    });
  }

  function open(modal){ modal.classList.remove("hidden"); }
  function close(modal){ modal.classList.add("hidden"); }

  function render(state){
    // Show/hide screens
    const menu = root.querySelector("#screenMenu");
    const game = root.querySelector("#screenGame");
    const topbar = root.querySelector("#topbar");

    menu.classList.toggle("hidden", state.screen !== SCREENS.MENU);
    game.classList.toggle("hidden", state.screen !== SCREENS.GAME);
    topbar.classList.toggle("hidden", state.screen !== SCREENS.GAME);

    if(state.screen === SCREENS.GAME){
      renderGame(state);
    }
  }

  function renderGame(state){
    // Topbar
    root.querySelector("#dayNum").textContent = state.day;
    root.querySelector("#timeText").textContent = state.timeText;
    root.querySelector("#coinsText").textContent = state.coins;
    root.querySelector("#goalText").textContent = `${state.goalDone}/${state.goalTotal}`;
    root.querySelector("#goalFill").style.width = `${Math.round((state.goalDone/state.goalTotal)*100)}%`;

    // Queue
    root.querySelector("#queue").innerHTML = renderQueue(state.queue);

    // Ticket
    root.querySelector("#ticketName").textContent = state.order.customer;
    const coffeeLabel = root.querySelector("#coffeeLabel");
    const pastryLabel = root.querySelector("#pastryLabel");

    coffeeLabel.textContent = state.order.coffee.name;
    pastryLabel.textContent = state.order.pastry.name;

    root.querySelector("#coffeeCheck").textContent = state.order.coffee.done ? "✓" : "○";
    root.querySelector("#pastryCheck").textContent = state.order.pastry.done ? "✓" : "○";

    coffeeLabel.classList.toggle("done", state.order.coffee.done);
    pastryLabel.classList.toggle("done", state.order.pastry.done);

    root.querySelector("#ticketTimer").textContent = `${state.order.secondsLeft}s`;

    const ready = state.order.coffee.done && state.order.pastry.done;
    root.querySelector("#ticketStatus").textContent = ready ? "Ready to Deliver" : "In Progress";

    // Serve button triggers delivery mini-game
    const btnServe = root.querySelector("#btnServe");
    btnServe.disabled = !ready;
    btnServe.onclick = () => systems.actions.startDelivery(state);

    // Prep stage content (menu / coffee / pastry / delivery)
    const prepStage = root.querySelector("#prepStage");
    prepStage.innerHTML = getPrepStageHTML(state);

    // Wire prep buttons
    root.querySelector("#btnPrepMenu").onclick = () => systems.actions.openPrepMenu(state);
    root.querySelector("#btnCoffeeStation").onclick = () => {
      // pick first coffee item for quick demo
      systems.actions.selectPrepItem(state, { type:"coffee", item: MENU_ITEMS.coffee[0] });
    };
    root.querySelector("#btnPastryStation").onclick = () => {
      systems.actions.selectPrepItem(state, { type:"pastry", item: MENU_ITEMS.pastry[0] });
    };

    // Wire prep menu cards (if currently showing menu)
    if(state.prepView === PREP_VIEW.MENU){
      prepStage.querySelectorAll(".menu-card").forEach(card => {
        card.addEventListener("click", () => {
          const type = card.dataset.prepType;
          const id = card.dataset.itemId;
          const item = (type === "coffee" ? MENU_ITEMS.coffee : MENU_ITEMS.pastry).find(x => x.id === id);
          systems.actions.selectPrepItem(state, { type, item });
        });
      });
    }

    // Wire coffee view buttons
    if(state.prepView === PREP_VIEW.COFFEE){
      prepStage.querySelector("#coffeeCancel").onclick = () => systems.actions.openPrepMenu(state);
      prepStage.querySelector("#coffeeSubmit").onclick = () => systems.actions.submitCoffee(state);
    }

    // Wire pastry view buttons
    if(state.prepView === PREP_VIEW.PASTRY){
      prepStage.querySelector("#pastryCancel").onclick = () => systems.actions.openPrepMenu(state);
      prepStage.querySelector("#pastryBake").onclick = () => systems.actions.startBaking(state);
    }

    // Wire delivery view buttons + highlight target table + collision check
    if(state.prepView === PREP_VIEW.DELIVERY){
      prepStage.querySelector("#deliveryBack").onclick = () => systems.actions.openPrepMenu(state);

      const tables = Array.from(prepStage.querySelectorAll(".table"));
      tables.forEach(t => t.classList.toggle("target", Number(t.dataset.table) === state.order.tableTarget));

      // Interact key (E) is detected by systems, but collision is best checked in UI DOM
      // We'll listen for keydown E here and decide if close enough.
      // NOTE: simple approach: one listener, but we guard by current view.
      const handler = (e) => {
        if(state.prepView !== PREP_VIEW.DELIVERY) return;
        if(e.key.toLowerCase() !== "e") return;

        const room = prepStage.querySelector("#room").getBoundingClientRect();
        const barista = prepStage.querySelector("#barista").getBoundingClientRect();
        const target = tables.find(t => Number(t.dataset.table) === state.order.tableTarget);
        if(!target) return;

        const targetRect = target.getBoundingClientRect();
        const baristaCenterX = barista.left + barista.width/2;
        const baristaCenterY = barista.top + barista.height/2;

        const inside =
          baristaCenterX >= targetRect.left && baristaCenterX <= targetRect.right &&
          baristaCenterY >= targetRect.top && baristaCenterY <= targetRect.bottom;

        const hint = prepStage.querySelector("#deliveryHint");
        if(inside){
          hint.textContent = "Served! 🎉";
          systems.actions.completeOrder(state);
        } else {
          hint.textContent = "Not close enough — walk to the highlighted table.";
        }
      };

      // attach once per render of delivery view
      window.addEventListener("keydown", handler, { once:false });
    }
  }

  return { mount, render };
}
