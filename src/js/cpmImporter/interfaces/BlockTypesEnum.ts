/* eslint-disable no-multi-spaces, no-shadow */

/**
 * Enumeration defining the types of nodes used within this class to parse CPM
 */
export enum BlockTypes {
  // #region Multiline Nodes
  TextBlock=            1, // temporary type, should be replaced with Chord Text or Plain Text
  ChorusBlock=          2,
  TabBlock=             3,
  // #endregion

  // #endregion Single Line "Instruction" Nodes
  Comment=            101,
  Title=              102,
  Subtitle=           103,
  Album=              104,
  ChordDefinition=    105,
  UkeGeeksMeta=       106,
  ColumnBreak=        107, // Defining this as an instruction instead of a node since I'm not requiring a Begin/End syntax and it simplifies processing
  Artist=             108,
  NewPage=            109,
  Key=                110,
  // #endregion

  // #region Text Types
  ChordText=          201,
  PlainText=          202,
  ChordOnlyText=      203,
  // #endregion

  // Undefined
  Undefined=          666,
}

export enum CpmInstructions {
  title =               'title',
  titleShort =          't',
  subtitle =            'subtitle',
  subtitleShort =       'st',

  album =               'album',
  artist =              'artist',

  comment =             'comment',
  commentShort =        'c',

  key =                 'key',
  keyShort =            'k',
  define =              'define',

  columnBreak =         'column_break',
  columnBreakShort =    'colb',
  newPage =             'new_page',
  newPageShort =        'np',
  ugsMeta =             'ukegeeks-meta',

  /*
  startOfTab =          'start_of_tab',
  startOfTabShort =     'sot',
  endOfTab =            'end_of_tab',
  endOfTabShort =       'eot',

  startOfChorus =       'start_of_chorus',
  startOfChorusShort =  'soc',
  endOfChorus =         'end_of_chorus',
  endOfChorusShort =    'eoc',
  */
}
