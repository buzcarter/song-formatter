import { Chord } from '../cpmImporter';
import { FretBox, ImageBuilder, generateChordSvg, toSVGString } from '../imageRenderer';
import { StringDict } from '../tools';
import { SvgChordStyles } from './Styles';

function appendChild(element: HTMLElement, image: ImageBuilder, className: string): HTMLElement {
  const wrapper = document.createElement('span');
  if (className) {
    wrapper.classList.add(className);
  }
  wrapper.innerHTML = toSVGString(image.getData());
  element.appendChild(wrapper);
  return wrapper;
}

export function plot(chordBox: HTMLElement, chord: Chord, fretBox: FretBox, fontSettings: StringDict, colorSettings: StringDict): void {
  const img = generateChordSvg(chord, fretBox, fontSettings, colorSettings);
  if (!img) {
    return;
  }
  appendChild(chordBox, img, SvgChordStyles.CHORD_IMG);
}
