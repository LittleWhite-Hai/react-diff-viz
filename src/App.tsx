import { useState } from "react";
import "./App.css";
import Diff from "./diff";
import Card from "./card";
import InfoList from "./InfoList";

const ancientEarth = {
  name: "地球",
  age: 4.52, // 单位：十亿年
  timePeriod: "20,000年前",
  type: "陆地行星",
  galaxy: "银河系",
  continents: [
    "非洲",
    "南极洲",
    "亚洲",
    "欧洲",
    "北美洲",
    "澳大利亚",
    "南美洲",
  ],
  diameter: 12742, // 单位：公里
  population: 0.005, // 单位：十亿，估计值
  countries: 0, // 尚未形成现代国家
  species: 8700000, // 物种数量变化不大
  oceans: [
    {
      name: "大西洋",
      area: 85133000, // 单位：平方公里
      depth: 3646, // 单位：米
    },
    {
      name: "印度洋",
      area: 70560000, // 单位：平方公里
      depth: 3741, // 单位：米
    },
  ],
  atmosphere: {
    composition: {
      氮气: 78, // 百分比
      氧气: 21, // 百分比
      氩气: 0.93, // 百分比
      二氧化碳: 0.018, // 百分比，较低的二氧化碳水平
    },
    layers: ["对流层", "平流层", "中间层", "热层", "外逸层"],
  },
  climate: {
    temperature: "低于现在", // 较低的温度
    seaLevel: "低于现在", // 较低的海平面
  },
  biodiversity: {
    diversityLevel: "高", // 生物多样性仍然很高
    extinctSpecies: "一些大型动物", // 一些大型动物灭绝
  },
  civilization: {
    developmentLevel: "狩猎采集社会", // 以狩猎采集为主
    technology: "石器工具", // 石器工具
  },
  magneticField: {
    strength: 25, // 单位：微特斯拉
    poles: {
      north: "北极地区",
      south: "南极地区",
    },
  },
};

const currentEarth = {
  name: "地球",
  age: 4.52, // 单位：十亿年
  timePeriod: "现在",
  type: "陆地行星",
  galaxy: "银河系",
  continents: [
    "非洲",
    "南极洲",
    "亚洲",
    "欧洲",
    "北美洲",
    "澳大利亚",
    "南美洲",
  ],
  diameter: 12742, // 单位：公里
  population: 8, // 单位：十亿，估计值
  countries: 195, // 现代国家数量
  species: 8700000, // 物种数量
  oceans: [
    {
      name: "太平洋",
      area: 168723000, // 单位：平方公里
      depth: 3970, // 单位：米
    },
    {
      name: "大西洋",
      area: 85133000, // 单位：平方公里
      depth: 3646, // 单位：米
    },
    {
      name: "印度洋",
      area: 70560000, // 单位：平方公里
      depth: 3741, // 单位：米
    },
  ],
  atmosphere: {
    composition: {
      氮气: 78, // 百分比
      氧气: 21, // 百分比
      氩气: 0.93, // 百分比
      二氧化碳: 0.041, // 百分比，较高的二氧化碳水平
    },
    layers: ["对流层", "平流层", "中间层", "热层", "外逸层"],
  },
  climate: {
    temperature: "上升", // 温度上升
    seaLevel: "上升", // 海平面上升
  },
  biodiversity: {
    diversityLevel: "高", // 生物多样性仍然很高
    extinctSpecies: "灭绝率增加", // 灭绝率增加
  },
  civilization: {
    developmentLevel: "先进的技术社会", // 高度发达的技术社会
    technology: "数字和太空技术", // 数字和太空技术
  },
  magneticField: {
    strength: 25, // 单位：微特斯拉
    poles: {
      north: "北极地区",
      south: "南极地区",
    },
  },
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Rediff</h1>

      <Diff
        strictMode={false}
        data1={ancientEarth}
        data2={currentEarth}
        renderItems={[
          {
            label: "名称",
            path: "name",
          },
          {
            label: "物理性质",
          },
          {
            label: "年龄（十亿年）",
            path: "age",
            isEqual: (a, b) => Math.abs(a - b) < 0.1,
          },
          {
            label: "时期",
            path: "timePeriod",
          },
          {
            label: "类型",
            path: "type",
          },
          {
            label: "星系",
            path: "galaxy",
          },
          {
            label: "直径（公里）",
            path: "diameter",
          },
          {
            label: "大陆",
            path: "continents",
            content: (v) => v.join(", "),
          },
          {
            label: "海洋",
            path: "oceans",
            arrayKey: "name",
            content: (v: any) => {
              return v.map((ocean: any) => (
                <Card
                  pathPrefix="oceans"
                  key={ocean.name}
                  title={ocean.name}
                  content={`面积: ${ocean.area} 平方公里, 深度: ${ocean.depth} 米`}
                />
              ));
            },
          },
          {
            label: "大气成分",
            path: "atmosphere.composition",
            content: (v) => (
              <InfoList
                items={Object.entries(v).map(([key, value]) => ({
                  label: key,
                  value: `${value}%`,
                  path: `atmosphere.composition.${key}`,
                }))}
              />
            ),
          },
          {
            label: "大气层",
            path: "atmosphere.layers",
            content: (v) => v.join(", "),
          },
          {
            label: "气候",
            path: "climate",
            content: (v) => (
              <InfoList
                items={[
                  {
                    label: "温度",
                    value: v.temperature,
                    path: "climate.temperature",
                  },
                  {
                    label: "海平面",
                    value: v.seaLevel,
                    path: "climate.seaLevel",
                  },
                ]}
              />
            ),
          },
          {
            label: "磁场强度（微特斯拉）",
            path: "magneticField.strength",
          },
          {
            label: "磁极",
            path: "magneticField.poles",
            content: (v) => (
              <InfoList
                items={[
                  { label: "北极", value: v.north },
                  { label: "南极", value: v.south },
                ]}
              />
            ),
          },
          {
            label: "文明和生物性质",
          },
          {
            label: "人口（十亿）",
            path: "population",
          },
          {
            label: "国家数量",
            path: "countries",
          },
          {
            label: "物种数量",
            path: "species",
          },
          {
            label: "生物多样性",
            path: "biodiversity",
            content: (v) => (
              <InfoList
                items={[
                  {
                    label: "多样性水平",
                    value: v.diversityLevel,
                    path: "biodiversity.diversityLevel",
                  },
                  {
                    label: "灭绝物种",
                    value: v.extinctSpecies,
                    path: "biodiversity.extinctSpecies",
                  },
                ]}
              />
            ),
          },
          {
            label: "文明",
            path: "civilization",
            content: (v) => (
              <InfoList
                items={[
                  {
                    label: "发展水平",
                    value: v.developmentLevel,
                    path: "civilization.developmentLevel",
                  },
                  {
                    label: "技术",
                    value: v.technology,
                    path: "civilization.technology",
                  },
                ]}
              />
            ),
          },
        ]}
        labelStyle={{ width: "25%" }}
        contentStyle={{ width: "70%" }}
      />
    </>
  );
}

export default App;
