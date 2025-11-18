import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ProjectType } from '../types/index.js';

export async function updatePackageScripts(cwd: string, projectType: ProjectType) {
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!existsSync(packageJsonPath)) {
    console.log(chalk.yellow('⚠️  未找到 package.json，跳过脚本更新'));
    return;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

  packageJson.scripts = packageJson.scripts || {};
  
  // TypeScript 项目使用类型感知的 lint
  if (projectType.includes('ts')) {
    packageJson.scripts.lint = 'oxlint --type-aware .';
    packageJson.scripts['lint:basic'] = 'oxlint .';
  } else {
    packageJson.scripts.lint = 'oxlint .';
  }
  
  packageJson.scripts.format = 'prettier --write "**/*.{js,jsx,ts,tsx,vue,json,css,scss,md}"';
  packageJson.scripts['format:check'] =
    'prettier --check "**/*.{js,jsx,ts,tsx,vue,json,css,scss,md}"';

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
