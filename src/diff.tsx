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
  VizItems,
  ContentType,
  LabelType,
  VizItem,
} from "./types";
import { headerBlueTipStyle, headerStyle, titleStyle } from "./styles";

function getFieldPathMap<T extends DataTypeBase>(vizItems: VizItems<T>) {
  const isEqualMap: Record<string, IsEqualFuncType> = {};
  const arrayAlignLCSMap: Record<string, string> = {};
  const arrayAlignCurrentDataMap: Record<string, string> = {};
  const arrayNoAlignMap: Record<string, true> = {};
  const arrayMap: Record<string, true> = {};

  vizItems.forEach((field) => {
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
      const res = content(
        getPathValue(data, ext.path, arrayKey),
        data,
        ext
      ) as any;
      if (res.map) {
        return res.map((i: any, idx: any) => (
          <div data-path={ext.path + "." + idx}>{i}</div>
        ));
      } else {
        return res;
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
  fieldItem: VizItem<T>;
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
    <div style={headerStyle}>
      <div style={headerBlueTipStyle}></div>
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
  vizItems: VizItems<T>;
  // 用于比较的数据1，如果不传，则等于data2
  data1?: T;
  // 用于比较的数据2
  data2: T;
  // 严格模式，默认开启，关闭后diff算法会忽略数据类型差异，如0="0"
  strictMode?: boolean;
  // 仅展示数据2
  singleMode?: boolean;
  // 是否展示最上方的标题
  showTitle?: boolean;
  data1Title?: string;
  data2Title?: string;
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
    vizItems,
    data1 = props.data2,
    data2,
    strictMode = true,
    singleMode = false,
    showTitle = true,
    refreshKey = 0,
    data1Title = "原始数据",
    data2Title = "当前数据",
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
      arrayMap,
    } = getFieldPathMap(vizItems);

    const res = alignAndDiff({
      data1: data1,
      data2: data2,
      isEqualMap,
      arrayAlignLCSMap,
      arrayAlignCurrentDataMap,
      arrayNoAlignMap,
      strictMode,
    });

    return { ...res, arrayMap };
  }, [data1, data2, vizItems]);

  const containerWrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);

  const alignAndColorDoms = useCallback(() => {
    // 所有的path元素
    const allElements1: Array<HTMLElement> = Array.from(
      wrapperRef1.current?.querySelectorAll(`[data-path]`) ?? []
    );
    const allElements2: Array<HTMLElement> = Array.from(
      wrapperRef2.current?.querySelectorAll(`[data-path]`) ?? []
    );
    const allColoredElements: Array<HTMLElement> = Array.from(
      containerWrapperRef.current?.querySelectorAll(`[data-colored-path]`) ?? []
    );
    allColoredElements.forEach((ele) => {
      ele.style.backgroundColor = "unset";
      ele.style.borderRight = "unset";
    });

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
        const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
        if (!contentElement.style) {
          return;
        }
        if (["CHANGED", "REMOVED"].includes(val)) {
          contentElement.setAttribute("data-colored-path", key);
          if (dom.querySelectorAll(`[data-path]`).length) {
            contentElement.style.borderRight = "3px solid rgb(253, 226, 226)";
          } else {
            contentElement.style.backgroundColor = "rgb(253, 226, 226)";
          }
        }
      });
      pathDomList2?.forEach((dom) => {
        const contentElement = (dom.lastElementChild ?? dom) as HTMLElement;
        if (!contentElement.style) {
          return;
        }
        if (["CHANGED", "CREATED"].includes(val)) {
          contentElement.setAttribute("data-colored-path", key);
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
      if (path && !ele.querySelectorAll(`[data-path]`).length) {
        const rect = ele.getBoundingClientRect();
        if (pathMaxHeightMap[path] > rect.height) {
          ele.style.height = Math.round(pathMaxHeightMap[path]) + "px";
        }
      }
    });
  }, [diffRes, arrayMap, wrapperRef1, wrapperRef2]);

  useEffect(() => {
    containerWrapperRef.current
      ?.querySelectorAll(`[data-path]`)
      .forEach((i) => {
        if (i instanceof HTMLElement) {
          i.style.height = "unset";
        }
      });
    setTimeout(() => {
      alignAndColorDoms();
    }, 18);
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
      }}
    >
      <div
        style={{
          ...colStyle,
          width: leftWidth + "px",
          overflow: "hidden",
          display: singleMode ? "none" : "block",
        }}
        ref={wrapperRef1}
      >
        {showTitle && <div style={titleStyle}>{data1Title}</div>}
        {vizItems.map((field) => {
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
          display: singleMode ? "none" : "",
          backgroundColor: dragStartEvent ? "rgb(83, 129, 238)" : "gray",
          cursor: "col-resize",
          flex: "1",
          marginRight: "1%",
          marginLeft: "1%",
          maxWidth: "4px",
          minWidth: "4px",
        }}
        ref={mainRef}
        onMouseDown={(e) => {
          setDragStartEvent(e);
          body!.style.cursor = "col-resize";
          body!.style.userSelect = "none";
          containerWrapperRef.current
            ?.querySelectorAll(`[data-path]`)
            .forEach((i) => {
              if (i instanceof HTMLElement) {
                i.style.height = "unset";
              }
            });
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
        {showTitle && <div style={titleStyle}>{data2Title}</div>}
        {vizItems.map((field) => {
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
