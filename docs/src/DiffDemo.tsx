/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Diff from "./diff/index";
import Form from "./form";
import { Card, Link, Rate } from "@arco-design/web-react";

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
  isEqual: "User can customize the data diff algorithm",
  content: "Rendering method",
  arrayKey: "Key for arrays, used to mark this data as array type",
  arrayAlignType:
    "Array alignment method, default is longest common subsequence (lcs) alignment",
};
export default function DiffDemo() {
  const [count, setCount] = useState(0);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "1360px",
          marginBottom: "2px",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "end" }}></div>

          <div style={{ display: "flex", justifyContent: "end" }}>
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
              {formVisible ? "查看Diff" : "编辑数据"}
            </a>
            <a
              href="https://github.com/LittleWhite-Hai/react-diff-viz/blob/main/docs/src/DiffDemo.tsx"
              target="_blank"
              style={{
                color: "green",
              }}
            >
              查看源码
            </a>
            {/* <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setCount(count + 1);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                Align And Color
              </a> */}
          </div>
        </div>
      </div>
      <div
        style={{
          display: formVisible ? "block" : "none",
          backgroundColor: "white",
        }}
      >
        <Form setFormData={setFormData} initialValues={initialFormData} />
      </div>
      <Diff
        strictMode={false}
        data1={initialFormData}
        data2={formData}
        refreshKey={count}
        singleMode={false}
        vizItems={[
          { label: "Basic Information" },
          { label: "Component Name", path: "name" },
          { label: "Introduction", path: "introduction" },
          {
            label: "Link",
            path: "link",
            content: (v: any) => (
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
            content: (v: any) => {
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
            content: (v: any) => v + " kb",
          },
          {
            label: "Npm Dependencies",
            path: "npm_dependencies",
            arrayAlignType: "none",
            content: (v: any) => v.join(", "),
          },
          {
            label: "Support Array Diff",
            path: "is_support_array",
            content: (v: any) => (v ? "Yes" : "No"),
          },
          { label: "Build Tool", path: "build_tool" },
          {
            label: "Tech Stack",
            path: "tech_stack",
            content: (v: any) => v?.join(", "),
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
                  title={
                    <div data-path={`other_tools.${idx}.name`}>
                      {item?.name}
                    </div>
                  }
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
        ]}
        style={{
          border: "6px solid white",
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
