// import { JsonData } from './interfaces/CoreTypes';

/* eslint-disable no-console, prefer-destructuring */
const error = console.error;
const info = console.info;
const log = console.log;
const warn = console.warn;

const json = (data: unknown) => info(JSON.stringify(data, null, 3).replace(/\\n/gm, '\n'));

export default {
  error,
  info,
  json,
  log,
  warn,
};
