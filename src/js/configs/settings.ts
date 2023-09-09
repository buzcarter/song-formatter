import { TabSettings } from './interfaces/Settings';
import { InstrumentTunings } from './globalConsts';

import { BooleanDict, StringDict } from '../tools';
import { FretBox } from '../imageRenderer';

/**
 * Customize your installation. This JSON object controls appearance and
 * HTML element names. It's divided into four sections: graphics, ids, layout,
 * and "options".
 */
const Settings = Object.seal({

  /**
   * Chord Diagram Font styles -- font size, font-weight, font-face stack, etc.
   */
  fonts: {
    dot: '9pt Arial Black,Arial',
    text: 'bold 14pt Arial',
    fret: 'bold 13pt Arial',
  } as StringDict,

  /**
   * Chord Diagram Colors for fretboard's grid lines and text.
   */
  colors: {
    /* eslint-disable key-spacing */
    fretLines: '#003366',
    dots: '#ff0000',
    dotText: '#ffffff',
    text: '#000000',
    fretText: '#4a4a4a',
    /* a muted string's 'X' stroke color */
    xStroke: '#444444',
    /* eslint-enable key-spacing */
  } as StringDict,

  fretBox: {
    showText: true,
    height: 150,
    width: 100,
    fretSpace: 20,
    stringSpace: 20,
    dotRadius: 8,
    lineWidth: 1.6,
    topLeftPos: {
      x: 22,
      y: 25,
    },
    xWidth: 0.45 * 20,
    xStroke: 1.6 * 1.6,
    fonts: {},
  } as FretBox,

  /**
   * Layout of Chord Digrams when inlineFredBoxes are being used. Identical in
   * structure to "fretBox". See fretBox for properties.
   */
  inlineFretBox: {
    showText: false,
    height: 50,
    width: 40,
    fretSpace: 9,
    stringSpace: 7,
    dotRadius: 3,
    lineWidth: 1,
    topLeftPos: {
      x: 10,
      y: 2,
    },
    xWidth: 0.7 * 7,
    xStroke: 1.4 * 1,
    fonts: {
      dot: '8pt Arial',
      text: '8pt Arial',
      fret: '8pt Arial',
    },
  } as FretBox,

  /**
   * ID's of key HTML page elements
   */
  ids: {
    /* eslint-disable key-spacing */
    songText: 'ukeSongText', // element holding the song's text
    canvas: 'ukeChordsCanvas', // canvas
    container: 'ukeSongContainer', // wraps BOTH Song Text and Chord Canvas
    /* eslint-enable key-spacing */
  } as StringDict,

  /**
   * CSS Class names used to find page elements-- be careful if renaming!
   */
  wrapClasses: {
    /* eslint-disable key-spacing */
    wrap: '.ugs-song-wrap', // wraps BOTH Song Text and Chord Canvas
    diagrams: '.ugs-diagrams-wrap', // canvas
    text: '.ugs-source-wrap', // element holding the song's text
    /* eslint-enable key-spacing */
  } as StringDict,

  /**
   * Options (Features) you can turn on or off
   */
  opts: {
    columnsEnabled: true,
    /**
     * the [ and ] surrounding chord names often looks bad in print (usually only good when inline)
     * set true to keep then, false to get rid of the buggers.
     */
    retainBrackets: false,
    /**
     * if `true` chords in the "commonChords" list will be ignored (excluded) from having thier
     * master chord diagram drawn
     */
    ignoreCommonChords: false,
    /**
     * If true chord reference diagrams are sorted alphabetically, otherwise chords are shown in the
     * order in which they appear within the song.
     */
    sortAlphabetical: false,
    /**
     * if `true` chords that overlap each other (in the music area) will have their spacing adjuste
     * to prevent overlapping.
     */
    autoFixOverlaps: true,
    debugVerbose: true,
  } as BooleanDict,

  /**
   * If `true` the Chord Digram is drawn ABOVE lyrics
   */
  inlineDiagrams: false,

  /**
   * Number of frets to draw. Default is 5 (as this is as wide as my hand can go and
   * I've never seen a chord diagram requiring more than this. But ya never know.
   */
  numFrets: 5,

  /** Array of string names (letters) */
  tuning: ['G', 'C', 'E', 'A'] as string[],

  /**
   * Number of Strings (dashed lines of tablature notation) expected. (For now
   * a constant -- ukueleles "always" have four).
   * @todo Making a variable to help support port for other instruments.
   */
  getNumStrings() {
    return Settings.tuning.length;
  },

  /**
   * Last String Name (Note), as above, on Ukulele is a "G".
   * @todo Here for other instruments.
   */
  getLastStringName() {
    return Settings.tuning[0];
    // export const LAST_STRING_NAME = 'G';
  },

  /**
   * The initial tuning when page first loads
   */
  defaultInstrument: InstrumentTunings.none,

  tabs: {
    lineSpacing: 16,
    noteSpacing: 14,
    lineWidth: 1,
    lineColor: '#999999',
    labelWidth: 12,
    labelFont: '10pt Arial, Helvetica, Verdana, Geneva, sans-serif',
    dotColor: '#eaeaea',
    dotRadius: 10,
    textFont: 'bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif',
    textColor: '#000000',
    bottomPadding: 10,
  } as TabSettings,

  /**
   * List of common chords to be "ignored" (won't show master chord diagrams)
   */
  commonChords: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Am'] as string[],
});

export default Settings;
