import { NumberDict, StringDict } from '../tools';

/**
 * local substitions (replacements for identical chord shapes)
 */
export const chordNameAliases: StringDict = Object.freeze({
  'A#': 'Bb',
  Db: 'C#',
  'D#': 'Eb',
  Gb: 'F#',
  Ab: 'G#',
});

/**
 * Predefined ukuele instrument tunings
 */
export const InstrumentTunings: NumberDict = Object.freeze({
  /** GCEA */
  sopranoUke: 0,
  /** DGBA  -- Baritone's "A" fingering is the Soprano's "D" */
  baritoneUke: 5,
});
