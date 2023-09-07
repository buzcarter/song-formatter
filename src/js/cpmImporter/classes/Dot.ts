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
  constructor(string: number, fret: number, finger: number) {
    this.string = string;
    this.fret = fret;
    this.finger = finger;
  }

  /**
   * The ukulele's string, numbered from "top" (1) to "bottom" (4). Sporano uke strings would be ['G' => 1,'C' => 2,'E' => 3,'A' => 4]
   * TODO: do "add-ins" use char or int?
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
