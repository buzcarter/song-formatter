import { JsonData } from './interfaces/CoreTypes';

const RegExes = {
  DOUBLE_SPACES: /\s{2,}/g,
};

export const pack = (value: string): string => value.replace(RegExes.DOUBLE_SPACES, ' ').trim();

export const clean = (sourceObj: JsonData) => {
  Object.keys(sourceObj).forEach((key) => {
    delete sourceObj[key];
  });
  return sourceObj;
};
