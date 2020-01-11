import { RenderOptions, NodePart, removeNodes, templateFactory } from "lit-html";

export const parts = new WeakMap<Node, NodePart>();

export const renderWithoutCommit = (
  result: unknown,
  container: Element | DocumentFragment,
  options?: Partial<RenderOptions>
) => {
  let part = parts.get(container);
  if (part === undefined) {
    removeNodes(container, container.firstChild);
    parts.set(
      container,
      part = new NodePart(
        {
          templateFactory,
          ...options,
        }));
    part.appendInto(container);
  }
  part.setValue(result);
  return part;
};