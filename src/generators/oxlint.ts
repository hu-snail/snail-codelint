import { writeFile } from 'fs/promises';
import { execa } from 'execa';
import path from 'path';
import chalk from 'chalk';
import { ProjectType, PackageManager } from '../types/index.js';
import { getOxlintTemplate } from '../utils/template.js';

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
      console.log(chalk.red('❌ oxlint --init 执行失败，请手动运行: pnpm dlx oxlint --init'));
      // TypeScript 项目不生成 oxlint.json，只使用 .oxlintrc.json
    }
  } else {
    // 其他项目类型使用模板生成 oxlint.json
    const config = await getOxlintTemplate(projectType);
    await writeFile(path.join(cwd, 'oxlint.json'), JSON.stringify(config, null, 2));
  }
}
