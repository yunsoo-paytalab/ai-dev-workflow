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
const CENTRAL_STORE = path.join(HOME, ".claude-aidev-memory");

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
    const memoryRefPath = path.join(
      projectPath,
      ".claude",
      "docs",
      "memory",
      ".memory-ref"
    );
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

// ============================================================
// 설정 관리 (config.json 기반)
// ============================================================

/**
 * 기본 설정값 (config.json이 없을 때 사용)
 * 단일 소스: .claude/hooks/lib/config.defaults.json
 */
const CONFIG_DEFAULTS = require("./config.defaults.json");

/**
 * config.json 파일 경로
 */
function getConfigFile() {
  return path.join(CENTRAL_STORE, "config.json");
}

/**
 * 깊은 병합 유틸리티
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * 전역 설정 읽기 (config.json)
 * - 파일이 없으면 기본값으로 생성
 * - 누락된 필드는 기본값으로 채움
 */
function getConfig() {
  const configPath = getConfigFile();

  // 디렉토리 확인
  ensureDir(CENTRAL_STORE);

  let config = {};
  if (fs.existsSync(configPath)) {
    config = readJson(configPath, {});
  }

  // 기본값과 병합 (깊은 병합)
  const merged = deepMerge(CONFIG_DEFAULTS, config);

  // 병합된 설정 저장 (누락된 필드 추가)
  if (JSON.stringify(config) !== JSON.stringify(merged)) {
    writeJson(configPath, merged);
  }

  return merged;
}

/**
 * 전역 설정 업데이트
 */
function updateConfig(updates) {
  const config = getConfig();
  const updated = deepMerge(config, updates);
  writeJson(getConfigFile(), updated);
  return updated;
}

/**
 * progress.json 기본값 가져오기
 */
function getDefaultProgress() {
  const config = getConfig();
  return {
    version: config.version,
    lastUpdated: null,
    ...config.defaultProgress,
  };
}

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
  return readJson(progressFile, getDefaultProgress());
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

// ============================================================
// v2.0 확장 함수들
// ============================================================

/**
 * 워크플로우 완료 상태 업데이트
 */
function completeWorkflow(memoryId, workflowName) {
  const progress = readProgress(memoryId);

  if (!progress.setup) {
    progress.setup = { workflows: {}, custom: [] };
  }
  if (!progress.setup.workflows) {
    progress.setup.workflows = {};
  }

  progress.setup.workflows[workflowName] = {
    done: true,
    completedAt: getDateString(),
  };

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * 현재 진행 중인 워크플로우 설정
 */
function setCurrentWorkflow(memoryId, workflowName) {
  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath, {});

  meta.currentWorkflow = workflowName;
  meta.workflowStartedAt = getTimestamp();

  writeJson(metaPath, meta);
  return meta;
}

/**
 * 현재 워크플로우 가져오기
 */
function getCurrentWorkflow(memoryId) {
  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath, {});

  return meta.currentWorkflow || null;
}

/**
 * 현재 워크플로우 완료 처리
 */
function finishCurrentWorkflow(memoryId) {
  const currentWorkflow = getCurrentWorkflow(memoryId);

  if (!currentWorkflow) {
    return null;
  }

  // 워크플로우 완료 표시
  completeWorkflow(memoryId, currentWorkflow);

  // meta에서 currentWorkflow 제거
  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath, {});

  const finishedWorkflow = meta.currentWorkflow;
  delete meta.currentWorkflow;
  delete meta.workflowStartedAt;

  writeJson(metaPath, meta);

  return finishedWorkflow;
}

/**
 * 커스텀 설정 항목 추가
 */
function addCustomSetupItem(memoryId, id, label) {
  const progress = readProgress(memoryId);

  if (!progress.setup) {
    progress.setup = { workflows: {}, custom: [] };
  }
  if (!progress.setup.custom) {
    progress.setup.custom = [];
  }

  // 중복 체크
  const exists = progress.setup.custom.find((item) => item.id === id);
  if (!exists) {
    progress.setup.custom.push({ id, label, done: false });
    writeProgress(memoryId, progress);
  }

  return progress;
}

