import HTMLHandles from './classes/HTMLHandles';

import { settings } from '../configs';

export function getHandlesFromClass(wrap: HTMLElement): HTMLHandles | null {
  const diagrams = wrap.querySelectorAll(settings.wrapClasses.diagrams);
  const text = wrap.querySelectorAll(settings.wrapClasses.text);
  if ((diagrams === undefined) || (diagrams.length < 1) || (text === undefined) || (text.length < 1)) {
    return null;
  }
  return new HTMLHandles(
    wrap,
    diagrams[0] as HTMLElement,
    text[0] as HTMLElement,
  );
}

export function getHandlesFromId(): HTMLHandles | null {
  const { ids } = settings;
  const wrap = document.getElementById(ids.container);
  const diagrams = document.getElementById(ids.canvas);
  const text = document.getElementById(ids.songText);

  return wrap && diagrams && text
    ? new HTMLHandles(wrap, diagrams, text)
    : null;
}
