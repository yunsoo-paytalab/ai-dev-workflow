import chalk from "chalk";
import { select, confirm, input } from "@inquirer/prompts";
import readline from "readline";
import {
  findFeatureListPath,
  parseFeatureList,
  parseTaskList,
  calculateStats,
} from "../utils/parser.js";
import {
  printHeader,
  printFeatureTable,
  printTaskTable,
  printError,
  printSuccess,
  progressBar,
  priorityBadge,
  statusBadge,
} from "../utils/ui.js";
import { WORKFLOWS, runWorkflow } from "../utils/claude.js";

// ESC 키로 뒤로가기 반환값
const BACK = Symbol("back");

/**
 * ESC 키를 지원하는 select 래퍼
 */
async function selectWithEsc(options) {
  return new Promise((resolve, reject) => {
    // ESC 키 감지를 위한 readline 설정
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    let promptPromise;
    let resolved = false;

    const onKeypress = (str, key) => {
      if (key && key.name === "escape") {
        resolved = true;
        process.stdin.removeListener("keypress", onKeypress);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        // 프롬프트 취소
        if (promptPromise && promptPromise.cancel) {
          promptPromise.cancel();
        }
        resolve({ _escaped: true });
      }
    };

    process.stdin.on("keypress", onKeypress);

    // Raw mode 해제 후 프롬프트 실행
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }

    promptPromise = select(options);

    promptPromise
      .then((value) => {
        if (!resolved) {
          process.stdin.removeListener("keypress", onKeypress);
          resolve(value);
        }
      })
      .catch((error) => {
        process.stdin.removeListener("keypress", onKeypress);
        if (error.name === "ExitPromptError") {
          resolve({ _escaped: true });
        } else {
          reject(error);
        }
      });
  });
}

/**
 * ESC 키를 지원하는 confirm 래퍼
 */
async function confirmWithEsc(options) {
  try {
    return await confirm(options);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      return false;
    }
    throw error;
  }
}

/**
 * ESC 키를 지원하는 input 래퍼
 */
async function inputWithEsc(options) {
  try {
    return await input(options);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      return null;
    }
    throw error;
  }
}

/**
 * 대화형 대시보드 실행
 */
export async function dashboard() {
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
    await runDashboardLoop(featureListPath);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log();
      console.log(chalk.gray("👋 종료합니다."));
      console.log();
      return;
    }
    printError(`오류 발생: ${error.message}`);
  }
}

/**
 * 대시보드 메인 루프
 */
async function runDashboardLoop(featureListPath) {
  while (true) {
    console.clear();

    const features = await parseFeatureList(featureListPath);
    const tasks = await parseTaskList(featureListPath);
    const stats = calculateStats(features, tasks);

    // 헤더 및 요약
    printHeader(
      "AI Dev Workflow",
      `${features.length} Features | ${tasks.length} Tasks`
    );
    console.log();
    console.log(
      `  ${chalk.cyan("Progress:")} ${progressBar(
        stats.completedTasks,
        stats.totalTasks,
        20
      )} ${stats.progress}%`
    );
    console.log(
      `  ${chalk.green("Done:")} ${stats.tasksByStatus.done}  ${chalk.yellow(
        "In Progress:"
      )} ${stats.tasksByStatus.in_progress}  ${chalk.gray("Pending:")} ${
        stats.tasksByStatus.pending
      }`
    );

    if (stats.nextTask) {
      console.log();
      console.log(
        `  ${chalk.magenta("Next:")} ${stats.nextTask.id} - ${
          stats.nextTask.name
        }`
      );
    }
    console.log();
    console.log(chalk.gray("  (Esc: 종료)"));

    // 메인 메뉴
    const action = await selectWithEsc({
      message: "무엇을 하시겠습니까?",
      pageSize: 20,
      choices: [
        { name: "📋 Feature 목록 보기", value: "features" },
        { name: "📝 Task 목록 보기", value: "tasks" },
        {
          name: "🚀 다음 Task 작업 시작",
          value: "next",
          disabled: !stats.nextTask,
        },
        { name: "⚡ 워크플로우 실행", value: "workflows" },
        { name: "🔍 특정 Feature 선택", value: "select-feature" },
        { name: "🔄 새로고침", value: "refresh" },
        { name: "❌ 종료", value: "exit" },
      ],
    });

    // ESC 또는 종료 선택
    if (action?._escaped || action === "exit") {
      console.log();
      console.log(chalk.gray("👋 종료합니다."));
      console.log();
      return;
    }

    switch (action) {
      case "features":
        await showFeatureList(features, tasks);
        break;

      case "tasks":
        await showTaskList(tasks);
        break;

      case "next":
        if (stats.nextTask) {
          await handleTaskAction(stats.nextTask, features);
        }
        break;

      case "workflows":
        await showWorkflowMenu(features);
        break;

      case "select-feature":
        await selectFeature(features, tasks);
        break;

      case "refresh":
        continue;
    }
  }
}

