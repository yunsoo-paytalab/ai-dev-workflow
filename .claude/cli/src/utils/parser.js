import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
} from "fs";
import { join, dirname } from "path";
import { homedir } from "os";

/**
 * 중앙 저장소 경로
 */
const CENTRAL_STORE = join(homedir(), ".claude-aidev-memory");

/**
 * .memory-ref 파일에서 메모리 ID 읽기
 */
export function getMemoryId() {
  const refPath = join(
    process.cwd(),
    ".claude",
    "docs",
    "memory",
    ".memory-ref"
  );
  try {
    return readFileSync(refPath, "utf-8").trim();
  } catch {
    return null;
  }
}

/**
 * progress.json 파일 경로 가져오기
 */
export function getProgressFilePath(memoryId) {
  return join(CENTRAL_STORE, "projects", memoryId, "progress.json");
}

/**
 * progress.json 읽기
 */
export function readProgressJson(memoryId) {
  if (!memoryId) return null;

  const progressPath = getProgressFilePath(memoryId);
  try {
    return JSON.parse(readFileSync(progressPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * progress.json에서 Feature 목록 조회 (배열 형태로 반환)
 */
export function getFeatures(progress) {
  if (!progress || !progress.features) {
    return [];
  }

  return Object.entries(progress.features).map(([id, data]) => ({
    id,
    name: data.name || "",
    category: data.category || "Feature",
    status: data.status || "pending",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    completedAt: data.completedAt || null,
    note: data.note || "",
  }));
}

/**
 * Task ID에서 Feature ID 추출
 * 예: "COMMON-001-001" -> "COMMON-001"
 *     "AUTH-001-002" -> "AUTH-001"
 */
function extractFeatureId(taskId) {
  // Task ID 형식: {DOMAIN}-{NUM}-{TASK_NUM} (예: COMMON-001-001)
  const parts = taskId.split("-");
  if (parts.length >= 3) {
    // 마지막 부분(Task 번호)을 제외한 나머지를 Feature ID로
    return parts.slice(0, -1).join("-");
  }
  return "";
}

/**
 * progress.json에서 Task 목록 조회 (배열 형태로 반환)
 */
export function getTasks(progress) {
  if (!progress || !progress.tasks) {
    return [];
  }

  return Object.entries(progress.tasks).map(([id, data]) => ({
    id,
    name: data.name || "",
    featureId: data.featureId || extractFeatureId(id),
    priority: data.priority || "medium",
    dependencies: data.dependencies || [],
    status: data.status || "pending",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    completedAt: data.completedAt || null,
    note: data.note || "",
  }));
}

/**
 * Feature/Task 데이터 로드 (progress.json에서만)
 */
export function loadProjectData() {
  const memoryId = getMemoryId();
  const progress = readProgressJson(memoryId);

  const features = getFeatures(progress);
  const tasks = getTasks(progress);

  // Feature별 Task 개수 계산
  const featuresWithTaskCount = features.map((feature) => ({
    ...feature,
    taskCount: tasks.filter((t) => t.featureId === feature.id).length,
  }));

  // setup.workflows 데이터 추출
  const workflows = progress?.setup?.workflows || {};

  return {
    features: featuresWithTaskCount,
    tasks,
    workflows,
    memoryId,
    hasProgress: !!progress,
  };
}

/**
 * 통계 계산
 */
export function calculateStats(features, tasks) {
  const totalFeatures = features.length;
  const totalTasks = tasks.length;

  const tasksByStatus = {
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => ["done", "completed"].includes(t.status)).length,
  };

  const tasksByPriority = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  const completedTasks = tasksByStatus.done;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 다음 작업 추천 (의존성 충족된 pending task 중 high 우선순위)
  const readyTasks = tasks.filter((task) => {
    if (task.status !== "pending") return false;

    // 의존성이 없거나 모두 완료되었는지 확인
    if (!task.dependencies || task.dependencies.length === 0) return true;

    return task.dependencies.every((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask && ["done", "completed"].includes(depTask.status);
    });
  });

  const nextTask =
    readyTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (
        (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
      );
    })[0] || null;

  return {
    totalFeatures,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    completedTasks,
    progress: progressPercent,
    nextTask,
    readyTasks,
  };
}

/**
 * 사용 가능한 Memory ID 목록 조회
 * ~/.claude-aidev-memory/projects/ 하위 디렉토리 목록 반환
 */
export function getAvailableMemoryIds() {
  const projectsPath = join(CENTRAL_STORE, "projects");

  try {
    if (!existsSync(projectsPath)) {
      return [];
    }

    const entries = readdirSync(projectsPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Memory ID 설정 (.memory-ref 파일에 저장)
 */
export function setMemoryId(memoryId) {
  const refPath = join(
    process.cwd(),
    ".claude",
    "docs",
    "memory",
    ".memory-ref"
  );
  const refDir = dirname(refPath);

  try {
    // 디렉토리가 없으면 생성
    if (!existsSync(refDir)) {
      mkdirSync(refDir, { recursive: true });
    }

    writeFileSync(refPath, memoryId, "utf-8");
    return true;
  } catch {
    return false;
  }
}
