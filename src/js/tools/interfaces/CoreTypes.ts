export type Primitive = string | number | boolean;

export interface JsonData {
  [key: string]: Primitive | JsonData
}

export interface BooleanDict {
  [key: string]: boolean
}

export interface NumberDict {
  [key: string]: number
}

export interface StringDict {
  [key: string]: string
}
