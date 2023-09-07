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

  columnCount = 1;

  songBlocks: SongBlockArray = [];
}
