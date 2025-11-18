#!/usr/bin/env node

import { execa } from 'execa';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

class DeployScript {
  constructor() {
    this.spinner = null;
    this.packageJson = this.loadPackageJson();
  }

  loadPackageJson() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = join(__dirname, '..', 'package.json');

    try {
      return JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
      console.error(chalk.red('❌ 无法读取 package.json'), error.message);
      process.exit(1);
    }
  }

  async run() {
    console.log(chalk.blue.bold('🚀 Snail CodeLint 发布工具\n'));
    console.log(chalk.gray(`当前版本：${this.packageJson.version}`));
    console.log('');

    try {
      // 检查是否有未提交的修改
      const hasChanges = await this.checkGitStatus();
      if (hasChanges) {
        await this.handleGitChanges();
      }

      // 检查是否已登录 npm
      const isLoggedIn = await this.checkNpmLogin();

      if (!isLoggedIn) {
        await this.npmLogin();
      }

      // 选择发布类型
      const { releaseType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'releaseType',
          message: '选择发布类型：',
          choices: [
            { name: '🔄 补丁版本 (patch) - 修复 bug', value: 'patch' },
            { name: '✨ 次要版本 (minor) - 新增功能', value: 'minor' },
            { name: '🔥 主要版本 (major) - 重大变更', value: 'major' },
            { name: '🧪 Beta 版本 - 测试发布', value: 'beta' },
            { name: '🚫 取消发布', value: 'cancel' },
          ],
        },
      ]);

      if (releaseType === 'cancel') {
        console.log(chalk.yellow('发布已取消'));
        return;
      }

      // 显示发布预览
      await this.showReleasePreview(releaseType);

      // 确认发布
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '确认开始发布流程？',
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow('发布已取消'));
        return;
      }

      // 执行发布流程
      await this.executeRelease(releaseType);
    } catch (error) {
      console.error(chalk.red('❌ 发布失败：'), error.message);
      process.exit(1);
    }
  }

  async checkGitStatus() {
    this.spinner = ora('检查 Git 状态...').start();

    try {
      const { stdout } = await execa('git', ['status', '--porcelain']);
      const hasChanges = stdout.trim().length > 0;

      if (hasChanges) {
        this.spinner.warn('发现未提交的修改');
        console.log(chalk.yellow('\n📋 未提交的修改：'));
        console.log(chalk.gray('────────────────────────'));

        const lines = stdout.split('\n').filter((line) => line.trim());
        lines.forEach((line) => {
          const status = line.substring(0, 2);
          const file = line.substring(3);
          console.log(`• ${this.formatGitStatus(status)} ${file}`);
        });

        console.log(chalk.gray('────────────────────────'));
        return true;
      } else {
        this.spinner.succeed('工作区干净，无未提交修改');
        return false;
      }
    } catch {
      this.spinner.fail('Git 状态检查失败');
      console.warn(chalk.yellow('⚠️  无法检查 Git 状态，继续发布流程...'));
      return false;
    }
  }

  formatGitStatus(status) {
    const statusMap = {
      ' M': '修改',
      'A ': '新增',
      'D ': '删除',
      'R ': '重命名',
      'C ': '复制',
      '??': '未跟踪',
    };
    return statusMap[status] || status;
  }

  async handleGitChanges() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '发现有未提交的修改，请选择操作：',
        choices: [
          { name: '✅ 提交所有修改并继续发布', value: 'commit' },
          { name: '🔍 查看修改详情', value: 'view' },
          { name: '🚫 取消发布', value: 'cancel' },
        ],
      },
    ]);

    if (action === 'cancel') {
      console.log(chalk.yellow('发布已取消'));
      process.exit(0);
    }

    if (action === 'view') {
      await execa('git', ['diff'], { stdio: 'inherit' });

      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: '是否继续提交修改？',
          default: true,
        },
      ]);

      if (!proceed) {
        console.log(chalk.yellow('发布已取消'));
        process.exit(0);
      }

      return this.commitChanges();
    }

    if (action === 'commit') {
      return this.commitChanges();
    }
  }

  async commitChanges() {
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: '输入提交信息：',
        default: 'chore: update before release',
      },
    ]);

    this.spinner = ora('提交修改...').start();

    try {
      await execa('git', ['add', '.']);
      await execa('git', ['commit', '-m', message]);
      this.spinner.succeed('修改已提交');
    } catch (error) {
      this.spinner.fail('提交失败');
      throw error;
    }
  }

  async checkNpmLogin() {
    this.spinner = ora('检查 npm 登录状态...').start();

    try {
      await execa('npm', ['whoami']);
      this.spinner.succeed('npm 已登录');
      return true;
    } catch {
      this.spinner.fail('npm 未登录');
      return false;
    }
  }

  async npmLogin() {
    console.log(chalk.yellow('\n🔐 需要登录 npm 才能发布包'));

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: '是否现在登录 npm?',
        default: true,
      },
    ]);

    if (!proceed) {
      throw new Error('发布需要 npm 登录');
    }

    this.spinner = ora('执行 npm 登录...').start();

    try {
      await execa('npm', ['login'], {
        stdio: 'inherit',
        timeout: 120000, // 2 分钟超时
      });
      this.spinner.succeed('npm 登录成功');
    } catch (error) {
      this.spinner.fail('npm 登录失败');
      throw error;
    }
  }

  async showReleasePreview(releaseType) {
    console.log(chalk.blue.bold('\n📋 发布预览：'));
    console.log(chalk.gray('────────────────────────'));

    if (releaseType === 'beta') {
      console.log('• 发布类型：Beta 版本');
      console.log('• 版本标签：beta');
    } else {
      console.log(`• 发布类型：${releaseType}版本`);
      console.log(`• 当前版本：${this.packageJson.version}`);
    }

    console.log('• 执行步骤：代码检查 → 构建 → 版本更新 → 发布');
    console.log(chalk.gray('────────────────────────\n'));
  }

  async executeRelease(releaseType) {
    const steps = [
      { name: '代码检查', command: ['npm', ['run', 'lint']] },
      { name: '构建项目', command: ['npm', ['run', 'build']] },
    ];

    if (releaseType === 'beta') {
      steps.push({ name: '发布 Beta 版本', command: ['npm', ['publish', '--tag', 'beta']] });
    } else {
      steps.push({
        name: `更新版本 (${releaseType})`,
        command: ['npm', ['version', releaseType]],
      });
      steps.push({ name: '发布到 npm', command: ['npm', ['publish', '--access', 'public']] });
      steps.push({ name: '推送 Git 标签', command: ['git', ['push', '--follow-tags']] });
    }

    for (const step of steps) {
      this.spinner = ora(step.name + '...').start();

      try {
        await execa(...step.command);
        this.spinner.succeed(step.name + '完成');
      } catch (error) {
        this.spinner.fail(step.name + '失败');
        throw error;
      }
    }

    console.log(chalk.green.bold('\n🎉 发布成功！'));

    if (releaseType !== 'beta') {
      // 重新加载 package.json 获取新版本号
      const updatedPackageJson = this.loadPackageJson();
      console.log(chalk.blue(`新版本：${updatedPackageJson.version}`));
    }
  }
}

// 执行发布脚本
new DeployScript().run().catch(console.error);
