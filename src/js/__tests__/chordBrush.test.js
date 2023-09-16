import { GuitarPredfinedChordsTests } from './data/chordBrush.guitar';
import defineExtraChordsTests from './data/chordBrush.defineExtraChords';
import mutedStringsTests from './data/chordBrush.mutedStrings';
import standardChordsExpectedResults from './data/chordBrush.standardChords';
import guitarLiteDef from './data/definitions.guitarLite';

import { generateChordSvg, toString } from '../imageRenderer';
import { InstrumentTunings, settings } from '../configs';
import { runLine } from '../cpmImporter';
import { definitions, get } from '../tunings';
import sopranoUkuleleGcea from '../.built/sopranoUkuleleGCEAChordDefinitions';
const { addInstrument, setInstrument } = definitions;

const ukuleleIndex = addInstrument(sopranoUkuleleGcea);
const guitarIndex = addInstrument(guitarLiteDef);

describe('chordSVG & imageRenderer', () => {
  describe('plot, standard GCEA Chords', () => {
    setInstrument(ukuleleIndex, InstrumentTunings.none);
    definitions
      .getChords()
      .map(({ name }) => get(name))
      .forEach((chord) => {
        it(`should render built-in chords "${chord.name}"`, () => {
          setInstrument(ukuleleIndex, InstrumentTunings.none);
          const expected = standardChordsExpectedResults[chord.name];

          const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
          const svg = toString(img);

          expect(svg).toBe(expected);
        });
      });
  });

  describe('plot, Chords With Muted Strings', () => {
    beforeEach(() => {
      setInstrument(ukuleleIndex, InstrumentTunings.none);
    });

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
    beforeEach(() => {
      setInstrument(ukuleleIndex, InstrumentTunings.none);
    });

    defineExtraChordsTests.forEach(({ definition, expectedResult, name }) => {
      it(`should render Custom Chords chords "${name}"`, () => {
        const chord = runLine(definition);
        const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
        const svg = toString(img);

        expect(svg).toBe(expectedResult);
      });
    });
  });

  describe('plot, Guitar chords', () => {
    describe('plot, predefined Chords', () => {
      setInstrument(guitarIndex, InstrumentTunings.none);
      definitions
        .getChords()
        .map(({ name }) => get(name))
        .forEach((chord) => {
          it(`should render built-in chords "${chord.name}"`, () => {
            setInstrument(guitarIndex, InstrumentTunings.none);
            const expected = GuitarPredfinedChordsTests[chord.name];

            const img = generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors);
            const svg = toString(img);

            expect(svg).toBe(expected);
          });
        });
    });
  });
});
