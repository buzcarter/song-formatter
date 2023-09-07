import { StringDict } from '../../tools';

export type StyleDef = StringDict;

export interface Position {
  x: number,
  y: number,
}

// eslint-disable-next-line no-shadow
export enum LayerTypes {
  CIRCLE = 'circle',
  GROUP = 'group',
  IMAGE = 'image',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  TEXT = 'text',
}

export interface SVGBase {
  type: LayerTypes,
  style?: StyleDef | null,
}

export interface CircleSVGLayer extends SVGBase {
  center: Position,
  radius: number,
}

export interface GroupSVGLayer extends SVGBase {
  name: string,
  layers: SVGLayer[],
}

export interface LineSVGLayer extends SVGBase {
  endPoints: Position[]
}

export interface RectangleSVGLayer extends SVGBase {
  pos: Position,
  height: number,
  width: number,
}

export interface TextSVGLayer extends SVGBase {
  pos: Position,
  text: string,
}

export type SVGLayer = CircleSVGLayer | GroupSVGLayer | LineSVGLayer | RectangleSVGLayer | TextSVGLayer;

export interface SVGImage extends SVGBase {
  dimensions: {
    width: number,
    height: number,
  },
  layers: SVGLayer[],
}
