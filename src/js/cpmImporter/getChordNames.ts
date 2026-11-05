import { BlockTypes } from './interfaces/BlockTypesEnum';
import { SongBlock, SongBlockArray } from './interfaces/SongBlock';

/**
 * Returns an array of all of the unique bracket chord names. So even if [D7] appears a
 * dozen times you'll only see it once in this list.
 * @param text CPM Text Block to be parsed
 */
export function getChordNames(text: string): string[] {
  const chordRegEx = /\[(.+?)]/img;
  const matches = text.match(chordRegEx);
  if (!matches) {
    return [];
  }

  return matches
    .reduce((acc: string[], name) => {
      if (!acc.includes(name)) {
        acc.push(name);
      }
      return acc;
    }, [])
    .map((name) => name.replace('[', '').replace(']', ''));
}

/** Block types whose text ends up in the song's HTML, where its chords are drawn */
const RENDERED_TEXT = [
  BlockTypes.ChordText,
  BlockTypes.ChordOnlyText,
  BlockTypes.PlainText,
  BlockTypes.Comment,
];

/** The text of every line that will be shown, in song order. */
function renderedLines(songBlocks: SongBlockArray): string[] {
  return songBlocks.flatMap((block) => {
    if (!('lines' in block)) {
      return []; // tablature
    }
    if (RENDERED_TEXT.includes(block.type)) {
      return block.lines.filter((line): line is string => typeof line === 'string');
    }
    return renderedLines(block.lines.filter((line): line is SongBlock => typeof line !== 'string'));
  });
}

/**
 * The chords used in the song's lyrics and comments, as the old library listed them: it
 * searched the HTML it had built, so chords in `# comment` lines, `<!-- HTML comments -->`,
 * or instructions such as `{title: ...}` were not included. (Searching the raw text, as
 * this used to, also drew diagrams for those, or reported them as unknown.)
 */
export function getRenderedChordNames(songBlocks: SongBlockArray): string[] {
  return getChordNames(renderedLines(songBlocks).join('\n'));
}

export default getChordNames;
