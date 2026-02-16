export function createEngine({ state, systems, ui }) {
  let last = performance.now();

  function start(){
    ui.mount();
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