/**
 * 워크플로우 메뉴 표시
 */
async function showWorkflowMenu(features) {
  console.clear();
  printHeader("워크플로우 실행");
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  // 카테고리별 분류
  const featureWorkflows = Object.entries(WORKFLOWS)
    .filter(([_, w]) => w.category === "feature")
    .map(([key, w]) => ({
      name: `${w.icon} ${w.name}`,
      value: key,
    }));

  const projectWorkflows = Object.entries(WORKFLOWS)
    .filter(([_, w]) => w.category === "project")
    .map(([key, w]) => ({
      name: `${w.icon} ${w.name}`,
      value: key,
    }));

  const utilityWorkflows = Object.entries(WORKFLOWS)
    .filter(([_, w]) => w.category === "utility")
    .map(([key, w]) => ({
      name: `${w.icon} ${w.name}`,
      value: key,
    }));

  const workflowKey = await selectWithEsc({
    message: "워크플로우 선택:",
    pageSize: 20,
    choices: [
      { name: chalk.dim("── Feature ──"), value: "_sep1", disabled: true },
      ...featureWorkflows,
      { name: chalk.dim("── Project ──"), value: "_sep2", disabled: true },
      ...projectWorkflows,
      { name: chalk.dim("── Utility ──"), value: "_sep3", disabled: true },
      ...utilityWorkflows,
      { name: "← 돌아가기", value: "back" },
    ],
  });

  if (workflowKey?._escaped || workflowKey === "back") {
    return BACK;
  }

  const workflow = WORKFLOWS[workflowKey];
  let arg = "";

  // 인자가 필요한 경우 Feature 선택
  if (workflow.requiresArg) {
    if (workflow.argName === "featureId") {
      const featureId = await selectWithEsc({
        message: "Feature 선택:",
        pageSize: 20,
        choices: [
          ...features.map((f) => ({
            name: `${f.id} - ${f.name}`,
            value: f.id,
          })),
          { name: "← 돌아가기", value: null },
        ],
      });

      if (featureId?._escaped || !featureId) {
        return await showWorkflowMenu(features);
      }
      arg = featureId;
    } else if (workflow.argName === "scope") {
      const scope = await inputWithEsc({
        message: "Scope 입력 (예: header, sidebar):",
      });

      if (!scope) {
        return await showWorkflowMenu(features);
      }
      arg = scope;
    }
  }

  await executeClaudeWorkflow(workflowKey, arg);
  return BACK;
}

/**
 * Feature 목록 표시 및 선택
 */
async function showFeatureList(features, tasks) {
  console.clear();
  printHeader("Feature List");
  printFeatureTable(features, tasks);
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  const action = await selectWithEsc({
    message: "선택:",
    pageSize: 20,
    choices: [
      ...features.map((f) => ({
        name: `${f.id} - ${f.name} (${
          tasks.filter((t) => t.featureId === f.id).length
        } tasks)`,
        value: f.id,
      })),
      { name: "← 돌아가기", value: "back" },
    ],
  });

  if (action?._escaped || action === "back") {
    return BACK;
  }

  const feature = features.find((f) => f.id === action);
  if (feature) {
    return await showFeatureDetail(feature, tasks, features);
  }
  return BACK;
}

/**
 * Feature 상세 및 Task 목록
 */
