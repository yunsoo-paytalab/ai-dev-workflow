#!/usr/bin/env node

/**
 * Claude Memory Sync Hook
 *
 * 사용법:
 *   node memory-sync.js start    # 세션 시작 시
 *   node memory-sync.js end      # 세션 종료 시
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const {
  CENTRAL_STORE,
  DEFAULT_CONFIG,
  ensureDir,
  readJson,
  writeJson,
  getMemoryId,
  getMemoryPath,
  getLocalMemoryDir,
  getLocalMemoryFile,
  getTimestamp,
  getDateString,
  getCurrentBranch,
  generateShortHash,
  createSymlink,
  syncMemoryToCentral,
} = require("./lib/utils");

// 중앙 저장소 초기화
function initCentralStore() {
  ensureDir(CENTRAL_STORE);
  ensureDir(path.join(CENTRAL_STORE, "projects"));

  const configPath = path.join(CENTRAL_STORE, "config.json");
  if (!fs.existsSync(configPath)) {
    writeJson(configPath, DEFAULT_CONFIG);
  }

  const indexPath = path.join(CENTRAL_STORE, "index.json");
  if (!fs.existsSync(indexPath)) {
    writeJson(indexPath, { projects: {} });
  }
}

// 세션 시작 처리
function handleSessionStart() {
  initCentralStore();

  const memoryId = getMemoryId();

  if (!memoryId) {
    console.log("⚠️  메모리가 연결되지 않았습니다.");
    console.log("   `/workflow-memory init [id]` 명령어로 메모리를 생성하세요.");
    return;
  }

  const memoryPath = getMemoryPath(memoryId);
  const memoryFile = path.join(memoryPath, "memory.md");

  if (!fs.existsSync(memoryFile)) {
    console.log(`⚠️  메모리 '${memoryId}'를 찾을 수 없습니다.`);
    console.log("   `/workflow-memory init` 명령어로 다시 생성하세요.");
    return;
  }

  // 심볼릭 링크 확인/생성
  const localMemoryDir = getLocalMemoryDir();
  const localMemoryFile = getLocalMemoryFile();

  ensureDir(localMemoryDir);

  if (!fs.existsSync(localMemoryFile)) {
    createSymlink(memoryFile, localMemoryFile);
  } else {
    const stats = fs.lstatSync(localMemoryFile);
    if (!stats.isSymbolicLink()) {
      // 기존 파일 백업 후 심볼릭 링크 생성
      createSymlink(memoryFile, localMemoryFile);
    }
  }

  // index.json 업데이트 (lastAccess)
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });
  if (index.projects[memoryId]) {
    index.projects[memoryId].lastAccess = getTimestamp();
    writeJson(indexPath, index);
  }

  // meta.json 업데이트
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);
  meta.lastAccess = getTimestamp();
  writeJson(metaPath, meta);

  // 최근 세션 정보 출력
  const sessionsDir = path.join(memoryPath, "sessions");
  let recentSessions = [];
  if (fs.existsSync(sessionsDir)) {
    recentSessions = fs
      .readdirSync(sessionsDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .slice(0, 3);
  }

  console.log(`✓ 메모리 '${memoryId}' 로드됨`);
  if (recentSessions.length > 0) {
    console.log(`  최근 세션: ${recentSessions[0].replace(".md", "")}`);
  }
}

// 세션 종료 처리
function handleSessionEnd() {
  const memoryId = getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  // 복사 모드일 경우 로컬 → 중앙 저장소 동기화
  syncMemoryToCentral(memoryId);

  const memoryPath = getMemoryPath(memoryId);
  const sessionsDir = path.join(memoryPath, "sessions");
  ensureDir(sessionsDir);

  // 세션 파일 생성
  const branch = getCurrentBranch();
  const dateStr = getDateString();
  const hash = generateShortHash();
  const sessionFileName = `${dateStr}_${branch}_${hash}.md`;
  const sessionFilePath = path.join(sessionsDir, sessionFileName);

  // 세션 내용 생성 (기본 템플릿)
  const sessionContent = `# 세션: ${dateStr} ${branch}

## 시작 시간
${getTimestamp()}

## 작업 요약
- (세션 종료 시 자동 생성 예정)

## 변경 파일
- (추적된 파일 목록)

## 메모
-
`;

  fs.writeFileSync(sessionFilePath, sessionContent);

  // meta.json 업데이트
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);
  meta.lastAccess = getTimestamp();
  meta.totalSessions = (meta.totalSessions || 0) + 1;
  writeJson(metaPath, meta);

  // 정리 규칙 적용
  applyCleanupRules(memoryId);

  console.log(`✓ 세션 저장됨: ${sessionFileName}`);
}

// 정리 규칙 적용
function applyCleanupRules(memoryId) {
  const configPath = path.join(CENTRAL_STORE, "config.json");
  const config = readJson(configPath, DEFAULT_CONFIG);
  const { maxSessionsPerProject, maxSessionAgeDays } = config.retention;

  const sessionsDir = path.join(getMemoryPath(memoryId), "sessions");
  if (!fs.existsSync(sessionsDir)) return;

  let sessions = fs
    .readdirSync(sessionsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      name: f,
      path: path.join(sessionsDir, f),
      date: f.split("_")[0],
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  // 개수 제한
  if (sessions.length > maxSessionsPerProject) {
    const toDelete = sessions.slice(maxSessionsPerProject);
    toDelete.forEach((s) => fs.unlinkSync(s.path));
    sessions = sessions.slice(0, maxSessionsPerProject);
  }

  // 기간 제한
  const maxAge = Date.now() - maxSessionAgeDays * 24 * 60 * 60 * 1000;
  sessions.forEach((s) => {
    const sessionDate = new Date(s.date).getTime();
    if (sessionDate < maxAge) {
      fs.unlinkSync(s.path);
    }
  });
}

// 메인 실행
const command = process.argv[2];

switch (command) {
  case "start":
    handleSessionStart();
    break;
  case "end":
    handleSessionEnd();
    break;
  default:
    console.log("사용법: node memory-sync.js [start|end]");
    process.exit(1);
}
