import { SCREENS, PREP_VIEW } from "./constants.js";
import { pick } from "./utils.js";
import { CUSTOMER_NAMES, TABLE_IDS } from "./data.js";

export function createInitialState(){
  return {
    screen: SCREENS.MENU,

    day: 3,
    timeText: "10:45 AM",
    coins: 1250,

    goalDone: 9,
    goalTotal: 15,

    // UI: what the prep station is currently showing
    prepView: PREP_VIEW.MENU,
    selectedMenuItem: null, // {type:'coffee'|'pastry', itemId:'latte'...}

    // active order (demo)
    order: makeNewOrder(),

    // demo queue
    queue: [
      { name: "Emma", icons: "☕ 🥐", patience: 0.78 },
      { name: "Alex", icons: "🧋", patience: 0.45 },
      { name: "Sofia", icons: "☕ ☕", patience: 0.62 },
      { name: "James", icons: "🥐 ☕", patience: 0.18 }
    ],

    // mini-game internal state (systems updates these)
    coffeePour: { fill: 0, pouring: false },
    pastryQTE:  { seq: ["W","A","S","D"], index: 0, timer: 6.0, active: false, canBake:false },
    delivery:   { active:false, x:12, y:45, speed:0.9 },

    // tick helpers
    _accum1s: 0,
  };
}

export function makeNewOrder(){
  return {
    customer: pick(CUSTOMER_NAMES),
    coffee: { name: "Caramel Latte", done: false },
    pastry: { name: "Croissant", done: false },
    secondsLeft: 45,
    tableTarget: pick(TABLE_IDS),
  };
}
