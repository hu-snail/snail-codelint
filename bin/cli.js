#!/usr/bin/env node

/**
 * Snail CodeLint CLI 入口文件
 *
 * 这个文件是 CLI 工具的启动入口，负责：
 * 1. 加载编译后的主程序
 * 2. 处理启动错误
 * 3. 确保正确的 Node.js 版本
 */

// 检查 Node.js 版本
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

if (majorVersion < 16) {
  console.error('❌ 错误: Snail CodeLint 需要 Node.js 16.0.0 或更高版本');
  console.error(`   当前版本: ${nodeVersion}`);
  console.error('   请升级 Node.js: https://nodejs.org/');
  process.exit(1);
}

// 动态导入主程序
import('../dist/index.js').catch((err) => {
  console.error('❌ 启动失败:', err.message);

  if (err.code === 'MODULE_NOT_FOUND') {
    console.error('\n💡 提示: 请确保已经构建项目');
    console.error('   运行: npm run build');
  }

  if (process.env.DEBUG) {
    console.error('\n调试信息:');
    console.error(err);
  }

  process.exit(1);
});
