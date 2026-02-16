import { createInitialState } from "./shared/state.js";
import { createSystems } from "./systems/systems.js";
import { createUI } from "./ui/ui.js";
import { createEngine } from "./engine/engine.js";

const state = createInitialState();

// Teammates plug into these:
const systems = createSystems();              // Janisis
const ui = createUI({ state, systems });      // Fabiana
const engine = createEngine({ state, systems, ui }); // Sydney

engine.start();
