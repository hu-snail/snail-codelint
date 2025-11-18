import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { setupLint } from '../core/setup.js';
import { getProjectTypeChoices } from './prompts.js';
import { printWelcome, printSuccess } from './output.js';

export async function runCLI() {
  printWelcome();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目类型:',
      choices: getProjectTypeChoices(),
    },
    {
      type: 'list',
      name: 'packageManager',
      message: '请选择包管理器:',
      choices: ['pnpm', 'npm', 'yarn'],
      default: 'pnpm',
    },
  ]);

  const spinner = ora('正在配置代码规范...').start();

  try {
    await setupLint(answers.projectType, answers.packageManager);
    spinner.succeed(chalk.green('✨ 配置完成！'));
    printSuccess();
  } catch (error) {
    spinner.fail(chalk.red('配置失败'));
    console.error(error);
    process.exit(1);
  }
}
