#!/usr/bin/env node

/**
 * Claude Memory Init
 *
 * 새 메모리를 생성하고 현재 프로젝트에 연결합니다.
 *
 * 사용법:
 *   node memory-init.js [memory-id]
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  CENTRAL_STORE,
  getConfig,
  getDefaultProgress,
  ensureDir,
  readJson,
  writeJson,
  getProjectRoot,
  getLocalMemoryDir,
  getMemoryRefFile,
  getLocalMemoryFile,
  getTimestamp,
  createSymlink,
} = require("./lib/utils.cjs");

// 메모리 템플릿
const MEMORY_TEMPLATE = `# 프로젝트 메모리

> 마지막 업데이트: ${new Date().toISOString()}

## 현재 상태

\`\`\`yaml
working_on: null          # 진행 중인 작업
phase: null               # Research | Planning | Implementation
blocked_by: null          # 차단 요소
\`\`\`

## 기술 스택

- Frontend:
- Backend:
- Database:
- 기타:

## 핵심 결정사항

| 날짜 | 결정 | 이유 |
|------|------|------|
| - | - | - |

## 기능 상태

| ID | 기능 | 상태 | 비고 |
|----|------|------|------|
| - | - | ⏳ 대기 | - |

**상태 범례:** ⏳ 대기 | 🔄 진행중 | ✅ 완료 | ❌ 취소

## 주요 패턴

\`\`\`yaml
api: null                 # API 호출 패턴 (예: src/api/ + React Query)
state: null               # 상태 관리 패턴 (예: Zustand per feature)
components: null          # 컴포넌트 구조 (예: src/components/ 공통, src/features/ 기능별)
\`\`\`

## 메모

-
`;

// 메모리 ID 유효성 검사
function isValidMemoryId(id) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

// 프로젝트 이름 추출
function getProjectName() {
  return path.basename(getProjectRoot());
}

// 메모리 생성
function createMemory(memoryId) {
  // 중앙 저장소 초기화
  ensureDir(CENTRAL_STORE);
  ensureDir(path.join(CENTRAL_STORE, "projects"));

  // config.json 초기화 (getConfig가 자동으로 기본값 생성)
  getConfig();

  // index.json 초기화/업데이트
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });

  // 이미 존재하는 메모리인지 확인
  if (index.projects[memoryId]) {
    console.log(`⚠️  메모리 '${memoryId}'가 이미 존재합니다.`);
    console.log(`   기존 메모리에 연결하려면 '/workflow-memory switch ${memoryId}'를 사용하세요.`);
    return false;
  }

  // 프로젝트 디렉토리 생성
  const memoryPath = path.join(CENTRAL_STORE, "projects", memoryId);
  ensureDir(memoryPath);
  ensureDir(path.join(memoryPath, "sessions"));

  // meta.json 생성
  const metaPath = path.join(memoryPath, "meta.json");
  writeJson(metaPath, {
    id: memoryId,
    projectPath: getProjectRoot(),
    projectName: getProjectName(),
    createdAt: getTimestamp(),
    lastAccess: getTimestamp(),
    totalSessions: 0,
  });

  // memory.md 생성
  const memoryFile = path.join(memoryPath, "memory.md");
  fs.writeFileSync(memoryFile, MEMORY_TEMPLATE);

  // progress.json 생성
  const progressFile = path.join(memoryPath, "progress.json");
  writeJson(progressFile, {
    ...getDefaultProgress(),
    lastUpdated: getTimestamp(),
  });

  // index.json 업데이트
  index.projects[memoryId] = {
    path: getProjectRoot(),
    createdAt: getTimestamp(),
    lastAccess: getTimestamp(),
  };
  writeJson(indexPath, index);

  // 로컬 연결
  const localMemoryDir = getLocalMemoryDir();
  const memoryRefFile = getMemoryRefFile();
  const localMemoryFile = getLocalMemoryFile();

  ensureDir(localMemoryDir);

  // .memory-ref 생성
  fs.writeFileSync(memoryRefFile, memoryId);

  // 심볼릭 링크 생성 (크로스 플랫폼)
  const linkResult = createSymlink(memoryFile, localMemoryFile);

  console.log(`✓ 메모리 '${memoryId}' 생성됨`);
  console.log(`✓ progress.json 초기화됨`);

  if (linkResult.type === "copy") {
    console.log(`✓ 파일 복사로 연결됨 (심볼릭 링크 대체)`);
  } else {
    console.log(`✓ 심볼릭 링크 연결됨`);
  }

  console.log(`  경로: ${memoryPath}${path.sep}`);

  return true;
}

// 대화형 입력
async function promptMemoryId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const projectName = getProjectName();
    rl.question(`메모리 ID를 입력하세요 (기본값: ${projectName}): `, (answer) => {
      rl.close();
      resolve(answer.trim() || projectName);
    });
  });
}

// 메인 실행
async function main() {
  let memoryId = process.argv[2];

  if (!memoryId) {
    memoryId = await promptMemoryId();
  }

  if (!isValidMemoryId(memoryId)) {
    console.log("❌ 유효하지 않은 메모리 ID입니다.");
    console.log("   영문자, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.");
    process.exit(1);
  }

  createMemory(memoryId);
}

main().catch(console.error);