async function showFeatureDetail(feature, tasks, allFeatures) {
  console.clear();

  const featureTasks = tasks.filter((t) => t.featureId === feature.id);
  const doneTasks = featureTasks.filter((t) =>
    ["done", "completed"].includes(t.status)
  ).length;

  printHeader(`${feature.id}: ${feature.name}`);
  console.log(
    `  Status: ${statusBadge(feature.status)}  Progress: ${progressBar(
      doneTasks,
      featureTasks.length,
      15
    )}`
  );
  console.log();

  printTaskTable(featureTasks);
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  const action = await selectWithEsc({
    message: "작업 선택:",
    pageSize: 10,
    choices: [
      { name: "📋 Feature Spec", value: "feature-spec" },
      { name: "🔨 구현", value: "implement" },
      { name: "🎨 UI", value: "ui" },
      { name: "⚡ 다른 워크플로우", value: "other-workflow" },
      { name: "← 돌아가기", value: "back" },
    ],
  });

  if (action?._escaped || action === "back") {
    return BACK;
  }

  switch (action) {
    case "feature-spec":
      await executeClaudeWorkflow("feature-spec", feature.id);
      break;

    case "implement":
      await executeClaudeWorkflow("implement", feature.id);
      break;

    case "ui":
      await executeClaudeWorkflow("ui", feature.id);
      break;

    case "other-workflow":
      return await showWorkflowMenu(allFeatures);
  }

  return BACK;
}

/**
 * Task 목록 표시
 */
async function showTaskList(tasks) {
  console.clear();
  printHeader("Task List", `Total: ${tasks.length} tasks`);
  printTaskTable(tasks);

  await inputWithEsc({
    message: "Enter로 돌아가기...",
  });
  return BACK;
}

/**
 * Feature 선택
 */
async function selectFeature(features, tasks) {
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  const featureId = await selectWithEsc({
    message: "Feature를 선택하세요:",
    pageSize: 20,
    choices: [
      ...features.map((f) => {
        const featureTasks = tasks.filter((t) => t.featureId === f.id);
        const doneTasks = featureTasks.filter((t) =>
          ["done", "completed"].includes(t.status)
        ).length;
        return {
          name: `${f.id} - ${f.name} [${doneTasks}/${featureTasks.length}]`,
          value: f.id,
        };
      }),
      { name: "← 돌아가기", value: null },
    ],
  });

  if (featureId?._escaped || !featureId) {
    return BACK;
  }

  const feature = features.find((f) => f.id === featureId);
  if (feature) {
    return await showFeatureDetail(feature, tasks, features);
  }
  return BACK;
}

/**
 * Task 액션 처리
 */
async function handleTaskAction(task, features) {
  console.clear();
  printHeader(`Task: ${task.id}`);
  console.log(`  ${task.name}`);
  console.log(
    `  ${statusBadge(task.status)} | ${priorityBadge(
      task.priority
    )} | Feature: ${task.featureId}`
  );
  console.log();
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  const feature = features.find((f) => f.id === task.featureId);

  const action = await selectWithEsc({
    message: "작업 선택:",
    pageSize: 10,
    choices: [
      { name: "📋 Feature Spec", value: "feature-spec" },
      { name: "🔨 구현", value: "implement" },
      { name: "🎨 UI", value: "ui" },
      { name: "← 돌아가기", value: "back" },
    ],
  });

  if (action?._escaped || action === "back") {
    return BACK;
  }

  if (feature) {
    await executeClaudeWorkflow(action, feature.id);
  }
  return BACK;
}

/**
 * Claude 워크플로우 실행
 */
async function executeClaudeWorkflow(workflowKey, arg = "") {
  const workflow = WORKFLOWS[workflowKey];
  if (!workflow) {
    printError(`알 수 없는 워크플로우: ${workflowKey}`);
    return;
  }

  const confirmed = await confirmWithEsc({
    message: `"${workflow.name}" 실행?${arg ? ` (${arg})` : ""}`,
    default: true,
  });

  if (!confirmed) return;

  console.clear();
  printHeader(`Claude: ${workflow.name}`);

  try {
    await runWorkflow(workflowKey, arg);
    printSuccess("완료되었습니다.");
  } catch (error) {
    printError(error.message);
  }

  await inputWithEsc({
    message: "Enter로 돌아가기...",
  });
}
