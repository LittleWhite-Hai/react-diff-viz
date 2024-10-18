import {
  ReactNode,
  useRef,
  useMemo,
  useEffect,
  CSSProperties,
  useCallback,
  useState,
} from "react";
import { throttle } from "lodash";

import { alignAndDiff } from "../diff-algorithm";
import {
  ExtType,
  PathType,
  DataTypeBase,
  IsEqualFuncType,
  RenderItems,
  ContentType,
  LabelType,
  FieldItem,
} from "./types";

function getFieldPathMap<T extends DataTypeBase>(renderItems: RenderItems<T>) {
  const isEqualMap: Record<string, IsEqualFuncType> = {};
  const arrayAlignLCSMap: Record<string, string> = {};
  const arrayAlignCurrentDataMap: Record<string, string> = {};
  const arrayNoAlignMap: Record<string, true> = {};

  renderItems.forEach((field) => {
    const path: string = field.path ?? "";
    if (field.isEqual && path) {
      isEqualMap[path] = field.isEqual;
    }
    if (typeof field.arrayKey === "string") {
      if (field.alignAlignType === "lcs") {
        arrayAlignLCSMap[path] = field.arrayKey;
      } else if (field.alignAlignType === "data2") {
        arrayAlignCurrentDataMap[path] = field.arrayKey;
      } else if (field.alignAlignType === "none") {
        arrayNoAlignMap[path] = true;
      }
    }
  });
  return {
    isEqualMap,
    arrayAlignLCSMap,
    arrayAlignCurrentDataMap,
    arrayNoAlignMap,
  };
}

function getFieldContent<T extends DataTypeBase>(
  data: any,
  content: ContentType<T>,
  ext: ExtType<T>
): ReactNode {
  if (!ext.path && !content) {
    return "";
  }
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
  data1: T;
  data2: T;
  type: "data1" | "data2";
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
}): any {
  const { fieldItem, data, data1, data2, type, contentStyle, labelStyle } =
    props;
  const ext = useMemo(
    () => ({
      data1,
      data2,
      type,
      path: fieldItem.path,
    }),
    [data1, data2, type, fieldItem.path]
  );
  const isHeader = !fieldItem.path && !fieldItem.content;

  return isHeader ? (
    <div
      style={{
        paddingLeft: "16px",
        marginTop: "10px",
        marginBottom: "2px",
        height: "24px",
        fontWeight: "bold",
        fontSize: "17px",
        display: "flex",
      }}
    >
      <div
        style={{
          height: "16px",
          width: "4px",
          marginRight: "3px",
          marginTop: "4px",
          background: "rgb(83, 129, 238)",
        }}
      ></div>
      {getPathLabel(data, fieldItem.label, ext)}
    </div>
  ) : (
    <div
      data-path={fieldItem.path}
      style={{ display: "flex", marginBottom: "6px" }}
    >
      <div
        style={{
          textAlign: "left",
          paddingLeft: "16px",
          color: "gray",
          ...labelStyle,
        }}
      >
        {getPathLabel(data, fieldItem.label, ext)}
      </div>
      <div
        style={{
          textAlign: "left",
          paddingLeft: "6px",
          ...contentStyle,
        }}
      >
        {getFieldContent(data, fieldItem.content, ext)}
      </div>
    </div>
  );
}

