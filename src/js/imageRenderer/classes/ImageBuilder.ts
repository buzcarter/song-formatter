/**
 * Stores, in an output-format agnostic manner, data for drawing images. Usage:
 * all methods are chainable except getData.
 * Limits: nested groups not supported; names are only available on groups, no unique checks.
 *
 *   new ImageBuilder()
 *     .newImage(100, 150)
 *     .newGroup('fretboard').setStyle({ strokeColor: '#036' })
 *     .line(0, 0, 10, 0)            // goes in the group, styled by it
 *     .endGroup()
 *     .circle(5, 5, 2).setStyle({ fillColor: 'red' })   // styles just this circle
 *     .getData();
 */
import {
  LayerTypes,
  StyleDef,
  SVGImage, SVGLayer,
  CircleSVGLayer, GroupSVGLayer, LineSVGLayer, RectangleSVGLayer, TextSVGLayer,
} from '../interfaces/SVGImage';

/** Something that holds layers: the image itself, or a group */
type Container = SVGImage | GroupSVGLayer;

interface ImageContext {
  /** The image; `null` until newImage() is called */
  root: SVGImage | null,
  /** Where new shapes go: the image, or the group newGroup() started */
  current: Container | null,
  /** The shape added last, which setStyle() styles; `null` right after newImage() or newGroup() */
  layer: SVGLayer | null,
}

// (This class used to say `implements SVGImage` and carry unused `dimensions`, `layers` and
// `type` fields to satisfy that. It isn't an image, it builds one: getData() returns it.)
export class ImageBuilder {
  // `#` makes these truly private (at runtime, not only to TypeScript)
  #context: ImageContext = {
    root: null,
    current: null,
    layer: null,
  };

  newImage(width: number, height: number): ImageBuilder {
    const image: SVGImage = {
      type: LayerTypes.IMAGE,
      dimensions: {
        height,
        width,
      },
      layers: [],
      style: null,
    };

    this.#context = {
      root: image,
      current: image,
      layer: null,
    };
    return this;
  }

  #add(layer: SVGLayer): ImageBuilder {
    const { current } = this.#context;
    if (!current) {
      // newImage() hasn't been called: there's nowhere to put it
      return this;
    }

    layer.style = null;
    current.layers.push(layer);
    if (layer.type === LayerTypes.GROUP) {
      // shapes added from now on go in this group, until endGroup()
      this.#context.current = layer;
    } else {
      this.#context.layer = layer;
    }
    return this;
  }

  newGroup(name: string): ImageBuilder {
    const group: GroupSVGLayer = {
      type: LayerTypes.GROUP,
      name,
      layers: [],
    };
    this.#add(group);
    // so a setStyle() straight after this styles the group
    this.#context.layer = null;
    return this;
  }

  endGroup(): ImageBuilder {
    this.#context.current = this.#context.root;
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
    return this.#add(circle);
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
    return this.#add(rectangle);
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
    return this.#add(line);
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
    return this.#add(textLayer);
  }

  /**
   * Styles the shape just added or, straight after newImage()/newGroup(), the image/group.
   * Only the first setStyle() on something counts.
   */
  setStyle(styleDef: StyleDef): ImageBuilder {
    const target = this.#context.layer || this.#context.current;
    if (!target || target.style) {
      return this;
    }

    target.style = styleDef;
    return this;
  }

  getData(): SVGImage {
    if (!this.#context.root) {
      throw new Error('ImageBuilder: call newImage() before getData()');
    }
    return this.#context.root;
  }
}

export default ImageBuilder;
