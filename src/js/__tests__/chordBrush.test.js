import defineExtraChordsTests from './data/chordBrush.defineExtraChords';
import mutedStringsTests from './data/chordBrush.mutedStrings';
import standardChordsExpectedResults from './data/chordBrush.standardChords';

import { generateChordSvg, toString } from '../imageRenderer';
import { InstrumentTunings, settings, sopranoUkuleleGcea } from '../configs';
import { runLine } from '../cpmImporter';
import { definitions, get } from '../tunings';

const { addInstrument, useInstrumentBOOOGERS } = definitions;

function loadAllChords() {
  const index = addInstrument(sopranoUkuleleGcea);
  useInstrumentBOOOGERS(index, InstrumentTunings.none);

  return definitions
    .getChords()
    .map(({ name }) => get(name));
}

describe('chordBrush', () => {
  describe('plot, standard GCEA Chords', () => {
    const chordNames = loadAllChords();
    chordNames.forEach((chord) => {
      it(`should render built-in chords "${chord.name}"`, () => {
        const expected = standardChordsExpectedResults[chord.name];

        const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
        const svg = toString(img);

        expect(svg).toBe(expected);
      });
    });
  });

  describe('plot, Chords With Muted Strings', () => {
    mutedStringsTests.forEach(({ definition, expectedResult, name }) => {
      it(`should place 'X' on muted strings "${name}"`, () => {
        const chord = runLine(definition);
        const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
        const svg = toString(img);

        expect(svg).toBe(expectedResult);
      });
    });
  });

  describe('plot, Custom Chords', () => {
    defineExtraChordsTests.forEach(({ definition, expectedResult, name }) => {
      it(`should render Custom Chords chords "${name}"`, () => {
        const chord = runLine(definition);
        const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
        const svg = toString(img);

        expect(svg).toBe(expectedResult);
      });
    });
  });
});
