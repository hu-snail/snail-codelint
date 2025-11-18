import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ProjectType } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 获取模板文件的根目录
 */
function getTemplateRoot(): string {
  // 从 dist/utils/template.js 回到项目根目录的 templates
  return join(__dirname, '../../templates');
}

/**
 * 读取 Prettier 模板配置
 */
export async function getPrettierTemplate(projectType: ProjectType): Promise<any> {
  const templateRoot = getTemplateRoot();
  let templateFile = 'base.json';

  if (projectType.includes('vue3')) {
    templateFile = 'vue3.json';
  } else if (projectType.includes('react')) {
    templateFile = 'react.json';
  }

  const templatePath = join(templateRoot, 'prettier', templateFile);
  const content = await readFile(templatePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 读取 Oxlint 模板配置
 */
export async function getOxlintTemplate(projectType: ProjectType): Promise<any> {
  const templateRoot = getTemplateRoot();
  const templatePath = join(templateRoot, 'oxlint', `${projectType}.json`);
  const content = await readFile(templatePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 读取 VSCode settings 模板配置
 */
export async function getVSCodeSettingsTemplate(projectType: ProjectType): Promise<any> {
  const templateRoot = getTemplateRoot();
  let templateFile = 'settings-base.json';

  if (projectType.includes('vue3')) {
    templateFile = 'settings-vue3.json';
  } else if (projectType.includes('react')) {
    templateFile = 'settings-react.json';
  } else if (projectType.includes('ts')) {
    templateFile = 'settings-typescript.json';
  }

  const templatePath = join(templateRoot, 'vscode', templateFile);
  const content = await readFile(templatePath, 'utf-8');
  const baseConfig = JSON.parse(content);

  // 如果是 vue3-ts 或 react-ts，需要合并 TypeScript 配置
  if (projectType.includes('ts') && (projectType.includes('vue3') || projectType.includes('react'))) {
    const tsTemplatePath = join(templateRoot, 'vscode', 'settings-typescript.json');
    const tsContent = await readFile(tsTemplatePath, 'utf-8');
    const tsConfig = JSON.parse(tsContent);
    // 合并配置，TypeScript 配置会覆盖基础配置
    return { ...baseConfig, ...tsConfig };
  }

  return baseConfig;
}

/**
 * 读取 VSCode extensions 模板配置
 */
export async function getVSCodeExtensionsTemplate(projectType: ProjectType): Promise<any> {
  const templateRoot = getTemplateRoot();
  let templateFile = 'extensions-base.json';

  if (projectType.includes('vue3')) {
    templateFile = 'extensions-vue3.json';
  } else if (projectType.includes('react')) {
    templateFile = 'extensions-react.json';
  } else if (projectType.includes('ts')) {
    templateFile = 'extensions-typescript.json';
  }

  const templatePath = join(templateRoot, 'vscode', templateFile);
  const content = await readFile(templatePath, 'utf-8');
  const baseConfig = JSON.parse(content);

  // 如果是 vue3-ts 或 react-ts，需要合并 TypeScript 扩展
  if (projectType.includes('ts') && (projectType.includes('vue3') || projectType.includes('react'))) {
    const tsTemplatePath = join(templateRoot, 'vscode', 'extensions-typescript.json');
    const tsContent = await readFile(tsTemplatePath, 'utf-8');
    const tsConfig = JSON.parse(tsContent);
    // 合并扩展推荐列表，去重
    const mergedRecommendations = [
      ...new Set([...baseConfig.recommendations, ...tsConfig.recommendations])
    ];
    return {
      recommendations: mergedRecommendations
    };
  }

  return baseConfig;
}
