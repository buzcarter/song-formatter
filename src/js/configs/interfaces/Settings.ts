import { FretBox } from '../../imageRenderer';

// Types for `settings` (configs/settings.ts). They used to be loose dictionaries
// (`as StringDict`, `as BooleanDict`), so any property name compiled: a typo such as
// `settings.opts.retainBracket` was only found at runtime, if at all.
//
// These are `type` aliases rather than `interface`s on purpose: a type alias can be passed
// where a `{ [key: string]: string }` (StringDict) is expected, an interface can't. The
// renderer accepts any such dictionary, so the Songbook's themes can swap in their own colors.

/** Chord diagram fonts: a CSS `font` shorthand each */
export type ChordFonts = {
  /** the finger number in a dot */
  dot: string,
  /** the chord name above the diagram */
  text: string,
  /** the fret number beside a diagram that starts above the first fret */
  fret: string,
};

/** Chord diagram colors */
export type ChordColors = {
  fretLines: string,
  dots: string,
  dotText: string,
  text: string,
  fretText: string,
  /** a muted string's 'X' */
  xStroke: string,
};

/** IDs of the page elements run() fills */
export type ElementIds = {
  /** "Meta" includes song Title, Subtitle, Album, Artist */
  songMeta: string,
  /** element holding the song's text */
  songText: string,
  /** Chord Diagrams */
  canvas: string,
  /** wraps BOTH Song Text and Chord Canvas */
  container: string,
};

/** CSS selectors runByClasses() uses to find each song's elements */
export type WrapClasses = {
  songMeta: string,
  wrap: string,
  diagrams: string,
  text: string,
};

export type Options = {
  columnsEnabled: boolean,
  /** keep the [ ] around chord names */
  retainBrackets: boolean,
  /** leave the `commonChords` out of the reference diagrams */
  ignoreCommonChords: boolean,
  /** sort the reference diagrams by name instead of song order */
  sortAlphabetical: boolean,
  /** nudge chord names apart where they'd overlap */
  autoFixOverlaps: boolean,
  /** log the parsed song to the console */
  debugVerbose: boolean,
};

/**
 * TODO: Clean-up Tab Options!!
 */
export type TabSettings = {
  /** pixels between lines (or strings)  */
  lineSpacing: number,
  /** pixels between finger dots  */
  noteSpacing: number,
  /** pixels  */
  lineWidth: number,
  /** hex  */
  lineColor: string,
  /** pixels, how much room to allow for string names, eg, "G" or "A"  */
  labelWidth: number,
  labelFont: string,
  /** hex  */
  dotColor: string,
  /** pixels, finger dot's radius  */
  dotRadius: number,
  textFont: string,
  textColor: string,
  /** extra blank space added to bottom of diagram  */
  bottomPadding: number,
};

export type Settings = {
  fonts: ChordFonts,
  colors: ChordColors,
  fretBox: FretBox,
  inlineFretBox: FretBox,
  ids: ElementIds,
  wrapClasses: WrapClasses,
  opts: Options,
  inlineDiagrams: boolean,
  numFrets: number,
  /** the instrument's string names, e.g. ['G', 'C', 'E', 'A']; set by definitions.setInstrument() */
  tuning: string[],
  getNumStrings(): number,
  getLastStringName(): string,
  defaultInstrument: number,
  tabs: TabSettings,
  commonChords: string[],
};
