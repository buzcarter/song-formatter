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

export interface TabBlock extends BaseSongBlock {
  tabs: ExpandedTabs,
  hasLabels: boolean
}

export interface SongBlock extends BaseSongBlock {
  lines: (string | SongBlock)[],
}

export type SongBlockArray = (TabBlock | SongBlock)[];

export default SongBlock;
