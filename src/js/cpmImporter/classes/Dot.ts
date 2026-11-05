/**
 * A single fretboard fingering "dot".
 *
 * Add-in fingerings. Frequently you'll add this to indicate
 * "nutting" or "barring" with one or more fingers.
 *
 * For example, the D7 is often played by laying the index finger across the entire
 * second fret and then placing middle finger on 3rd fret of "A" string like this:
 *
 * ```
 *  G C E A
 *  - - - -  (1st fret)
 *  X X X X
 *  - - - X
 *  - - - -  (4th fret)
 * ```
 *
 * The "A" string has two fingers on it, obviously one does nothing -- except to make the
 * chord much easier to play.
 */
export default class Dot {
  /** Values can be `null` when an `add:` clause leaves one out */
  constructor(string: number | null, fret: number | null, finger: number | null) {
    this.string = string;
    this.fret = fret;
    this.finger = finger;
  }

  /**
   * The string, counted from 0: on a soprano uke G = 0, C = 1, E = 2, A = 3.
   * Add-ins are numbers too, written from 1 (`add: string 1 ...`) and stored from 0.
   */
  string: number | null = null;

  /**
   * Fret position, i.e. 0-12
   */
  fret: number | null = null;

  /**
   * ex: 0-4 (where 1 = index finger and 4 = pinky)
   */
  finger: number | null = null;
}
