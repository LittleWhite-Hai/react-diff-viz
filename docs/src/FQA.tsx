import React, { useMemo } from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import CodeExample from "./CodeExample";

const getCommonAQ = (isZh: boolean) => [
  {
    key: "01",
    label: isZh ? "问：实现原理是什么" : "Q: How does it work?",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        {isZh ? "基于以下思路：" : "Based on the following ideas:"}
        <br />
        {isZh
          ? "1. 计算出所有数据路径的 diff 结果"
          : "1. Calculate the diff result of all data paths"}
        <br />
        {isZh
          ? "2. 在 dom 上标记数据路径( data-path )"
          : "2. Mark the data path on the dom (data-path)"}
        <br />
        {isZh
          ? "3. 根据 diff 结果染色dom"
          : "3. Color the dom according to the diff result"}
        <br />
        {isZh
          ? "4. 对齐相应数据的 dom 高度"
          : "4. Align the dom height of the corresponding data"}
      </p>
    ),
  },
  {
    key: "02",
    label: isZh ? "问：Vue 可以使用吗" : "Q: Is it compatible with Vue?",
    children: (
      <p style={{ paddingInlineStart: 24 }}>
        {isZh
          ? "可以使用函数式接入，参考上面的教程即可"
          : "You can use the functional approach, refer to the tutorial above."}
      </p>
    ),
  },
];
export function DiffVizFQA({ isZh }: { isZh: boolean }) {
  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: isZh
          ? "问：我想对一些数据自定义 diff 算法"
          : "Q: How can I customize the diff algorithm for specific data?",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            {isZh
              ? "答：使用 isEqual 自定义数据 diff 算法"
              : "A: Use the isEqual property to define custom comparison algorithm"}
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
        label: isZh
          ? "问：我想对数组数据进行 diff ，这个算法是怎么 diff 数组的，删除或新增元素会导致错位吗"
          : "Q: How does array diffing work, and how are insertions and deletions handled?",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            {isZh ? "答：" : "A:"}
            <br />
            {isZh
              ? "对于数组新增或删除元素的情况，有三种数组 diff 模式， 分别是依据 lcs 对齐（默认）、依据 data2 的顺序对齐、不对齐;"
              : "There are three alignment modes for handling array modifications: aligning by lcs (default), aligning by the order of data2, and not aligning. "}
            <br />
            {isZh
              ? "可以使用 arrayAlignType 来选择对齐模式，使用 vizItems 的 arrayKey 来指定数组 key ;"
              : "You can specify the alignment mode using arrayAlignType and define array keys using the arrayKey property in vizItems;"}
            <br />
            {isZh
              ? "组件将数组对齐后会修改数据，并用修改后的数据进行渲染"
              : "The component will align and transform the arrays before rendering"}
            <CodeExample
              lineProps={(lineNumber) => ({
                style: {
                  display: "block",
                  backgroundColor:
                    lineNumber == 11 ||
                    lineNumber == 12 ||
                    lineNumber == 21 ||
                    lineNumber == 22
                      ? "#ffeb3b40"
                      : "", // 这里设置你想要高亮的行号范围
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

  // diff组件会将data2和data1的数组对齐，再进行渲染
  // 修改后的data2.info.education：[undefined,{ school: "人民大学", type: "大学" },]
  const data2 = _.cloneDeep(data1);
  data2.info.education = [{ school: "人民大学", type: "大学" }];
  
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
        label: isZh
          ? "问：在 diff 对齐和染色 dom 后，页面发生了变化，怎么触发重新 diff 和染色对齐"
          : "Q: How to re-trigger diffing and alignment after DOM changes?",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            {isZh ? "答：" : "A:"}
            <br />
            {isZh
              ? "数据变化后，diff 组件会自动重新 diff 和染色对齐；"
              : "The component automatically re-runs diffing and alignment when data changes;"}
            <br />
            {isZh
              ? "如果数据没有变化但是想要重新 diff 和染色对齐，可以传入 refreshKey 来触发"
              : "To manually trigger re-diffing and alignment, you can update the refreshKey prop"}
          </p>
        ),
      },
    ],
    [isZh]
  );

  return (
    <Collapse
      items={[...getCommonAQ(isZh), ...items]}
      bordered={false}
      style={{ background: "white" }}
    />
  );
}

export function DiffFuncFQA({ isZh }: { isZh: boolean }) {
  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "0",
        label: isZh
          ? "问：我想自定义数据的diff算法"
          : "Q: How can I implement a custom diff algorithm?",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            {isZh
              ? "答：calcDiff 函数支持传入 isEqualMap 来自定义 diff 算法"
              : "A: The calcDiff function accepts an isEqualMap parameter for custom comparison algorithm"}
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
            {isZh
              ? "另外，你也可以完全使用其他 json-diff 算法工具，如 microdiff 等，将他们的 diff 结果转换为本工具需要的格式即可"
              : "In addition, you can completely use other json-diff algorithms, such as microdiff, and convert their diff results to the format needed by this tool."}
          </p>
        ),
      },
      {
        key: "1",
        label: isZh
          ? "问：如何支持数组diff"
          : "Q: How can I handle array comparisons?",
        children: (
          <p style={{ paddingInlineStart: 24 }}>
            {isZh ? "答：" : "A:"}
            <br />
            {isZh
              ? "使用 calcDiffWithArrayAlign 代替 calcDiff，它提供了额外的数组对齐支持；"
              : "Use calcDiffWithArrayAlign instead of calcDiff for enhanced array alignment support;"}
            <br />
            {isZh
              ? "它支持指定对齐方式，以及数组 key；"
              : "It supports specifying the alignment mode and the array key;"}
            <br />
            {isZh
              ? "记得用 calcDiffWithArrayAlign 返回的数据进行渲染，这些数据是经过对齐的"
              : "Make sure to render the aligned data returned by calcDiffWithArrayAlign"}
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
    [isZh]
  );

  return (
    <Collapse
      items={[...getCommonAQ(isZh), ...items]}
      bordered={false}
      defaultActiveKey={[]}
      style={{ background: "white" }}
    />
  );
}
