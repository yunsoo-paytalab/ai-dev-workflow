/**
 * Cross-platform utilities for Claude Memory System
 *
 * Windows와 macOS/Linux 모두 지원
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

// 플랫폼 감지
const IS_WINDOWS = process.platform === "win32";

// 경로 설정
const HOME = process.env.HOME || process.env.USERPROFILE;
const CENTRAL_STORE = path.join(HOME, ".claude-memory");

/**
 * 프로젝트 루트 경로 (현재 작업 디렉토리)
 */
function getProjectRoot() {
  return process.cwd();
}

/**
 * 로컬 메모리 디렉토리 경로
 */
function getLocalMemoryDir() {
  return path.join(getProjectRoot(), ".claude", "docs", "memory");
}

/**
 * .memory-ref 파일 경로
 */
function getMemoryRefFile() {
  return path.join(getLocalMemoryDir(), ".memory-ref");
}

/**
 * 로컬 memory.md 파일 경로
 */
function getLocalMemoryFile() {
  return path.join(getLocalMemoryDir(), "memory.md");
}

/**
 * 디렉토리 생성 (재귀적)
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * JSON 파일 읽기
 */
function readJson(filePath, defaultValue = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return defaultValue;
  }
}

/**
 * JSON 파일 쓰기
 */
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * ISO 타임스탬프 반환
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * 날짜 문자열 반환 (YYYY-MM-DD)
 */
function getDateString() {
  return new Date().toISOString().split("T")[0];
}

/**
 * 시간 문자열 반환 (HH:MM:SS)
 */
function getTimeString() {
  return new Date().toTimeString().split(" ")[0];
}

/**
 * 현재 Git 브랜치 이름
 */
