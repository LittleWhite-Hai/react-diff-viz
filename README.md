# react-diff-viz

Rediff 是一个用于比较和展示复杂对象差异的 React 应用程序。

## 项目描述

这个应用程序允许用户可视化地比较两个复杂的 JavaScript 对象之间的差异。它特别适用于展示个人信息、工作经历、技能等数据的变化。

## 主要功能

- 比较两个复杂对象的差异
- 自定义字段比较逻辑
- 灵活的数据展示方式，包括文本和卡片形式
- 支持嵌套对象和数组的比较

## 技术栈

- React
- TypeScript
- CSS

## 安装

1. 克隆仓库:

   ```
   git clone [您的仓库URL]
   ```

2. 安装依赖:

   ```
   pnpm install
   ```

3. 运行应用:
   ```
   pnpm run dev
   ```

## 使用方法

在 `App.tsx` 文件中，您可以修改 `complexObject1` 和 `complexObject2` 来定义要比较的对象。通过调整 `Diff` 组件的 `fieldItems` 属性，您可以自定义比较的字段和展示方式。

## 贡献

欢迎提交 pull requests 来改进这个项目。对于重大更改，请先开一个 issue 讨论您想要改变的内容。

## 许可证

MIT
