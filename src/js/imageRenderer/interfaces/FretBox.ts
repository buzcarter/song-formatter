import { StringDict } from '../../tools';

/**
 * The size and spacing of a chord diagram. `settings.fretBox` is the big reference diagram,
 * `settings.inlineFretBox` the mini-diagram above lyrics.
 * (This had `[index: string]: any`, which let any property name through unchecked, so a typo
 * like `fretbox.dotRadus` compiled. Only scaleSettings needed it, to loop over the keys.)
 */
export default interface FretBox {
  /**
   * True if chord name and finger "number" are to be drawn on canvas.
   * By default normal chord diagrams have text (`true`) whereas inlineDiagrams
   * (i.e. chord diagrams shown above lyrics) do NOT as they are too small
   * (thus inlineFretbox.showText is `false`)
   */
  showText: boolean,
  /**
   * Chord Box's Bounding height (int)
   */
  height: number,
  /**
   * Chord Box's Bounding width (int)
   */
  width: number,
  /**
   * Row Height -- vertical height between frets (pixels) (int)
   */
  fretSpace: number,
  /**
   * String Spacing -- horizontal distance between strings (pixels) (int)
   */
  stringSpace: number,
  /**
   * Dot (finger position) radius in pixels (int)
   */
  dotRadius: number,
  /**
   * Fretboard line width in pixels (decimal)
   */
  lineWidth: number,
  /**
   * top-left position -- the offset for chord box. Doing this programatically
   * had "issues", decided to make this adjustment manual.
   */
  topLeftPos: {
    x: number,
    y: number,
  },
  /**
   * muted string "X" width of the 'X' crossbars. Recommend this be about 0.5 to 0.9 relative to stringSpace. (decimal)
   */
  xWidth: number,
  /**
   * muted string "X" stroke thickness. Recommend this be about 1.3 to 2.1 relative to lineWidth (decimal)
   */
  xStroke: number,

  /** dot, text and fret fonts for the inline diagram; the reference diagram uses `settings.fonts` */
  fonts: StringDict,

  // ESLint's core `semi` rule misreads `export default interface` and wants a ";" after it
  // eslint-disable-next-line semi
}
