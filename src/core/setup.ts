import { ProjectType, PackageManager } from '../types/index.js';
import { generatePrettierConfig } from '../generators/prettier.js';
import { generateOxlintConfig } from '../generators/oxlint.js';
import { generateVSCodeConfig } from '../generators/vscode.js';
import { generateLefthookConfig } from '../generators/lefthook.js';
import { installDependencies } from '../utils/dependencies.js';
import { updatePackageScripts } from '../utils/package.js';

export async function setupLint(projectType: ProjectType, packageManager: PackageManager) {
  const cwd = process.cwd();

  // 生成配置文件
  await generatePrettierConfig(cwd, projectType);
  await generateOxlintConfig(cwd, projectType, packageManager);
  await generateVSCodeConfig(cwd, projectType);
  await generateLefthookConfig(cwd, projectType);

  // 安装依赖
  await installDependencies(packageManager, projectType);

  // 更新 package.json scripts
  await updatePackageScripts(cwd, projectType);
}
