/* eslint-disable key-spacing */
export const ChordsStyles = {
  INLINE_SPACER:   'ugsInlineSpacer',
};

export const PageStyles = Object.freeze({
  INLINE_DIAGRAMS: 'ugsInlineDiagrams',
  NO_CHORDS:       'ugsNoChords',
});

export const RefDiagramsStyles = Object.freeze({
  IGNORED_CHORDS:  'ugsIgnoredChords',
});

/** All of the CSS classnames used by UkeGeeks JavaScript */
export const SongStyles = Object.freeze({
  Comment:         'ugsComment',
  Tabs:            'ugsTabs',
  Chorus:          'ugsChorus',
  /** preformatted with chords */
  PreChords:       'ugsChords',
  /** preformated, no chords */
  PrePlain:        'ugsPlain',
  /** preformated, chords ONLY -- no lyrics (text) between 'em */
  NoLyrics:        'ugsNoLyrics',
  ColumnWrap:      'ugsWrap',
  ColumnCount:     'ugsColumnCount',
  Column:          'ugsColumn',
  NewPage:         'ugsNewPage',
});

// export default {
//   ...PageStyles,
//   ...ChordsStyles,
//   ...SongStyles,
// };
