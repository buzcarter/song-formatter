/* eslint-disable key-spacing */
import { TabSettings } from './interfaces/Settings';

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
    dot:  '9pt Arial Black,Arial',
    text: 'bold 14pt Arial',
    fret: 'bold 13pt Arial',
  } as StringDict,

  /**
   * Chord Diagram Colors for fretboard's grid lines and text.
   */
  colors: {
    fretLines:  '#003366',
    dots:       '#ff0000',
    dotText:    '#ffffff',
    text:       '#000000',
    fretText:   '#4a4a4a',
    /* a muted string's 'X' stroke color */
    xStroke:    '#444444',
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
      dot:  '8pt Arial',
      text: '8pt Arial',
      fret: '8pt Arial',
    },
  } as FretBox,

  /**
   * ID's of key HTML page elements, the "buckets" into which generated
   * HTML markup will be placed
   * @todo sync naming with the `wrapClasses`
   * @see `wrapClasses`
   */
  ids: {
    /** "Meta" includes song Title, Subtitle, Album, Artist */
    songMeta:     'ukeSongMeta',
    /** element holding the song's text */
    songText:     'ukeSongText',
    /** Chord Diagrams */
    diagrams:     'ukeChordDiagrams',
    /** wraps BOTH Song Text and Chord Diagrams */
    container:    'ukeSongContainer',
  } as StringDict,

  /**
   * Magic CSS Class names used to find page elements-- be careful if renaming!
   * @see `ids`
   */
  wrapClasses: {
    /** "Meta" includes song Title, Subtitle, Album, Artist */
    songMeta:     '.js-ugs-song-meta',
    /** wraps BOTH Song Text and Chord Diagrams */
    wrap:         '.js-ugs-song-wrap',
    /** Chord Diagrams */
    diagrams:     '.js-ugs-diagrams-wrap',
    /** element holding the song's text */
    text:         '.js-ugs-source-wrap',
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
    debugVerbose: false,
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
   * Last String Name (Note), as above, ex. on Ukulele this is a "G".
   */
  getLastStringName() {
    return Settings.tuning[0];
  },

  /**
   * The initial tuning when page first loads
   */
  defaultInstrument: 0,

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
