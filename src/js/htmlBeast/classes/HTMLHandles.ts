/**
 * DOM Element object
 */
export default class HTMLHandles {
  constructor(wrap: HTMLElement, diagrams: HTMLElement, text: HTMLElement) {
    this.wrap = wrap;
    this.diagrams = diagrams;
    this.text = text;
  }

  wrap: HTMLElement;

  diagrams: HTMLElement;

  text: HTMLElement;
}
