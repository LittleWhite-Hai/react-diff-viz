# react-diff-viz

react-diff-viz 是一个用于比较和展示复杂对象差异的 React 应用程序。

## 项目描述

这个应用程序允许用户可视化地比较两个复杂的 JavaScript 对象之间的差异。

## 主要功能

- 比较两个复杂对象的差异
- 自定义字段比较逻辑
- 灵活的数据展示方式，包括文本和卡片形式
- 支持嵌套对象和数组的比较

## 技术栈

- React
- TypeScript
- CSS

## 安装

```bash
npm install react-diff-viz
```

## 使用

```tsx
import Diff from "react-diff-viz";

const data1 = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA"
  }
};

const data2 = {
  name: "John",
  age: 31,
  address: {
    city: "New York",
    country: "USA"
  }
};

const vizItems = [   
  {
    path: "name",
    label: "name",
  },
  {
    path: "age",
    label: "age",
  },
  {
    path: "address",
    label: "address",
    content: (v) => {
      return v.city +" of "+ v.country;
    },
  },
];

<Diff data1={data1} data2={data2} vizItems={vizItems} />
```

## 许可证

MIT
