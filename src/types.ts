import { ReactNode } from "react";
import { Path } from "../path-type";

export type DataTypeBase = {
  [key: string]: any;
};

export type PathType<T> = undefined | Path<T> | "";

export type ExtType<T> = {
  data1: T;
  data2: T;
  type: "data1" | "data2" | "";
  path: PathType<T>;
  index?: number;
};
export type IsEqualFuncType = (
  data1: any,
  data2: any,
  ext: ExtType<any>
) => boolean;

export type LabelType<T> =
  | undefined
  | string
  | ((data: any, record: T, ext: ExtType<T>) => ReactNode);

export type VisibleType<T> =
  | undefined
  | boolean
  | ((data: any, record: T, ext: ExtType<T>) => boolean | undefined);

export type ContentType<T> =
  | undefined
  | ReactNode
  | ((data: any, record: T, ext: ExtType<T>) => ReactNode);

export type FieldItem<T extends DataTypeBase> = {
  label: LabelType<T>;
  separator?: boolean;
  path?: PathType<T>;
  key?: string;
  visible?: VisibleType<T>;
  foldable?: boolean;
  isEqual?: IsEqualFuncType;
  colPadding?: number;
  content?: ContentType<T>;
  colorDataPath?: boolean;
  arrayKey?: string;
  alignAlignType?: "lcs" | "data2" | "none";
  labelWidth?: number;
  index?: number;
};
export type RenderItems<T extends DataTypeBase> = Array<FieldItem<T>>;
