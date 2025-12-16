import chalk from "chalk";
import { loadProjectData, calculateStats } from "../utils/parser.js";
import {
  printHeader,
  printDashboardSummary,
  printNextTask,
  printError,
  printDivider,
} from "../utils/ui.js";

/**
 * 현재 진행 상황 요약 출력
 */
export async function status() {
  // progress.json에서 데이터 로드
  const { features, tasks, memoryId, hasProgress } = loadProjectData();

  if (!memoryId) {
    printError("Memory가 연결되지 않았습니다.");
    console.log(
      chalk.gray("  /workflow-memory init 명령어로 메모리를 생성하세요.")
    );
    console.log();
    return;
  }

  const stats = calculateStats(features, tasks);

  // Memory 연결 상태 표시
  const memoryStatus = hasProgress
    ? chalk.green(`Memory: ${memoryId}`)
    : chalk.yellow(`Memory: ${memoryId} (empty)`);

  printHeader("AI Dev Workflow", `Project Status | ${memoryStatus}`);

  if (features.length === 0 && tasks.length === 0) {
    console.log(chalk.yellow("  등록된 Feature/Task가 없습니다."));
    console.log(
      chalk.gray("  /workflow-feature-spec으로 Feature를 추가하세요.")
    );
    console.log();
    return;
  }

  printDashboardSummary(stats);
  printDivider();
  printNextTask(stats.nextTask, tasks);

  // 실행 가능한 Task 목록
  if (stats.readyTasks.length > 1) {
    console.log(chalk.bold("📋 Ready Tasks (의존성 충족):"));
    for (const task of stats.readyTasks.slice(0, 5)) {
      console.log(`  ${chalk.cyan(task.id)} - ${task.name}`);
    }
    if (stats.readyTasks.length > 5) {
      console.log(chalk.gray(`  ... 외 ${stats.readyTasks.length - 5}개`));
    }
    console.log();
  }
}
