# <img src="./public/diff.ico" height="20" /> react-diff-viz

react-diff-viz is a React component that compares and renders complex object differences

## Features

> This component integrates diff algorithm and visual rendering, features are as follows

- The left and right columns display the data, aligned to the height of corresponding field, and colored the different fields
- The component comes with the diff function. You can customize the diff function for fields
- The component has its own rendering function. You can customize rendering functions for fields
- Supports comparison of nested objects and arrays

## Dependencies

- react (peer dependency)
- react-dom (peer dependency)
- lodash (peer dependency)

## Demo

https://littlewhite-hai.github.io/react-diff-viz/
![demo](./docs/public/demo.png)

## Install

```bash
npm install react-diff-viz
```

## Usage

```tsx
import Diff from "react-diff-viz";

const data1 = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA",
  },
};

const data2 = {
  name: "John",
  age: 31,
  address: {
    city: "New York",
    country: "USA",
  },
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
      return v.city + " of " + v.country;
    },
  },
];

<Diff data1={data1} data2={data2} vizItems={vizItems} />;
```

## 许可证

MIT
