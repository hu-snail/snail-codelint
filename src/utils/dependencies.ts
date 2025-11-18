import { execa } from 'execa';
import chalk from 'chalk';
import { ProjectType, PackageManager } from '../types/index.js';

export async function installDependencies(
  packageManager: PackageManager,
  projectType: ProjectType
) {
  const deps = getDependencies(projectType);

  console.log(chalk.cyan(`\n📦 正在安装依赖: ${deps.join(', ')}`));

  const installCmd = packageManager === 'yarn' ? 'add' : 'install';
  const devFlag = '-D';

  await execa(packageManager, [installCmd, devFlag, ...deps], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

function getDependencies(projectType: ProjectType): string[] {
  const baseDeps = ['oxlint', 'prettier', 'lefthook'];
  const deps = [...baseDeps];

  // TypeScript 项目添加 tsgolint 支持
  // 检查项目类型：vue3-ts, react-ts, typescript
  if (projectType === 'typescript' || projectType.includes('-ts')) {
    deps.push('oxlint-tsgolint@latest');
  }

  if (projectType.includes('vue3')) {
    deps.push('prettier-plugin-vue');
  }

  return deps;
}
