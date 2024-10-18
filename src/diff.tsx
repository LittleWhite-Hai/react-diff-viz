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

import { alignAndDiff, getValueByPath } from "../diff-algorithm";
import {
  ExtType,
  PathType,
  DataTypeBase,
  IsEqualFuncType,
  RenderItems,
  ContentType,
  LabelType,
  RenderItem,
} from "./types";

function getFieldPathMap<T extends DataTypeBase>(renderItems: RenderItems<T>) {
  const isEqualMap: Record<string, IsEqualFuncType> = {};
  const arrayAlignLCSMap: Record<string, string> = {};
  const arrayAlignCurrentDataMap: Record<string, string> = {};
  const arrayNoAlignMap: Record<string, true> = {};
  const arrayMap: Record<string, true> = {};

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
      arrayMap[path] = true;
    }
  });
  return {
    isEqualMap,
    arrayAlignLCSMap,
    arrayAlignCurrentDataMap,
    arrayNoAlignMap,
    arrayMap,
  };
}

function getFieldContent<T extends DataTypeBase>(
  data: any,
  content: ContentType<T>,
  arrayKey: string | undefined,
  ext: ExtType<T>
): ReactNode {
  if (!ext.path && !content) {
    return "";
  }
  if (content) {
    if (typeof arrayKey === "string" && typeof content === "function") {
      const res = content(getPathValue(data, ext.path, arrayKey), data, ext) as any
      if (res.map) {
        return res.map((i: any, idx: any) => (
          <div data-path={ext.path + "." + idx}>{i}</div>
        ));
      } else {
        return res
      }
    }
    if (typeof content === "function") {
      return content(getPathValue(data, ext.path, arrayKey), data, ext);
    } else {
      return content;
    }
  } else {
    return getPathValue(data, ext.path, undefined);
  }
}

// 根据path得到data中对应的原始数据
function getPathValue<T extends DataTypeBase>(
  data: T,
  path: string | undefined,
  arrayKey: string | undefined
): any {
  const res = getValueByPath(data, path);

  // if (["object", "function"].includes(typeof res)) {
  //   return JSON.stringify(res);
  // }
  return res;
}

// 根据path得到data对应的label
function getPathLabel<T extends DataTypeBase>(
  data: T | undefined,
  label: LabelType<T>,
  arrayKey: string | undefined,
  ext: ExtType<T>
): ReactNode {
  if (!data) {
    return typeof label === "string" ? label : "";
  }
  const curData = ext.path ? getPathValue(data, ext.path, arrayKey) : undefined;
  if (typeof label === "function") {
    return label(curData, data, ext);
  } else {
    return label;
  }
}

function RenderFieldItem<T extends DataTypeBase>(props: {
  fieldItem: RenderItem<T>;
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
  if (fieldItem.visible === false) {
    return null;
  }

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
          width: "3px",
          marginRight: "3px",
          marginTop: "4px",
          background: "rgb(83, 129, 238)",
        }}
      ></div>
      {getPathLabel(data, fieldItem.label, fieldItem.arrayKey, ext)}
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
        {getPathLabel(data, fieldItem.label, fieldItem.arrayKey, ext)}
      </div>
      <div
        style={{
          textAlign: "left",
          paddingLeft: "6px",
          ...contentStyle,
        }}
      >
        {getFieldContent(data, fieldItem.content, fieldItem.arrayKey, ext)}
      </div>
    </div>
  );
}

