import { useState } from "react";
import "./App.css";
import Diff from "./diff";
import Card from "./card";
import InfoList from "./InfoList";




const data1 = {
  组件名称: "rediff",
  简介: "功能强大的、集成数据diff算法与数据渲染的组件",
  包体积: "131kb",
  技术栈: "react",
  npm依赖: ["react", "lodash"],
  和其他组件的区别: "不同于jsdiff和microdiff仅提供diff算法，rediff还提供数据渲染功能",
  是否为ts项目: true,
  基础类型: "默认使用===比较基础类型，若将strictMode设置为true，则忽略类型差异",
  对象类型: "子元素均不变则认为相等，否则认为不相等",
  数组类型: "先对齐两数组，再逐个比较数组元素",
  数组对齐方式: [{ 对齐方式: "最长公共子序列lcs", 算法: "寻找data1和data2的lcs，并使它们对齐lcs", 默认方式: true }, { 对齐方式: "提供数组key，以data2的顺序为基准", 算法: "改变data1的顺序，使data1与data2一致" }],
  自定义diff算法: "用户可定制数据diff算法，使用isEqual函数",

  data1: "用于比较的数据（一般是原始数据）",
  data2: "用于比较的数据（一般是新数据）",
  renderItems: "描述需要渲染的数据，包括diff方式和渲染方式",
  colStyle: "所有data1和data2外侧dom的整体样式",
  labelStyle: "每一项data的label样式",
  contentStyle: "每一项data的content样式",
  strictMode: "严格模式，默认开启，关闭后diff算法会忽略数据类型差异，如0=null=undefined=false",
  data2Mode: "仅查看data2，默认false",
  refreshKey: "改变Key以触发重新染色和高度对齐",

  label: "数据的标题，若仅传入label，则渲染一个分隔标题",
  path: "数据的路径",

  foldable: "是否折叠",
  isEqual: "用户可定制数据diff算法",
  content: "渲染方式",
  arrayKey: "数组的key，用于标记本数据为数组类型",
  alignAlignType: "数组对齐方式，默认为最长公共子序列lcs对齐",
} as any;

const data2 = {
  组件名称: "rediff(react-diff)",
  简介: "功能强大的、集成数据diff算法与数据渲染的组件",
  包体积: "131kb",
  技术栈: "react",
  npm依赖: ["react", "lodash"],
  和其他组件的区别: "不同于jsdiff和microdiff仅提供diff算法，rediff还提供数据渲染功能",
  是否为ts项目: true,
  基础类型: "默认使用===比较基础类型，若将strictMode设置为true，则忽略类型差异",
  对象类型: "子元素均不变则认为相等，否则认为不相等",
  数组类型: "先对齐两数组，再逐个比较数组元素",
  数组对齐方式: [{ 对齐方式: "不对齐数组，直接使用原数组进行比较" }, { 对齐方式: "最长公共子序列lcs", 算法: "寻找data1和data2的lcs，并使它们对齐lcs", 默认方式: true }, { 对齐方式: "提供数组key，以data2的顺序为基准", 算法: "改变data1的顺序，使data1与data2一致" }],
  自定义diff算法: "用户可定制数据diff算法，使用isEqual函数",

  data1: "用于比较的数据（一般是原始数据）",
  data2: "用于比较的数据（一般是新数据）",
  renderItems: "描述需要渲染的数据，包括diff方式和渲染方式",
  colStyle: "所有data1和data2外侧dom的整体样式",
  labelStyle: "每一项data的label样式",
  contentStyle: "每一项data的content样式",
  strictMode: "严格模式，默认开启，关闭后diff算法会忽略数据类型差异，如0=null=undefined=false",
  data2Mode: "仅查看data2，默认false",
  refreshKey: "改变Key以触发重新染色和高度对齐",

  label: "数据的标题，若仅传入label，则渲染一个分隔标题",
  path: "数据的路径",
  visible: "是否渲染",
  foldable: "是否折叠",
  isEqual: "用户可定制数据diff算法",
  content: "渲染方式",
  arrayKey: "数组的key，用于标记本数据为数组类型",
  alignAlignType: "数组对齐方式，默认为最长公共子序列lcs对齐",
} as any;


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Rediff</h1>
      <button onClick={() => {
        setTimeout(() => {
          setCount(count + 1);
        }, 1000);
      }}>
        count: {count}
      </button>

      <Diff
        strictMode={false}
        data1={data1}
        data2={data2}
        refreshKey={count}
        renderItems={[
          {
            label: "组件名称",
            path: "组件名称",
          },
          {
            label: "简介",
            path: "简介",
          },
          {
            label: "包体积",
            path: "包体积",
          },
          // {
          //   label: "技术栈",
          //   path: "技术栈",
          //   arrayKey: "",
          //   content: (v: any) => {
          //     console.log('v', v);
          //     // return v
          //     return v.join("+");
          //   },
          // },
          {
            label: "npm依赖",
            path: "npm依赖",
          },
          {
            label: "和其他组件的区别",
            path: "和其他组件的区别",
          },
          {
            label: "是否为ts项目",
            path: "是否为ts项目",
          },
          {
            label: "基础类型",
            path: "基础类型",
          },
          {
            label: "对象类型",
            path: "对象类型",
          },
          {
            label: "数组类型",
            path: "数组类型",
          },
          {
            label: "数组对齐方式",
            path: "数组对齐方式",
            arrayKey: "对齐方式",
            content: (v: any) => {
              return v.map((item: any, idx: string) => (
                <Card
                  pathPrefix={"数组对齐方式." + idx}
                  key={item.对齐方式}
                  title={item.对齐方式}
                  content={`算法: ${item.算法 || '无'}, 默认方式: ${item.默认方式 ? '是' : '否'}`}
                />
              ));
            },
          },
          {
            label: "自定义diff算法",
            path: "自定义diff算法",
          },
          { label: "diff组件的api" },
          {
            label: "data1",
            path: "data1",
          },
          {
            label: "data2",
            path: "data2",
          },
          {
            label: "renderItems",
            path: "renderItems",
          },
          {
            label: "colStyle",
            path: "colStyle",
          },
          {
            label: "labelStyle",
            path: "labelStyle",
          },
          {
            label: "contentStyle",
            path: "contentStyle",
          },
          {
            label: "strictMode",
            path: "strictMode",
          },
          {
            label: "data2Mode",
            path: "data2Mode",
          },
          {
            label: "refreshKey",
            path: "refreshKey",
          },
          { label: "renderItems的api" },
          {
            label: "label",
            path: "label",
          },
          {
            label: "path",
            path: "path",
          },
          {
            label: "visible",
            path: "visible",
          },
          {
            label: "foldable",
            path: "foldable",
          },
          {
            label: "isEqual",
            path: "isEqual",
          },
          {
            label: "content",
            path: "content",
          },
          {
            label: "arrayKey",
            path: "arrayKey",
          },
          {
            label: "alignAlignType",
            path: "alignAlignType",
          },
        ]}
        labelStyle={{ width: "25%" }}
        contentStyle={{ width: "70%" }}
      />
    </>
  );
}

export default App;
