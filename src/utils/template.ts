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
