/**
 * DOM Elements, the "buckets" into which generated HTML markup will be placed
 */
export default class HTMLHandles {
  constructor(wrap: HTMLElement, diagrams: HTMLElement, text: HTMLElement, meta?: HTMLElement | null) {
    this.wrap = wrap;
    this.diagrams = diagrams;
    this.text = text;
    if (meta) {
      this.meta = meta;
    }
  }

  meta?: HTMLElement;

  wrap: HTMLElement;

  diagrams: HTMLElement;

  text: HTMLElement;
}
