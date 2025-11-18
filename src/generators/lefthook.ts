import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ProjectType } from '../types/index.js';

/**
 * 生成 lefthook 配置文件
 */
export async function generateLefthookConfig(cwd: string, projectType: ProjectType) {
  const lefthookPath = path.join(cwd, 'lefthook.yml');

  // 构建 lefthook 配置
  const config = buildLefthookConfig(projectType);

  // 如果文件已存在，检查是否需要更新
  if (existsSync(lefthookPath)) {
    try {
      const existingContent = await readFile(lefthookPath, 'utf-8');
      // 简单的字符串比较，如果内容相同则不更新
      const newContent = configToYaml(config);
      if (existingContent.trim() === newContent.trim()) {
        console.log(chalk.gray('ℹ️  lefthook.yml 无需更新'));
        return;
      }
      // 有变化，写入新配置（注意：这里会覆盖现有配置，用户需要手动合并自定义配置）
      await writeFile(lefthookPath, newContent, 'utf-8');
      console.log(chalk.green('✅ 已更新 lefthook.yml'));
    } catch {
      // 如果读取失败，使用新配置
      console.log(chalk.yellow('⚠️  读取现有 lefthook.yml 失败，将使用新配置'));
      await writeFile(lefthookPath, configToYaml(config), 'utf-8');
      console.log(chalk.green('✅ 已生成 lefthook.yml'));
    }
  } else {
    // 文件不存在，直接写入新配置
    await writeFile(lefthookPath, configToYaml(config), 'utf-8');
    console.log(chalk.green('✅ 已生成 lefthook.yml'));
  }
}

/**
 * 构建 lefthook 配置对象
 */
function buildLefthookConfig(_projectType: ProjectType): any {
  const config: any = {
    pre_commit: {
      parallel: true,
      commands: {
        lint: {
          run: 'npm run lint || pnpm run lint || yarn run lint',
          stage_fixed: true,
        },
        format: {
          run: 'npm run format:check || pnpm run format:check || yarn run format:check',
          stage_fixed: true,
        },
      },
    },
    pre_push: {
      parallel: true,
      commands: {
        lint: {
          run: 'npm run lint || pnpm run lint || yarn run lint',
        },
      },
    },
  };

  return config;
}

/**
 * 将配置对象转换为 YAML 格式
 */
function configToYaml(config: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(config)) {
    // 某些属性需要保持下划线格式（如 stage_fixed），其他转换为连字符
    const keysToKeepUnderscore = ['stage_fixed'];
    const yamlKey = keysToKeepUnderscore.includes(key) ? key : key.replace(/_/g, '-');

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) {
        yaml += `${spaces}${yamlKey}: {}\n`;
      } else {
        yaml += `${spaces}${yamlKey}:\n`;
        yaml += configToYaml(value, indent + 1);
      }
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${yamlKey}:\n`;
      value.forEach((item) => {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n`;
          yaml += configToYaml(item, indent + 2);
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      });
    } else {
      // 处理字符串值
      const stringValue = String(value);
      // 布尔值直接输出
      if (typeof value === 'boolean') {
        yaml += `${spaces}${yamlKey}: ${stringValue}\n`;
      } else if (stringValue.includes('\n')) {
        // 多行字符串使用 | 格式
        yaml += `${spaces}${yamlKey}: |\n`;
        stringValue.split('\n').forEach((line) => {
          yaml += `${spaces}  ${line}\n`;
        });
      } else {
        // 单行字符串，如果包含特殊字符需要引号
        const needsQuotes = stringValue.includes(':') && !stringValue.includes('||');
        yaml += `${spaces}${yamlKey}: ${needsQuotes ? `"${stringValue}"` : stringValue}\n`;
      }
    }
  }

  return yaml;
}
