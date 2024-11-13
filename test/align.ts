export const originData = [
  {
    category: "柑橘类",
    items: [
      { id: 1, name: "橙子" },
      { id: 2, name: "柚子" },
      { id: 3, name: "柠檬" },
    ],
  },
  {
    category: "瓜类",
    items: [
      { id: 4, name: "西瓜" },
      { id: 5, name: "哈密瓜" },
    ],
  },
  {
    category: "浆果类",
    items: [
      { id: 6, name: "葡萄" },
      { id: 7, name: "樱桃" },
      { id: 8, name: "蓝莓" },
      { id: 9, name: "草莓" },
    ],
  },
  {
    category: "热带水果",
    items: [{ id: 10, name: "菠萝" }],
  },
  {
    category: "异域水果",
    items: [
      { id: 11, name: "芒果" },
      { id: 12, name: "火龙果" },
    ],
  },
  {
    category: "其他水果",
    items: [
      { id: 13, name: "猕猴桃" },
      { id: 14, name: "无花果" },
      { id: 15, name: "石榴" },
    ],
  },
];

export const case1 = {
  msg: "删除path = '1.item.0' (category='瓜类',id=4,name='西瓜')",
  a: originData,
  b: [
    {
      category: "柑橘类",
      items: [
        { id: 1, name: "橙子" },
        { id: 2, name: "柚子" },
        { id: 3, name: "柠檬" },
      ],
    },
    {
      category: "瓜类",
      items: [
        // { id: 4, name: "西瓜" },
        { id: 5, name: "哈密瓜" },
      ],
    },
    {
      category: "浆果类",
      items: [
        { id: 6, name: "葡萄" },
        { id: 7, name: "樱桃" },
        { id: 8, name: "蓝莓" },
        { id: 9, name: "草莓" },
      ],
    },
    {
      category: "热带水果",
      items: [{ id: 10, name: "菠萝" }],
    },
    {
      category: "异域水果",
      items: [
        { id: 11, name: "芒果" },
        { id: 12, name: "火龙果" },
      ],
    },
    {
      category: "其他水果",
      items: [
        { id: 13, name: "猕猴桃" },
        { id: 14, name: "无花果" },
        { id: 15, name: "石榴" },
      ],
    },
  ],
};

export const case2 = {
  msg: "删除path = '1' (category='瓜类)",

  a: originData,

  b: [
    {
      category: "柑橘类",
      items: [
        { id: 1, name: "橙子" },
        { id: 2, name: "柚子" },
        { id: 3, name: "柠檬" },
      ],
    },
    // {
    //     category: "瓜类",
    //     items: [
    //       { id: 4, name: "西瓜" },
    //       { id: 5, name: "哈密瓜" },
    //     ],
    //   },
    {
      category: "浆果类",
      items: [
        { id: 6, name: "葡萄" },
        { id: 7, name: "樱桃" },
        { id: 8, name: "蓝莓" },
        { id: 9, name: "草莓" },
      ],
    },
    {
      category: "热带水果",
      items: [{ id: 10, name: "菠萝" }],
    },
    {
      category: "异域水果",
      items: [
        { id: 11, name: "芒果" },
        { id: 12, name: "火龙果" },
      ],
    },
    {
      category: "其他水果",
      items: [
        { id: 13, name: "猕猴桃" },
        { id: 14, name: "无花果" },
        { id: 15, name: "石榴" },
      ],
    },
  ],
};

export const case3 = {
  msg: "新增path = '3' (category='新增一条)",

  a: originData,
  b: [
    {
      category: "柑橘类",
      items: [
        { id: 1, name: "橙子" },
        { id: 2, name: "柚子" },
        { id: 3, name: "柠檬" },
      ],
    },

    {
      category: "瓜类",
      items: [
        { id: 4, name: "西瓜" },
        { id: 5, name: "哈密瓜" },
      ],
    },
    {
      category: "浆果类",
      items: [
        { id: 6, name: "葡萄" },
        { id: 7, name: "樱桃" },
        { id: 8, name: "蓝莓" },
        { id: 9, name: "草莓" },
      ],
    },
    {
      category: "新增一条",
      items: [
        { id: 111, name: "橙车子" },
        { id: 222, name: "柚车子" },
        { id: 333, name: "柠檬车子" },
      ],
    },
    {
      category: "热带水果",
      items: [{ id: 10, name: "菠萝" }],
    },
    {
      category: "异域水果",
      items: [
        { id: 11, name: "芒果" },
        { id: 12, name: "火龙果" },
      ],
    },
    {
      category: "其他水果",
      items: [
        { id: 13, name: "猕猴桃" },
        { id: 14, name: "无花果" },
        { id: 15, name: "石榴" },
      ],
    },
  ],
};

export const case4 = {
  msg: `新增path = '3' (category='新增一条);
        删除path='2.items.1' (category='浆果类',id=7,name='樱桃')`,

  a: originData,
  b: [
    {
      category: "柑橘类",
      items: [
        { id: 1, name: "橙子" },
        { id: 2, name: "柚子" },
        { id: 3, name: "柠檬" },
      ],
    },

    {
      category: "瓜类",
      items: [
        { id: 4, name: "西瓜" },
        { id: 5, name: "哈密瓜" },
      ],
    },
    {
      category: "浆果类",
      items: [
        { id: 6, name: "葡萄" },
        //   { id: 7, name: "樱桃" },
        { id: 8, name: "蓝莓" },
        { id: 9, name: "草莓" },
      ],
    },
    {
      category: "新增一条",
      items: [
        { id: 111, name: "橙车子" },
        { id: 222, name: "柚车子" },
        { id: 333, name: "柠檬车子" },
      ],
    },
    {
      category: "热带水果",
      items: [{ id: 10, name: "菠萝" }],
    },
    {
      category: "异域水果",
      items: [
        { id: 11, name: "芒果" },
        { id: 12, name: "火龙果" },
      ],
    },
    {
      category: "其他水果",
      items: [
        { id: 13, name: "猕猴桃" },
        { id: 14, name: "无花果" },
        { id: 15, name: "石榴" },
      ],
    },
  ],
};

export const case5 = {
  msg: `删除path = '1' (category='瓜类);
        修改path=3.items.0.id ，改为108`,

  a: originData,

  b: [
    {
      category: "柑橘类",
      items: [
        { id: 1, name: "橙子" },
        { id: 2, name: "柚子" },
        { id: 3, name: "柠檬" },
      ],
    },

    {
      category: "浆果类",
      items: [
        { id: 6, name: "葡萄" },
        { id: 7, name: "樱桃" },
        { id: 8, name: "蓝莓" },
        { id: 9, name: "草莓" },
      ],
    },
    {
      category: "热带水果",
      items: [{ id: 108, name: "菠萝" }],
    },
    {
      category: "异域水果",
      items: [
        { id: 11, name: "芒果" },
        { id: 12, name: "火龙果" },
      ],
    },
    {
      category: "其他水果",
      items: [
        { id: 13, name: "猕猴桃" },
        { id: 14, name: "无花果" },
        { id: 15, name: "石榴" },
      ],
    },
  ],
};
