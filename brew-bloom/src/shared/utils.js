export function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
export function money(n){
  return `$${n.toFixed(2)}`;
}
export function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
