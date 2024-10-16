import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Diff from "./diff";

const complexObject1 = {
  个人信息: {
    姓名: "张三",
    年龄: 30,
    地址: {
      城市: "北京",
      邮编: "100000",
    },
  },
  工作经历: [
    { 公司: "ABC科技", 职位: "软件工程师", 年份: 2018 },
    { 公司: "XYZ集团", 职位: "高级开发者", 年份: 2020 },
  ],
  技能: ["JavaScript", "React", "Node.js", "Python"],
  项目: {
    进行中: ["电商平台", "数据分析工具"],
    已完成: ["社交媒体APP", "在线教育系统"],
  },
  评分: { 技术: 9, 沟通: 8, 团队合作: 9 },
};

const complexObject2 = {
  个人信息: {
    姓名: "张三",
    年龄: 31, // 变化
    地址: {
      城市: "北京", // 变化
      邮编: "200000", // 变化
    },
  },
  工作经历: [
    { 公司: "ABC科技", 职位: "软件工程师", 年份: 2018 },
    { 公司: "XYZ集团", 职位: "技术主管", 年份: 2020 }, // 变化
    { 公司: "新公司", 职位: "架构师", 年份: 2022 }, // 新增
  ],
  技能: ["JavaScript", "React", "Node.js", "Python", "Docker"], // 变化
  项目: {
    进行中: ["电商平台升级", "AI助手开发"], // 变化
    已完成: ["社交媒体APP", "在线教育系统", "企业管理系统"], // 变化
  },
  评分: { 技术: 9, 沟通: 8, 团队合作: 9 },
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>

      <Diff
        beforeData={complexObject1}
        currentData={complexObject2}
        fieldItems={[
          {
            label: "个人信息.姓名",
            path: "个人信息.姓名",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "个人信息.年龄",
            path: "个人信息.年龄",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "个人信息.地址.城市",
            path: "个人信息.地址.城市",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "个人信息.地址.邮编",
            path: "个人信息.地址.邮编",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "个人信息.地址",
            path: "个人信息.地址",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "工作经历.0",
            path: "工作经历.0",
            content: (v) => JSON.stringify(v),
          },
          {
            label: "工作经历",
            path: "工作经历",
            arrayNeedAlignByLCS:"公司",
            content: (v) => JSON.stringify(v),
          },
          { label: "技能", path: "技能", content: (v) => JSON.stringify(v) },
          { label: "项目", path: "项目", content: (v) => JSON.stringify(v) },
          { label: "评分", path: "评分", content: (v) => JSON.stringify(v) },
        ]}
    
      />
    </>
  );
}

export default App;
