import { markupChords } from './chords';
import { SongStyles as Styles } from './Styles';

import {
  BaseSongBlock,
  BlockTypes, Song, SongBlock, SongBlockArray, TabBlock,
} from '../cpmImporter';
import { generateTabSvg } from '../imageRenderer';

interface SongBlockOptions {
  include?: BlockTypes[]
  exclude?: BlockTypes[]
  /** if `true` bypass Column Wrap & Chord HTML */
  blocksOnly?: boolean
}

// TS type guards
const isSongBlock = (block: BaseSongBlock): block is SongBlock => block.type !== BlockTypes.TabBlock;
const isTabBlock = (block: BaseSongBlock): block is TabBlock => !isSongBlock(block);

function songBlocksToHTML(songBlocks: SongBlockArray, options?: SongBlockOptions): string {
  let nextType;

  return songBlocks
    .filter(({ type }) => {
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
    })
    .reduce((html: string, block: BaseSongBlock, i: number) => {
      if (isTabBlock(block)) {
        html += `<pre class="${Styles.Tabs}">`;
        html += generateTabSvg(block);
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
          const currentType = type;
          const lastType = ((i - 1) >= 0) ? songBlocks[i - 1].type : BlockTypes.Undefined;
          nextType = ((i + 1) < songBlocks.length) ? nextType = songBlocks[i + 1].type : BlockTypes.Undefined;
          html += lastType !== currentType ? `<pre class="${preClasses}">` : '\n';
          html += firstLine;
          html += nextType !== currentType ? '</pre>\n' : '';
        }
          break;
        case BlockTypes.ChorusBlock:
          html += `<div class="${Styles.Chorus}">\n`;
          html += songBlocksToHTML(lines as SongBlockArray, options);
          html += '</div>\n';
          break;
        case BlockTypes.TextBlock:
          html += songBlocksToHTML(lines as SongBlockArray, options);
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

  return markupChords(song.chordNames, html);
}
