/**
 * Chord diagrams as HTML strings: the reference diagrams beside the song, and the
 * mini-diagrams above the lyrics. No DOM needed, so this also runs in Node.
 */
import { get } from '../tunings';
import { settings } from '../configs';
import { Chord } from '../cpmImporter';
import { FretBox, generateChordSvg, toString } from '../imageRenderer';
import { StringDict, escapeHtml } from '../tools';
import { RefDiagramsStyles, SvgChordStyles } from './Styles';

const RegExes = {
  /** Ignore "tacet" or "no chord" chords */
  TACET: /^(n.?\/?c.?|tacet)$/i,
};

export interface ReferenceDiagrams {
  /** The diagrams, plus an "Also uses: ..." line if some common chords were left out */
  html: string,
  /** Chords in the song that have no diagram */
  unknownChords: string[],
  /** Common chords left out because of `settings.opts.ignoreCommonChords` */
  ignoredChords: string[],
}

/** One chord diagram, wrapped in the `<span>` the CSS expects */
export function chordDiagramHtml(chord: Chord, fretBox: FretBox, fonts: StringDict, colors: StringDict): string {
  const img = generateChordSvg(chord, fretBox, fonts, colors);
  return `<span class="${SvgChordStyles.CHORD_IMG}">${toString(img)}</span>`;
}

/**
 * The reference diagrams for a song's chords, in the order given.
 * Note: like the old library, `settings.opts.sortAlphabetical` sorts `chordNames` in place.
 */
export function referenceDiagrams(chordNames: string[]): ReferenceDiagrams {
  const unknownChords: string[] = [];
  const ignoredChords: string[] = [];

  if (settings.opts.sortAlphabetical) {
    chordNames.sort();
  }

  const diagrams = chordNames.map((name) => {
    if (RegExes.TACET.test(name)) {
      return '';
    }
    if (settings.opts.ignoreCommonChords && settings.commonChords.includes(name)) {
      if (!ignoredChords.includes(name)) {
        ignoredChords.push(name);
      }
      return '';
    }
    const chord = get(name);
    if (!chord) {
      unknownChords.push(name);
      return '';
    }
    return chordDiagramHtml(chord, settings.fretBox, settings.fonts, settings.colors);
  });

  const alsoUses = ignoredChords.length
    ? `<p class="${RefDiagramsStyles.IGNORED_CHORDS}">Also uses: ${[...ignoredChords].sort().join(', ')}</p>`
    : '';

  return {
    html: diagrams.join('') + alsoUses,
    unknownChords,
    ignoredChords,
  };
}

/**
 * Adds a mini-diagram inside each chord's `<code data-chordName="...">` in the song's HTML
 * (as made by markupChords). Chords with no diagram are left as they are.
 */
export function addInlineDiagrams(html: string, chordNames: string[]): string {
  const { inlineFretBox, colors } = settings;
  return chordNames.reduce((result, name) => {
    const chord = get(name);
    if (!chord) {
      return result;
    }
    const diagram = chordDiagramHtml(chord, inlineFretBox, inlineFretBox.fonts, colors);
    const code = `<code data-chordName="${escapeHtml(name)}">`;
    // each chord's <code> ends with </strong></code>; the diagram goes just before </code>
    return result
      .split(code)
      .map((part, i) => (i === 0 ? part : part.replace('</strong></code>', `</strong>${diagram}</code>`)))
      .join(code);
  }, html);
}
