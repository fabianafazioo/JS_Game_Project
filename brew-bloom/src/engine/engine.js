// Engine owns the main loop + input forwarding.
// Sydney can expand this later (delta time smoothing, scene graph, etc.)

export function createEngine({ state, systems, ui }) {
  let last = performance.now();

  function onKeyDown(e){ systems.handleKeyDown(e, state); }
  function onKeyUp(e){ systems.handleKeyUp(e, state); }

  function start(){
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    ui.mount(); // build DOM once
    ui.render(state);

    requestAnimationFrame(loop);
  }

  function loop(now){
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    systems.update(dt, state);
    ui.render(state);

    requestAnimationFrame(loop);
  }

  return { start };
}
