import { BlockTypes } from './interfaces/BlockTypesEnum';
import { BaseSongBlock, SongBlockArray, isSongBlock, isTabBlock } from './interfaces/SongBlock';

import { logger } from '../tools';

/** A numeric enum also maps back from value to name: BlockTypes[102] is "Title" */
const getTypeName = (type: BlockTypes): string => BlockTypes[type] || 'unknown';

export function echo(songBlocks: SongBlockArray): void {
  songBlocks.forEach((block: BaseSongBlock, i: number) => {
    const { type } = block;
    const typeName = getTypeName(type);
    if (isTabBlock(block)) {
      const { staves } = block;
      logger.log(`>> ${i}. ${type} node ("${typeName}"), ${staves.length} staves`);
      logger.json(staves);
      return;
    }

    if (!isSongBlock(block)) {
      return;
    }
    const { lines } = block;
    logger.log(`>> ${i}. ${type} node ("${typeName}"), ${lines.length} lines`);
    lines.forEach((line) => {
      if (typeof line === 'string') {
        logger.log(line);
        return;
      }

      if (!line.lines.length) {
        logger.log({
          type: line.type,
          typeName: getTypeName(line.type),
        });
        return;
      }

      logger.log({
        ...line,
        typeName: getTypeName(line.type),
      });
    });
  });
}
