import chalk from 'chalk';

export function printWelcome() {
  console.log(chalk.cyan.bold('\n🐌 欢迎使用 Snail CodeLint\n'));
}

export function printSuccess() {
  console.log(chalk.cyan('\n📝 已生成的文件:'));
  console.log(chalk.gray('  - .prettierrc.json'));
  console.log(chalk.gray('  - .prettierignore'));
  console.log(chalk.gray('  - .vscode/settings.json'));
  console.log(chalk.gray('  - .vscode/extensions.json'));

  console.log(chalk.cyan('\n🚀 可用的命令:'));
  console.log(chalk.gray('  - npm run lint       # 运行代码检查'));
  console.log(chalk.gray('  - npm run format     # 格式化代码'));
  console.log(chalk.gray('  - npm run format:check # 检查代码格式\n'));
}
