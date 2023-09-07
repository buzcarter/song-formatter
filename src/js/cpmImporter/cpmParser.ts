/* eslint-disable prefer-destructuring */

import { BlockTypes, CpmInstructions } from './interfaces/BlockTypesEnum';
import { echo } from './debugWriter';
import { readTabs } from './tabs';
import { runLine } from './chordParser';
import {
  BaseSongBlock, SongBlock, SongBlockArray, StringArray, TabBlock,
} from './interfaces/SongBlock';
import getChordNames from './getChordNames';
import Song from './classes/Song';

import { clean, logger } from '../tools';
import definitions from '../tunings';
import { settings } from '../configs';

/**
 * @todo add ukeGeeks Meta support:
 * /{(ukegeeks-meta|meta)\s*:\s*(.+?)}/i
 */

const RegExes = {
  /* eslint-disable key-spacing */
  BLOCKS:           /\s*{\s*(start_of_tabs?|sot|start_of_chorus|soc|end_of_tabs?|eot|end_of_chorus|eoc)\s*}\s*/im,
  TAB_BLOCKS:       /\s*{\s*(start_of_tabs?|sot)\s*}\s*/im,
  CHORUS_BLOCKS:    /\s*{\s*(start_of_chorus|soc)\s*}\s*/im,

  /** HTML <pre></pre> */
  PRE_TAG:          /<\/?pre>/img,
  /** HTML <!-- Comment --> */
  HTML_COMMENT:     /<!--(.|\n)*?-->/gm,

  // #region used in `parseSimpleInstructions`
  COLUMN_BREAK:     /\s*{\s*(column_break|colb|np|new_page)\s*}\s*/im,
  // #endregion

  // #region used in `markChordLines`
  CHORD:            /\[(.+?)]/i,
  ALL_CHORDS:       /\[(.+?)]/img,
  // #endregion

  // #region used in `parseInstructions`
  INSTRUCTION:      /\{[^}]+?:.*?\}/im,
  COMMAND_ARGS:     /\{.+?:(.*)\}/gi,
  COMMAND_VERB:     /\{(.+?)\s*:.*\}/gi,
  // #endregion
  /* eslint-enable key-spacing */
};

/**
 * Under development, bool indicating whether any chords were found within the lyrics.
 * Helpful for tablature-only arrangements.
 * @todo: do not rely on this!!!
 */
let hasChords = false; // TODO:
let columnCount = 1;

/** Song's key. May be set via command tag {key: C} otherwise use the first chord found (if available) */
let firstChord = '';

// type guards
const isSongBlock = (block: BaseSongBlock): block is SongBlock => block.type !== BlockTypes.TabBlock;
const isTabBlock = (block: BaseSongBlock): block is TabBlock => !isSongBlock(block);

function parseSongBlocks(text: string): SongBlockArray {
  text = stripHtml(text);
  const songBlocks = textToSongBlocks(text);
  parseInstructions(songBlocks);
  parseSimpleInstructions(songBlocks);
  markChordLines(songBlocks);
  expandTabs(songBlocks);
  if (settings.opts.debugVerbose) {
    echo(songBlocks);
  }
  return songBlocks;
}

/**
 * Accepts raw CPM text block, returns a Song object containing whatever ChordPro elements it recognizes.
 */
