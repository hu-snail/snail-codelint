# 贡献指南

感谢你对 Snail CodeLint 的关注！

## 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 代码规范

本项目使用 TypeScript 开发，请确保：

- 代码符合 TypeScript 严格模式
- 遵循模块化设计原则
- 添加必要的类型定义
- 保持代码简洁清晰

## 目录结构规范

- `src/cli/` - 所有命令行交互相关代码
- `src/core/` - 核心业务逻辑
- `src/generators/` - 配置文件生成器
- `src/utils/` - 通用工具函数
- `src/types/` - TypeScript 类型定义

## 添加新功能

### 添加新的项目类型支持

1. 在 `src/types/index.ts` 中添加新的项目类型
2. 在 `src/cli/prompts.ts` 中添加选项
3. 在 `src/generators/oxlint.ts` 中添加配置逻辑
4. 在 `src/utils/dependencies.ts` 中添加依赖

### 添加新的配置生成器

1. 在 `src/generators/` 中创建新文件
2. 导出生成函数
3. 在 `src/core/setup.ts` 中调用

## 测试

在发布前，请在实际项目中测试：

```bash
# 构建
pnpm run build

# 本地链接
npm link

# 在测试项目中测试
cd /path/to/test-project
snail-codelint
```

## 问题反馈

如果发现 bug 或有功能建议，请创建 Issue。
