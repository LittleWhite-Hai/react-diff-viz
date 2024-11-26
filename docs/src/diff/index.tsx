import React, {
  ReactNode,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from "react";
import { throttle } from "lodash";

import {
  align,
  alignAndDiff,
  diff,
  DiffResType,
  getValueByPath,
} from "./diff-algorithm";
import {
  ExtType,
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

  vizItems.forEach((field) => {
    const path: string = field.path ?? "";
    if (field.isEqual && path) {
      isEqualMap[path] = field.isEqual;
    }
    if (typeof field.arrayKey === "string") {
      if (field.arrayAlignType === "lcs") {
        arrayAlignLCSMap[path] = field.arrayKey;
      } else if (field.arrayAlignType === "data2") {
        arrayAlignCurrentDataMap[path] = field.arrayKey;
      }
    }
    if (field.arrayAlignType === "none") {
      arrayNoAlignMap[path] = true;
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
  arrayKey: string | undefined,
  ext: ExtType<T>
): ReactNode {
  if (!ext.path && !content) {
    return "";
  }
  if (content) {
    if (typeof arrayKey === "string" && typeof content === "function") {
      const res = content(getPathValue(data, ext.path), data, ext) as any;
      if (res.map) {
        return res.map((i: any, idx: any) => (
          <div data-path={ext.path + "." + idx} key={ext.path + "." + idx}>
            {i}
          </div>
        ));
      } else {
        return res;
      }
    }
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
  const curData = ext.path ? getPathValue(data, ext.path) : undefined;
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
  contentStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
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
      // data-path={fieldItem.path}
      style={{ display: "flex", marginBottom: "15px" }}
    >
      <div
        style={{
          textAlign: "left",
          color: "gray",
          height: "min-content",
          ...labelStyle,
        }}
      >
        {getPathLabel(data, fieldItem.label, fieldItem.arrayKey, ext)}
      </div>
      <div style={{ marginLeft: "10px", ...contentStyle }}>
        <div
          // 染色和对齐高度(如果该dom有子元素也标记了data-path，则不染色和对齐高度)
          data-path={fieldItem.path}
          style={{
            textAlign: "left",
            paddingRight: "4px",
            borderRight: "4px solid transparent",
          }}
        >
          {getFieldContent(data, fieldItem.content, fieldItem.arrayKey, ext)}
        </div>
      </div>
    </div>
  );
}

/**
 * 使用范例：
 *
 * const diffRes = diff({
 *   data1,
 *   data2,
 * });
 *
 * <DiffWrapper ref1={beforeRef} ref2={afterRef} diffRes={diffRes}>
 *  <div ref={beforeRef}>{your code, render by data1}</div>
 *  <div ref={afterRef}>{your code, render by data2}</div>
 * </DiffWrapper>
 *
 */

function DiffWrapper(props: {
  children: React.ReactNode;
  diffRes: DiffResType;
  wrapperRef1: React.RefObject<HTMLDivElement>;
  wrapperRef2: React.RefObject<HTMLDivElement>;
  refreshKey?: number;
  disableColoring?: boolean;
  style?: React.CSSProperties;
}) {
  const {
    diffRes,
    wrapperRef1,
    wrapperRef2,
    refreshKey,
    disableColoring = false,
  } = props;

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
      if (
        ["rgb(253, 226, 226)", "rgb(217, 245, 214)"].includes(
          ele.style.backgroundColor
        )
      ) {
        ele.style.backgroundColor = "unset";
      }
      if (
        [
          "4px solid rgb(253, 226, 226)",
          "4px solid rgb(217, 245, 214)",
        ].includes(ele.style.borderRight)
      ) {
        ele.style.borderRight = "unset";
        ele.style.paddingRight = "unset";
      }
    });

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

    // 如果禁用，则不继续操作dom染色
    if (disableColoring) return;

    // 着色
    Object.entries(diffRes).forEach(([key, val]: [string, string]) => {
      const pathDomList1 = data1DomMap[key];
      const pathDomList2 = data2DomMap[key];

      pathDomList1?.forEach((dom) => {
        if (["CHANGED", "REMOVED", "CREATED"].includes(val)) {
          if (dom.querySelectorAll(`[data-path]`).length) {
            dom.setAttribute("data-colored-path", key);
            dom.style.borderRight = "4px solid rgb(253, 226, 226)";
            dom.style.paddingRight = "4px";
          } else if (["CHANGED", "REMOVED"].includes(val)) {
            dom.setAttribute("data-colored-path", key);
            dom.style.backgroundColor = "rgb(253, 226, 226)";
          }
        }
      });

      pathDomList2?.forEach((dom) => {
        if (["CHANGED", "CREATED", "REMOVED"].includes(val)) {
          if (dom.querySelectorAll(`[data-path]`).length) {
            dom.setAttribute("data-colored-path", key);
            dom.style.borderRight = "4px solid rgb(217, 245, 214)";
            dom.style.paddingRight = "4px";
          } else if (["CHANGED", "CREATED"].includes(val)) {
            dom.setAttribute("data-colored-path", key);
            dom.style.backgroundColor = "rgb(217, 245, 214)";
          }
        }
      });
    });
  }, [diffRes, wrapperRef1, wrapperRef2, disableColoring]);

  const containerWrapperRef = useRef<HTMLDivElement>(null);

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
  }, [
    diffRes,
    wrapperRef1,
    wrapperRef2,
    refreshKey,
    containerWrapperRef,
    disableColoring,
  ]);

  return (
    <div ref={containerWrapperRef} style={props.style}>
      {props.children}
    </div>
  );
}

