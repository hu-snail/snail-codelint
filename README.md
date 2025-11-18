# 🐌 Snail CodeLint

通用代码规范检查和优化工具，支持 Vue3/React/TypeScript 项目，基于 oxlint + prettier 构建。

## 特性

- 🚀 快速配置代码规范
- 🎯 支持多种项目类型（Vue3/React/TypeScript）
- 🛠️ 基于 oxlint（快速）+ Prettier（格式化）
- 💡 交互式命令行界面
- 📦 自动安装依赖
- 🏗️ 模块化架构设计

## 安装

全局安装：

```bash
pnpm i snail-codelint -g
```

或使用其他包管理器：

```bash
npm i snail-codelint -g
# 或
yarn global add snail-codelint
```

## 使用

在项目根目录运行：

```bash
snail-codelint
```

然后按照提示选择：

1. 项目类型（Vue3/React/TypeScript 等）
2. 包管理器（pnpm/npm/yarn）

工具会自动：

- 生成 `.prettierrc.json` 配置文件
- 生成 `.prettierignore` 忽略文件
- 生成 `oxlint.json` 配置文件
- 安装必要的依赖
- 在 `package.json` 中添加 lint 和 format 脚本

## 生成的命令

配置完成后，可以使用以下命令：

```bash
# 运行代码检查
npm run lint

# 格式化代码
npm run format

# 检查代码格式（不修改）
npm run format:check
```

## 支持的项目类型

- Vue 3 + TypeScript
- Vue 3 + JavaScript
- React + TypeScript
- React + JavaScript
- TypeScript（纯）
- JavaScript（纯）

## 项目结构

```
snail-codelint/
├── bin/
│   └── cli.js              # CLI 入口
├── src/
│   ├── cli/                # 命令行交互模块
│   │   ├── index.ts        # CLI 主逻辑
│   │   ├── prompts.ts      # 交互式提示配置
│   │   └── output.ts       # 终端输出格式化
│   ├── core/               # 核心功能模块
│   │   └── setup.ts        # 配置安装主流程
│   ├── generators/         # 配置文件生成器
│   │   ├── prettier.ts     # Prettier 配置生成
│   │   └── oxlint.ts       # Oxlint 配置生成
│   ├── utils/              # 工具函数
│   │   ├── dependencies.ts # 依赖安装管理
│   │   ├── package.ts      # package.json 操作
│   │   └── file.ts         # 文件操作工具
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   └── index.ts            # 入口文件
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
├── LICENSE
└── README.md
```

## 模块说明

### CLI 模块 (`src/cli/`)

负责命令行交互和用户界面：

- `index.ts` - CLI 主流程控制
- `prompts.ts` - 交互式问题配置
- `output.ts` - 终端输出美化

### Core 模块 (`src/core/`)

核心业务逻辑：

- `setup.ts` - 协调各模块完成配置安装

### Generators 模块 (`src/generators/`)

配置文件生成器：

- `prettier.ts` - 生成 Prettier 配置和忽略文件
- `oxlint.ts` - 根据项目类型生成 Oxlint 配置

### Utils 模块 (`src/utils/`)

通用工具函数：

- `dependencies.ts` - 依赖包安装管理
- `package.ts` - package.json 读写操作
- `file.ts` - 文件系统操作封装

### Types 模块 (`src/types/`)

TypeScript 类型定义，提供类型安全

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm run build

# 开发模式（监听文件变化）
pnpm run dev

# 本地测试
npm link

# 在测试项目中使用
cd /path/to/test-project
snail-codelint
```

## 发布

```bash
# 登录 npm
npm login

# 发布
npm publish
```

## License

MIT
