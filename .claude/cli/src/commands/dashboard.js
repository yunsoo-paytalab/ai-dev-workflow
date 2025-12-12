import chalk from "chalk";
import { select, confirm, input } from "@inquirer/prompts";
import readline from "readline";
import { loadProjectData, calculateStats, getAvailableMemoryIds, setMemoryId } from "../utils/parser.js";
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
import {
  WORKFLOWS,
  runWorkflow,
  getBypassPermissions,
  setBypassPermissions,
} from "../utils/claude.js";

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

    const onKeypress = (_, key) => {
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
  try {
    await runDashboardLoop();
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
async function runDashboardLoop() {
  while (true) {
    console.clear();

    // progress.json에서 데이터 로드
    const { features, tasks, memoryId, hasProgress } = loadProjectData();
    const stats = calculateStats(features, tasks);

    // 헤더 및 요약
    printHeader(
      "AI Dev Workflow",
      `${features.length} Features | ${tasks.length} Tasks`
    );
    console.log();

    // Memory 연결 상태 표시
    if (memoryId) {
      console.log(
        `  ${chalk.blue("Memory:")} ${memoryId} ${
          hasProgress ? chalk.green("✓") : chalk.yellow("(empty)")
        }`
      );
    } else {
      console.log(
        `  ${chalk.yellow("Memory:")} 연결 안됨 ${chalk.gray(
          "(/workflow-memory init)"
        )}`
      );
    }

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

    // Bypass Permissions 상태 표시
    const bypassStatus = getBypassPermissions();
    console.log(
      `  ${chalk.gray("Bypass Permissions:")} ${
        bypassStatus ? chalk.yellow("ON ⚠️") : chalk.gray("OFF")
      }`
    );
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
        { name: "🔗 Memory 선택", value: "memory" },
        {
          name: `⚙️  Bypass Permissions: ${
            bypassStatus ? "ON → OFF" : "OFF → ON"
          }`,
          value: "toggle-bypass",
        },
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

      case "memory":
        await showMemoryMenu(memoryId);
        break;

      case "toggle-bypass":
        setBypassPermissions(!bypassStatus);
        continue;

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
    }
  }

  await executeClaudeWorkflow(workflowKey, arg);
  return BACK;
}

/**
 * Memory 선택 메뉴 표시
 */
async function showMemoryMenu(currentMemoryId) {
  console.clear();
  printHeader("Memory 선택");

  const availableIds = getAvailableMemoryIds();

  if (availableIds.length === 0) {
    console.log(chalk.yellow("  사용 가능한 Memory가 없습니다."));
    console.log(chalk.gray("  /workflow-memory init으로 Memory를 생성하세요."));
    console.log();
    await inputWithEsc({ message: "Enter로 돌아가기..." });
    return BACK;
  }

  // 현재 연결 상태 표시
  if (currentMemoryId) {
    console.log(`  ${chalk.blue("현재 연결:")} ${chalk.green(currentMemoryId)}`);
  } else {
    console.log(`  ${chalk.yellow("현재 연결:")} 없음`);
  }
  console.log();
  console.log(chalk.gray("  (Esc: 뒤로가기)"));

  const selectedId = await selectWithEsc({
    message: "Memory 선택:",
    pageSize: 15,
    choices: [
      ...availableIds.map((id) => ({
        name: id === currentMemoryId ? `${id} ${chalk.green("(현재)")}` : id,
        value: id,
      })),
      { name: "← 돌아가기", value: "back" },
    ],
  });

  if (selectedId?._escaped || selectedId === "back") {
    return BACK;
  }

  // 같은 Memory를 선택한 경우
  if (selectedId === currentMemoryId) {
    console.log();
    console.log(chalk.gray("  이미 선택된 Memory입니다."));
    await inputWithEsc({ message: "Enter로 돌아가기..." });
    return BACK;
  }

  // Memory 변경 확인
  const confirmed = await confirmWithEsc({
    message: `"${selectedId}" Memory로 변경하시겠습니까?`,
    default: true,
  });

  if (!confirmed) {
    return BACK;
  }

  // Memory ID 저장
  const success = setMemoryId(selectedId);

  if (success) {
    printSuccess(`Memory가 "${selectedId}"로 변경되었습니다.`);
  } else {
    printError("Memory 변경에 실패했습니다.");
  }

  await inputWithEsc({ message: "Enter로 돌아가기..." });
  return BACK;
}

/**
 * Feature 목록 표시 및 선택
 */
async function showFeatureList(features, tasks) {
  console.clear();
  printHeader("Feature List");

  if (features.length === 0) {
    console.log(chalk.yellow("  등록된 Feature가 없습니다."));
    console.log(chalk.gray("  /workflow-feature-spec으로 Feature를 추가하세요."));
    console.log();
    await inputWithEsc({ message: "Enter로 돌아가기..." });
    return BACK;
  }

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

  if (featureTasks.length === 0) {
    console.log(chalk.yellow("  등록된 Task가 없습니다."));
    console.log();
  } else {
    printTaskTable(featureTasks);
  }
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
    case "implement":
    case "ui":
      await executeClaudeWorkflow(action, feature.id);
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

  if (tasks.length === 0) {
    console.log(chalk.yellow("  등록된 Task가 없습니다."));
    console.log();
  } else {
    printTaskTable(tasks);
  }

  await inputWithEsc({
    message: "Enter로 돌아가기...",
  });
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
