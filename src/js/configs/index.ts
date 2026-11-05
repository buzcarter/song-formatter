import settings from './settings';
import sopranoUkuleleGcea from './definitions.sopranoUkuleleGcea';

export const { getLastStringName, getNumStrings } = settings;
export { settings, sopranoUkuleleGcea };
export * from './globalConsts';
export type {
  ChordColors, ChordFonts, Options, Settings, TabSettings,
} from './interfaces/Settings';
