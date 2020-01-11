export function createComponent(Ctor: any, innerHTML?: any, bindings?: any) {
  const insance = new Ctor();
  insance.textContent = innerHTML;
  Object.entries(bindings || {}).forEach(([key, value]) => {
    insance[key] = value;
  });
  return insance;
}