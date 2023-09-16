# Change Log

## History

### 0.0.4-alpha

* **Breaking Changes** in the exported methods/props
    * `chordBrush` replaced by `ChordBrush` (reason: consitent naming, classnames begin with capitals)
    * `toolsLite` dropped (reason: IE is long gone)
    * `window.ukeGeeks.scriptasaurus` dropped, all scriptasaurus props spread with others on public interface (reason: no one, including me, can remember how it's spelled)
    * default HTML id `ukeChordsCanvas` replaced with `ukeChordDiagrams` (reason: canvas support was removed in 2015)
    * default HTML class selectors in `wrapClasses` renamed, `js-` prefix added (reason: JS hooks should be clear and never styled. Avoid confusiion)
    * `definition.instrument` and `InstrumentTunings` dropped (reason: this is specific to an implementation, not relevant to core library),
    * `song.chords` replaces with `song.chordNames` (reason: "chord" is ambiguous as to type, is it name? definition? object?)
* Build generates definition scripts by wrapping CPM defintion files as JavaScript


### 0.0.3-alpha

* Initial fixes for guitar support

### 0.0.2-alpha
