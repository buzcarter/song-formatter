import { __test__ } from '../chordSVG';
import { toString } from '../imageSVG';

describe('chordSvg.newFretboard', () => {
  const { newFretboard } = __test__;
  const Tests = [{
    name: 'typical Uke',
    inputs: {
      position: {
        x: 22,
        y: 25,
      },
      fretBox: {
        width: 100,
        height: 150,
        lineWidth: 1.6,
        fretSpace: 20,
        stringSpace: 20,
      },
      numStrings: 4,
      numFrets: 5,
      fretColor: '#003366',
    },
    expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 150" width="100px" height="150px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="125.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="125.8"  /><line x1="22.8" y1="45.8" x2="82.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="82.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="82.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="82.8" y2="105.8"  /><rect x="22.8" y="25.8" width="60" height="100"  /></g></svg>',
  }, {
    name: 'Guitar',
    inputs: {
      position: {
        x: 22,
        y: 25,
      },
      fretBox: {
        width: 150,
        height: 200,
        lineWidth: 1.6,
        fretSpace: 20,
        stringSpace: 20,
      },
      numStrings: 6,
      numFrets: 7,
      fretColor: '#003366',
    },
    expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 150 200" width="150px" height="200px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="165.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="165.8"  /><line x1="82.8" y1="25.8" x2="82.8" y2="165.8"  /><line x1="102.8" y1="25.8" x2="102.8" y2="165.8"  /><line x1="22.8" y1="45.8" x2="122.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="122.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="122.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="122.8" y2="105.8"  /><line x1="22.8" y1="125.8" x2="122.8" y2="125.8"  /><line x1="22.8" y1="145.8" x2="122.8" y2="145.8"  /><rect x="22.8" y="25.8" width="100" height="140"  /></g></svg>',
  }];

  Tests.forEach(({
    name,
    expectedResult,
    inputs: { position, fretBox, numStrings, numFrets, fretColor },
  }) => {
    it(`should parse ${name}`, () => {
      const result = toString(newFretboard(position, fretBox, numStrings, numFrets, fretColor));
      expect(result).toBe(expectedResult);
    });
  });
});
