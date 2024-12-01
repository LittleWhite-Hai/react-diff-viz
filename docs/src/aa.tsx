import { diff, DiffWrapper } from "react-diff-viz";

const diffRes = diff({
  data1,
  data2,
  isEqualMap: { name: () => true, age: (a, b) => math.abs(a - b) > 2 },
});
const ref1 = useRef<HTMLDivElement>();
const ref2 = useRef<HTMLDivElement>();
return (
  <DiffWrapper diffRes={diffRes} wrapperRef1={ref1} wrapperRef2={ref2}>
    <div ref={ref1}>
      <RenderData data={data1} /> {/* 你的业务代码,渲染数据1 */}
    </div>
    <div ref={ref2}>
      <RenderData data={data2} /> {/* 你的业务代码,渲染数据2 */}
    </div>
  </DiffWrapper>
);
