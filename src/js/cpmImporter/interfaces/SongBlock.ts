import { BlockTypes } from './BlockTypesEnum';

export type StringArray = string[];

/**
 * Two-Dimensional Array:
 * Topmost is an array of "Lines", one per string on the instrument,
 * within that array representation of Fret numbers, spaces, and measure
 * lines.
 */
export type ExpandedTabs = StringArray[];

export interface BaseSongBlock {
  type: BlockTypes,
}

/** One staff of tablature: one packed line per string (see tabs.ts) */
export interface TabStaff {
  tabs: ExpandedTabs,
  /** `true` if each line started with its string's name, e.g. "A|--3--" */
  hasLabels: boolean,
}

export interface TabBlock extends BaseSongBlock {
  /** A tab block can hold several staves, one after another, each `getNumStrings()` lines long */
  staves: TabStaff[],
}

export interface SongBlock extends BaseSongBlock {
  lines: (string | SongBlock)[],
}

export type SongBlockArray = (TabBlock | SongBlock)[];

export default SongBlock;
