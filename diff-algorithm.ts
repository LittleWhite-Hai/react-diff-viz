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
  listKey: string | boolean;
}): boolean {
  const { data1: obj1, data2: obj2, path, listKey } = props;

  if (typeof listKey === "string") {
    return obj1[listKey as keyof T] === obj2[listKey as keyof T];
  }

  return _.isEqual(obj1, obj2);
}

// 获取两个数组的最长子序列
function getLCS<T>(arr1: T[], arr2: T[], listKey: string | boolean): T[] {
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
          path: "[]",
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
  listKey: string | boolean;
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
        path: "[]",
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
        path: "[]",
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
 * @param alignByLCSMap
 * @param alignByData2Map
 * @param noAlignMap
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
    if (Array.isArray(obj)) {
      mapResult[path] = obj;
    }
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      if (typeof obj === "object") {
        traverse(value, newPath);
      }
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
function alignAllArrayOfObject(
  data1: any,
  data2: any,
  alignByLCSMap: Record<string, true | string> = {},
  alignByData2Map: Record<string, true | string> = {},
  noAlignMap: Record<string, true> = {}
) {
  const { mapResult: mapResult1 } = getObjectPathArrayMap(data1);
  const { mapResult: mapResult2 } = getObjectPathArrayMap(data2);
  const alignedResult1: DataArrayType = [];
  const alignedResult2: DataArrayType = [];

  Object.keys(mapResult1).forEach((path) => {
    if (mapResult2[path]) {
      if (noAlignMap[path]) {
        // do nothing
      } else if (alignByData2Map[path]) {
        const listKey = alignByData2Map[path];
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
        const listKey = alignByLCSMap[path];
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

type BaseType = string | number | Date | null | undefined;
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

/**
 *
 * @param data1
 * @param data2
 * @returns  diff结果的结构：
 * a.b.c:"CHANGED"
 * a.c.0.d:"REMOVED"
 */
export function diff(rawData1: any, rawData2: any) {
  const data1 = _.cloneDeep(rawData1);
  const data2 = _.cloneDeep(rawData2);

  const [alignedResult1, alignedResult2] = alignAllArrayOfObject(data1, data2);
  alignedResult1.forEach((item) => {
    data1[item.path] = item.value;
  });
  alignedResult2.forEach((item) => {
    data2[item.path] = item.value;
  });

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
      if (arrayPathValue1[i].value !== arrayPathValue2[j].value) {
        setNodeDiffRes(diffRes, arrayPathValue1[i].path, "CHANGED");
      } else {
        setNodeDiffRes(diffRes, arrayPathValue1[i].path, "UNCHANGED");
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

  return diffRes;
}

const object1 = {
  公司: "创新科技有限公司",
  成立日期: new Date("2010-05-15"),
  员工数量: 250,
  部门: [
    {
      名称: "研发部",
      主管: "张三",
      员工: [
        {
          工号: "RD001",
          姓名: "李四",
          职位: "高级工程师",
          入职日期: new Date("2015-03-01"),
        },
        {
          工号: "RD002",
          姓名: "王五",
          职位: "产品经理",
          入职日期: new Date("2016-07-15"),
        },
        {
          工号: "RD003",
          姓名: "赵六",
          职位: "UI设计师",
          入职日期: new Date("2018-02-28"),
        },
      ],
      项目: ["智能家居系统", "移动支付平台"],
    },
    {
      名称: "市场部",
      主管: "钱七",
      员工: [
        {
          工号: "MK001",
          姓名: "孙八",
          职位: "市场总监",
          入职日期: new Date("2014-09-01"),
        },
        {
          工号: "MK002",
          姓名: "周九",
          职位: "销售经理",
          入职日期: new Date("2017-05-20"),
        },
      ],
      负责区域: ["华东", "华北", "华南"],
    },
  ],
  财务状况: {
    年营业额: 5000000,
    净利润: 1000000,
    主要客户: ["腾讯", "阿里巴巴", "百度"],
  },
  公司地址: {
    省份: "广东",
    城市: "深圳",
    详细地址: "南山区科技园路10号",
  },
};

const object2 = {
  公司: "创新科技股份有限公司", // 更新：公司名称变更
  成立日期: new Date("2010-05-15"),
  员工数量: 280, // 更新：员工数量增加
  部门: [
    {
      名称: "研发部",
      主管: "张三",
      员工: [
        {
          工号: "RD001",
          姓名: "李四",
          职位: "技术总监",
          入职日期: new Date("2015-03-01"),
        }, // 更新：职位变更
        {
          工号: "RD002",
          姓名: "王五",
          职位: "产品经理",
          入职日期: new Date("2016-07-15"),
        },
        {
          工号: "RD004",
          姓名: "刘十",
          职位: "后端工程师",
          入职日期: new Date("2022-04-01"),
        }, // 新增：新员工
      ],
      项目: ["智能家居系统", "移动支付平台", "区块链应用"], // 更新：新增项目
    },
    {
      名称: "市场部",
      主管: "钱七",
      员工: [
        {
          工号: "MK001",
          姓名: "孙八",
          职位: "市场总监",
          入职日期: new Date("2014-09-01"),
        },
        {
          工号: "MK002",
          姓名: "周九",
          职位: "销售经理",
          入职日期: new Date("2017-05-20"),
        },
        {
          工号: "MK003",
          姓名: "吴十一",
          职位: "市场分析师",
          入职日期: new Date("2023-01-10"),
        }, // 新增：新员工
      ],
      负责区域: ["华东", "华北", "华南", "西南"], // 更新：新增负责区域
    },
    {
      名称: "人力资源部", // 新增：新部门
      主管: "郑十二",
      员工: [
        {
          工号: "HR001",
          姓名: "黄十三",
          职位: "人力资源经理",
          入职日期: new Date("2023-03-15"),
        },
      ],
      职责: ["招聘", "培训", "绩效管理"],
    },
  ],
  财务状况: {
    年营业额: 6000000, // 更新：营业额增加
    净利润: 1200000, // 更新：净利润增加
    主要客户: ["腾讯", "阿里巴巴", "字节跳动"], // 更新：客户变更
  },
  公司地址: {
    省份: "广东",
    城市: "深圳",
    详细地址: "南山区科技园路15号", // 更新：地址变更
  },
  公司愿景: "成为行业领先的科技创新企业", // 新增：公司愿景
};
// const microDiffRes = microDiff(object1, object2).map((i: any) => {
//   return {
//     path: i.path.join("."),
//     type: i.type,
//     oldValue: i.oldValue,
//     newValue: i.value,
//   };
// });
// console.log("microDiffRes:", microDiffRes);

const res = diff(object1, object2);
console.log("res:", res);
// const aaa = getObjectPathArrayMap(object1);
// console.log("aaa", aaa);
console.log("");
