import Dot from './Dot';

/**
 * Chord info sutiable for rendering SVGs; has name and dot positions
 */
export default class Chord {
  constructor(name: string) {
    this.name = name;
  }

  /** string, i.e. 'C#6' */
  name = '';

  dots: Dot[] = [];

  /** true means that string is not played (muted). i.e. chord.mute[2] means third string is muted. */
  muted: boolean[] = [];
}
