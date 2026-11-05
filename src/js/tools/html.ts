/**
 * HTML escaping, using the same rule as the UkeGeeks Songbook (server/lib/html.js and the
 * editor's `run(markup)`).
 */

const ESCAPES: Readonly<Record<string, string>> = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
});

/** A "&" that does NOT already start an entity like `&amp;` `&copy;` `&#39;` `&#x2665;`, or one of < > " ' */
const BARE_AMP_OR_SPECIAL = /&(?!#\d+;|#x[0-9a-f]+;|[a-z][a-z0-9]*;)|[<>"']/gi;

const TRIM = /^\s+|\s+$/g;

/**
 * Escapes <, >, quotes and bare &, but leaves existing entities alone (like PHP's
 * htmlspecialchars with double_encode=false). ChordPro files legitimately contain entities
 * ("Lyrics &amp; Music &copy; 1933"), and an entity can't open a tag or leave a quoted
 * attribute, so this is still safe to put in HTML text or a quoted attribute.
 */
export const escapeHtml = (text: string): string => String(text).replace(BARE_AMP_OR_SPECIAL, (c) => ESCAPES[c] || c);

/** Removes leading & trailing whitespace. (Kept for the Songbook, which calls `ukeGeeks.toolsLite.trim`.) */
export const trim = (text: string): string => String(text).replace(TRIM, '');
