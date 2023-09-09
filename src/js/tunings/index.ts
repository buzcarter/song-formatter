import * as definitions from './chordDefinitions';
import Instrument from './classes/Instrument';

export {
  definitions,
  Instrument,
};
export default definitions;
export { get } from './chordDefinitions';
// for legacy
export { shift, shiftChords } from './transpose';
