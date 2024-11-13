import { alignAndDiff } from "./diff/diff-algorithm";
import { case1, case2, case3, case4, case5 } from "../../test/align";

function testAlign(casen: { a: any; b: any; msg: string }) {
  const res = alignAndDiff({
    data1: { xx: casen.a },
    data2: { xx: casen.b },
    arrayAlignLCSMap: { "xx.[]": "category", "xx.[].items.[]": "name" },
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
