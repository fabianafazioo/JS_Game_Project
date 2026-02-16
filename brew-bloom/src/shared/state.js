import { STORAGE_KEYS, SCREENS } from "./constants.js";
import { INVENTORY_ITEMS } from "./data.js";

export function createInitialState(){
  const audio = loadAudioSettings();
  const inv = loadInventory();

  return {
    screen: SCREENS.MENU,

    cash: inv.cash ?? 200.00,
    inventory: inv.inventory ?? defaultInventory(),

    // audio settings
    audio: {
      musicVolume: audio.musicVolume ?? 0.35,
      sfxVolume: audio.sfxVolume ?? 0.55,
      musicEnabled: audio.musicEnabled ?? true,
      sfxEnabled: audio.sfxEnabled ?? true,
    },

    // gameplay UI state
    day: 1,
    goalDone: 0,
    goalTotal: 10,

    // simple order/timer
    orderSeconds: 40,
    orderActive: false,
    message: "",

    // top-down cafe simulation (UI prototype)
    server: { x: 120, y: 240, speed: 160 },
    customers: [],   // populated by systems
    tables: [
      { id:1, x: 540, y: 110 },
      { id:2, x: 580, y: 310 },
      { id:3, x: 420, y: 300 },
    ],
  };
}

function defaultInventory(){
  // start with 0, user must buy
  const inv = {};
  INVENTORY_ITEMS.forEach(i => inv[i.id] = 0);
  return inv;
}

function loadAudioSettings(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIO) || "{}"); }
  catch { return {}; }
}

function loadInventory(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || "{}"); }
  catch { return {}; }
}

export function saveAudioSettings(state){
  localStorage.setItem(STORAGE_KEYS.AUDIO, JSON.stringify(state.audio));
}

export function saveInventory(state){
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify({
    cash: state.cash,
    inventory: state.inventory
  }));
}
