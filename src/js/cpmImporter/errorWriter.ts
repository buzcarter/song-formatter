import { logger } from '../tools';

const errs: string[] = [];

/** Add an error. As one would with console.log("blah"). */
export const log = (msg: string): number => errs.push(msg);

export const echo = () => errs.forEach((e, i) => logger.log(`${i}. ${e}`));
