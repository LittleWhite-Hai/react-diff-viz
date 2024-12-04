# <img src="./public/diff.ico" height="20" /> diff-viz

render JSON differences + custom your styles

## Install

```bash
npm install diff-viz
```

## Demo

https://littlewhite-hai.github.io/diff-viz/

![demo](./docs/public/demo.png)

## Usage

```tsx
import DiffViz from "diff-viz";

// describe the content to be rendered
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
  ]

// diff data1 and data2 ,then render
<DiffViz
  data1={{
    name: "John",
    age: 30,
    address: {
      city: "New York",
      country: "USA",
    },
  }}
  data2={{
    name: "John",
    age: 31,
    address: {
      city: "New York",
      country: "USA",
    },
  }}
  vizItems={vizItems}
/>;
```

recommend to read the demo site: https://littlewhite-hai.github.io/diff-viz/

## Dependencies

- react (peer dependency)
- react-dom (peer dependency)
- lodash (peer dependency)

## License

MIT
