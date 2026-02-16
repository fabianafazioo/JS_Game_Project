import { createInitialState } from "./shared/state.js";
import { createSystems } from "./systems/systems.js";
import { createUI } from "./ui/ui.js";
import { createEngine } from "./engine/engine.js";

const state = createInitialState();

const systems = createSystems();
const ui = createUI({ state, systems });
const engine = createEngine({ state, systems, ui });

window.addEventListener("keydown", (e) => systems.handleKeyDown(e, state));
window.addEventListener("keyup", (e) => systems.handleKeyUp(e, state));

engine.start();
