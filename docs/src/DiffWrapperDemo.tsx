import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Diff from "../../src/index";
import Form from "./form";
import { Card, Link, Rate } from "@arco-design/web-react";
const DiffWrapper = Diff.DiffWrapper;
const align = Diff.align;
const a = [
  {
    category: "柑橘类",
    items: [
      { id: 1, name: "橙子" },
      { id: 2, name: "柚子" },
      { id: 3, name: "柠檬" },
    ],
  },
  {
    category: "瓜类",
    items: [
      { id: 4, name: "西瓜" },
      { id: 5, name: "哈密瓜" },
    ],
  },
  {
    category: "浆果类",
    items: [
      { id: 6, name: "葡萄" },
      { id: 7, name: "樱桃" },
      { id: 8, name: "蓝莓" },
      { id: 9, name: "草莓" },
    ],
  },
  {
    category: "热带水果",
    items: [{ id: 10, name: "菠萝" }],
  },
  {
    category: "异域水果",
    items: [
      { id: 11, name: "芒果" },
      { id: 12, name: "火龙果" },
    ],
  },
  {
    category: "其他水果",
    items: [
      { id: 13, name: "猕猴桃" },
      { id: 14, name: "无花果" },
      { id: 15, name: "石榴" },
    ],
  },
];
const b = [
  {
    category: "柑橘类",
    items: [
      { id: 1, name: "橙子" },
      { id: 2, name: "柚子" },
      { id: 3, name: "柠檬" },
    ],
  },
  {
    category: "瓜类",
    items: [
      // { id: 4, name: "西瓜" },
      { id: 5, name: "哈密瓜" },
    ],
  },
  {
    category: "浆果类",
    items: [
      { id: 6, name: "葡萄" },
      { id: 7, name: "樱桃" },
      { id: 8, name: "蓝莓" },
      { id: 9, name: "草莓" },
    ],
  },
  {
    category: "热带水果",
    items: [{ id: 10, name: "菠萝" }],
  },
  {
    category: "异域水果",
    items: [
      { id: 11, name: "芒果" },
      { id: 12, name: "火龙果" },
    ],
  },
  {
    category: "其他水果",
    items: [
      { id: 13, name: "猕猴桃" },
      { id: 14, name: "无花果" },
      { id: 15, name: "石榴" },
    ],
  },
];
console.log(
  "align",
  align({
    data1: { x: a },
    data2: { x: b },
    arrayAlignLCSMap: {
      "[]": "category",
      "[].items.[]": "name",
    },
  })
);

const initialFormData = {
  name: "react-diff-viz",
  introduction:
    "react-diff-viz is a React component that compares and renders complex object differences",
  link: "https://github.com/LittleWhite-Hai/react-diff-viz",
  package_size: 43,
  create_time: [1727765900000, 2897765900000],
  npm_dependencies: ["react", "react-dom", "lodash"],
  build_tool: "rollup",
  tech_stack: ["frontend", "javascript", "react"],
  stars: 5,
  is_support_array: true,
  other_tools: [
    {
      name: "git diff",
      description: "diff git commits, highlight text changes",
    },
    {
      name: "microdiff",
      description:
        "Microdiff is a tiny, fast json diff tool, only offer diff algorithm",
    },
    {
      name: "mi2crodiff",
      description:
        "Microd3iff is a tiny, fast json diff tool, only offer diff algorithm",
    },
  ],
  data1: "Data used for comparison (usually the original data)",
  data2: "Data used for comparison (usually the new data)",
  vizItems:
    "Describes the data to be rendered, including diff method and rendering method",
  colStyle: "Overall style for the outer DOM of all data1 and data2",
  labelStyle: "Style for the label of each data item",
  contentStyle: "Style for the content of each data item",
  strictMode:
    "Strict mode, enabled by default. When disabled, the diff algorithm ignores data type differences, e.g., 0=null=undefined=false",
  singleMode: "Only view data2, default is false",
  refreshKey: "Change this key to trigger recoloring and height alignment",

  label:
    "Title of the data, if only label is provided, it renders a separator title",
  path: "Path of the data",
  visible: "If false, the item will not be displayed",
  foldable: "Whether it can be folded",
  isEqual: "User can customize the data diff algorithm",
  content: "Rendering method",
  arrayKey: "Key for arrays, used to mark this data as array type",
  arrayAlignType:
    "Array alignment method, default is longest common subsequence (lcs) alignment",
};

