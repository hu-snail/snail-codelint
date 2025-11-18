import { execa } from 'execa';
import chalk from 'chalk';
import { ProjectType, PackageManager } from '../types/index.js';

export async function generateOxlintConfig(
  cwd: string,
  projectType: ProjectType,
  packageManager: PackageManager = 'pnpm'
) {
  // 纯 TypeScript 项目使用 oxlint --init 生成配置
  if (projectType === 'typescript') {
    console.log(chalk.cyan('📝 使用 oxlint --init 生成 TypeScript 配置...'));
    try {
      // 根据包管理器选择命令
      const dlxCmd = packageManager === 'yarn' ? 'yarn' : packageManager === 'npm' ? 'npx' : 'pnpm';
      const dlxArgs =
        packageManager === 'yarn'
          ? ['dlx', 'oxlint', '--init']
          : packageManager === 'npm'
            ? ['oxlint', '--init']
            : ['dlx', 'oxlint', '--init'];

      await execa(dlxCmd, dlxArgs, {
        cwd,
        stdio: 'inherit',
      });
      console.log(chalk.green('✅ 已生成 .oxlintrc.json'));
    } catch {
      console.log(chalk.red('❌ oxlint --init 执行失败，请手动运行：pnpm dlx oxlint --init'));
    }
  } else {
    // 其他项目类型不生成 oxlint 配置文件
    console.log(chalk.gray('ℹ️  非 TypeScript 项目，跳过 oxlint 配置生成'));
  }
}
