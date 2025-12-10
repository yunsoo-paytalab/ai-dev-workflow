import chalk from 'chalk';
import {
  findFeatureListPath,
  parseFeatureList,
  parseTaskList,
} from '../utils/parser.js';
import {
  printHeader,
  printFeatureTable,
  printTaskTable,
  printError,
} from '../utils/ui.js';

/**
 * Feature/Task 목록 출력
 */
export async function list(options) {
  const featureListPath = findFeatureListPath();

  if (!featureListPath) {
    printError('feature-list.md 파일을 찾을 수 없습니다.');
    console.log(chalk.gray('  .claude/docs/feature-list.md 또는 docs/feature-list.md 경로를 확인하세요.'));
    console.log();
    return;
  }

  try {
    const features = await parseFeatureList(featureListPath);
    const tasks = await parseTaskList(featureListPath);

    if (options.tasks) {
      // Task 목록만 표시
      printHeader('Task List', `Total: ${tasks.length} tasks`);
      printTaskTable(tasks, options.feature);
    } else if (options.feature) {
      // 특정 Feature의 Task만 표시
      const feature = features.find(f => f.id === options.feature);
      if (feature) {
        printHeader(`${feature.id}: ${feature.name}`, `Status: ${feature.status}`);
        printTaskTable(tasks, options.feature);
      } else {
        printError(`Feature "${options.feature}"를 찾을 수 없습니다.`);
      }
    } else {
      // Feature 목록 표시
      printHeader('Feature List', `Total: ${features.length} features, ${tasks.length} tasks`);
      printFeatureTable(features, tasks);
    }

  } catch (error) {
    printError(`파일 읽기 오류: ${error.message}`);
  }
}
