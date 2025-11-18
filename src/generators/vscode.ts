import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ProjectType } from '../types/index.js';
import { getVSCodeSettingsTemplate, getVSCodeExtensionsTemplate } from '../utils/template.js';

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
 * 深度合并对象
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * 判断是否为对象
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 比较两个对象是否相等（深度比较）
 */
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    const sorted1 = [...obj1].sort();
    const sorted2 = [...obj2].sort();
    return sorted1.every((val, idx) => deepEqual(val, sorted2[idx]));
  }

  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      if (!(key in obj2)) return false;
      return deepEqual(obj1[key], obj2[key]);
    });
  }

  return obj1 === obj2;
}

/**
 * 生成 settings.json
 */
async function generateSettingsJson(vscodeDir: string, projectType: ProjectType) {
  const settingsPath = path.join(vscodeDir, 'settings.json');
  const newSettings = await getVSCodeSettingsTemplate(projectType);

  // 如果文件已存在，读取并合并
  if (existsSync(settingsPath)) {
    try {
      const existingContent = await readFile(settingsPath, 'utf-8');
      const existingSettings = JSON.parse(existingContent);

      // 合并配置（新配置会覆盖旧配置，但保留旧配置中新增的项）
      const mergedSettings = deepMerge(existingSettings, newSettings);

      // 比较合并后的配置和现有配置是否相同
      if (deepEqual(existingSettings, mergedSettings)) {
        console.log(chalk.gray('ℹ️  .vscode/settings.json 无需更新'));
        return;
      }

      // 有变化，写入合并后的配置
      await writeFile(settingsPath, JSON.stringify(mergedSettings, null, 2), 'utf-8');
      console.log(chalk.green('✅ 已更新 .vscode/settings.json'));
    } catch {
      // 如果读取失败，使用新配置
      console.log(chalk.yellow('⚠️  读取现有 settings.json 失败，将使用新配置'));
      await writeFile(settingsPath, JSON.stringify(newSettings, null, 2), 'utf-8');
      console.log(chalk.green('✅ 已生成 .vscode/settings.json'));
    }
  } else {
    // 文件不存在，直接写入新配置
    await writeFile(settingsPath, JSON.stringify(newSettings, null, 2), 'utf-8');
    console.log(chalk.green('✅ 已生成 .vscode/settings.json'));
  }
}

/**
 * 生成 extensions.json
 */
async function generateExtensionsJson(vscodeDir: string, projectType: ProjectType) {
  const extensionsPath = path.join(vscodeDir, 'extensions.json');
  const newExtensions = await getVSCodeExtensionsTemplate(projectType);

  // 如果文件已存在，读取并合并
  if (existsSync(extensionsPath)) {
    try {
      const existingContent = await readFile(extensionsPath, 'utf-8');
      const existingExtensions = JSON.parse(existingContent);

      // 合并扩展推荐列表，去重
      const existingRecs = existingExtensions.recommendations || [];
      const newRecs = newExtensions.recommendations || [];
      const mergedRecs = [...new Set([...existingRecs, ...newRecs])];

      const mergedExtensions = {
        ...existingExtensions,
        recommendations: mergedRecs,
      };

      // 比较合并后的配置和现有配置是否相同
      if (deepEqual(existingExtensions, mergedExtensions)) {
        console.log(chalk.gray('ℹ️  .vscode/extensions.json 无需更新'));
        return;
      }

      // 有变化，写入合并后的配置
      await writeFile(extensionsPath, JSON.stringify(mergedExtensions, null, 2), 'utf-8');
      console.log(chalk.green('✅ 已更新 .vscode/extensions.json'));
    } catch {
      // 如果读取失败，使用新配置
      console.log(chalk.yellow('⚠️  读取现有 extensions.json 失败，将使用新配置'));
      await writeFile(extensionsPath, JSON.stringify(newExtensions, null, 2), 'utf-8');
      console.log(chalk.green('✅ 已生成 .vscode/extensions.json'));
    }
  } else {
    // 文件不存在，直接写入新配置
    await writeFile(extensionsPath, JSON.stringify(newExtensions, null, 2), 'utf-8');
    console.log(chalk.green('✅ 已生成 .vscode/extensions.json'));
  }
}
