import _ from "lodash";
import microDiff from "microdiff";

export type IsEqualFuncType = (data1: any, data2: any) => boolean;
const EMPTY_SYMBOL = Symbol.for("EMPTY_SYMBOL");

function getPathMapVal(path: string, map: Record<string, any>) {
  if (path.endsWith(".")) {
    path = path.substring(0, path.length - 1);
  }
  if (map[path]) {
    return map[path];
  }
  //path的数字，可能是个数组idx，用通配符[]替换
  const newPath = path.replaceAll(/\d+/g, "[]");
  return map[newPath];
}
// todo: 不借助lodash: 如果子项都一样，则一样，如果子项有任何差异，则不一样
function isSameItem<T>(props: {
  data1: T;
  data2: T;
  path: string;
  isEqualMap: Record<string, IsEqualFuncType>;
  listKeyMap: Record<string, string>;
}): boolean {
  const { data1: obj1, data2: obj2, path, isEqualMap, listKeyMap } = props;
  const listKey = listKeyMap[path];

  if (listKey) {
    return obj1[listKey as keyof T] === obj2[listKey as keyof T];
  }
  const isEqual = getPathMapVal(path, isEqualMap);

  if (typeof isEqual === "function") {
    return isEqual(obj1, obj2);
  }
  return _.isEqual(obj1, obj2);
}

// 获取两个数组的最长子序列
function getLCS<T>(
  arr1: T[],
  arr2: T[],
  prefixPath: string,
  isEqualMap: Record<string, IsEqualFuncType>,
  listKeyMap: Record<string, string>
): T[] {
  const dp: T[][][] = Array(arr1.length + 1)
    .fill(0)
    .map(() => Array(arr2.length + 1).fill([[]]));

  for (let i = 0; i < arr1.length + 1; i++) {
    for (let j = 0; j < arr2.length + 1; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = [];
      } else if (
        isSameItem({
          data1: arr1[i - 1],
          data2: arr2[j - 1],
          path: prefixPath + "[]",
          listKeyMap,
          isEqualMap,
        })
      ) {
        dp[i][j] = [...dp[i - 1][j - 1], arr1[i - 1]];
      } else {
        dp[i][j] =
          dp[i - 1][j].length > dp[i][j - 1].length
            ? dp[i - 1][j]
            : dp[i][j - 1];
      }
    }
  }

  return dp[arr1.length][arr2.length];
}
// 对齐两个数组: 匹配最长子序列，并将两数组内的最长子序列元素 index 对齐
function align<T>(props: {
  arr1: T[];
  arr2: T[];
  lcs: T[];
  path: string;
  isEqualMap: Record<string, IsEqualFuncType>;
  listKeyMap: Record<string, string>;
}): [(T | typeof EMPTY_SYMBOL)[], (T | typeof EMPTY_SYMBOL)[]] {
  const { arr1, arr2, lcs, isEqualMap, path, listKeyMap } = props;

  const alignedArr1: (T | typeof EMPTY_SYMBOL)[] = [];
  const alignedArr2: (T | typeof EMPTY_SYMBOL)[] = [];
  let arrIdx1 = 0;
  let arrOffset1 = 0;
  let arrIdx2 = 0;
  let arrOffset2 = 0;
  let lcsIdx = 0;
  while (lcsIdx < lcs.length) {
    const resI = lcs[lcsIdx];
    while (
      arrIdx1 - arrOffset1 < arr1.length &&
      !isSameItem({
        data1: resI,
        data2: arr1[arrIdx1 - arrOffset1],
        isEqualMap,
        listKeyMap,
        path: path + "[]",
      })
    ) {
      alignedArr1.push(arr1[arrIdx1 - arrOffset1]);
      arrIdx1++;
    }
    while (
      arrIdx2 - arrOffset2 < arr2.length &&
      !isSameItem({
        data1: resI,
        data2: arr2[arrIdx2 - arrOffset2],
        isEqualMap,
        listKeyMap,
        path: path + "[]",
      })
    ) {
      alignedArr2.push(arr2[arrIdx2 - arrOffset2]);
      arrIdx2++;
    }
    while (arrIdx1 < arrIdx2) {
      alignedArr1.push(EMPTY_SYMBOL);
      arrOffset1++;
      arrIdx1++;
    }
    while (arrIdx2 < arrIdx1) {
      alignedArr2.push(EMPTY_SYMBOL);
      arrOffset2++;
      arrIdx2++;
    }
    alignedArr1.push(arr1[arrIdx1 - arrOffset1]);
    alignedArr2.push(arr2[arrIdx2 - arrOffset2]);
    arrIdx1++;
    arrIdx2++;
    lcsIdx++;
  }
  while (arrIdx1 - arrOffset1 < arr1.length) {
    alignedArr1.push(arr1[arrIdx1 - arrOffset1]);
    arrIdx1++;
  }
  while (arrIdx2 - arrOffset2 < arr2.length) {
    alignedArr2.push(arr2[arrIdx2 - arrOffset2]);
    arrIdx2++;
  }
  while (arrIdx1 < arrIdx2) {
    alignedArr1.push(EMPTY_SYMBOL);
    arrOffset1++;
    arrIdx1++;
  }
  while (arrIdx2 < arrIdx1) {
    alignedArr2.push(EMPTY_SYMBOL);
    arrOffset2++;
    arrIdx2++;
  }
  return [alignedArr1, alignedArr2];
}

