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

## API

### Diff Component API

| Name               | Type             | Description                                                                                                                    |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| data1(required)    | any              | Data used for comparison (usually the original data)                                                                           |
| data2(required)    | any              | Data used for comparison (usually the new data)                                                                                |
| vizItems(required) | Array\<VizItem\> | Describes the data to be rendered, including diff method and rendering method                                                  |
| colStyle           | CSSProperties    | Overall style for the outer DOM of all data1 and data2                                                                         |
| labelStyle         | CSSProperties    | Style for the label of each data item                                                                                          |
| contentStyle       | CSSProperties    | Style for the content of each data item                                                                                        |
| strictMode         | boolean          | Strict mode, enabled by default. When disabled, the diff algorithm ignores data type differences, e.g., 0=null=undefined=false |
| singleMode         | boolean          | Only view data2, default false                                                                                                 |
| refreshKey         | number           | Change this key to trigger recoloring and height alignment                                                                     |

### VizItems API

| Name                  | Type                       | Description                                                                                                                               |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| label                 | string                     | Title of the data, if only label is provided, it renders a separator title                                                                |
| path                  | string                     | Data path of the data                                                                                                                     |
| visible               | boolean                    | If false, the item will not be displayed                                                                                                  |
| foldable(coming soon) | boolean                    | Whether it can be folded                                                                                                                  |
| isEqual               | (v1,v2)=>boolean           | Customize the data diff algorithm                                                                                                         |
| content               | (v,ext)=>ReactNode         | Customize the data rendering method                                                                                                       |
| arrayKey              | string                     | Key for arrays, used to mark this data as array type                                                                                      |
| alignAlignType        | "lcs" \| "data2" \| "none" | Array alignment method, default is longest common subsequence ([lcs](https://en.wikipedia.org/wiki/Longest_common_subsequence)) alignment |

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

## License

MIT
