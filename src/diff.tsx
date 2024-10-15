import {
  ReactNode,
  useRef,
  useMemo,
  useEffect,
  CSSProperties,
  useCallback,
} from "react";

import { Path } from "../path-type";
import { diff } from "../diff-algorithm";

export type DataTypeBase = {
  [key: string]: any;
};

export enum DiffStatus {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
  UNCHANGED = "UNCHANGED",
}

type ExtType<T> = {
  beforeData: T;
  currentData: T;
  type: "before" | "current";
  path: PathType<T>;
  index?: number;
};

type LabelType<T> =
  | undefined
  | string
  | ((data: any, record: T, ext: ExtType<T>) => ReactNode);
type PathType<T> = undefined | Path<T> | "";

type VisibleType<T> =
  | undefined
  | boolean
  | ((data: any, record: T, ext: ExtType<T>) => boolean | undefined);

type IsEqualFuncType = (data1: any, data2: any, ext: ExtType<any>) => boolean;

type ContentType<T> =
  | undefined
  | ReactNode
  | ((data: any, record: T, ext: ExtType<T>) => ReactNode);

type FieldItem<T extends DataTypeBase> = {
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
  arrNeedAlignByLCS?: boolean;
  arrNeedAlignByAfterKey?: string;
  labelWidth?: number;
  index?: number;
};
type FieldItems<T extends DataTypeBase> = Array<FieldItem<T>>;

function getIsEqualMap(fieldItems: any) {
  return {};
}

function calcDiff(
  beforeData: any,
  currentData: any,
  fieldItems: any
): {
  diffRes: Record<string, string>;
  alignedData1: any;
  alignedData2: any;
} {
  return diff(beforeData, currentData);
}

function getFieldContent<T extends DataTypeBase>(
  data: any,
  content: ContentType<T>,
  ext: {
    beforeData: T;
    currentData: T;
    type: "before" | "current";
    path: PathType<T>;
    index?: number;
  }
): ReactNode {
  if (content) {
    if (typeof content === "function") {
      return content(getPathValue(data, ext.path), data, ext);
    } else {
      return content;
    }
  } else {
    return getPathValue(data, ext.path);
  }
}

// 根据path得到data中对应的原始数据
function getPathValue<T extends DataTypeBase>(
  data: T,
  path: string | undefined
): any {
  if (path === undefined) {
    return data;
  } else {
    // path是string
    const pathArr = path.split(".") ?? [];
    let curData = data;
    for (const tmpIdx of pathArr) {
      curData = (curData as T)?.[tmpIdx];
    }
    return curData;
  }
}

// 根据path得到data对应的label
function getPathLabel<T extends DataTypeBase>(
  data: T | undefined,
  label: LabelType<T>,
  ext: ExtType<T>
): ReactNode {
  if (!data) {
    return typeof label === "string" ? label : "";
  }
  const curData = ext.path ? getPathValue(data, ext.path) : undefined;
  if (typeof label === "function") {
    return label(curData, data, ext);
  } else {
    return label;
  }
}

function RenderFieldItem<T extends DataTypeBase>(props: {
  fieldItem: FieldItem<T>;
  data: T;
  beforeData: T;
  currentData: T;
  type: "before" | "current";
}): any {
  const { fieldItem, data, beforeData, currentData, type } = props;
  const ext = useMemo(
    () => ({
      beforeData,
      currentData,
      type,
      path: fieldItem.path,
    }),
    [beforeData, currentData, type, fieldItem.path]
  );

  return (
    <div data-path={fieldItem.path}>
      <div>{getPathLabel(data, fieldItem.label, ext)}</div>
      <div>{getFieldContent(data, fieldItem.content, ext)}</div>
    </div>
  );
}