function rearrangeByArr2(props: {
  arr1: Record<string, any>[];
  arr2: Record<string, any>[];
  idKey: string;
}) {
  const { arr1, arr2, idKey } = props;
  // 创建 arr1 的映射，用于快速查找
  const map1 = new Map<string, any[]>();
  arr1.forEach((item) => {
    if (!map1.has(item[idKey])) {
      map1.set(item[idKey], []);
    }
    map1.get(item[idKey])?.push(item);
  });
  // 创建 arr2 的映射，用于快速查找
  const map2 = new Map<string, any[]>();
  arr2.forEach((item) => {
    if (!map2.has(item[idKey])) {
      map2.set(item[idKey], []);
    }
    map2.get(item[idKey])?.push(item);
  });

  // 创建结果数组
  const result1: any[] = [];
  const result2: any[] = [];
  const processedKeys = new Set<string>();
  const arr2arr1 = [arr2, arr1].flat();

  // 按照 arr2 的顺序重排 arr1，补足对应key缺少的元素
  for (const item2 of arr2arr1) {
    const k = item2[idKey];
    if (processedKeys.has(k)) {
      continue;
    }
    processedKeys.add(k);
    const subArr1 = map1.get(k) ?? [];
    const subArr2 = map2.get(k) ?? [];
    while (subArr1.length < subArr2.length) {
      subArr1.push(EMPTY_SYMBOL);
    }
    while (subArr1.length > subArr2.length) {
      subArr2.push(EMPTY_SYMBOL);
    }
    result1.push(...subArr1);
    result2.push(...subArr2);
  }

  return [result1, result2];
}
type DiffItemType = "CHANGED" | "CREATED" | "REMOVED" | "UNCHANGED";
type DiffResType = Record<string, DiffItemType>;

/**
 *
 * @param data1
 * @param data2
 * @returns  diff结果的结构：
 * a.b.c:"CHANGED"
 * a.c.0.d:"REMOVED"
 */
export function diff(data1: any, data2: any) {
  const diffRes: DiffResType = {};
  const microDiffRes = microDiff(data1, data2);
  microDiffRes.forEach((diffItem) => {
    const path = diffItem.path.join(".");
    diffRes[path] = (diffItem.type + "D") as DiffItemType;
  });

  return diffRes;
}
/**
 *
 * @param data
 * 获取对象路径值的映射,仅获取叶子节点的值
 * 例子：
 * 输入：data:{age:2,name:"张三",address:{city:"上海",area:"浦东"}}
 * 输出：{
 *  "age":2,
 *  "name":"张三",
 *  "address.city":"上海",
 *  "address.area":"浦东"
 * }
 */
export function getObjectPathValueMap(data: any) {
  const map = new Map<string, any>();

  function traverse(obj: any, path: string = "") {
    if (typeof obj !== "object" || obj === null) {
      map.set(path, obj);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        traverse(value, newPath);
      } else {
        map.set(newPath, value);
      }
    }
  }

  traverse(data);
  return map;
}
