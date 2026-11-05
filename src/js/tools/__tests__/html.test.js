import { escapeHtml, trim } from '../html';

describe('html', () => {
  describe('escapeHtml', () => {
    it('should escape <, >, quotes and a bare &', () => {
      expect(escapeHtml('<b class="x">Rock & Roll\'s</b>')).toBe('&lt;b class=&quot;x&quot;&gt;Rock &amp; Roll&#39;s&lt;/b&gt;');
    });

    it('should leave entities that are already there alone', () => {
      const input = 'Lyrics &amp; Music &copy; 1933 &#39;quoted&#39; &#x2665;';
      expect(escapeHtml(input)).toBe(input);
    });

    it('should escape an & that only looks like an entity', () => {
      expect(escapeHtml('Tom & Jerry; AT&T &;')).toBe('Tom &amp; Jerry; AT&amp;T &amp;;');
    });
  });

  describe('trim', () => {
    it('should remove leading and trailing whitespace', () => {
      expect(trim('  \t G C E A \n')).toBe('G C E A');
    });
  });
});
