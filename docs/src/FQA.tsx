import React, { useMemo } from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import CodeExample from "./CodeExample";

const commonAQ = [
  {
    key: "01",
    label: "问：这工具是什么原理",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        基于以下原理：
        <br />
        1. 计算出所有数据路径的 diff 结果
        <br />
        2. 在 dom 上标记数据路径( data-path )
        <br />
        3. 根据 diff 结果染色dom
        <br />
        4. 对齐相应数据的 dom 高度
      </p>
    ),
  },
  {
    key: "02",
    label: "问：vue 可以使用吗",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        可以使用函数式接入，参考上面的教程即可
      </p>
    ),
  },
];
export function DiffVizFQA() {
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
                  backgroundColor: lineNumber == 4 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`const vizItems = [
  { 
    label: '年龄', path: 'age',
    isEqual: (a, b) => math.abs(a - b) > 2
  },
  { label: '介绍', path: 'info.introduction' },
];
return <DiffViz data1={data1} data2={data2} vizItems={vizItems} />;`}
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
                    lineNumber == 23 || lineNumber == 24 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
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

  // diff组件会使用修改后的data2渲染以对齐data1，修改对齐后的data2.info.education：[undefined,{ school: "人民大学", type: "大学" },]
  const data2 = {
    age: 20,
    info: {
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

  return (
    <Collapse
      items={[...commonAQ, ...items]}
      bordered={false}
      style={{ background: "white" }}
    />
  );
}

export function DiffFuncFQA() {
  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "0",
        label: "问：我想自定义数据的diff算法",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：calcDiff 函数支持传入 isEqualMap 来自定义 diff 算法
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor: lineNumber == 9 ? "#ffeb3b40" : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`import { calcDiff, applyDiff } from 'diff-viz'
const ref1 = useRef < HTMLDivElement > null
const ref2 = useRef < HTMLDivElement > null

useEffect(() => {
  const diffRes = calcDiff({
    data1,
    data2,
    isEqualMap: { name: () => true, age: (a, b) => math.abs(a - b) > 2 }
  })
  applyDiff({ diffRes, ref1, ref2 })
}, [data1, data2])

return (
  <>
    <div ref={ref1}>
      <RenderData data={data1} /> {/* 你的业务代码,渲染数据1 */}
    </div>
    <div ref={ref2}>
      <RenderData data={data2} /> {/* 你的业务代码,渲染数据2 */}
    </div>
  </>
)
`}
            />
            另外，你也可以完全使用其他 json-diff 算法工具，如 microdiff
            等，将他们的 diff 结果转换为本工具需要的格式即可
          </p>
        ),
      },
      {
        key: "1",
        label: "问：如何支持数组diff",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            答：使用 calcDiffWithArrayAlign 代替
            calcDiff，它提供了额外的数组对齐支持；它支持指定对齐方式，以及数组
            key；
            <br />
            记得用 calcDiffWithArrayAlign 修改后的数据进行渲染
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor:
                    lineNumber == 16 ||
                    lineNumber == 8 ||
                    lineNumber == 22 ||
                    lineNumber == 25
                      ? "#ffeb3b40"
                      : "", // 这里设置你想要高亮的行号范围
                },
              })}
              code={`import { calcDiffWithArrayAlign, applyDiff } from 'diff-viz'

const ref1 = useRef < HTMLDivElement > null
const ref2 = useRef < HTMLDivElement > null

const res = useMemo(
  () =>
    calcDiffWithArrayAlign({ //对齐数组 + diff数据
      data1,
      data2
    }),
  [data1, data2]
)

useEffect(() => {
  applyDiff({ diffRes: res.diffRes, ref1, ref2 }) // 在dom上应用diff结果(染色+对齐dom)
}, [res])

return (
  <>
    <div ref={ref1}>
      <RenderData data={res.alignedData1} /> {/* 你的业务代码,渲染数据1 */}
    </div>
    <div ref={ref2}>
      <RenderData data={res.alignedData2} /> {/* 你的业务代码,渲染数据2 */}
    </div>
  </>
)
`}
            />
          </p>
        ),
      },
    ],
    []
  );

  return (
    <Collapse
      items={[...commonAQ, ...items]}
      bordered={false}
      defaultActiveKey={[]}
      style={{ background: "white" }}
    />
  );
}
