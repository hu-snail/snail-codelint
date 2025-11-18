import { writeFile } from 'fs/promises';
import path from 'path';
import { ProjectType } from '../types/index.js';
import { getPrettierTemplate } from '../utils/template.js';

export async function generatePrettierConfig(cwd: string, projectType: ProjectType) {
  const config = await getPrettierTemplate(projectType);

  await writeFile(path.join(cwd, '.prettierrc.json'), JSON.stringify(config, null, 2));

  await generatePrettierIgnore(cwd);
}

async function generatePrettierIgnore(cwd: string) {
  const ignoreContent = `node_modules
dist
build
coverage
.next
.nuxt
*.min.js
*.min.css
pnpm-lock.yaml
package-lock.json
yarn.lock
`;

  await writeFile(path.join(cwd, '.prettierignore'), ignoreContent);
}
