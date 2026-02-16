import { SCREENS, PREP_VIEW, KEYS } from "../shared/constants.js";
import { clamp, pick, shuffle } from "../shared/utils.js";
import { makeNewOrder } from "../shared/state.js";
import { CUSTOMER_NAMES } from "../shared/data.js";

export function createSystems(){
  const held = new Set();

  function update(dt, state){
    // Only tick gameplay when in GAME screen
    if(state.screen !== SCREENS.GAME) return;

    // 1-second ticks (order timer + patience)
    state._accum1s += dt;
    while(state._accum1s >= 1){
      state._accum1s -= 1;

      // order countdown only while not ready
      const ready = state.order.coffee.done && state.order.pastry.done;
      if(!ready && state.order.secondsLeft > 0){
        state.order.secondsLeft -= 1;
        if(state.order.secondsLeft <= 0){
          state.order.secondsLeft = 0;
          // could mark as failed, etc.
        }
      }

      // patience drops
      state.queue = state.queue.map(c => ({...c, patience: Math.max(0, c.patience - 0.01)}));
    }

    // Coffee pour fill
    if(state.prepView === PREP_VIEW.COFFEE && state.coffeePour.pouring){
      state.coffeePour.fill = clamp(state.coffeePour.fill + (dt * 50), 0, 100);
    }

    // Pastry QTE timer
    if(state.prepView === PREP_VIEW.PASTRY && state.pastryQTE.active){
      state.pastryQTE.timer = Math.max(0, state.pastryQTE.timer - dt);
      if(state.pastryQTE.timer <= 0){
        // reset
        startPastryQTE(state);
      }
    }

    // Delivery movement
    if(state.prepView === PREP_VIEW.DELIVERY){
      let dx = 0, dy = 0;
      if(held.has(KEYS.UP)) dy -= state.delivery.speed;
      if(held.has(KEYS.DOWN)) dy += state.delivery.speed;
      if(held.has(KEYS.LEFT)) dx -= state.delivery.speed;
      if(held.has(KEYS.RIGHT)) dx += state.delivery.speed;

      state.delivery.x = clamp(state.delivery.x + dx, 2, 96);
      state.delivery.y = clamp(state.delivery.y + dy, 8, 86);
    }
  }

  function handleKeyDown(e, state){
    const k = e.key.toLowerCase();

    // Coffee: hold Space to pour
    if(state.prepView === PREP_VIEW.COFFEE && e.code === "Space"){
      state.coffeePour.pouring = true;
      return;
    }

    // Pastry: QTE keys
    if(state.prepView === PREP_VIEW.PASTRY && state.pastryQTE.active){
      const key = e.key.toUpperCase();
      const expected = state.pastryQTE.seq[state.pastryQTE.index];
      if(["W","A","S","D"].includes(key)){
        if(key === expected){
          state.pastryQTE.index++;
          if(state.pastryQTE.index >= state.pastryQTE.seq.length){
            state.pastryQTE.active = false;
            state.pastryQTE.canBake = true;
          }
        } else {
          startPastryQTE(state);
        }
      }
      return;
    }

    // Delivery: movement + interact
    if(state.prepView === PREP_VIEW.DELIVERY){
      if([KEYS.UP,KEYS.DOWN,KEYS.LEFT,KEYS.RIGHT].includes(k)) held.add(k);
      if(k === KEYS.INTERACT){
        // UI checks collision precisely using DOM rects; systems just signals intent.
        // UI will call actions.completeDelivery() if close enough.
      }
    }
  }

  function handleKeyUp(e, state){
    const k = e.key.toLowerCase();
    if(e.code === "Space") state.coffeePour.pouring = false;
    held.delete(k);
  }

  // Actions are called by UI on clicks
  const actions = {
    goToScreen(state, screen){ state.screen = screen; },

    openPrepMenu(state){
      state.prepView = PREP_VIEW.MENU;
      state.selectedMenuItem = null;
    },

    selectPrepItem(state, payload){
      // payload: {type:'coffee'|'pastry', item}
      state.selectedMenuItem = payload;
      if(payload.type === "coffee"){
        state.prepView = PREP_VIEW.COFFEE;
        startCoffee(state);
      } else if(payload.type === "pastry"){
        state.prepView = PREP_VIEW.PASTRY;
        startPastryQTE(state);
      }
    },

    submitCoffee(state){
      const ok = state.coffeePour.fill >= 58 && state.coffeePour.fill <= 74;
      if(ok){
        state.order.coffee.done = true;
        state.prepView = PREP_VIEW.MENU;
      } else {
        startCoffee(state);
      }
    },

    startBaking(state){
      // simple bake timer done in systems? easiest: instant for now + UI animation later
      state.order.pastry.done = true;
      state.prepView = PREP_VIEW.MENU;
    },

    startDelivery(state){
      // only if ready
      const ready = state.order.coffee.done && state.order.pastry.done;
      if(!ready) return;
      state.prepView = PREP_VIEW.DELIVERY;
      state.delivery.active = true;
      state.delivery.x = 12;
      state.delivery.y = 45;
    },

    completeOrder(state){
      state.coins += 75;
      state.goalDone = Math.min(state.goalTotal, state.goalDone + 1);

      state.order = makeNewOrder();
      // refresh demo queue
      state.queue = [
        { name: state.order.customer, icons: "☕ 🥐", patience: 0.82 },
        { name: pick(CUSTOMER_NAMES), icons: "🧋", patience: 0.52 },
        { name: pick(CUSTOMER_NAMES), icons: "☕ ☕", patience: 0.68 },
        { name: pick(CUSTOMER_NAMES), icons: "🥐 ☕", patience: 0.26 }
      ];

      state.prepView = PREP_VIEW.MENU;
      state.selectedMenuItem = null;
    },
  };

  function startCoffee(state){
    state.coffeePour.fill = 0;
    state.coffeePour.pouring = false;
  }

  function startPastryQTE(state){
    state.pastryQTE.seq = shuffle(["W","A","S","D","W","A"]);
    state.pastryQTE.index = 0;
    state.pastryQTE.timer = 6.0;
    state.pastryQTE.active = true;
    state.pastryQTE.canBake = false;
  }

  return { update, handleKeyDown, handleKeyUp, actions };
}
