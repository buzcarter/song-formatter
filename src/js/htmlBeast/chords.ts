import { settings } from '../configs';
import { escapeHtml } from '../tools';

import { ChordsStyles as Styles } from './Styles';

/**
 * This does all of the work -- it's a Wrapper method that calls all of this classes other
 * (private) methods in correct order.
 * Returns the HTML block with wrapped chords: &lt;code&gt;&lt;strong&gt;&lt;em&gt;
 */
export function markupChords(chordNames: string[], text: string, inlineDiagrams: boolean = settings.inlineDiagrams): string {
  text = encloseChords(chordNames, text);
  text = packChords(text, inlineDiagrams);
  return text;
}

/**
 * Returns the input string having replaced all of the "bracketed chord names" (i.e. [D7]) with HTML
 * marked-up version (i.e. &lt;code&gt;&lt;strong&gt;[&lt;em&gt;D7&lt;/em&gt;]&lt;/strong&gt;&lt;/code&gt;)
 */
function encloseChords(chordNames: string[], text: string): string {
  const { retainBrackets } = settings.opts;
  const openBracket = retainBrackets ? '[' : ' ';
  const closeBracket = retainBrackets ? ']' : ' ';
  chordNames.forEach((chordName) => {
    // The name comes from the song's HTML text, where `<`, `>` and `&` are already escaped but
    // quotes aren't, so a `"` in a chord name, `[A" onclick="..."]`, could end the attribute
    // and add its own. Escaping it for the attribute keeps it a value.
    const attr = escapeHtml(chordName);
    const markup = `<code data-chordName="${attr}"><strong>${openBracket}<em>${chordName}</em>${closeBracket}</strong></code>`;
    // split + join replaces EVERY "[A7+5]", taking the text literally. (This was a do/while
    // repeating replace(), which only does the first; a /regex/g would need "+", "/", "#"...
    // escaped, which an older, commented-out version here tried.)
    text = text.split(`[${chordName}]`).join(markup);
  });
  return text;
}

/**
 * Looks for consecutive chords and strips the whitespace between them -- thus "packing" the
 * chords against each other with only a single space separating them.
 */
function packChords(text: string, inlineDiagrams: boolean): string {
  if (inlineDiagrams) {
    // With mini-diagrams, side-by-side chords can't share one <code> (each needs its own
    // diagram), so a spacer goes between them instead of packing them together.
    /* TODO: problem with packing */
    const regEx = /(<\/strong><\/code>)[ \t]*(<code data-chordName="[^"]*"><strong>)/ig;
    return text.replace(regEx, `$1<span class="${Styles.INLINE_SPACER}">&nbsp;</span>$2`);
  }

  const regEx = /<\/strong><\/code>[ \t]*<code data-chordName="[^"]*"><strong>/ig;
  return text.replace(regEx, ' ');
}
