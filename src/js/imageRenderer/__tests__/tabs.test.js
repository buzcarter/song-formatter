import tabTests from './data/tab.generateTabSvg';

import { generateTabSvg } from '../tabSVG';

describe('tab', () => {
  describe('generateTabSvg', () => {
    tabTests.forEach(({ tabs, hasLabels, expectedResult, name, skip }) => {
      if (skip) {
        return;
      }
      it(`should render tablature "${name}"`, () => {
        const svg = generateTabSvg({ tabs, hasLabels });

        expect(svg).toBe(expectedResult);
      });
    });
  });
});
