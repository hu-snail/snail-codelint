import { writeFile as fsWriteFile } from 'fs/promises';
import path from 'path';

export async function writeFile(cwd: string, filename: string, content: string) {
  const filePath = path.join(cwd, filename);
  await fsWriteFile(filePath, content, 'utf-8');
}

export async function writeJsonFile(cwd: string, filename: string, data: any) {
  const content = JSON.stringify(data, null, 2);
  await writeFile(cwd, filename, content);
}
