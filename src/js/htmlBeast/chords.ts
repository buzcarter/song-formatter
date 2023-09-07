import { settings } from '../configs';

import { ChordsStyles as Styles } from './Styles';

/**
 * This does all of the work -- it's a Wrapper method that calls all of this classes other
 * (private) methods in correct order.
 * Returns the HTML block with wrapped chords: &lt;code&gt;&lt;strong&gt;&lt;em&gt;
 */
export function markupChords(chordNames: string[], text: string): string {
  text = encloseChords(chordNames, text);
  text = packChords(text);
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
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const i in chordNames) {
    do { /* empty */ }
    while (text.length !== (
      // eslint-disable-next-line no-cond-assign
      text = text.replace(`[${chordNames[i]}]`, `<code data-chordName="${chordNames[i]}"><strong>${openBracket}<em>${chordNames[i]}</em>${closeBracket}</strong></code>`)
    ).length);
  }
  return text;
  /*
  // need to handle chords such as: [A7+5]
  var escapeRegEx = new RegExp('([+])','g');
  for (var j = 0; j < this.chords.length; j++){
    var s = this.chords[j].replace(escapeRegEx, '\\\$1')
    var re = new RegExp('[[]' + s + ']', 'img');
    text = text.replace(re, '<code data-chordName="' + this.chords[j] + '"><strong>[<em>' + this.chords[j] + '</em>]</strong></code>');
  }
  */
}

/**
 * Looks for consecutive chords and strips the whitespace between them -- thus "packing" the
 * chords against each other with only a single space separating them.
 */
function packChords(text: string): string {
  if (settings.inlineDiagrams) {
    /* TODO: problem with packing */
    const regEx = /(<\/strong><\/code>)[ \t]*(<code data-chordName="[^"]*"><strong>)/ig;
    return text.replace(regEx, `$1<span class="${Styles.INLINE_SPACER}">&nbsp;</span>$2`);
  }

  const regEx = /<\/strong><\/code>[ \t]*<code data-chordName="[^"]*"><strong>/ig;
  return text.replace(regEx, ' ');
}
