import HTMLHandles from './classes/HTMLHandles';

import { settings } from '../configs';

/** Finds one song's elements inside `wrap`, by the class names in `settings.wrapClasses` */
export function getHandlesFromClass(wrap: HTMLElement): HTMLHandles | null {
  // querySelector<HTMLElement> says what kind of element we expect, instead of casting the result
  const find = (selector: string) => wrap.querySelector<HTMLElement>(selector);
  const diagrams = find(settings.wrapClasses.diagrams);
  const text = find(settings.wrapClasses.text);

  if (!diagrams || !text) {
    return null;
  }
  return new HTMLHandles(wrap, diagrams, text, find(settings.wrapClasses.songMeta));
}

/** Finds the song's elements by the IDs in `settings.ids` */
export function getHandlesFromId(): HTMLHandles | null {
  const { ids } = settings;
  const wrap = document.getElementById(ids.container);
  const diagrams = document.getElementById(ids.canvas);
  const text = document.getElementById(ids.songText);
  const meta = document.getElementById(ids.songMeta);

  return wrap && diagrams && text
    ? new HTMLHandles(wrap, diagrams, text, meta)
    : null;
}
