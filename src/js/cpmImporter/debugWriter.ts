import { BlockTypes } from './interfaces/BlockTypesEnum';
import { BaseSongBlock, SongBlock, SongBlockArray, TabBlock } from './interfaces/SongBlock';

import { logger } from '../tools';

const getTypeName = (type: BlockTypes): string => Object
  .keys(BlockTypes)
  // @ts-ignore-next-line
  .find((key) => BlockTypes[key] === type) || 'unknown';

export function echo(songBlocks: SongBlockArray): void {
  songBlocks.forEach((block: BaseSongBlock, i: number) => {
    const { type } = block;
    const typeName = getTypeName(type);
    if (block && type === BlockTypes.TabBlock) {
      const { tabs } = block as TabBlock;
      logger.log(`>> ${i}. ${type} node ("${typeName}"), ${tabs.length} lines`);
      logger.json(tabs);
      return;
    }

    const { lines } = block as SongBlock;
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