export default function Diff<T extends DataTypeBase>(props: {
  // 描述数据的渲染方式及diff计算方式
  renderItems: RenderItems<T>;
  // 用于比较的数据1，如果不传，则等于data2
  data1?: T;
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
    data1 = props.data2,
    data2,
    strictMode = true,
    data2Mode = false,
    refreshKey = 0,
    colStyle = { width: "650px" },
    labelStyle = { width: "30%" },
    contentStyle = { width: "65%" },
    style,
  } = props;

  const { diffRes, alignedData1, alignedData2, arrayMap } = useMemo(() => {
    const {
      isEqualMap,
      arrayAlignLCSMap,
      arrayAlignCurrentDataMap,
      arrayNoAlignMap,
      arrayMap
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
    return { ...res, arrayMap };
  }, [data1, data2, renderItems]);

  const containerWrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);

  const alignAndColorDoms = useCallback(() => {
    // 所有的path元素
    const allElements1: Array<HTMLElement> =
      Array.from(wrapperRef1.current?.querySelectorAll(`[data-path]`) ?? []) as Array<HTMLElement>;
    const allElements2: Array<HTMLElement> =
      Array.from(wrapperRef2.current?.querySelectorAll(`[data-path]`) ?? []) as Array<HTMLElement>;

    // {
    //   // 给所有数组元素添加data-path
    //   const allArrayItemElements1: Array<HTMLElement> = []
    //   allElements1.forEach((ele) => {
    //     const path = ele.getAttribute("data-path");
    //     const listChildren = ele.lastElementChild?.children
    //     if (path && arrayMap[path] && listChildren) {
    //       for (const idx in listChildren) {
    //         const child = listChildren[idx] as HTMLElement
    //         if (child instanceof HTMLElement && !child.getAttribute("data-path")) {
    //           child.setAttribute("data-path", path + "." + idx);
    //           allArrayItemElements1.push(child);
    //         }

    //       }
    //     }
    //   });
    //   allElements1.push(...allArrayItemElements1);

    //   const allArrayItemElements2: Array<HTMLElement> = []
    //   allElements2.forEach((ele) => {
    //     const path = ele.getAttribute("data-path");
    //     const listChildren = ele.lastElementChild?.children
    //     if (path && arrayMap[path] && listChildren) {
    //       for (const idx in listChildren) {
    //         const child = listChildren[idx] as HTMLElement
    //         if (child instanceof HTMLElement && !child.getAttribute("data-path")) {
    //           child.setAttribute("data-path", path + "." + idx);
    //           allArrayItemElements2.push(child);
    //         }
    //       }
    //     }
    //   });
    //   allElements2.push(...allArrayItemElements2);
    // }


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
        if (["CHANGED", "DELETED"].includes(val)) {
          const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
          if (dom.querySelectorAll(`[data-path]`).length) {
            contentElement.style.borderRight = "3px solid rgb(253, 226, 226)";
          } else {
            contentElement.style.backgroundColor = "rgb(253, 226, 226)";
          }
        }
      });
      pathDomList2?.forEach((dom) => {
        if (["CHANGED", "CREATED"].includes(val)) {
          const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
          if (dom.querySelectorAll(`[data-path]`).length) {
            contentElement.style.borderRight = "3px solid rgb(217, 245, 214)";
          } else {
            contentElement.style.backgroundColor = "rgb(217, 245, 214)";
          }
        }
      });
    });
    console.log("pathMaxHeightMap:", pathMaxHeightMap);
    // 对齐高度1
    allElements1.forEach((ele) => {
      const path = ele.getAttribute("data-path");
      // 如果有子元素也需要diff对齐，则不对齐父亲高度
      if (path) {
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
      if (path) {
        const rect = ele.getBoundingClientRect();
        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.height = Math.round(pathMaxHeightMap[path]) + "px";
        }
      }
    });
  }, [diffRes, arrayMap, wrapperRef1, wrapperRef2]);

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
  }, [dragStartEvent]);
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
          ...colStyle,
          width: leftWidth + "px",
          overflow: "hidden",
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
          marginRight: "1%",
          marginLeft: "1%",
          maxWidth: "4px",
          minWidth: "4px",
          display: data2Mode ? "none" : "",
        }}
        ref={mainRef}
        onMouseDown={(e) => {
          setDragStartEvent(e);
          body!.style.cursor = "col-resize";
          body!.style.userSelect = "none";
          containerWrapperRef.current?.querySelectorAll(`[data-path]`).forEach(i => {
            if (i instanceof HTMLElement) {
              i.style.height = "unset"
            }
          })
          setOldLeftWidth(leftWidth);
        }}
      ></div>
      <div
        style={{
          ...colStyle,
          flex: 1,
          overflow: "hidden",
          width: rightWidth + "px",
        }}
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
