import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Diff from "./diff/index";
import Form from "./form";
import {
  Card,
  Link,
  Rate,
  Grid,
  Typography,
  Button,
  Space,
  Badge,
  Steps,
  Table,
} from "@arco-design/web-react";
import { case1, case2, case3, case4, case5 } from "../../test/align";
import _ from "lodash";

const DiffWrapper = Diff.DiffWrapper;
const align = Diff.align;
const alignAndDiff = Diff.alignAndDiff;

function testAlign(casen: { a: any; b: any; msg: string }) {
  const res = alignAndDiff({
    data1: casen.a,
    data2: casen.b,
    arrayAlignLCSMap: { "[]": "category", "[].items.[]": "name" },
  });
  console.log("res:", {
    ...res,
    diffRes: Object.entries(res.diffRes).filter((x) => x[1] !== "UNCHANGED"),
  });
  console.log("msg:", casen.msg);
  console.log("--------------------------------");
}
testAlign(case1);
testAlign(case2);
testAlign(case3);
testAlign(case4);
testAlign(case5);

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

const originData = {
  currentStep: 2,
  tech: {
    配置模式: "自定义",
    采集分辨率: "720*1280",
    采集帧率: "15 fps",
    编码分辨率: "720*1280",
    编码码率最小值: "300 bps",
    编码码率最大值: "800 bps",
    编码码率默认值: "1500 bps",
    编码帧率: "15 fpx",
  },
  device: {
    设备名称: "摄像头-A103",
    编码profile: "high",
    设备状态: "运行中",
    在线时长: "72小时",
  },
  users: [
    {
      key: "1",
      name: "Jane Doe",
      salary: 23000,
      address: "32 Park Road, London",
      email: "jane.doe@example.com",
    },
    {
      key: "2",
      name: "Alisa Ross",
      salary: 25000,
      address: "35 Park Road, London",
      email: "alisa.ross@example.com",
    },
    {
      key: "3",
      name: "Kevin Sandra",
      salary: 22000,
      address: "31 Park Road, London",
      email: "kevin.sandra@example.com",
    },
    {
      key: "4",
      name: "Ed Hellen",
      salary: 17000,
      address: "42 Park Road, London",
      email: "ed.hellen@example.com",
    },
    {
      key: "5",
      name: "William Smith",
      salary: 27000,
      address: "62 Park Road, London",
      email: "william.smith@example.com",
    },
  ],
};
const modifyedData = _.cloneDeep(originData);
modifyedData.tech.编码分辨率 = "2080*1920";
modifyedData.users.splice(0, 1);
modifyedData.users[2].name = "Kevin Sandr";
// modifyedData.currentStep = 1;

function DescList(props: { data: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        width: "100%",
      }}
    >
      {props.data.map((item) => (
        <div
          key={item.label}
          style={{ display: "flex", minWidth: "300px" }}
          data-path={"tech." + item.label}
        >
          <div style={{ width: "120px", color: "gray", textAlign: "right" }}>
            {item.label}:
          </div>
          <div style={{ marginLeft: "10px", color: "rgb(29,33,41)" }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
function RenderDetail(props: { data: any }) {
  console.log("props.data123", props.data);
  return (
    <div
      style={{
        width: "850px",
        background: "rgb(242,243,245)",
        padding: "10px 20px",
      }}
    >
      <Card style={{ marginBottom: "20px" }}>
        <Typography.Title
          heading={6}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          审批状态
        </Typography.Title>

        <Steps
          current={props.data.currentStep}
          lineless
          data-path="currentStep"
        >
          <Steps.Step title="提交修改" />
          <Steps.Step title="审批中" />
          <Steps.Step title="修改完成" />
        </Steps>
      </Card>
      <Card style={{ marginBottom: "20px" }} data-path="tech">
        <Typography.Title
          heading={6}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          配置信息
        </Typography.Title>

        <DescList
          data={Object.entries(props.data.tech).map((i) => ({
            label: i[0],
            value: i[1],
          }))}
        />
        <Typography.Title
          heading={6}
          style={{
            marginTop: "50px",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          配置信息
        </Typography.Title>

        <DescList
          data={Object.entries(props.data.device).map((i) => ({
            label: i[0],
            value: i[1],
          }))}
        />
      </Card>

      <Card data-path="users">
        <Typography.Title
          heading={6}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          表格
        </Typography.Title>
        <Table
          data={props.data.users}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              render: (col: any, item: any, index: number) => (
                <div data-path={`users.${index}.name`}>{col}</div>
              ),
            },
            {
              title: "Salary",
              dataIndex: "salary",
              render: (col: any, item: any, index: number) => (
                <div data-path={`users.${index}.salary`}>
                  {col ? col + "元" : ""}
                </div>
              ),
            },
            {
              title: "Address",
              dataIndex: "address",
              render: (col: any, item: any, index: number) => (
                <div data-path={`users.${index}.address`}>{col}</div>
              ),
            },
            {
              title: "Email",
              dataIndex: "email",
              render: (col: any, item: any, index: number) => (
                <div data-path={`users.${index}.email`}>{col}</div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    // console.log("formData", formData);
  }, [formData]);

  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);
  const diffRes = alignAndDiff({ data1: originData, data2: modifyedData });
  console.log("diffRes", diffRes);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <a
          style={{
            cursor: "pointer",
            marginRight: "20px",
            color: "green",
          }}
          onClick={(e) => {
            e.preventDefault();

            setDisable(!disable);
          }}
        >
          {disable ? "启用diff" : "禁用diff"}
        </a>
        <a
          style={{
            cursor: "pointer",
            color: "green",
          }}
          onClick={(e) => {
            e.preventDefault();

            setCount(count + 1);
          }}
        >
          刷新diff结果
        </a>
      </div>
      <DiffWrapper
        style={{ display: "flex" }}
        diffRes={diffRes.diffRes}
        refreshKey={count}
        disableColoring={disable}
        wrapperRef1={wrapperRef1}
        wrapperRef2={wrapperRef2}
      >
        <div ref={wrapperRef1}>
          <RenderDetail data={diffRes.alignedData1} />
        </div>
        <div ref={wrapperRef2}>
          <RenderDetail
            data={{
              ...diffRes.alignedData2,
              users: diffRes.alignedData2.users.map(
                (i) =>
                  i ?? {
                    key: "",
                    name: "",
                    address: "",
                    email: "",
                  }
              ),
            }}
          />
        </div>
      </DiffWrapper>
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

      <div
        style={{
          display: formVisible ? "block" : "none",
        }}
      >
        <Form setFormData={setFormData} initialValues={initialFormData} />
      </div>
    </div>
  );
}

export default App;
