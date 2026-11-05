import { SongBlockArray } from '../interfaces/SongBlock';
import Chord from './Chord';

export default class Song {
  title: string = '';

  album: string = '';

  artist: string = '';

  /**
   * "Subtitle", often Artist Info
   */
  st: string = '';

  /**
   * "Subtitle #2", subtitle2 (not used yet)
   */
  st2: string = '';

  /**
   * Song's Key ('A', 'C', etc)
   */
  key: string = '';

  /**
   * `true` if there is at least one chord in use, `false` otherwise.
   * Useful for laying out tablature, which might have no chords.
   */
  hasChords: boolean = false;

  ugsMeta: string[] = [];

  chordDefs: Chord[] = [];

  chordNames: string[] = [];

  /**
   * The old library's name for `chordNames`; the Songbook reads `song.chords`.
   * (A getter, instead of copying the array onto each song after it's made, as run() did.)
   */
  get chords(): string[] {
    return this.chordNames;
  }

  columnCount = 1;

  songBlocks: SongBlockArray = [];
}
