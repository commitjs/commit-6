import { createComponent } from './creacte-component';

export function bootstrap(Ctor: any) {
  const container = document.getElementById('app');
  const instance = createComponent(Ctor);
  container?.appendChild(instance);
}