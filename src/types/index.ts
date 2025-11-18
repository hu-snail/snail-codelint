export type ProjectType =
  | 'vue3-ts'
  | 'vue3-js'
  | 'react-ts'
  | 'react-js'
  | 'typescript'
  | 'javascript';

export type PackageManager = 'pnpm' | 'npm' | 'yarn';

export interface SetupOptions {
  projectType: ProjectType;
  packageManager: PackageManager;
}

export interface PrettierConfig {
  semi: boolean;
  singleQuote: boolean;
  tabWidth: number;
  trailingComma: string;
  printWidth: number;
  arrowParens: string;
  endOfLine: string;
}

export interface OxlintConfig {
  rules: Record<string, any>;
  env: Record<string, boolean>;
  plugins?: string[];
}