export default function Diff<T extends DataTypeBase>(props: {
  // 描述数据的渲染方式及diff计算方式
  renderItems: RenderItems<T>;
  // 用于比较的数据1
  data1: T;
  // 用于比较的数据2
  data2: T;
  // 严格模式，默认开启，关闭后diff算法会忽略数据类型差异，如0="0"
  strictMode?: boolean;
  // 仅查看数据2
  data2Mode?: boolean;
  // 改变Key以触发重新染色和高度对齐
  refreshKey?: number;
  // data1和data2的整体样式
  colStyle?: CSSProperties;
  // 每条数据label的样式
  labelStyle?: CSSProperties;
  // 每条数据content的样式
  contentStyle?: CSSProperties;
  // diff组件整体样式
  style?: CSSProperties;
}) {
  const {
    renderItems,
    data1,
    data2,
    strictMode = true,
    data2Mode = false,
    refreshKey = 0,
    colStyle = { width: "650px" },
    labelStyle = { width: "30%" },
    contentStyle = { width: "65%" },
    style,
  } = props;

  const { diffRes, alignedData1, alignedData2 } = useMemo(() => {
    const {
      isEqualMap,
      arrayAlignLCSMap,
      arrayAlignCurrentDataMap,
      arrayNoAlignMap,
    } = getFieldPathMap(renderItems);

    const res = alignAndDiff({
      data1: data1,
      data2: data2,
      isEqualMap,
      arrayAlignLCSMap,
      arrayAlignCurrentDataMap,
      arrayNoAlignMap,
      strictMode,
    });
    console.log("res.diffRes:", res.diffRes);
    return res;
  }, [data1, data2, renderItems]);

  const containerWrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);

  const alignAndColorDoms = useCallback(() => {
    // 所有的path元素
    const allElements1: NodeListOf<HTMLElement> =
      wrapperRef1.current?.querySelectorAll(`[data-path]`) ?? ([] as any);
    const allElements2: NodeListOf<HTMLElement> =
      wrapperRef2.current?.querySelectorAll(`[data-path]`) ?? ([] as any);

    // path对应dom关系
    const data1DomMap: Record<string, HTMLElement[]> = {};
    const data2DomMap: Record<string, HTMLElement[]> = {};

    // path对应的最高dom
    const pathMaxHeightMap: Record<string, number> = {};

    {
      // 统计container1里的path对应dom关系和max高度
      allElements1.forEach((ele) => {
        const path = ele.getAttribute("data-path");
        if (path) {
          const rect = ele.getBoundingClientRect();
          pathMaxHeightMap[path] = Math.max(
            pathMaxHeightMap[path] ?? 0,
            rect.height
          );

          if (data1DomMap[path]) {
            data1DomMap[path].push(ele);
          } else {
            data1DomMap[path] = [ele];
          }
        }
      });
    }

    {
      // 统计container2里的path对应dom关系和max高度
      allElements2.forEach((ele) => {
        const path = ele.getAttribute("data-path");
        if (path) {
          const rect = ele.getBoundingClientRect();
          pathMaxHeightMap[path] = Math.max(
            pathMaxHeightMap[path] ?? 0,
            rect.height
          );

          if (data2DomMap[path]) {
            data2DomMap[path].push(ele);
          } else {
            data2DomMap[path] = [ele];
          }
        }
      });
    }

    // 着色
    Object.entries(diffRes).forEach(([key, val]: [string, string]) => {
      const pathDomList1 = data1DomMap[key];
      const pathDomList2 = data2DomMap[key];

      pathDomList1?.forEach((dom) => {
        if (["CHANGED", "CREATED", "DELETED"].includes(val)) {
          const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
          if (dom.querySelectorAll(`[data-path]`).length) {
            contentElement.style.borderRight = "3px solid rgb(253, 226, 226)";
          } else {
            contentElement.style.backgroundColor = "rgb(253, 226, 226)";
          }
        }
      });
      pathDomList2?.forEach((dom) => {
        if (["CHANGED", "CREATED", "DELETED"].includes(val)) {
          const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
          if (dom.querySelectorAll(`[data-path]`).length) {
            contentElement.style.borderRight = "3px solid rgb(217, 245, 214)";
          } else {
            contentElement.style.backgroundColor = "rgb(217, 245, 214)";
          }
        }
      });
    });
    // 对齐高度1
    allElements1.forEach((ele) => {
      const path = ele.getAttribute("data-path");
      // 如果有子元素也需要diff对齐，则不对齐父亲高度
      if (path && !ele.querySelectorAll(`[data-path]`).length) {
        const rect = ele.getBoundingClientRect();
        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.height = Math.round(pathMaxHeightMap[path]) + "px";
        }
      }
    });
    // 对齐高度2
    allElements2.forEach((ele) => {
      const path = ele.getAttribute("data-path");
      // 如果有子元素也需要diff对齐，则不对齐父亲高度
      if (path && !ele.querySelectorAll(`[data-path]`).length) {
        const rect = ele.getBoundingClientRect();
        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.height = Math.round(pathMaxHeightMap[path]) + "px";
        }
      }
    });
  }, [diffRes, wrapperRef1, wrapperRef2]);

  useEffect(() => {
    alignAndColorDoms();
  }, [diffRes, wrapperRef1, wrapperRef2, refreshKey]);

  const [leftWidth, setLeftWidth] = useState<number>(
    parseInt((colStyle.width ?? "650") as string)
  );
  const [rightWidth, setRightWidth] = useState<number>(
    parseInt((colStyle.width ?? "650") as string)
  );
  const [oldLeftWidth, setOldLeftWidth] = useState<number>(
    parseInt((colStyle.width ?? "650") as string)
  );

  const [dragStartEvent, setDragStartEvent] =
    useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();
  const mainRef = useRef<any>(null);
  const handleMouseMove = throttle((e: MouseEvent) => {
    if (!dragStartEvent) return;
    const leftWidth = oldLeftWidth - (dragStartEvent.clientX - e.clientX);
    setLeftWidth(leftWidth);
    setRightWidth(containerWrapperRef.current!.clientWidth - leftWidth);
  }, 16);

  useEffect(() => {
    const handleMouseUp = () => {
      body!.style.cursor = "unset";
      body!.style.userSelect = "unset";
      setDragStartEvent(undefined);
      setTimeout(() => {
        // 拖拽后，重新对齐高度
        alignAndColorDoms();
      }, 60);
    };

    if (dragStartEvent) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);
  const body = useMemo(() => document.querySelector("body"), []);

  return (
    <div
      ref={containerWrapperRef}
      style={{
        width: "1500px",
        ...style,
        display: "flex",
        border: "1px dashed gray",
      }}
    >
      <div
        style={{
          marginRight: "4%",
          ...colStyle,
          width: leftWidth + "px",
          display: data2Mode ? "none" : "block",
        }}
        ref={wrapperRef1}
      >
        {renderItems.map((field) => {
          const label =
            typeof field.label === "string" ? field.label : field.key ?? "";
          return (
            <RenderFieldItem<T>
              key={field.path + label}
              data={alignedData1}
              data1={alignedData1}
              data2={alignedData2}
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              fieldItem={field}
              type="data1"
            />
          );
        })}
      </div>
      <div
        style={{
          backgroundColor: dragStartEvent ? "rgb(83, 129, 238)" : "gray",
          cursor: "col-resize",
          flex: "1",
          maxWidth: "4px",
          minWidth: "4px",
          display: data2Mode ? "none" : "",
        }}
        ref={mainRef}
        onMouseDown={(e) => {
          setDragStartEvent(e);
          body!.style.cursor = "col-resize";
          body!.style.userSelect = "none";
          setOldLeftWidth(leftWidth);
        }}
      ></div>
      <div
        style={{ ...colStyle, flex: 1, width: rightWidth + "px" }}
        ref={wrapperRef2}
      >
        {renderItems.map((field) => {
          const label =
            typeof field.label === "string" ? field.label : field.key ?? "";
          return (
            <RenderFieldItem
              key={field.path + label}
              data={alignedData2}
              data1={alignedData1}
              data2={alignedData2}
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              fieldItem={field}
              type="data2"
            />
          );
        })}
      </div>
    </div>
  );
}
