import { Chord } from '../cpmImporter';
import { FretBox, ImageBuilder, generateChordSvg, toString } from '../imageRenderer';
import { StringDict } from '../tools';
import { SvgChordStyles } from './Styles';

function appendChild(element: HTMLElement, image: ImageBuilder, className: string): HTMLElement {
  const wrapper = document.createElement('span');
  if (className) {
    wrapper.classList.add(className);
  }
  wrapper.innerHTML = toString(image);
  element.appendChild(wrapper);
  return wrapper;
}

/**
 * Adds a chord diagram to the end of `chordBox`
 * @param fontSettings default: `settings.fonts`
 * @param colorSettings default: `settings.colors`
 */
export function plot(chordBox: HTMLElement, chord: Chord, fretBox: FretBox, fontSettings?: StringDict, colorSettings?: StringDict): void {
  appendChild(chordBox, generateChordSvg(chord, fretBox, fontSettings, colorSettings), SvgChordStyles.CHORD_IMG);
}
