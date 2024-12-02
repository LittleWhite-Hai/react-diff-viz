/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Typography, Steps, Table, Input } from "antd";
import _ from "lodash";
import { JsonEditor } from "json-edit-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

// import { alignAndDiff, DiffWrapper } from "./diff/index";
import { alignAndDiff, applyDiff, DiffWrapper } from "./diff/index";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

const d1 = {
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
const d2 = _.cloneDeep(d1);
d2.tech.编码分辨率 = "2080*1920";
d2.users.splice(0, 1);
d2.users[2].name = "Kevin Sandr";
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
  return (
    <div
      style={{
        width: "700px",
      }}
    >
      <Card style={{ marginBottom: "20px" }}>
        <Typography.Title
          level={3}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          审批状态
        </Typography.Title>

        <Steps current={props.data.currentStep} data-path="currentStep">
          <Steps.Step title="提交修改" />
          <Steps.Step title="审批中" />
          <Steps.Step title="修改完成" />
        </Steps>
      </Card>
      <Card style={{ marginBottom: "20px" }}>
        <Typography.Title
          level={3}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          配置信息
        </Typography.Title>

        <DescList
          data={
            Object.entries(props.data.tech).map((i) => ({
              label: i[0],
              value: i[1],
            })) as any
          }
        />
        <Typography.Title
          level={3}
          style={{
            marginTop: "50px",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          配置信息
        </Typography.Title>

        <DescList
          data={
            Object.entries(props.data.device).map((i) => ({
              label: i[0],
              value: i[1],
            })) as any
          }
        />
      </Card>

      <Card>
        <Typography.Title
          level={3}
          style={{
            marginTop: "0px",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          表格
        </Typography.Title>
        <Table
          dataSource={props.data.users}
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

export default function DiffWrapperDemo(props: { count: number }) {
  const [disable, setDisable] = useState(false);
  const [editedDataStr1, setEditedDataStr1] = useState(
    JSON.stringify(d1, null, 2)
  );
  const [editedData2, setEditedData2] = useState(d2);
  const [editedDataStr2, setEditedDataStr2] = useState(
    JSON.stringify(d2, null, 2)
  );
  useEffect(() => {
    console.log("formData", editedData2);
    try {
      const res = JSON.parse(editedDataStr2);
      setEditedData2(res);
    } catch (e) {
      console.error(e);
    }
  }, [editedDataStr2]);

  const wrapperRef1 = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);
  const diffRes = useMemo(
    () =>
      alignAndDiff({
        data1: d1,
        data2: editedData2,
      }),
    [d1, editedData2]
  );
  useEffect(() => {
    applyDiff({
      diffRes: diffRes.diffRes,
      domWrapper1: wrapperRef1.current,
      domWrapper2: wrapperRef2.current,
      disableColoring: disable,
      disableAligning: disable,
    });
  }, [diffRes, props.count, disable]);

  const [showJson, setShowJson] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div>
        <div
          style={{ display: "flex", justifyContent: "end", padding: "0 5px" }}
        >
          <a
            style={{
              cursor: "pointer",
              marginRight: "20px",
              color: "#7dba2f",
            }}
            onClick={(e) => {
              e.preventDefault();
              setShowJson(!showJson);
            }}
          >
            编辑数据
          </a>

          <a
            style={{
              cursor: "pointer",
              marginRight: "20px",
              color: "#7dba2f",
            }}
            onClick={(e) => {
              e.preventDefault();

              setDisable(!disable);
            }}
          >
            {disable ? "启用DIFF" : "禁用DIFF"}
          </a>
          <a
            href="https://github.com/LittleWhite-Hai/react-diff-viz/blob/main/docs/src/DiffWrapperDemo.tsx"
            target="_blank"
            style={{
              color: "#7dba2f",
            }}
          >
            查看源码
          </a>
        </div>
        <div>
          <div
            style={{
              display: showJson ? "flex" : "none",
              backgroundColor: "white",
              height: "800px",
              marginBottom: "4px",
              overflowY: "scroll",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Input.TextArea
              style={{
                height: "1250px",
                width: "695px",
                marginRight: "4px",
              }}
              value={editedDataStr1}
            ></Input.TextArea>
            <Input.TextArea
              style={{
                height: "1250px",
                width: "695px",
              }}
              onChange={(e) => {
                setEditedDataStr2(e.target.value);
              }}
              value={editedDataStr2}
            ></Input.TextArea>
          </div>
          <div style={{ display: "flex" }}>
            <div ref={wrapperRef1} style={{ marginRight: 5 }}>
              <RenderDetail data={diffRes.alignedData1} />
            </div>

            <div ref={wrapperRef2} style={{ marginLeft: 5 }}>
              <RenderDetail
                data={{
                  ...diffRes.alignedData2,
                  users: diffRes.alignedData2.users,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