export function parseCPM(text: string): Song {
  const song = new Song();
  // eslint-disable-next-line no-multi-assign
  const songBlocks = song.songBlocks = parseSongBlocks(text);
  song.hasChords = hasChords;
  song.columnCount = columnCount;
  let info;

  info = getInfo(songBlocks, BlockTypes.Title);
  if (info.length) {
    song.title = info[0];
  }
  info = getInfo(songBlocks, BlockTypes.Artist);
  if (info.length) {
    song.artist = info[0];
  }
  info = getInfo(songBlocks, BlockTypes.Subtitle);
  if (info.length) {
    song.st = info[0];
    if (info.length > 1) {
      song.st2 = info[1];
    }
  }
  info = getInfo(songBlocks, BlockTypes.Album);
  if (info.length) {
    song.album = info[0];
  }
  info = getInfo(songBlocks, BlockTypes.UkeGeeksMeta);
  if (info.length) {
    song.ugsMeta = info;
  }
  info = getInfo(songBlocks, BlockTypes.Key);
  if (info.length) {
    song.key = info[0];
  } else if (firstChord !== '') {
    song.key = firstChord;
  }

  info = getInfo(songBlocks, BlockTypes.ChordDefinition);
  info.forEach((t) => {
    const d = runLine(`{define: ${t}}`);
    if (d) {
      song.chordDefs.push(d);
    }
  });

  definitions.replace(song.chordDefs);
  song.chordNames = getChordNames(text);

  if (settings.opts.debugVerbose) {
    logger.json(song);
  }
  return song;
}

function getBlockType(line: string): BlockTypes {
  // TODO: verify line's type in documentation
  if (RegExes.CHORUS_BLOCKS.test(line)) {
    return BlockTypes.ChorusBlock;
  }
  if (RegExes.TAB_BLOCKS.test(line)) {
    return BlockTypes.TabBlock;
  }
  return BlockTypes.TextBlock;
}

/** Explodes passed in text block into an array of songNodes ready for further parsing. */
function textToSongBlocks(text: string): SongBlockArray {
  let hasBeenInitialized = false;
  const songBlocks: SongBlockArray = [];
  let block: SongBlock = {
    type: BlockTypes.Comment,
    lines: [],
  };

  text.split('\n')
    .filter((line) => line[0] !== '#')
    .forEach((line) => {
      const isBlockBoundary = RegExes.BLOCKS.test(line);
      if (isBlockBoundary || !hasBeenInitialized) {
        // save last block, start new one...
        if (hasBeenInitialized) {
          songBlocks.push(block);
        }
        hasBeenInitialized = true;
        block = {
          type: getBlockType(line),
          lines: [],
        };
        if (!isBlockBoundary) {
          // Don't miss that first line!
          block.lines.push(line);
        }
      } else {
        line = line.trim();
        if (line) {
          block.lines.push(line);
        }
      }
    });

  if (block.lines.length) {
    songBlocks.push(block);
  }

  return songBlocks;
}

/**
 * Goes through songNodes, those nodes that are "instructions" are exploded and
 * a "the resulting "songDomElement" built, this songDomElement then replaces the
 * original line.
 *
 * The regular expression look for instructions with this format:
 * {commandVerb: commandArguments}
 */
function parseInstructions(songBlocks: SongBlockArray): void {
  /* eslint-disable key-spacing */
  const verbToBlockTypeHash: {
    [key: string]: BlockTypes
  } = {
    [CpmInstructions.title]:            BlockTypes.Title,
    [CpmInstructions.titleShort]:       BlockTypes.Title,
    [CpmInstructions.artist]:           BlockTypes.Artist,
    [CpmInstructions.subtitle]:         BlockTypes.Subtitle,
    [CpmInstructions.subtitleShort]:    BlockTypes.Subtitle,
    [CpmInstructions.album]:            BlockTypes.Album,
    [CpmInstructions.comment]:          BlockTypes.Comment,
    [CpmInstructions.commentShort]:     BlockTypes.Comment,
    [CpmInstructions.key]:              BlockTypes.Key,
    [CpmInstructions.keyShort]:         BlockTypes.Key,
    [CpmInstructions.define]:           BlockTypes.ChordDefinition,
    [CpmInstructions.ugsMeta]:          BlockTypes.UkeGeeksMeta,
  };
  /* eslint-enable key-spacing */

  songBlocks
    .filter(isSongBlock)
    .forEach((block) => {
      block.lines = block.lines.map((line) => {
        if (typeof line !== 'string' || !RegExes.INSTRUCTION.test(line)) {
          return line;
        }

        const args = line.replace(RegExes.COMMAND_ARGS, '$1');
        const verb = line.replace(RegExes.COMMAND_VERB, '$1')
          .toLowerCase()
          .replace(/\r/, ''); // IE7 bug

        return {
          type: verbToBlockTypeHash[verb] || `Undefined-${verb}`,
          lines: [args.trim()],
        };
      });
    });
}