const vizItems = [
  { label: "Basic Information" },
  { label: "Component Name", path: "name" },
  { label: "Introduction", path: "introduction" },
  {
    label: "Link",
    path: "link",
    content: (v: string) => (
      <Link
        href={v}
        target="_blank"
        hoverable={false}
        onClick={() => {
          open(v);
        }}
      >
        Click to Jump
      </Link>
    ),
  },
  {
    label: "Maintenance Time",
    path: "create_time",
    content: (v: string) => {
      if (v) {
        return (
          <span>
            <span data-path="create_time.0">
              {new Date(v[0]).toLocaleDateString()}
            </span>
            <span> ~ </span>
            <span data-path="create_time.1">
              {new Date(v[1]).toLocaleDateString()}
            </span>
          </span>
        );
      }
    },
  },
  {
    label: "Package Size",
    path: "package_size",
    content: (v: string) => v + " kb",
  },
  {
    label: "Npm Dependencies",
    path: "npm_dependencies",
    arrayAlignType: "none",
    content: (v: string[]) => v.join(", "),
  },
  {
    label: "Support Array Diff",
    path: "is_support_array",
    content: (v: string) => (v ? "Yes" : "No"),
  },
  { label: "Build Tool", path: "build_tool" },
  {
    label: "Tech Stack",
    path: "tech_stack",
    content: (v: string[]) => v?.join(", "),
  },
  {
    label: "Stars",
    path: "stars",
    content: (v: any) => <Rate value={v} readonly allowHalf />,
  },
  {
    label: "Other Tools",
    path: "other_tools",
    arrayKey: "name",
    content: (v: any) =>
      v.map((item: any, idx: string) => (
        <Card
          style={{ width: 360, marginBottom: 10 }}
          title={<div data-path={`other_tools.${idx}.name`}>{item?.name}</div>}
          key={item?.name}
          extra={<Link>More</Link>}
        >
          <div data-path={`other_tools.${idx}.description`}>
            {item?.description}
          </div>
          <br />
        </Card>
      )),
  },
  { label: "Diff Component API" },

  {
    label: "data1",
    path: "data1",
  },
  {
    label: "data2",
    path: "data2",
  },
  {
    label: "vizItems",
    path: "vizItems",
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
    label: "singleMode",
    path: "singleMode",
  },
  {
    label: "refreshKey",
    path: "refreshKey",
  },
  { label: "VizItems API" },
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
    label: "arrayAlignType",
    path: "arrayAlignType",
  },
];
function App() {
  const [count, setCount] = useState(0);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    // console.log("formData", formData);
  }, [formData]);

  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);
  const diffRes = Diff.diff(initialFormData, formData);

  return (
    <div>
      <a
        onClick={(e) => {
          e.preventDefault();
          setFormVisible(!formVisible);
        }}
        style={{
          marginRight: "20px",
          cursor: "pointer",
          color: "green",
        }}
      >
        {formVisible ? "Show Diff" : "Show Editor"}
      </a>
      <a
        style={{
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.preventDefault();

          setCount(count + 1);
        }}
      >
        count + 1
      </a>
      <div
        style={{
          display: formVisible ? "block" : "none",
        }}
      >
        <Form setFormData={setFormData} initialValues={initialFormData} />
      </div>

      <DiffWrapper
        wrapperRef1={wrapperRef1}
        wrapperRef2={wrapperRef2}
        diffRes={diffRes}
        refreshKey={count}
        style={{
          width: "1500px",
          display: "flex",
          justifyContent: "space-between",
          height: "125px",
        }}
      >
        <div ref={wrapperRef1} style={{ width: "600px" }}>
          {vizItems.map((item) => {
            return (
              <div key={item.label} style={{ display: "flex" }}>
                <div style={{ minWidth: "150px" }}> {item.label}</div>
                <div data-path={item.path}>
                  {item.path && JSON.stringify(initialFormData[item.path])}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={wrapperRef2} style={{ width: "600px" }}>
          {vizItems.map((item) => {
            return (
              <div key={item.label} style={{ display: "flex" }}>
                <div style={{ minWidth: "150px" }}> {item.label}</div>
                <div data-path={item.path}>
                  {item.path && JSON.stringify(formData[item.path])}
                </div>
              </div>
            );
          })}
        </div>
      </DiffWrapper>
    </div>
  );
}

export default App;