export default function Diff<T extends DataTypeBase>(props: {
  fieldItems: FieldItems<T>;
  beforeData: T;
  currentData: T;
  refreshKey?: number;
  beforeColStyle?: CSSProperties;
  currentColStyle?: CSSProperties;
  beforeLabelStyle?: CSSProperties;
  currentLabelStyle?: CSSProperties;
  beforeContentStyle?: CSSProperties;
  currentContentStyle?: CSSProperties;
  style?: CSSProperties;
}) {
  const {
    fieldItems,
    beforeData,
    currentData,
    refreshKey = 0,
    beforeColStyle = { width: "45%" },
    currentColStyle = { width: "45%" },
    beforeLabelStyle = { width: "35%" },
    currentLabelStyle = { width: "35%" },
    beforeContentStyle = { width: "65%" },
    currentContentStyle = { width: "65%" },
    style,
  } = props;

  const isEqualMap = useMemo(() => {
    return getIsEqualMap(fieldItems);
  }, [fieldItems]);

  const { diffRes, alignedData1, alignedData2 } = useMemo(() => {
    return calcDiff(beforeData, currentData, isEqualMap);
  }, [beforeData, currentData, isEqualMap]);

  const beforeWrapperRef = useRef<HTMLDivElement>(null);
  const currentWrapperRef = useRef<HTMLDivElement>(null);

  const alignAndColorDoms = useCallback(() => {
    // 所有的path元素
    const beforeAllElements: NodeListOf<HTMLElement> =
      beforeWrapperRef.current?.querySelectorAll(`[data-path]`) ?? ([] as any);
    const currentAllElements: NodeListOf<HTMLElement> =
      currentWrapperRef.current?.querySelectorAll(`[data-path]`) ?? ([] as any);

    // path对应dom关系
    const beforeDataDomMap: Record<string, HTMLElement[]> = {};
    const currentDataDomMap: Record<string, HTMLElement[]> = {};

    // path对应的最高dom
    const pathMaxHeightMap: Record<string, number> = {};

    {
      // 统计beforeContainer里的path对应dom关系和max高度
      beforeAllElements.forEach((ele) => {
        const path = ele.dataset.dataPath;
        if (path) {
          // 如果有子元素也需要diff对齐，则不对齐父亲高度
          const rect = ele.getBoundingClientRect();
          pathMaxHeightMap[path] = Math.max(
            pathMaxHeightMap[path] ?? 0,
            rect.height
          );

          if (beforeDataDomMap[path]) {
            beforeDataDomMap[path].push(ele);
          } else {
            beforeDataDomMap[path] = [ele];
          }
        }
      });
    }

    {
      // 统计currentContainer里的path对应dom关系和max高度
      currentAllElements.forEach((ele) => {
        const path = ele.dataset.dataPath;
        if (path) {
          const rect = ele.getBoundingClientRect();
          pathMaxHeightMap[path] = Math.max(
            pathMaxHeightMap[path] ?? 0,
            rect.height
          );

          if (currentDataDomMap[path]) {
            currentDataDomMap[path].push(ele);
          } else {
            currentDataDomMap[path] = [ele];
          }
        }
      });
    }
    // 着色
    Object.entries(diffRes).forEach(([key, val]: [string, string]) => {
      const beforePathDomList = beforeDataDomMap[key];
      const currentPathDomList = currentDataDomMap[key];

      beforePathDomList?.forEach((dom) => {
        if (["UPDATE", "CREATE", "DELETE"].includes(val)) {
          dom.style.backgroundColor = "rgb(253, 226, 226)";
        }
      });
      currentPathDomList?.forEach((dom) => {
        if (["UPDATE", "CREATE", "DELETE"].includes(val)) {
          dom.style.backgroundColor = "rgb(217, 245, 214)";
        }
      });
    });
    // 对齐before高度
    beforeAllElements.forEach((ele) => {
      const path = ele.dataset.dataPath;
      // 如果有子元素也需要diff对齐，则不对齐父亲高度
      if (path && !ele.querySelectorAll(`[data-path]`).length) {
        const rect = ele.getBoundingClientRect();

        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.paddingBottom =
            Number(getComputedStyle(ele).paddingBottom.slice(0, -2)) +
            pathMaxHeightMap[path] -
            rect.height +
            "px";
        }
      }
    });
    // 对齐current高度
    currentAllElements.forEach((ele) => {
      const path = ele.dataset.dataPath;
      // 如果有子元素也需要diff对齐，则不对齐父亲高度
      if (path && !ele.querySelectorAll(`[data-path]`).length) {
        const rect = ele.getBoundingClientRect();
        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.paddingBottom =
            Number(getComputedStyle(ele).paddingBottom.slice(0, -2)) +
            pathMaxHeightMap[path] -
            rect.height +
            "px";
        }
      }
    });
  }, [diffRes, beforeWrapperRef, currentWrapperRef]);

  useEffect(() => {
    alignAndColorDoms();
  }, [diffRes, beforeWrapperRef, currentWrapperRef, refreshKey]);

  return (
    <div style={{ ...style, display: "flex" }}>
      <div
        style={{ marginRight: "10%", overflow: "scroll", ...beforeColStyle }}
        ref={beforeWrapperRef}
      >
        {fieldItems.map((field) => {
          return (
            <RenderFieldItem<T>
              key={field.path ?? "" + field.key}
              data={alignedData1}
              beforeData={alignedData1}
              currentData={alignedData2}
              fieldItem={field}
              type="before"
            />
          );
        })}
      </div>
      <div
        style={{ overflow: "scroll", ...currentColStyle }}
        ref={currentWrapperRef}
      >
        {fieldItems.map((field) => {
          return (
            <RenderFieldItem
              key={field.path ?? "" + field.key}
              data={alignedData2}
              beforeData={alignedData1}
              currentData={alignedData2}
              fieldItem={field}
              type="current"
            />
          );
        })}
      </div>
    </div>
  );
}
