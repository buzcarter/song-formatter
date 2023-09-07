/**
 * TODO: Clean-up Tab Options!!
 */
export interface TabSettings {
  /** pixels between lines (or strings)  */
  lineSpacing: number,
  /** pixels between finger dots  */
  noteSpacing: number,
  /** pixels  */
  lineWidth: number,
  /** hex  */
  lineColor: string,
  /** pixels, how much room to allow for string names, eg, "G" or "A"  */
  labelWidth: number,
  labelFont: string,
  /** hex  */
  dotColor: string,
  /** pixels, finger dot's radius  */
  dotRadius: number,
  textFont: string,
  textColor: string,
  /** extra blank space added to bottom of diagram  */
  bottomPadding: number,
}
