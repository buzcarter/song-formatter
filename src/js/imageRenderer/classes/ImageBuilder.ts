/**
 * Stores, in an output-format agnostic manner, data for drawing images. Usage:
 * all methods are chainable except getData.
 * Limits: nested groups not supported; names are only available on groups, no unique checks.
 */
import {
  LayerTypes,
  StyleDef,
  SVGImage, SVGBase,
  CircleSVGLayer, GroupSVGLayer, LineSVGLayer, RectangleSVGLayer, TextSVGLayer,
} from '../interfaces/SVGImage';

interface ImageContext {
  root: SVGImage | null,
  layer: SVGBase | null,
  current: SVGBase | null,
}

export class ImageBuilder implements SVGImage {
  constructor() {
    this.#context = {
      root: null,
      layer: null,
      current: null,
    };
  }

  #context: ImageContext;

  dimensions = { width: 0, height: 0 };

  layers = [];

  type = LayerTypes.IMAGE;

  newImage(width: number, height: number): ImageBuilder {
    const obj: SVGImage = {
      type: LayerTypes.IMAGE,
      dimensions: {
        height,
        width,
      },
      layers: [],
      style: null,
    };

    this.#context.root = obj;
    this.#context.current = obj;

    return this;
  }

  #newLayer(obj: SVGBase): ImageBuilder {
    const hasLayers = Boolean(this.#context.current && 'layers' in this.#context.current && Array.isArray(this.#context.current.layers));
    if (!hasLayers) {
      return this;
    }

    obj.style = null;
    // @ts-ignore-next-line
    this.#context.current.layers.push(obj);
    if (obj.type && obj.type === LayerTypes.GROUP) {
      this.#context.current = obj;
    } else {
      this.#context.layer = obj;
    }
    return this;
  }

  newGroup(name: string): ImageBuilder {
    const group: GroupSVGLayer = {
      type: LayerTypes.GROUP,
      name,
      layers: [],
    };
    this.#newLayer(group);
    this.#context.layer = null;
    return this;
  }

  endGroup(): ImageBuilder {
    this.#context.current = this.#context.root;
    // this.#context.layer = this.#context.current;
    return this;
  }

  circle(centerX: number, centerY: number, radius: number): ImageBuilder {
    const circle: CircleSVGLayer = {
      type: LayerTypes.CIRCLE,
      center: {
        x: centerX,
        y: centerY,
      },
      radius,
    };
    return this.#newLayer(circle);
  }

  rectangle(x: number, y: number, width: number, height: number): ImageBuilder {
    const rectangle: RectangleSVGLayer = {
      type: LayerTypes.RECTANGLE,
      pos: {
        x,
        y,
      },
      width,
      height,
    };
    return this.#newLayer(rectangle);
  }

  line(x0: number, y0: number, x1: number, y1: number): ImageBuilder {
    const line: LineSVGLayer = {
      type: LayerTypes.LINE,
      endPoints: [{
        x: x0,
        y: y0,
      }, {
        x: x1,
        y: y1,
      }],
    };
    return this.#newLayer(line);
  }

  hLine(x: number, y: number, length: number): ImageBuilder {
    return this.line(x, y, x + (length || 1), y);
  }

  vLine(x: number, y: number, length: number): ImageBuilder {
    return this.line(x, y, x, y + (length || 1));
  }

  text(x: number, y: number, text: string): ImageBuilder {
    const textLayer: TextSVGLayer = {
      type: LayerTypes.TEXT,
      pos: { x, y },
      text,
    };
    return this.#newLayer(textLayer);
  }

  setStyle(styleDef: StyleDef): ImageBuilder {
    const target = this.#context.layer ? this.#context.layer : this.#context.current;
    if (!target || target.style) {
      return this;
    }

    target.style = styleDef;
    return this;
  }

  getData(): SVGImage {
    // @ts-ignore-next-line
    return this.#context.root;
  }
}

export default ImageBuilder;
