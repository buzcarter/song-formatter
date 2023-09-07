import { Chord } from '../../cpmImporter';

export default class Instrument {
  constructor(key: string, name: string, tuning: string[], chords: Chord[]) {
    this.key = key;
    this.name = name;
    this.tuning = tuning;
    this.chords = chords;
  }

  key: string;

  name: string;

  tuning: string[];

  chords: Chord[];
}
