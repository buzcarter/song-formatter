/** How a shape is drawn. getStyle() in imageSVG.ts turns these into SVG/CSS properties. */
export interface StyleDef {
  fillColor?: string,
  /** a CSS `font` shorthand, e.g. "bold 14pt Arial" */
  fontFamily?: string,
  textAlign?: 'left' | 'center' | 'right',
  strokeColor?: string,
  strokeWidth?: string,
}

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

// Each shape's `type` is one exact LayerTypes value, which makes SVGLayer a "discriminated
// union": after `if (layer.type === LayerTypes.GROUP)` TypeScript knows it's a GroupSVGLayer.

export interface CircleSVGLayer extends SVGBase {
  type: LayerTypes.CIRCLE,
  center: Position,
  radius: number,
}

export interface GroupSVGLayer extends SVGBase {
  type: LayerTypes.GROUP,
  name: string,
  layers: SVGLayer[],
}

export interface LineSVGLayer extends SVGBase {
  type: LayerTypes.LINE,
  endPoints: Position[]
}

export interface RectangleSVGLayer extends SVGBase {
  type: LayerTypes.RECTANGLE,
  pos: Position,
  height: number,
  width: number,
}

export interface TextSVGLayer extends SVGBase {
  type: LayerTypes.TEXT,
  pos: Position,
  text: string,
}

export type SVGLayer = CircleSVGLayer | GroupSVGLayer | LineSVGLayer | RectangleSVGLayer | TextSVGLayer;

export interface SVGImage extends SVGBase {
  type: LayerTypes.IMAGE,
  dimensions: {
    width: number,
    height: number,
  },
  layers: SVGLayer[],
}
