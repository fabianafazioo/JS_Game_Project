import { pick, clamp } from "../shared/utils.js";
import { CUSTOMER_NAMES, MENU_PRODUCTS } from "../shared/data.js";
import { saveInventory } from "../shared/state.js";
import { SCREENS } from "../shared/constants.js";

export function createSystems(){
  const keys = new Set();

  function update(dt, state){
    if(state.screen !== SCREENS.GAME) return;

    // spawn customers if low
    if(state.customers.length < 3 && Math.random() < 0.01){
      spawnCustomer(state);
    }

    // move customers toward their table
    for(const c of state.customers){
      walkTo(c, c.targetX, c.targetY, 60, dt);

      // once seated, show $ bubble
      if(distance(c.x,c.y,c.targetX,c.targetY) < 6){
        c.seated = true;
        c.state = c.state || "waiting_order";
      }
    }

    // server movement (arrow keys)
    let dx = 0, dy = 0;
    if(keys.has("ArrowUp")) dy -= 1;
    if(keys.has("ArrowDown")) dy += 1;
    if(keys.has("ArrowLeft")) dx -= 1;
    if(keys.has("ArrowRight")) dx += 1;

    const sp = state.server.speed;
    state.server.x = clamp(state.server.x + dx * sp * dt, 20, 740);
    state.server.y = clamp(state.server.y + dy * sp * dt, 60, 390);

    // order timer
    if(state.orderActive){
      state.orderSeconds -= dt;
      if(state.orderSeconds <= 0){
        state.orderSeconds = 40;
        state.orderActive = false;
        state.message = "⏱ Time ran out! Customer got upset.";
      }
    }
  }

  function handleKeyDown(e, state){
    keys.add(e.key);
  }

  function handleKeyUp(e, state){
    keys.delete(e.key);
  }

  const actions = {
    goTo(state, screen){
      state.screen = screen;
      state.message = "";
    },

    buyInventory(state, itemId, price){
      if(state.cash + 1e-9 < price){
        state.message = "Not enough money!";
        return { ok:false };
      }
      state.cash = +(state.cash - price).toFixed(2);
      state.inventory[itemId] = (state.inventory[itemId] || 0) + 1;
      saveInventory(state);
      state.message = `Bought 1 ${itemId}.`;
      return { ok:true };
    },

    tryTakeOrder(state){
      // if near a seated customer waiting for order
      const c = nearestCustomer(state);
      if(!c || !c.seated) return { ok:false, reason:"No seated customer nearby." };
      if(c.state !== "waiting_order") return { ok:false, reason:"Customer already ordered." };

      // assign random menu product
      c.order = pick(MENU_PRODUCTS);
      c.state = "ordered";
      state.orderActive = true;
      state.orderSeconds = 40;
      state.message = `Order taken: ${c.order.name}`;
      return { ok:true };
    },

    tryDeliver(state){
      const c = nearestCustomer(state);
      if(!c || !c.seated || !c.order) return { ok:false, reason:"No order to deliver." };

      // must have ingredients in inventory
      for(const req of c.order.requires){
        if((state.inventory[req] || 0) <= 0){
          return { ok:false, reason:`Missing: ${req}` };
        }
      }

      // consume ingredients
      for(const req of c.order.requires){
        state.inventory[req] -= 1;
      }

      // earn money
      state.cash = +(state.cash + c.order.price).toFixed(2);
      saveInventory(state);

      // mark served + remove customer after a moment
      c.state = "served";
      state.orderActive = false;
      state.orderSeconds = 40;
      state.goalDone = Math.min(state.goalTotal, state.goalDone + 1);
      state.message = `Served ${c.order.name}! +${c.order.price.toFixed(2)}`;

      // remove after 1.2s
      setTimeout(() => {
        const idx = state.customers.indexOf(c);
        if(idx >= 0) state.customers.splice(idx, 1);
      }, 1200);

      return { ok:true, earned:c.order.price };
    }
  };

  function spawnCustomer(state){
    const t = pick(state.tables);
    const startX = 40;
    const startY = pick([90, 160, 250, 340]);

    state.customers.push({
      id: crypto.randomUUID?.() || String(Math.random()),
      name: pick(CUSTOMER_NAMES),
      x: startX, y: startY,
      targetX: t.x, targetY: t.y,
      tableId: t.id,
      seated: false,
      state: "walking",
      order: null
    });
  }

  function nearestCustomer(state){
    let best = null;
    let bestD = 999999;
    for(const c of state.customers){
      const d = distance(state.server.x, state.server.y, c.x, c.y);
      if(d < bestD){
        bestD = d; best = c;
      }
    }
    return bestD <= 70 ? best : null;
  }

  function walkTo(obj, tx, ty, speed, dt){
    const dx = tx - obj.x;
    const dy = ty - obj.y;
    const d = Math.hypot(dx, dy);
    if(d < 0.001) return;
    const vx = (dx / d) * speed;
    const vy = (dy / d) * speed;
    obj.x += vx * dt;
    obj.y += vy * dt;
  }

  function distance(x1,y1,x2,y2){ return Math.hypot(x1-x2, y1-y2); }

  return { update, handleKeyDown, handleKeyUp, actions };
}
