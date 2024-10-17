import { ReactNode } from "react";
import { Path } from "../path-type";

export type DataTypeBase = {
  [key: string]: any;
};

export type PathType<T> = undefined | Path<T> | "";

export type ExtType<T> = {
  beforeData: T;
  currentData: T;
  type: "before" | "current";
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
  alignAlignType?: "lcs" | "currentData" | "none";
  labelWidth?: number;
  index?: number;
};
export type FieldItems<T extends DataTypeBase> = Array<FieldItem<T>>;
