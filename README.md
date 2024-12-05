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

step 1

```tsx
import { calcDiff, applyDiff } from "diff-viz";
const ref1 = useRef<HTMLDivElement>(null);
const ref2 = useRef<HTMLDivElement>(null);

useEffect(() => {
  const diffRes = calcDiff({ data1, data2 });
  applyDiff({ diffRes, ref1, ref2 });
}, [data1, data2]);

return (
  <>
    <div ref={ref1}>
      <RenderData data={data1} /> {/* 你的业务代码,渲染数据1 */}
    </div>
    <div ref={ref2}>
      <RenderData data={data2} /> {/* 你的业务代码,渲染数据2 */}
    </div>
  </>
);
```

step 2

```tsx
// 假设<RenderData />是你的渲染数据的组件
function RenderData(props) {
  return (
    <div>
      ...
      <div data-path="cardData">{RenderCard(props.data.cardData)}</div>
      <div data-path="table.tableData">
        {RenderTable(props.data.table.tableData)}
      </div>
      <div data-path="dateData">{RenderDate(props.data.dateData)}</div>
      ...
    </div>
  );
}
```

## License

MIT
