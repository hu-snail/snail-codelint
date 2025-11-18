import { mkdir } from 'fs/promises';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ProjectType } from '../types/index.js';
import {
  getVSCodeSettingsTemplate,
  getVSCodeExtensionsTemplate,
} from '../utils/template.js';

/**
 * 生成 VSCode 配置文件
 */
export async function generateVSCodeConfig(cwd: string, projectType: ProjectType) {
  const vscodeDir = path.join(cwd, '.vscode');

  // 确保 .vscode 目录存在
  try {
    await mkdir(vscodeDir, { recursive: true });
  } catch {
    // 目录已存在，忽略错误
  }

  // 生成 settings.json
  await generateSettingsJson(vscodeDir, projectType);

  // 生成 extensions.json
  await generateExtensionsJson(vscodeDir, projectType);
}

/**
 * 生成 settings.json
 */
async function generateSettingsJson(vscodeDir: string, projectType: ProjectType) {
  const settings = await getVSCodeSettingsTemplate(projectType);
  const settingsPath = path.join(vscodeDir, 'settings.json');
  await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

/**
 * 生成 extensions.json
 */
async function generateExtensionsJson(vscodeDir: string, projectType: ProjectType) {
  const extensions = await getVSCodeExtensionsTemplate(projectType);
  const extensionsPath = path.join(vscodeDir, 'extensions.json');
  await writeFile(extensionsPath, JSON.stringify(extensions, null, 2), 'utf-8');
}

