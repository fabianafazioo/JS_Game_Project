Main.js
import { createInitialState } from "./shared/state.js";
import { createSystems } from "./systems/systems.js";
import { createUI } from "./ui/ui.js";
import { createEngine } from "./engine/engine.js";

const state = createInitialState();

// teammates plug in here later:
const systems = createSystems();          // Janisis
const ui = createUI({ state, systems });  // Fabiana
const engine = createEngine({ state, systems, ui }); // Sydney

// forward keys to systems (engine could own this later)
window.addEventListener("keydown", (e) => systems.handleKeyDown(e, state));
window.addEventListener("keyup", (e) => systems.handleKeyUp(e, state));

engine.start();