/** A "Simple Instruction" is one that accepts no arguments. Presently this only handles Column Breaks. */
function parseSimpleInstructions(songBlocks: SongBlockArray): void {
  songBlocks
    .filter(isSongBlock)
    .forEach((block: SongBlock) => {
      block.lines = block.lines.map((line) => {
        if (typeof line !== 'string' || !RegExes.COLUMN_BREAK.test(line)) {
          return line;
        }

        const verb = line.replace(RegExes.COLUMN_BREAK, '$1').toLowerCase();
        switch (verb) {
          case CpmInstructions.columnBreak:
          case CpmInstructions.columnBreakShort:
            columnCount++;
            line = {
              type: BlockTypes.ColumnBreak,
              lines: [],
            };
            break;
          case CpmInstructions.newPage:
          case CpmInstructions.newPageShort:
            line = {
              type: BlockTypes.NewPage,
              lines: [],
            };
            break;
        }
        return line;
      });
    });
}

/**
 * Runs through songNodes and if the line contains at least one chord it's type is et to
 * ChordText, otherwise it's marked as "PlainText", meaning straight lyrics
 */
function markChordLines(songBlocks: SongBlockArray): void {
  let chordFound;
  let hasOnlyChords;

  songBlocks
    .filter((block) => block.type === BlockTypes.TextBlock || block.type === BlockTypes.ChorusBlock)
    .filter(isSongBlock)
    .forEach((block) => {
      block.lines = block.lines.map((line) => {
        if (typeof line !== 'string') {
          return line;
        }

        chordFound = RegExes.CHORD.test(line);
        hasChords = hasChords || chordFound;
        hasOnlyChords = chordFound && (line.replace(RegExes.ALL_CHORDS, '').trim().length < 1);

        if (chordFound && firstChord === '') {
          const matches = line.match(RegExes.CHORD);
          if (matches) {
            firstChord = matches[1];
          }
        }

        return {
          // eslint-disable-next-line no-nested-ternary
          type: (hasOnlyChords ? BlockTypes.ChordOnlyText : (chordFound ? BlockTypes.ChordText : BlockTypes.PlainText)),
          lines: [line],
        };
      });
    });
}

function expandTabs(songBlocks: SongBlockArray): void {
  songBlocks
    .filter(isTabBlock)
    .forEach((block) => {
      // @ts-ignore-next-line
      const { lines } = block;
      // @ts-ignore-next-line
      Object.assign(clean(block), readTabs(lines as StringArray));
    });
}

/** Searches the songNodes for the specified block type, returning all matching node line (text) values. */
function getInfo(songBlocks: SongBlockArray, type: BlockTypes): string[] {
  const rtn: string[] = [];

  songBlocks
    .filter((block) => block.type === type)
    // @ts-ignore-next-line
    .forEach((block) => rtn.push(block.lines[0]));

  songBlocks
    .filter((block) => block.type === BlockTypes.TextBlock)
    .filter(isSongBlock)
    .forEach((block) => {
      block.lines
        // @ts-ignore-next-line
        .filter((line) => line.type === type)
        // @ts-ignore-next-line
        .forEach((line) => rtn.push(line.lines[0]));
    });

  return rtn;
}

/** Removes HTML "pre" tags and comments. */
const stripHtml = (text: string): string => text
  .replace(RegExes.PRE_TAG, '')
  .replace(RegExes.HTML_COMMENT, '');

export const __test__ = {
  stripHtml,
};
