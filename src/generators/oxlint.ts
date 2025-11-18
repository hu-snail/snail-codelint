import { writeFile } from 'fs/promises';
import path from 'path';
import { ProjectType } from '../types/index.js';
import { getOxlintTemplate } from '../utils/template.js';

export async function generateOxlintConfig(cwd: string, projectType: ProjectType) {
  const config = await getOxlintTemplate(projectType);

  await writeFile(path.join(cwd, 'oxlint.json'), JSON.stringify(config, null, 2));
}
