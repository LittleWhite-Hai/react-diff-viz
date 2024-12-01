import React from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "问：我想自定义一些数据的diff算法",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        答：使用isEqual自定义数据diff算法
        <CodeExample1 />
      </p>
    ),
  },
  {
    key: "2",
    label:
      "问：我想对数组数据进行diff，这个算法是怎么diff数组的，删除或新增会导致错位吗",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        答：对于数组新增或删除元素的情况，有三种数组diff模式，分别是不对齐，依据最长子序列lcs对齐，依据data2的顺序对齐。使用arrayAlignType来指定数组对齐模式，使用vizItems的arrayKey来指定数组key。组件会修改diff数据，将数组对齐，并用修改后的数据进行渲染
        <CodeExample
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
    key: "3",
    label: "This is panel header 3",
    children: "text",
  },
];

export default function FQA() {
  return <Collapse items={items} bordered={false} defaultActiveKey={[]} />;
}
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
function CodeExample1() {
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
        lineProps={(lineNumber) => ({
          style: {
            display: "block",
            backgroundColor: lineNumber == 2 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
          },
        })}
        children={`const vizItems = [
  { label: "年龄", path: "age",isEqual: (a, b) => math.abs(a - b) > 2},
  { label: "介绍", path: "info.introduction" }},
];
return (<Diff
	data1={data1}
	data2={data2}
	vizItems={vizItems} 
/>)`}
      ></SyntaxHighlighter>
    </div>
  );
}
