import _ from "lodash";
import { IsEqualFuncType } from "./types";

const EMPTY_SYMBOL = Symbol.for("EMPTY_SYMBOL");

export function getValueByPath(
  obj: Record<string, any>,
  path: string | undefined
) {
  if (!path) {
    return obj;
  }
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

// todo: 不借助lodash: 如果子项都一样，则一样，如果子项有任何差异，则不一样
function isSameItem<T>(props: {
  data1: T;
  data2: T;
  listKey: string;
}): boolean {
  const { data1: obj1, data2: obj2, listKey } = props;

  if (listKey) {
    return obj1[listKey as keyof T] === obj2[listKey as keyof T];
  }

  return _.isEqual(obj1, obj2);
}

// 获取两个数组的最长子序列
function getLCS<T>(arr1: T[], arr2: T[], listKey: string): T[] {
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
          listKey,
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
function alignByLCS<T>(props: {
  arr1: T[];
  arr2: T[];
  lcs: T[];
  listKey: string;
  // isEqualMap: Record<string, IsEqualFuncType>;
  // listKeyMap: Record<string, string>;
}): [(T | typeof EMPTY_SYMBOL)[], (T | typeof EMPTY_SYMBOL)[]] {
  const { arr1, arr2, lcs, listKey } = props;

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
        listKey,
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
        listKey,
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

function alignByArr2(props: {
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

/**
 *
 * @param data1
 * @param data2
 * @param pathPrefix
 * @param arrayAlignLCSMap
 * @param arrayAlignCurrentDataMap
 * @param arrayNoAlignMap
 *
 * 递归地对齐对象中的数组，利用align和rearrangeByArr2函数
 * 如果data1和data2的path相同，并且它们都是数组，
 * 则利用alignByLCSMap、alignByData2Map、noAlignMap对应的三种策略，重新排列两个数组
 *
 */

/**
 * 获取对象路径值的映射,仅获取Array的值
 * @param data
 * @returns
 */
export function getObjectPathArrayMap(data: any) {
  const mapResult: Record<string, Array<any>> = {};

  function traverse(obj: any, path: string = "") {
    if (typeof obj !== "object" || obj === null || obj === undefined) {
      return;
    }
    if (Array.isArray(obj)) {
      mapResult[path] = obj;
    }
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      traverse(value, newPath);
    }
  }

  traverse(data);
  // 将结果转换成数组，并且按照字母顺序排序，格式是{path:string,value:BaseType}[]
  const arrayResult = Array.from(Object.entries(mapResult))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([path, value]) => ({ path, value }));

  return { mapResult, arrayResult };
}

type DataArrayType = {
  path: string;
  value: any[];
}[];

// 计算两个对象中的所有需对齐的数组，返回对齐后需要修改的数据
function calcArrayAlign(props: {
  data1: any;
  data2: any;
  arrayAlignLCSMap: Record<string, string>;
  arrayAlignCurrentDataMap: Record<string, string>;
  arrayNoAlignMap: Record<string, true>;
}) {
  const {
    data1,
    data2,
    arrayAlignLCSMap,
    arrayAlignCurrentDataMap,
    arrayNoAlignMap,
  } = props;
  const { mapResult: mapResult1 } = getObjectPathArrayMap(data1);
  const { mapResult: mapResult2 } = getObjectPathArrayMap(data2);
  const alignedResult1: DataArrayType = [];
  const alignedResult2: DataArrayType = [];

  Object.keys(mapResult1).forEach((path) => {
    if (mapResult2[path]) {
      if (arrayNoAlignMap[path]) {
        // do nothing
      } else if (arrayAlignCurrentDataMap[path]) {
        const listKey = arrayAlignCurrentDataMap[path];
        const [alignedArr1, alignedArr2] = alignByArr2({
          arr1: mapResult1[path],
          arr2: mapResult2[path],
          // todo:支持boolean
          idKey: String(listKey),
        });
        alignedResult1.push({ path, value: alignedArr1 });
        alignedResult2.push({ path, value: alignedArr2 });
      } else {
        // 默认使用LCS方法
        const listKey = arrayAlignLCSMap[path];
        const lcs = getLCS(mapResult1[path], mapResult2[path], listKey);
        const [alignedArr1, alignedArr2] = alignByLCS({
          arr1: mapResult1[path],
          arr2: mapResult2[path],
          lcs,
          listKey,
        });
        alignedResult1.push({ path, value: alignedArr1 });
        alignedResult2.push({ path, value: alignedArr2 });
      }
    }
  });
  return [alignedResult1, alignedResult2];
}

type DiffItemType = "CHANGED" | "CREATED" | "REMOVED" | "UNCHANGED";
type DiffResType = Record<string, DiffItemType>;

type BaseType = string | number | Date | null | undefined | boolean;
/**
 *
 * @param data
 * 获取给定对象路径值的映射,仅获取叶子节点的值
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
  const mapResult = new Map<string, BaseType>();

  function traverse(obj: any, path: string = "") {
    if (
      typeof obj !== "object" ||
      obj === null ||
      obj === undefined ||
      obj instanceof Date
    ) {
      if (obj instanceof Date) {
        mapResult.set(path, obj.toISOString());
      } else {
        mapResult.set(path, obj);
      }
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !(obj instanceof Date)
      ) {
        traverse(value, newPath);
      } else {
        if (obj instanceof Date) {
          mapResult.set(newPath, obj.toISOString());
        } else {
          mapResult.set(newPath, value as BaseType);
        }
      }
    }
  }

  traverse(data);
  // 将结果转换成数组，并且按照字母顺序排序，格式是{path:string,value:BaseType}[]
  const arrayResult = Array.from(mapResult.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([path, value]) => ({ path, value }));

  return { mapResult, arrayResult };
}

// 根据叶子节点的diff结果，设置父节点的diff结果
function setNodeDiffRes(
  diffRes: DiffResType,
  leafPath: string,
  leafDiffRes: DiffItemType
) {
  diffRes[leafPath] = leafDiffRes;
  const pathArr = leafPath.split(".");
  pathArr.pop();
  if (leafDiffRes === "UNCHANGED") {
    while (pathArr.length) {
      const parentPath = pathArr.join(".");
      if (["CHANGED", "REMOVED", "CREATED"].includes(diffRes[parentPath])) {
        // do nothing
      } else {
        diffRes[parentPath] = "UNCHANGED";
      }
      pathArr.pop();
    }
  } else {
    while (pathArr.length) {
      const parentPath = pathArr.join(".");
      // 如果父节点的diff结果和当前节点的diff结果不一样，则设置为"CHANGED"
      if (diffRes[parentPath] && diffRes[parentPath] !== leafDiffRes) {
        diffRes[parentPath] = "CHANGED";
      } else {
        diffRes[parentPath] = leafDiffRes;
      }
      pathArr.pop();
    }
  }
}

export function alignAndDiff(props: {
  data1: any;
  data2: any;
  isEqualMap: Record<string, IsEqualFuncType>;
  arrayAlignLCSMap: Record<string, string>;
  arrayAlignCurrentDataMap: Record<string, string>;
  arrayNoAlignMap: Record<string, true>;
  strictMode: boolean;
}) {
  const { alignedData1, alignedData2 } = align(props);
  const diffRes = diff(
    alignedData1,
    alignedData2,
    props.isEqualMap,
    props.strictMode
  );
  return { diffRes, alignedData1, alignedData2 };
}

export function align(props: {
  data1: any;
  data2: any;
  isEqualMap: Record<string, IsEqualFuncType>;
  arrayAlignLCSMap: Record<string, string>;
  arrayAlignCurrentDataMap: Record<string, string>;
  arrayNoAlignMap: Record<string, true>;
}) {
  const {
    data1,
    data2,
    isEqualMap,
    arrayAlignLCSMap,
    arrayAlignCurrentDataMap,
    arrayNoAlignMap,
  } = props;
  const [alignedResult1, alignedResult2] = calcArrayAlign({
    data1,
    data2,
    arrayAlignLCSMap,
    arrayAlignCurrentDataMap,
    arrayNoAlignMap,
  });

  const alignedData1 = _.cloneDeep(data1);
  const alignedData2 = _.cloneDeep(data2);
  alignedResult1.forEach((item) => {
    alignedData1[item.path] = item.value;
  });
  alignedResult2.forEach((item) => {
    alignedData2[item.path] = item.value;
  });
  return { alignedData1, alignedData2 };
}

/**
 *
 * @param data1
 * @param data2
 * @returns  diff结果的结构：
 * a.b.c:"CHANGED"
 * a.c.0.d:"REMOVED"
 */
export function diff(
  data1: any,
  data2: any,
  isEqualMap: Record<string, IsEqualFuncType>,
  strictMode: boolean
) {
  const { arrayResult: arrayPathValue1 } = getObjectPathValueMap(data1);
  const { arrayResult: arrayPathValue2 } = getObjectPathValueMap(data2);
  // 对于arrayPathValue1和arrayPathValue2，如果path相同，则比较value，如果value不同，则diffRes[path] = "CHANGED"
  // 子节点遍历完成之后，根据子节点的结果，给父节点打diff标记
  // 比如a.b.c.d的结果是"CHANGED"或"REMOVED"或"CREATED"，则diffRes["a.b.c"] = "CHANGED"
  // 比如a.b.c.d和a.b.c.e的结果都是"UNCHANGED"，则diffRes["a.b.c"] = "UNCHANGED"
  const diffRes: DiffResType = {};
  let i = 0,
    j = 0;
  while (i < arrayPathValue1.length && j < arrayPathValue2.length) {
    if (
      i < arrayPathValue1.length &&
      arrayPathValue1[i].path.localeCompare(arrayPathValue2[j].path) < 0
    ) {
      // 数组1追数组2，则数组1的内容被删除了，标记为"REMOVED"
      while (
        i < arrayPathValue1.length &&
        arrayPathValue1[i].path.localeCompare(arrayPathValue2[j].path) < 0
      ) {
        setNodeDiffRes(diffRes, arrayPathValue1[i].path, "REMOVED");
        i++;
      }
    } else if (
      j < arrayPathValue2.length &&
      arrayPathValue1[i].path.localeCompare(arrayPathValue2[j].path) > 0
    ) {
      // 数组2追数组1，则数组2的内容是新增的，标记为"CREATED"
      while (
        j < arrayPathValue2.length &&
        arrayPathValue1[i].path.localeCompare(arrayPathValue2[j].path) > 0
      ) {
        setNodeDiffRes(diffRes, arrayPathValue2[j].path, "CREATED");
        j++;
      }
    } else {
      // 数组1和数组2的path相同，则比较它们的值，相同则为"UNCHANGED"，不同则为"CHANGED"
      if (
        isEqualFundamentalData(
          arrayPathValue1[i].value,
          arrayPathValue2[j].value,
          strictMode
        )
      ) {
        setNodeDiffRes(diffRes, arrayPathValue1[i].path, "UNCHANGED");
      } else {
        setNodeDiffRes(diffRes, arrayPathValue1[i].path, "CHANGED");
      }
      i++;
      j++;
    }
  }
  while (i < arrayPathValue1.length) {
    setNodeDiffRes(diffRes, arrayPathValue1[i].path, "REMOVED");
    i++;
  }
  while (j < arrayPathValue2.length) {
    setNodeDiffRes(diffRes, arrayPathValue2[j].path, "CREATED");
    j++;
  }
  // 用户自定义的isEqual会覆盖原本的diff计算
  Object.entries(isEqualMap).forEach(([path, isEqualFunc]) => {
    const a = getValueByPath(data1, path);
    const b = getValueByPath(data2, path);
    const isEqual = isEqualFunc(a, b, {
      data1,
      data2,
      type: "",
      path,
    });
    diffRes[path] = isEqual ? "UNCHANGED" : "CHANGED";
  });

  return diffRes;
}
function isEqualFundamentalData(a: BaseType, b: BaseType, strictMode: boolean) {
  if (strictMode) {
    return a === b;
  }
  if (
    ["0", 0, null, undefined, NaN, false].includes(a as any) &&
    ["0", 0, null, undefined, NaN, false].includes(b as any)
  ) {
    return true;
  }
  if (a === b || String(a) === String(b)) {
    return true;
  }

  return false;
}
