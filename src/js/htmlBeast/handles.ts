import HTMLHandles from './classes/HTMLHandles';

import { settings } from '../configs';

export function getHandlesFromClass(wrap: HTMLElement): HTMLHandles | null {
  const diagrams = wrap.querySelectorAll(settings.wrapClasses.diagrams);
  const text = wrap.querySelectorAll(settings.wrapClasses.text);
  const songMeta = wrap.querySelectorAll(settings.wrapClasses.songMeta);

  if (!diagrams.length || !text.length) {
    return null;
  }

  return new HTMLHandles(
    wrap,
    diagrams[0] as HTMLElement,
    text[0] as HTMLElement,
    (songMeta.length && songMeta[0] as HTMLElement) || null,
  );
}

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