/**
 * The Diff component is used to compare and display the differences between two sets of data
 *
 * @param
 * @param vizItems - Describes the rendering method and diff calculation method for the data
 * @param data1 - The first set of data for comparison
 * @param data2 - The second set of data for comparison
 * @param strictMode - Strict mode, enabled by default. When disabled, the diff algorithm ignores data type differences, e.g., 0="0"
 * @param singleMode - Only display data2
 * @param showTitle - Whether to display the title at the top
 * @param data1Title - Title for data1
 * @param data2Title - Title for data2
 * @param refreshKey - Change this key to trigger recoloring and height alignment
 * @param labelStyle - Style for each data label
 * @param contentStyle - Style for each data content
 * @param colStyle - Overall style for data1 and data2 columns(width only support px)
 * @param style - Style for the diff component(width only support px)
 * @returns react node component
 */
export default function Diff<T extends DataTypeBase>(props: {
  vizItems: VizItems<T>;
  data1?: T;
  data2: T;
  strictMode?: boolean;
  singleMode?: boolean;
  showTitle?: boolean;
  data1Title?: string;
  data2Title?: string;
  refreshKey?: number;
  colStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}) {
  const {
    vizItems,
    strictMode = true,
    singleMode = false,
    showTitle = false,
    refreshKey = 0,
    data1Title = "Before Data",
    data2Title = "Current Data",
    colStyle = {},
    labelStyle = { minWidth: "25%" },
    contentStyle = {},
    style = {},
  } = props;
  let { data1, data2 } = props;
  if (singleMode) {
    if (data1 && !data2) {
      data2 = data1;
    } else if (!data1 && data2) {
      data1 = data2;
    }
  }

  const [colWidth, width] = useMemo(() => {
    const width = parseInt(
      String(style.width ?? style.minWidth ?? style.maxWidth)
    );
    const colWidth = parseInt(
      String(colStyle.width ?? colStyle.minWidth ?? colStyle.maxWidth)
    );

    if (!isNaN(width) && width) {
      return [(width - 100) / 2, width];
    } else if (!isNaN(colWidth) && colWidth) {
      return [colWidth, colWidth * 2 + 100];
    }
    return [650, 1350];
  }, [colStyle, style]);

  const { diffRes, alignedData1, alignedData2 } = useMemo(() => {
    const {
      isEqualMap,
      arrayAlignLCSMap,
      arrayAlignCurrentDataMap,
      arrayNoAlignMap,
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
    console.log("diff-res", res);
    return res;
  }, [data1, data2, vizItems]);

  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = useState<number>(colWidth);

  const [oldLeftWidth, setOldLeftWidth] = useState<number>(colWidth);

  const [dragStartEvent, setDragStartEvent] =
    useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();

  useEffect(() => {
    const handleMouseUp = () => {
      body!.style.cursor = "unset";
      body!.style.userSelect = "unset";
      setDragStartEvent(undefined);
    };
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!dragStartEvent) return;
      const leftWidth = oldLeftWidth - (dragStartEvent.clientX - e.clientX);
      setLeftWidth(Math.max(leftWidth, 0));
    }, 16);

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
    <DiffWrapper
      diffRes={diffRes}
      wrapperRef1={wrapperRef1}
      wrapperRef2={wrapperRef2}
      refreshKey={refreshKey}
      style={{
        display: "flex",
        width: width + "px",
        ...style,
      }}
    >
      <div
        style={{
          marginLeft: "16px",
          marginRight: "16px",
          display: singleMode ? "none" : "block",
          minWidth: leftWidth + "px",
          maxWidth: leftWidth + "px",
          overflowX: "scroll",
        }}
      >
        <div
          style={{
            ...colStyle,
            width: colWidth + "px",
          }}
          ref={wrapperRef1}
        >
          {showTitle && <div style={titleStyle}>{data1Title}</div>}
          {data1 &&
            vizItems.map((field) => {
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
      </div>
      <div
        style={{
          display: singleMode ? "none" : "",
          backgroundColor: dragStartEvent ? "rgb(83, 129, 238)" : "gray",
          cursor: "col-resize",
          flex: "1",
          maxWidth: "4px",
          minWidth: "4px",
        }}
        onMouseDown={(e) => {
          e.persist();
          setDragStartEvent(e);
          body!.style.cursor = "col-resize";
          body!.style.userSelect = "none";
          setOldLeftWidth(leftWidth);
        }}
      ></div>
      <div
        style={{
          marginLeft: "16px",
          marginRight: "16px",
          overflowX: "scroll",
        }}
      >
        <div
          style={{
            ...colStyle,
            width: colWidth + "px",
          }}
          ref={wrapperRef2}
        >
          {showTitle && <div style={titleStyle}>{data2Title}</div>}
          {data2 &&
            vizItems.map((field) => {
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
    </DiffWrapper>
  );
}
export { align, diff, alignAndDiff, DiffWrapper };
// Diff.align = align;
// Diff.diff = diff;
// Diff.alignAndDiff = alignAndDiff;
// Diff.DiffWrapper = DiffWrapper;