function getCurrentBranch() {
  try {
    return execSync("git branch --show-current", {
      cwd: getProjectRoot(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "main";
  }
}

/**
 * 특정 경로에서 Git 브랜치 이름 가져오기
 */
function getCurrentBranchFromPath(projectPath) {
  if (!projectPath) {
    return getCurrentBranch();
  }
  try {
    const branch = execSync("git branch --show-current", {
      cwd: projectPath,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return branch || "main";
  } catch {
    return "main";
  }
}

/**
 * 짧은 해시 생성
 */
function generateShortHash() {
  return crypto.randomBytes(4).toString("hex");
}

/**
 * 현재 연결된 메모리 ID 가져오기
 */
function getMemoryId() {
  try {
    return fs.readFileSync(getMemoryRefFile(), "utf8").trim();
  } catch {
    return null;
  }
}

/**
 * 특정 프로젝트 경로에서 메모리 ID 가져오기
 */
function getMemoryIdFromPath(projectPath) {
  if (!projectPath) {
    return getMemoryId();
  }
  try {
    const memoryRefPath = path.join(projectPath, ".claude", "docs", "memory", ".memory-ref");
    return fs.readFileSync(memoryRefPath, "utf8").trim();
  } catch {
    return null;
  }
}

/**
 * 메모리 경로 가져오기
 */
function getMemoryPath(memoryId) {
  return path.join(CENTRAL_STORE, "projects", memoryId);
}

/**
 * 크로스 플랫폼 심볼릭 링크 생성
 *
 * Windows에서는:
 * - 개발자 모드가 활성화되어 있으면 심볼릭 링크 사용
 * - 그렇지 않으면 junction (디렉토리) 또는 하드링크 (파일) 시도
 * - 모두 실패하면 파일 복사로 대체
 */
function createSymlink(target, linkPath) {
  // 기존 링크/파일 제거
  if (fs.existsSync(linkPath)) {
    const stats = fs.lstatSync(linkPath);
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(linkPath);
    } else {
      // 일반 파일이면 백업
      fs.renameSync(linkPath, `${linkPath}.backup`);
    }
  }

  if (IS_WINDOWS) {
    try {
      // Windows: 먼저 심볼릭 링크 시도
      fs.symlinkSync(target, linkPath, "file");
    } catch (symlinkError) {
      try {
        // 심볼릭 링크 실패 시 하드링크 시도
        fs.linkSync(target, linkPath);
      } catch (linkError) {
        // 모두 실패 시 파일 복사
        console.log("⚠️  심볼릭 링크 생성 실패, 파일 복사로 대체합니다.");
        console.log(
          "   (Windows 개발자 모드를 활성화하면 심볼릭 링크를 사용할 수 있습니다)"
        );
        fs.copyFileSync(target, linkPath);
        return { type: "copy", target, linkPath };
      }
      return { type: "hardlink", target, linkPath };
    }
    return { type: "symlink", target, linkPath };
  } else {
    // macOS/Linux: 심볼릭 링크 사용
    fs.symlinkSync(target, linkPath);
    return { type: "symlink", target, linkPath };
  }
}

/**
 * 심볼릭 링크 여부 확인 (Windows 호환)
 */
function isSymlinkOrCopy(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const stats = fs.lstatSync(filePath);
  return stats.isSymbolicLink() || stats.nlink > 1; // 심볼릭 링크 또는 하드링크
}

/**
 * 메모리 파일 동기화 (복사 모드일 때)
 * Windows에서 심볼릭 링크가 안 될 때 사용
 */
function syncMemoryFile(memoryId) {
  const memoryPath = getMemoryPath(memoryId);
  const centralMemoryFile = path.join(memoryPath, "memory.md");
  const localMemoryFile = getLocalMemoryFile();

  if (!fs.existsSync(centralMemoryFile)) {
    return false;
  }

  // 로컬 파일이 심볼릭 링크가 아니면 동기화 필요
  if (fs.existsSync(localMemoryFile)) {
    const stats = fs.lstatSync(localMemoryFile);
    if (!stats.isSymbolicLink()) {
      // 복사 모드: 중앙 저장소 → 로컬
      fs.copyFileSync(centralMemoryFile, localMemoryFile);
      return true;
    }
  }

  return false;
}

/**
 * 로컬 메모리를 중앙 저장소로 동기화 (복사 모드일 때)
 */
function syncMemoryToCentral(memoryId) {
  const memoryPath = getMemoryPath(memoryId);
  const centralMemoryFile = path.join(memoryPath, "memory.md");
  const localMemoryFile = getLocalMemoryFile();

  if (!fs.existsSync(localMemoryFile)) {
    return false;
  }

  // 로컬 파일이 심볼릭 링크가 아니면 역동기화 필요
  const stats = fs.lstatSync(localMemoryFile);
  if (!stats.isSymbolicLink()) {
    // 복사 모드: 로컬 → 중앙 저장소
    fs.copyFileSync(localMemoryFile, centralMemoryFile);
    return true;
  }

  return false;
}

/**
 * 폴더 재귀 삭제
 */
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

/**
 * 파일 크기 포맷팅
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = (bytes / 1024).toFixed(1);
  return `${kb}KB`;
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
function formatDate(isoString) {
  if (!isoString) return "-";
  return isoString.split("T")[0];
}

/**
 * 파일 크기 가져오기
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return formatFileSize(stats.size);
  } catch {
    return "-";
  }
}

/**
 * 세션 파일 개수 가져오기
 */
function getSessionCount(memoryId) {
  const sessionsDir = path.join(
    CENTRAL_STORE,
    "projects",
    memoryId,
    "sessions"
  );
  try {
    return fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".md")).length;
  } catch {
    return 0;
  }
}

// 기본 설정
const DEFAULT_CONFIG = {
  version: "1.0",
  retention: {
    maxSessionsPerProject: 50,
    maxSessionAgeDays: 90,
  },
  summarization: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 500,
  },
};

// progress.json 기본 구조 (Feature/Task 정의 + 상태 통합)
const DEFAULT_PROGRESS = {
  version: "1.0",
  lastUpdated: null,
  features: {},
  // Feature 예시:
  // "AUTH-001": {
  //   name: "사용자 인증",
  //   category: "Core",
  //   status: "in_progress",  // pending | in_progress | done | cancelled
  //   createdAt: "...",
  //   updatedAt: "...",
  //   completedAt: null,
  //   note: ""
  // }
  tasks: {},
  // Task 예시:
  // "AUTH-001-001": {
  //   name: "Users 테이블 스키마 설계",
  //   featureId: "AUTH-001",
  //   priority: "high",  // high | medium | low
  //   dependencies: [],  // ["AUTH-001-001", ...]
  //   status: "done",    // pending | in_progress | done | cancelled
  //   createdAt: "...",
  //   updatedAt: "...",
  //   completedAt: "...",
  //   note: ""
  // }
};

/**
 * progress.json 파일 경로
 */
function getProgressFile(memoryId) {
  return path.join(getMemoryPath(memoryId), "progress.json");
}

/**
 * progress.json 읽기
 */
function readProgress(memoryId) {
  const progressFile = getProgressFile(memoryId);
  return readJson(progressFile, { ...DEFAULT_PROGRESS });
}

/**
 * progress.json 쓰기
 */
function writeProgress(memoryId, data) {
  const progressFile = getProgressFile(memoryId);
  data.lastUpdated = getTimestamp();
  writeJson(progressFile, data);
}

/**
 * Feature 추가/수정
 */
function addFeature(memoryId, featureId, featureData) {
  const progress = readProgress(memoryId);
  const now = getTimestamp();

  const existing = progress.features[featureId] || {};

  progress.features[featureId] = {
    name: featureData.name || existing.name || "",
    category: featureData.category || existing.category || "Feature",
    status: featureData.status || existing.status || "pending",
    createdAt: existing.createdAt || now,
    updatedAt: now,
    completedAt: existing.completedAt || null,
    note: featureData.note || existing.note || "",
  };

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * Task 추가/수정
 */
function addTask(memoryId, taskId, taskData) {
  const progress = readProgress(memoryId);
  const now = getTimestamp();

  const existing = progress.tasks[taskId] || {};

  progress.tasks[taskId] = {
    name: taskData.name || existing.name || "",
    featureId: taskData.featureId || existing.featureId || "",
    priority: taskData.priority || existing.priority || "medium",
    dependencies: taskData.dependencies || existing.dependencies || [],
    status: taskData.status || existing.status || "pending",
    createdAt: existing.createdAt || now,
    updatedAt: now,
    completedAt: existing.completedAt || null,
    note: taskData.note || existing.note || "",
  };

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * Task 상태 업데이트
 */
function updateTaskStatus(memoryId, taskId, status, note = null) {
  const progress = readProgress(memoryId);

  if (!progress.tasks[taskId]) {
    progress.tasks[taskId] = {};
  }

  const taskData = {
    ...progress.tasks[taskId],
    status,
    updatedAt: getTimestamp(),
  };

  if (status === "done" || status === "completed") {
    taskData.completedAt = getTimestamp();
  }

  if (note) {
    taskData.note = note;
  }

  progress.tasks[taskId] = taskData;

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * Feature 상태 업데이트
 */
function updateFeatureStatus(memoryId, featureId, status, note = null) {
  const progress = readProgress(memoryId);

  if (!progress.features[featureId]) {
    progress.features[featureId] = {};
  }

  const featureData = {
    ...progress.features[featureId],
    status,
    updatedAt: getTimestamp(),
  };

  if (status === "done" || status === "completed") {
    featureData.completedAt = getTimestamp();
  }

  if (note) {
    featureData.note = note;
  }

  progress.features[featureId] = featureData;

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * Feature 삭제
 */
function removeFeature(memoryId, featureId) {
  const progress = readProgress(memoryId);

  if (progress.features[featureId]) {
    delete progress.features[featureId];

    // 관련 Task도 삭제
    Object.keys(progress.tasks).forEach((taskId) => {
      if (progress.tasks[taskId].featureId === featureId) {
        delete progress.tasks[taskId];
      }
    });

    writeProgress(memoryId, progress);
  }

  return progress;
}

/**
 * Task 삭제
 */
function removeTask(memoryId, taskId) {
  const progress = readProgress(memoryId);

  if (progress.tasks[taskId]) {
    delete progress.tasks[taskId];

    // 다른 Task의 의존성에서도 제거
    Object.keys(progress.tasks).forEach((tid) => {
      const task = progress.tasks[tid];
      if (task.dependencies && task.dependencies.includes(taskId)) {
        task.dependencies = task.dependencies.filter((d) => d !== taskId);
      }
    });

    writeProgress(memoryId, progress);
  }

  return progress;
}

/**
 * Feature 목록 조회 (배열 형태로 반환)
 */
function getFeatures(memoryId) {
  const progress = readProgress(memoryId);

  return Object.entries(progress.features || {}).map(([id, data]) => ({
    id,
    ...data,
  }));
}

/**
 * Task 목록 조회 (배열 형태로 반환)
 */
function getTasks(memoryId) {
  const progress = readProgress(memoryId);

  return Object.entries(progress.tasks || {}).map(([id, data]) => ({
    id,
    ...data,
  }));
}

/**
 * Task 상태 조회
 */
function getTaskStatus(memoryId, taskId) {
  const progress = readProgress(memoryId);
  return progress.tasks[taskId] || null;
}

/**
 * Feature 상태 조회
 */
function getFeatureStatus(memoryId, featureId) {
  const progress = readProgress(memoryId);
  return progress.features[featureId] || null;
}

/**
 * 전체 진행 상태 조회
 */
function getAllProgress(memoryId) {
  return readProgress(memoryId);
}

module.exports = {
  // 상수
  IS_WINDOWS,
  HOME,
  CENTRAL_STORE,
  DEFAULT_CONFIG,
  DEFAULT_PROGRESS,

  // 경로 함수
  getProjectRoot,
  getLocalMemoryDir,
  getMemoryRefFile,
  getLocalMemoryFile,
  getMemoryPath,
  getProgressFile,

  // 파일 시스템 유틸리티
  ensureDir,
  readJson,
  writeJson,
  deleteFolderRecursive,

  // 심볼릭 링크 (크로스 플랫폼)
  createSymlink,
  isSymlinkOrCopy,
  syncMemoryFile,
  syncMemoryToCentral,

  // 메모리 유틸리티
  getMemoryId,
  getMemoryIdFromPath,
  getSessionCount,
  getFileSize,

  // Progress 유틸리티
  readProgress,
  writeProgress,
  addFeature,
  addTask,
  updateTaskStatus,
  updateFeatureStatus,
  removeFeature,
  removeTask,
  getFeatures,
  getTasks,
  getTaskStatus,
  getFeatureStatus,
  getAllProgress,

  // 날짜/시간 유틸리티
  getTimestamp,
  getDateString,
  getTimeString,
  formatDate,
  formatFileSize,

  // Git 유틸리티
  getCurrentBranch,
  getCurrentBranchFromPath,

  // 기타
  generateShortHash,
};
