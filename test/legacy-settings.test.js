/**
 * `ukeGeeks.settings.scale(multiplier)`, from the old library's API. The UkeGeeks WordPress
 * plugin calls it to size the chord diagrams.
 */
const ugs = require('../src/js/ukeGeeks').default;
const { settings } = require('../src/js/configs');

describe('settings.scale()', () => {
  it('should be the same settings object the renderer reads', () => {
    expect(ugs.settings).toBe(settings);
  });

  it('should scale the diagram size and fonts', () => {
    const { width, height } = settings.fretBox;
    ugs.settings.scale(2);
    expect(settings.fretBox.width).toBe(width * 2);
    expect(settings.fretBox.height).toBe(height * 2);
    expect(Object.values(settings.fonts).join(' ')).toMatch(/\d/);
    ugs.settings.scale(0.5);
    expect(settings.fretBox.width).toBe(width);
  });
});
