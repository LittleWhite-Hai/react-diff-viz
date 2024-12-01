import React, { useMemo } from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

function CodeExample(props: {
  code: string;
  lineProps?: (lineNumber: number) => React.HTMLProps<HTMLElement>;
}) {
  return (
    <div style={{ flex: 1 }}>
      <SyntaxHighlighter
        language="javascript"
        style={docco}
        customStyle={{
          textAlign: "left",
          padding: "20px",
        }}
        codeTagProps={{
          style: {
            display: "block",
            textAlign: "left",
          },
        }}
        wrapLines={true}
        showLineNumbers
        lineProps={props.lineProps}
        children={props.code}
      ></SyntaxHighlighter>
    </div>
  );
}
export function DiffFQA() {
  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "问：我想对一些数据自定义diff算法",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：使用isEqual自定义数据diff算法
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor: lineNumber == 2 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`const vizItems = [
    { label: "年龄", path: "age",isEqual: (a, b) => math.abs(a - b) > 2},
    { label: "介绍", path: "info.introduction" }},
  ];
  return (<Diff
    data1={data1}
    data2={data2}
    vizItems={vizItems} 
  />)`}
            />
          </p>
        ),
      },
      {
        key: "2",
        label:
          "问：我想对数组数据进行diff，这个算法是怎么diff数组的，删除或新增元素会导致错位吗",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：
            <br />
            对于数组新增或删除元素的情况，有三种数组diff模式，
            分别是依据最长子序列lcs对齐（默认）、依据data2的顺序对齐、不对齐;
            <br />
            可以使用arrayAlignType来选择对齐模式，使用vizItems的arrayKey来指定数组key;
            <br />
            组件将数组对齐后会修改数据，并用修改后的数据进行渲染
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor:
                    lineNumber == 21 || lineNumber == 22 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`const data1 = {
    age: 20,
    info: {
      education: [
        { school: "北京101学校", type: "中学" },
        { school: "人民大学", type: "大学" },
      ],
    },
  };
  const data2 = {
    age: 20,
    info: {
    // diff组件会使用修改后的data2渲染，以对齐data1。
    // 修改对齐后的data2.info.education：[undefined,{ school: "人民大学", type: "大学" },],
      education: [{ school: "人民大学", type: "大学" }],
    },
  };
  const vizItems = [
    { label: "年龄", path: "age" },
    {
      label: "教育经历",
      path: "info.education",
      arrayKey: "type",
      arrayAlignType: "lcs",
    },
  ];
  
  return <Diff data1={data1} data2={data2} vizItems={vizItems} />;
  `}
            />
          </p>
        ),
      },
      {
        key: "3",
        label:
          "问：在diff对齐和染色dom后，页面发生了变化，怎么触发重新diff和染色对齐",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：
            <br />
            数据变化后，diff组件会自动重新diff和染色对齐；
            <br />
            如果数据没有变化但是想要重新diff和染色对齐，可以传入refreshKey来触发
          </p>
        ),
      },
    ],
    []
  );

  return <Collapse items={items} bordered={false} defaultActiveKey={[]} />;
}

export function DiffWrapperFQA() {
  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "0",
        label: "问：我想对一些数据自定义diff算法",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：diff函数支持传入isEqualMap来自定义diff算法
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor: lineNumber == 6 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`import { diff, DiffWrapper } from "react-diff-viz";

const diffRes = diff({
  data1,
  data2,
  isEqualMap: { name: () => true, age: (a, b) => math.abs(a - b) > 2 },
});
const ref1 = useRef<HTMLDivElement>();
const ref2 = useRef<HTMLDivElement>();
return (
  <DiffWrapper diffRes={diffRes} wrapperRef1={ref1} wrapperRef2={ref2}>
    <div ref={ref1}>
      <RenderData data={data1} /> {/* 你的业务代码,渲染数据1 */}
    </div>
    <div ref={ref2}>
      <RenderData data={data2} /> {/* 你的业务代码,渲染数据2 */}
    </div>
  </DiffWrapper>
);
`}
            />
          </p>
        ),
      },
      {
        key: "1",
        label: "问：DiffWrapper如何支持数组",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：使用alignAndDiff代替diff，它提供了额外的数组对齐支持，并支持传入参数指定对齐方式，以及数组key；
            <br />
            记得用alignAndDiff修改后的数据进行渲染
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor:
                    lineNumber == 3 ||
                    lineNumber == 7 ||
                    lineNumber == 9 ||
                    lineNumber == 12
                      ? "#ffeb3b40"
                      : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`import { alignAndDiff, DiffWrapper } from "react-diff-viz";
      
      const diffRes = alignAndDiff({ data1, data2 });
      const ref1 = useRef<HTMLDivElement>();
      const ref2 = useRef<HTMLDivElement>();
      return (
        <DiffWrapper diffRes={diffRes.diffRes} wrapperRef1={ref1} wrapperRef2={ref2}>
          <div ref={ref1}>
            <RenderData data={diffRes.alignedData1} /> {/* 你的业务代码,渲染数据1 */}
          </div>
          <div ref={ref2}>
            <RenderData data={diffRes.alignedData2} /> {/* 你的业务代码,渲染数据2 */}
          </div>
        </DiffWrapper>
      );`}
            />
          </p>
        ),
      },
    ],
    []
  );

  return <Collapse items={items} bordered={false} defaultActiveKey={[]} />;
}
