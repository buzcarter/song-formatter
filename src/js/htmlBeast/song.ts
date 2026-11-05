import { markupChords } from './chords';
import { SongStyles as Styles } from './Styles';

import {
  BlockTypes, Song, SongBlock, TabBlock, isSongBlock, isTabBlock,
} from '../cpmImporter';
import { generateTabSvg } from '../imageRenderer';

interface SongBlockOptions {
  include?: BlockTypes[]
  exclude?: BlockTypes[]
  /** if `true` bypass Column Wrap & Chord HTML */
  blocksOnly?: boolean
  /** chords get room for mini-diagrams above them; default `settings.inlineDiagrams` */
  inlineDiagrams?: boolean
}

function isIncluded(type: BlockTypes, options?: SongBlockOptions): boolean {
  if (!options || type === BlockTypes.TextBlock) {
    return true;
  }
  if (Array.isArray(options.include)) {
    return options.include.includes(type);
  }
  if (Array.isArray(options.exclude)) {
    return !options.exclude.includes(type);
  }
  return true;
}

/**
 * A list of blocks to render: the song's top-level blocks, or the `lines` of a text or
 * chorus block. By the time we render, those lines have all become SongBlocks, but their
 * type still says `string | SongBlock`, so strings are allowed (and skipped) here rather
 * than cast away.
 */
type Renderable = SongBlock | TabBlock | string;

function songBlocksToHTML(songBlocks: Renderable[], options?: SongBlockOptions): string {
  /** The type of the block at `index`, or Undefined past either end */
  const typeAt = (index: number): BlockTypes => {
    const block = songBlocks[index];
    return typeof block === 'object' ? block.type : BlockTypes.Undefined;
  };

  // Excluded blocks are skipped here rather than filtered out first: the <pre> logic below
  // looks at the blocks either side (`songBlocks[i - 1]`, `songBlocks[i + 1]`), and those
  // indexes have to point into the same array we're walking. With a `.filter()` first, `i`
  // counted the filtered list but looked up the unfiltered one, so lines were split into
  // separate <pre>s, or a <pre> was opened and never closed (nested <pre>s).
  return songBlocks
    .reduce((html: string, block: Renderable, i: number) => {
      if (typeof block === 'string' || !isIncluded(block.type, options)) {
        return html;
      }
      if (isTabBlock(block)) {
        html += `<pre class="${Styles.Tabs}">`;
        html += block.staves.map((staff) => generateTabSvg(staff)).join('');
        html += '</pre>\n';
        return html;
      }
      if (!isSongBlock(block)) {
        return html;
      }

      const { type, lines } = block;
      const firstLine = (typeof lines[0] === 'string' && lines[0]) || '';
      switch (type) {
        case BlockTypes.Title:
          html += `<h1 class="${Styles.Title}">${firstLine}</h1>\n`;
          break;
        case BlockTypes.Subtitle:
          html += `<h2 class="${Styles.Subtitle}">${firstLine}</h2>\n`;
          break;
        case BlockTypes.Album:
          html += `<h3 class="${Styles.Album}">${firstLine}</h3>\n`;
          break;
        case BlockTypes.Artist:
          html += `<h3 class="${Styles.Artist}">${firstLine}</h3>\n`;
          break;
        case BlockTypes.UkeGeeksMeta:
          html += `<h3 class="${Styles.UgsMeta}">${firstLine}</h3>\n`;
          break;
        case BlockTypes.Comment:
          html += `<h6 class="${Styles.Comment}">${firstLine}</h6>\n`;
          break;
        case BlockTypes.NewPage:
          html += `<hr class="${Styles.NewPage}" />\n`;
          break;
        case BlockTypes.ChordText:
        case BlockTypes.PlainText:
        case BlockTypes.ChordOnlyText: {
          // TODO: beware undefined's!!!
          // Repack the text, only open/close <pre> tags when type changes
          // problem: exacerbates WebKit browsers' first chord position bug.
          if (!firstLine) {
          // prevent empty blocks (usually caused by comments mixed in header tags)
            return html;
          }
          let preClasses = (type === BlockTypes.PlainText) ? Styles.PrePlain : Styles.PreChords;
          if (type === BlockTypes.ChordOnlyText) {
            preClasses += ` ${Styles.NoLyrics}`;
          }
          // open a <pre> unless the previous line is the same kind; close it unless the next is
          html += typeAt(i - 1) !== type ? `<pre class="${preClasses}">` : '\n';
          html += firstLine;
          html += typeAt(i + 1) !== type ? '</pre>\n' : '';
        }
          break;
        case BlockTypes.ChorusBlock:
          html += `<div class="${Styles.Chorus}">\n`;
          html += songBlocksToHTML(lines, options);
          html += '</div>\n';
          break;
        case BlockTypes.TextBlock:
          html += songBlocksToHTML(lines, options);
          break;
        case BlockTypes.ColumnBreak:
          html += `</div><div class="${Styles.Column}">`;
          break;
      }

      return html;
    }, '');
}

/** Convert passed in song to HTML (text) block */
export function songToHTML(song: Song, options?: SongBlockOptions) {
  const { songBlocks: tempSongBlocks } = song;
  let html = songBlocksToHTML(tempSongBlocks, options);
  if (options?.blocksOnly) {
    return html;
  }
  if (song.columnCount > 1) {
    html = ''
      + `<div class="${Styles.ColumnWrap} ${Styles.ColumnCount}${song.columnCount}">`
      + `<div class="${Styles.Column}">${html}</div>`
      + '</div>';
  }

  return markupChords(song.chordNames, html, options?.inlineDiagrams);
}
