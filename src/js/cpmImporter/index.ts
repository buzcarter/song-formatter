import Song from './classes/Song';
import Dot from './classes/Dot';
import Chord from './classes/Chord';

export { Chord, Dot, Song };
export * from './interfaces/SongBlock';
export { BlockTypes } from './interfaces/BlockTypesEnum';
export { parseCPM } from './cpmParser';
export { runLine } from './chordParser';
export { runBlock } from './metaParser';
