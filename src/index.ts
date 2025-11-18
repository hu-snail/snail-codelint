import { program } from 'commander';
import { runCLI } from './cli/index.js';

program
  .name('snail-codelint')
  .description('通用代码规范检查和优化工具')
  .version('1.0.0')
  .action(runCLI);

program.parse();
