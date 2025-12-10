import chalk from "chalk";
import {
  findFeatureListPath,
  parseFeatureList,
  parseTaskList,
  calculateStats,
} from "../utils/parser.js";
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
  const featureListPath = findFeatureListPath();

  if (!featureListPath) {
    printError("feature-list.md 파일을 찾을 수 없습니다.");
    console.log(
      chalk.gray(
        "  .claude/docs/feature-list.md 또는 docs/feature-list.md 경로를 확인하세요."
      )
    );
    console.log();
    return;
  }

  try {
    const features = await parseFeatureList(featureListPath);
    const tasks = await parseTaskList(featureListPath);

    if (features.length === 0 && tasks.length === 0) {
      printError("Feature 또는 Task 정보를 파싱할 수 없습니다.");
      console.log(chalk.gray("  feature-list.md 파일 형식을 확인하세요."));
      return;
    }

    const stats = calculateStats(features, tasks);

    printHeader("AI Dev Workflow", "Project Status");
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
  } catch (error) {
    printError(`파일 읽기 오류: ${error.message}`);
  }
}