/**
 * 커스텀 설정 항목 완료 처리
 */
function completeCustomSetupItem(memoryId, id) {
  const progress = readProgress(memoryId);

  if (!progress.setup?.custom) {
    return progress;
  }

  const item = progress.setup.custom.find((item) => item.id === id);
  if (item) {
    item.done = true;
    item.completedAt = getDateString();
    writeProgress(memoryId, progress);
  }

  return progress;
}

/**
 * 도메인 초기화/업데이트
 */
function initDomain(memoryId, domainCode, domainData) {
  const progress = readProgress(memoryId);

  if (!progress.domains) {
    progress.domains = {};
  }

  progress.domains[domainCode] = {
    name: domainData.name || domainCode,
    status: "not_started",
    totalFeatures: domainData.totalFeatures || 0,
    completedFeatures: 0,
    ...progress.domains[domainCode],
  };

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * Phase 초기화/업데이트
 */
function initPhase(memoryId, phaseId, phaseData) {
  const progress = readProgress(memoryId);

  if (!progress.phases) {
    progress.phases = {};
  }

  progress.phases[phaseId] = {
    name: phaseData.name || phaseId,
    status: "not_started",
    totalPoints: phaseData.totalPoints || 0,
    completedPoints: 0,
    features: phaseData.features || [],
    ...progress.phases[phaseId],
  };

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * 도메인/Phase 상태 재계산
 */
function recalculateProgress(memoryId) {
  const progress = readProgress(memoryId);

  // 도메인별 완료 Feature 수 계산
  if (progress.domains && progress.features) {
    Object.keys(progress.domains).forEach((domainCode) => {
      const domainFeatures = Object.entries(progress.features).filter(([id]) =>
        id.startsWith(domainCode + "-")
      );

      const completed = domainFeatures.filter(
        ([, f]) => f.status === "done"
      ).length;
      const total = domainFeatures.length;

      progress.domains[domainCode].totalFeatures = total;
      progress.domains[domainCode].completedFeatures = completed;
      progress.domains[domainCode].status =
        completed === 0
          ? "not_started"
          : completed === total
          ? "completed"
          : "in_progress";
    });
  }

  // Phase별 완료 포인트 계산
  if (progress.phases && progress.features) {
    Object.keys(progress.phases).forEach((phaseId) => {
      const phase = progress.phases[phaseId];
      const phaseFeatures = (phase.features || [])
        .map((fId) => progress.features[fId])
        .filter(Boolean);

      const completedPoints = phaseFeatures
        .filter((f) => f.status === "done")
        .reduce((sum, f) => sum + (f.points || 0), 0);

      phase.completedPoints = completedPoints;
      phase.status =
        completedPoints === 0
          ? "not_started"
          : completedPoints >= phase.totalPoints
          ? "completed"
          : "in_progress";
    });
  }

  writeProgress(memoryId, progress);
  return progress;
}

/**
 * memory.md 체크리스트 섹션 생성
 */
function generateProgressMarkdown(memoryId) {
  const progress = readProgress(memoryId);
  let md = "";

  // 워크플로우 섹션
  md += "### 워크플로우\n";
  const workflowLabels = {
    "legacy-profile": "레거시 프로파일링",
    "domain-definition": "도메인 정의",
    "task-point": "Task Point 산정",
  };

  if (progress.setup?.workflows) {
    Object.entries(progress.setup.workflows).forEach(([key, value]) => {
      const label = workflowLabels[key] || key;
      const check = value.done ? "x" : " ";
      const date = value.completedAt ? ` (${value.completedAt})` : "";
      md += `- [${check}] ${label}${date}\n`;
    });
  }

  // 프로젝트 설정 섹션
  if (progress.setup?.custom?.length > 0) {
    md += "\n### 프로젝트 설정\n";
    progress.setup.custom.forEach((item) => {
      const check = item.done ? "x" : " ";
      const date = item.completedAt ? ` (${item.completedAt})` : "";
      md += `- [${check}] ${item.label}${date}\n`;
    });
  }

  // Phase별 진행 섹션
  if (progress.phases && Object.keys(progress.phases).length > 0) {
    md += "\n### Phase별 진행\n";
    Object.entries(progress.phases).forEach(([, phase]) => {
      const check = phase.status === "completed" ? "x" : " ";
      md += `- [${check}] ${phase.name} (${phase.completedPoints}/${phase.totalPoints} pt)\n`;
    });
  }

  // 도메인별 진행 섹션
  if (progress.domains && Object.keys(progress.domains).length > 0) {
    md += "\n### 도메인별 진행\n";
    Object.entries(progress.domains).forEach(([code, domain]) => {
      const check = domain.status === "completed" ? "x" : " ";
      md += `- [${check}] ${code} (${domain.completedFeatures}/${domain.totalFeatures} features)\n`;
    });
  }

  return md;
}

/**
 * memory.md의 진행 상황 섹션 업데이트
 */
function syncProgressToMemory(memoryId) {
  const memoryPath = getMemoryPath(memoryId);
  const memoryFile = path.join(memoryPath, "memory.md");

  if (!fs.existsSync(memoryFile)) {
    return false;
  }

  let content = fs.readFileSync(memoryFile, "utf-8");
  const progressMd = generateProgressMarkdown(memoryId);

  // "## 진행 상황" 섹션 찾기 및 교체
  const sectionRegex = /## 진행 상황[\s\S]*?(?=\n## |$)/;
  const newSection = `## 진행 상황\n\n${progressMd}\n`;

  if (sectionRegex.test(content)) {
    content = content.replace(sectionRegex, newSection);
  } else {
    // 섹션이 없으면 파일 끝에 추가
    content += `\n${newSection}`;
  }

  fs.writeFileSync(memoryFile, content);
  return true;
}

/**
 * feature-list.md 파싱하여 progress.json 업데이트
 */
function parseFeatureListToProgress(memoryId, projectPath) {
  const featureListPath = path.join(
    projectPath,
    ".claude",
    "docs",
    "feature-list.md"
  );

  if (!fs.existsSync(featureListPath)) {
    return { success: false, error: "feature-list.md not found" };
  }

  const content = fs.readFileSync(featureListPath, "utf-8");
  const progress = readProgress(memoryId);

  // 기존 features/tasks 초기화
  progress.features = progress.features || {};
  progress.tasks = progress.tasks || {};
  progress.domains = progress.domains || {};

  // Feature 테이블 파싱 (| ID | Feature명 | 설명 | Tasks | 우선순위 |)
  const featureRegex =
    /\|\s*([A-Z]+-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|/g;
  let match;
  let featureCount = 0;
  let taskCount = 0;

  while ((match = featureRegex.exec(content)) !== null) {
    const [, featureId, featureName, description, tasksNum, priority] = match;

    // 헤더 행 스킵
    if (featureId === "ID" || featureName.includes("---")) continue;

    const domainCode = featureId.split("-")[0];

    // Feature 추가
    progress.features[featureId] = {
      name: featureName.trim(),
      description: description.trim(),
      status: "not_started",
      priority: priority.trim().toLowerCase(),
      tasksCount: parseInt(tasksNum, 10),
      completedTasks: 0,
    };
    featureCount++;

    // 도메인 초기화
    if (!progress.domains[domainCode]) {
      progress.domains[domainCode] = {
        name: domainCode,
        status: "not_started",
        totalFeatures: 0,
        completedFeatures: 0,
      };
    }
    progress.domains[domainCode].totalFeatures++;
  }

  // 개별 Feature 상세 파일에서 Task 파싱
  const featureListDir = path.join(
    projectPath,
    ".claude",
    "docs",
    "feature-list"
  );
  if (fs.existsSync(featureListDir)) {
    const files = fs
      .readdirSync(featureListDir)
      .filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(featureListDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Task 테이블 파싱 (| Task ID | Task명 | 설명 | 우선순위 | 의존성 |)
      const taskRegex =
        /\|\s*([A-Z]+-\d+-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\w+)\s*\|\s*([^|]*)\s*\|/g;
      let taskMatch;

      while ((taskMatch = taskRegex.exec(fileContent)) !== null) {
        const [, taskId, taskName, taskDesc, taskPriority] = taskMatch;

        // 헤더 행 스킵
        if (taskId === "Task ID" || taskName.includes("---")) continue;

        const featureId = taskId.split("-").slice(0, 2).join("-");

        progress.tasks[taskId] = {
          name: taskName.trim(),
          description: taskDesc.trim(),
          featureId: featureId,
          status: "not_started",
          priority: taskPriority.trim().toLowerCase(),
          points: null, // task-point 워크플로우에서 설정됨
        };
        taskCount++;
      }
    }
  }

  progress.lastUpdated = getTimestamp();
  writeProgress(memoryId, progress);

  return {
    success: true,
    features: featureCount,
    tasks: taskCount,
    domains: Object.keys(progress.domains).length,
  };
}

/**
 * domain-definition.md 파싱하여 progress.json 업데이트
 */
function parseDomainDefinitionToProgress(memoryId, projectPath) {
  const domainDefPath = path.join(
    projectPath,
    ".claude",
    "docs",
    "domain-definition.md"
  );

  if (!fs.existsSync(domainDefPath)) {
    return { success: false, error: "domain-definition.md not found" };
  }

  const content = fs.readFileSync(domainDefPath, "utf-8");
  const progress = readProgress(memoryId);

  progress.domains = progress.domains || {};

  // Bounded Context 섹션 파싱
  // ### 1. 테스트 환경 관리 (Test Environment Management) - Core Domain
  const contextRegex =
    /###\s*\d+\.\s*([^(]+)\s*\(([^)]+)\)\s*-?\s*(Core Domain|Supporting Domain|Generic Domain)?/g;
  let match;
  let domainCount = 0;

  while ((match = contextRegex.exec(content)) !== null) {
    const [, koreanName, englishName, domainType] = match;

    // 도메인 코드 추출 (예: Test Environment Management → TEST-ENV)
    const code = englishName
      .trim()
      .split(" ")
      .map((w) => w.toUpperCase().slice(0, w.length > 3 ? 4 : w.length))
      .slice(0, 2)
      .join("-");

    if (!progress.domains[code]) {
      progress.domains[code] = {
        name: koreanName.trim(),
        englishName: englishName.trim(),
        type: domainType ? domainType.trim() : "Core Domain",
        status: "not_started",
        totalFeatures: 0,
        completedFeatures: 0,
      };
      domainCount++;
    } else {
      // 기존 도메인 정보 업데이트
      progress.domains[code].name = koreanName.trim();
      progress.domains[code].englishName = englishName.trim();
      progress.domains[code].type = domainType
        ? domainType.trim()
        : "Core Domain";
    }
  }

  progress.lastUpdated = getTimestamp();
  writeProgress(memoryId, progress);

  return {
    success: true,
    domains: domainCount,
  };
}

module.exports = {
  // 상수
  IS_WINDOWS,
  HOME,
  CENTRAL_STORE,

  // 설정 관리
  getConfig,
  getConfigFile,
  updateConfig,
  getDefaultProgress,

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

  // Progress v2.0 확장 유틸리티
  completeWorkflow,
  setCurrentWorkflow,
  getCurrentWorkflow,
  finishCurrentWorkflow,
  addCustomSetupItem,
  completeCustomSetupItem,
  initDomain,
  initPhase,
  recalculateProgress,
  generateProgressMarkdown,
  syncProgressToMemory,
  parseFeatureListToProgress,
  parseDomainDefinitionToProgress,

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
