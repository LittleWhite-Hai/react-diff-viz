import assert from "node:assert/strict";
import test from "node:test";
import { getObjectPathValueMap } from "../diff-algorithm"; // 假设您的函数在这个文件中

test("复杂嵌套对象测试", (t) => {
  const input = {
    name: "张三",
    age: 30,
    address: {
      city: "上海",
      district: "浦东新区",
      street: {
        name: "张江高科技园区",
        number: 88,
      },
    },
    hobbies: ["读书", "旅游", "编程"],
  };

  const expected = new Map<string, string | number | Date>([
    ["name", "张三"],
    ["age", 30],
    ["address.city", "上海"],
    ["address.district", "浦东新区"],
    ["address.street.name", "张江高科技园区"],
    ["address.street.number", 88],
    ["hobbies.0", "读书"],
    ["hobbies.1", "旅游"],
    ["hobbies.2", "编程"],
  ]);

  const result = getObjectPathValueMap(input);
  assert.deepStrictEqual(result, expected);
});

test("包含数组对象的嵌套测试", (t) => {
  const input = {
    company: "ABC科技",
    departments: [
      {
        name: "研发部",
        employees: [
          { id: 1, name: "李四", position: "高级工程师" },
          { id: 2, name: "王五", position: "产品经理" },
        ],
      },
      {
        name: "市场部",
        employees: [{ id: 3, name: "赵六", position: "市场总监" }],
      },
    ],
    founded: new Date("2020-01-01"),
  };

  const expected = new Map<string, string | number | Date>([
    ["company", "ABC科技"],
    ["departments.0.name", "研发部"],
    ["departments.0.employees.0.id", 1],
    ["departments.0.employees.0.name", "李四"],
    ["departments.0.employees.0.position", "高级工程师"],
    ["departments.0.employees.1.id", 2],
    ["departments.0.employees.1.name", "王五"],
    ["departments.0.employees.1.position", "产品经理"],
    ["departments.1.name", "市场部"],
    ["departments.1.employees.0.id", 3],
    ["departments.1.employees.0.name", "赵六"],
    ["departments.1.employees.0.position", "市场总监"],
    ["founded", new Date("2020-01-01")],
  ]);

  const result = getObjectPathValueMap(input);
  assert.deepStrictEqual(result, expected);
});

test("包含空值和特殊类型的测试", (t) => {
  const input = {
    id: 1,
    name: null,
    settings: {
      theme: "dark",
      notifications: {
        email: true,
        sms: false,
        push: undefined,
      },
    },
    tags: ["重要", "", null],
    createdAt: new Date("2023-04-01"),
    metadata: {
      version: 2.5,
      isActive: true,
      details: {},
    },
  };

  const expected = new Map<
    string,
    string | number | Date | null | undefined | {}
  >([
    ["id", 1],
    ["name", null],
    ["settings.theme", "dark"],
    ["settings.notifications.email", true],
    ["settings.notifications.sms", false],
    ["settings.notifications.push", undefined],
    ["tags.0", "重要"],
    ["tags.1", ""],
    ["tags.2", null],
    ["createdAt", new Date("2023-04-01")],
    ["metadata.version", 2.5],
    ["metadata.isActive", true],
    ["metadata.details", {}],
  ]);

  const result = getObjectPathValueMap(input);
  assert.deepStrictEqual(result, expected);
});
