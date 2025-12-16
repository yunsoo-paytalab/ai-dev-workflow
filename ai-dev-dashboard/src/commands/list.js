import chalk from 'chalk';
import { loadProjectData } from '../utils/parser.js';
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
  // progress.json에서 데이터 로드
  const { features, tasks, memoryId, hasProgress } = loadProjectData();

  if (!memoryId) {
    printError('Memory가 연결되지 않았습니다.');
    console.log(chalk.gray('  /workflow-memory init 명령어로 메모리를 생성하세요.'));
    console.log();
    return;
  }

  // 데이터 소스 표시
  const sourceInfo = hasProgress
    ? chalk.green(`(Memory: ${memoryId})`)
    : chalk.yellow(`(Memory: ${memoryId}, empty)`);

  if (options.tasks) {
    // Task 목록만 표시
    printHeader('Task List', `Total: ${tasks.length} tasks ${sourceInfo}`);
    if (tasks.length === 0) {
      console.log(chalk.yellow('  등록된 Task가 없습니다.'));
      console.log();
    } else {
      printTaskTable(tasks, options.feature);
    }
  } else if (options.feature) {
    // 특정 Feature의 Task만 표시
    const feature = features.find(f => f.id === options.feature);
    if (feature) {
      printHeader(`${feature.id}: ${feature.name}`, `Status: ${feature.status} ${sourceInfo}`);
      const featureTasks = tasks.filter(t => t.featureId === feature.id);
      if (featureTasks.length === 0) {
        console.log(chalk.yellow('  등록된 Task가 없습니다.'));
        console.log();
      } else {
        printTaskTable(featureTasks);
      }
    } else {
      printError(`Feature "${options.feature}"를 찾을 수 없습니다.`);
    }
  } else {
    // Feature 목록 표시
    printHeader('Feature List', `${features.length} features, ${tasks.length} tasks ${sourceInfo}`);
    if (features.length === 0) {
      console.log(chalk.yellow('  등록된 Feature가 없습니다.'));
      console.log(chalk.gray('  /workflow-feature-spec으로 Feature를 추가하세요.'));
      console.log();
    } else {
      printFeatureTable(features, tasks);
    }
  }
}
