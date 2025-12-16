#!/usr/bin/env node

import { Command } from 'commander';
import { dashboard } from './commands/dashboard.js';
import { status } from './commands/status.js';
import { list } from './commands/list.js';

const program = new Command();

program
  .name('aidev')
  .description('AI Development Workflow Dashboard')
  .version('0.1.0');

program
  .command('dashboard')
  .alias('d')
  .description('대화형 대시보드 실행')
  .action(dashboard);

program
  .command('status')
  .alias('s')
  .description('현재 진행 상황 요약')
  .action(status);

program
  .command('list')
  .alias('l')
  .description('Feature/Task 목록 출력')
  .option('-f, --feature <id>', '특정 Feature만 표시')
  .option('-t, --tasks', 'Task 목록만 표시')
  .action(list);

// 기본 명령어: 인자 없으면 대시보드 실행
program
  .action(() => {
    dashboard();
  });

program.parse();
