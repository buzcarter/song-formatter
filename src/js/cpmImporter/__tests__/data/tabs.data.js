/* eslint-disable prefer-template */
const LineBreak = '\n';

const toArry = (text) => text.split('\n');

const TestData = {
  'Basic Tabs (Happy Path)': {
    tuning: ['G', 'C', 'E', 'A'],
    block: ''
      + '-----2---2-----------3-3---' + LineBreak
      + '---3---3---3-------0-------' + LineBreak
      + '-2---------------0---------' + LineBreak
      + '---------------------------' + LineBreak,
    frets: [
      ['2', '2', '3', '3'],
      ['3', '3', '3', '0'],
      ['2', '0'],
      [],
    ],
    guide: '-*-*-*-*-*-*-    *-*-*-*',
    minLength: 24,
    symbols: [
      '-----*---*-----------*-*---',
      '---*---*---*-------*-------',
      '-*---------------*---------',
      '---------------------------',
    ],
    tabs: [
      ['-', '-', '-', '-', '-', '2', '-', '-', '-', '2', '-', '-', '-', '-', '-', '-', '-', '3', '-', '3'],
      ['-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '0', '-', '-', '-', '-'],
      ['-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ],
    tabStrings: [],
  },
  'Tabs with Measures (Happy Path)': {
    tuning: ['G', 'C', 'E', 'A'],
    block: ''
      + '|-----2---2-----|-------3-3---' + LineBreak
      + '|---3---3---3---|-----0-------' + LineBreak
      + '|-2-------------|---0---------' + LineBreak
      + '|---------------|-------------' + LineBreak,
    frets: [
      ['2', '2', '3', '3'],
      ['3', '3', '3', '0'],
      ['2', '0'],
      [],
    ],
    guide: '|-*-*-*-*-*-*-  |-  *-*-*-*',
    minLength: 27,
    symbols: [
      '|-----*---*-----|-------*-*---',
      '|---*---*---*---|-----*-------',
      '|-*-------------|---*---------',
      '|---------------|-------------',
    ],
    tabs: [
      ['|', '-', '-', '-', '-', '-', '2', '-', '-', '-', '2', '-', '-', '-', '|', '-', '-', '-', '-', '-', '3', '-', '3'],
      ['|', '-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '3', '-', '|', '-', '-', '-', '0', '-', '-', '-', '-'],
      ['|', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|', '-', '0', '-', '-', '-', '-', '-', '-'],
      ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|', '-', '-', '-', '-', '-', '-', '-', '-'],
    ],
    tabStrings: [],
  },
  'Guitar (Happy Path**)': {
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    block: ''
      + 'E--12-10-9----------9-10-9----------9-----9------------|' + LineBreak
      + 'B----------66-10-12--------18-10-12---33----12--10-----|' + LineBreak
      + 'G------------------------------------------------------|' + LineBreak
      + 'D---------------------------2--------------------------|' + LineBreak
      + 'A------------------------1-----------------------------|' + LineBreak
      + 'E-------------------5--2-------------------------------|' + LineBreak,
    frets: [
      ['12', '10', '9', '9', '10', '9', '9', '9'],
      ['66', '10', '12', '18', '10', '12', '33', '12', '10'],
      [],
      ['2'],
      ['1'],
      ['5', '2'],
    ],
    guide: '-   *- *-*- *- *- *-*- *-*- *- *- *-*- *- *- *-  *-    |',
    minLength: 56,
    symbols: [
      'E---*--*-*----------*--*-*----------*-----*------------|',
      'B-----------*--*--*---------*--*--*----*-----*---*-----|',
      'G------------------------------------------------------|',
      'D---------------------------*--------------------------|',
      'A------------------------*-----------------------------|',
      'E-------------------*--*-------------------------------|',
    ],
    tabs: [
      ['-', '12', '-', '10', '-', '9', '-', '-', '-', '-', '-', '-', '-', '9', '-', '10', '-', '9', '-', '-', '-', '-', '-', '-', '-', '9', '-', '-', '-', '9', '-', '-', '-', '-', '-', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '66', '-', '10', '-', '12', '-', '-', '-', '-', '-', '-', '-', '18', '-', '10', '-', '12', '-', '-', '-', '33', '-', '-', '-', '12', '-', '10', '-', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '5', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
    ],
    tabStrings: [],
  },
};

Object.keys(TestData)
  .forEach((key) => {
    const test = TestData[key];
    test.tabStrings = toArry(test.block);
  });

export default TestData;
