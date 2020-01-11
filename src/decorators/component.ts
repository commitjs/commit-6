import { IComponent } from "../interfaces/component";
import { TemplateResult } from "lit-html";

import { workLoop } from '../lib/work-loop';
import { renderWithoutCommit } from "../lib/render-without-commit";

export function Component<T>({ selector, templateFn }: { selector: string, templateFn: (context: T) => TemplateResult }): any {
  return function componentDecorator(target: any) {

    // console.log(Reflect.getMetadata('design:paramtypes', target));
    const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

    class Cmp extends HTMLElement implements IComponent {
      _update: () => void;

      static get observedAttributes() {
        return attributes;
      }

      attributeChangedCallback(name: any, oldValue: any, newValue: any) {
        (this as any)[name] = newValue;
      }

      constructor() {
        super();

        target.call(this);

        const root = this.attachShadow({ mode: 'open' });
        let updateScheduled = false;
        this._update = () => {
          if (updateScheduled) { return; }
          updateScheduled = true;

          // Promise.resolve().then(() => {
          workLoop.pushWork(() => {
            updateScheduled = false;
            return renderWithoutCommit(templateFn(this as any), root, { eventContext: this })
          });

          // });
        };
        // Promise.resolve().then(() => {
        this._update();
        // });
      }
    }

    const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
    Object.defineProperties(Cmp.prototype, others);

    customElements.define(selector, Cmp);
    return Cmp;
  }
}
