import React, { useEffect, useState } from "react";
import "./App.css";
import Diff from "../../src/index";
import Form from "./form";
import { Card, Link, Rate } from "@arco-design/web-react";


const initialFormData = {
  name: "react-diff-viz",
  introduction:
    "react-diff-viz is a React component that compares and renders complex object differences",
  link: "https://github.com/LittleWhite-Hai/react-diff-viz",
  package_size: 133,
  create_time: [1727765900000, 2897765900000],
  npm_dependencies: ["react", "react-dom", "lodash"],
  build_tool: "vite",
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
  foldable: "Whether it can be folded",
  isEqual: "User can customize the data diff algorithm",
  content: "Rendering method",
  arrayKey: "Key for arrays, used to mark this data as array type",
  alignAlignType:
    "Array alignment method, default is longest common subsequence (lcs) alignment",
};
function App() {
  const [count, setCount] = useState(0);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <div
      style={{
        width: "1500px",
      }}
    >
      <div
        style={{
          width: "1500px",
          display: "flex",
          justifyContent: "space-between",
          height: "125px",
        }}
      >
        <h1 style={{ marginTop: "10px" }}>
          <img
            src="public/diff.ico"
            style={{ marginBottom: -22, marginRight: "10px" }}
          ></img>
          react-diff-viz{" "}
        </h1>
        <div style={{ marginTop: "10px", display: "flex" }}>
          <div style={{ marginLeft: "30px" }}>
            <a
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                open("https://github.com/LittleWhite-Hai/react-diff-viz");
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 496 512"
                focusable="false"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginTop: "8px",
                  width: "35px",
                  height: "35px",
                  display: "inline-block",
                  lineHeight: "1em",
                  flexShrink: 0,
                  marginRight: "30px",
                  color: "ButtonText",
                }}
              >
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
            </a>
            <a
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                open("https://www.npmjs.com/package/react-diff-viz");
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                focusable="false"
                style={{
                  marginTop: "8px",
                  width: "35px",
                  height: "35px",
                  display: "inline-block",
                  lineHeight: "1em",
                  flexShrink: 0,
                  color: "ButtonText",
                }}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{ display: "flex", justifyContent: "end", width: "1500px" }}
        >
          <a
            onClick={(e) => {
              e.preventDefault();
              setFormVisible(!formVisible);
            }}
            style={{
              marginRight: "20px",
              cursor: "pointer",
            }}
          >
            {formVisible ? "Show Diff" : "Show Editor"}
          </a>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setFormData(initialFormData);
            }}
            style={{
              cursor: "pointer",
              marginRight: "20px",
            }}
          >
            Reset Data
          </a>

          <a
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
          </a>
        </div>
        <div
          style={{
            display: formVisible ? "block" : "none",
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
              content: (v: any) => <Rate value={v} readonly />,
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
                        {item.name}
                      </div>
                    }
                    key={item.name}
                    extra={<Link>More</Link>}
                  >
                    <div data-path={`other_tools.${idx}.description`}>
                      {item.description}
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
              label: "alignAlignType",
              path: "alignAlignType",
            },
          ]}
          labelStyle={{ width: "25%" }}
          contentStyle={{ width: "70%" }}
          colStyle={{ width: "650px" }}
          style={{
            border: "1px dashed gray",
          }}
        />
      </div>
    </div>
  );
}

export default App;
