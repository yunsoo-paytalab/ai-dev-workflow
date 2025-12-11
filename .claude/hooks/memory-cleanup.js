#!/usr/bin/env node

/**
 * Claude Memory Cleanup
 *
 * 정리 규칙을 수동으로 실행합니다.
 *
 * 사용법:
 *   node memory-cleanup.js [--all] [--force]
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  CENTRAL_STORE,
  DEFAULT_CONFIG,
  readJson,
  getMemoryId,
  getMemoryPath,
} = require("./lib/utils");

// 메모리 목록 가져오기
function getMemoryList() {
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });
  return Object.keys(index.projects);
}

// 정리 대상 분석
function analyzeCleanup(memoryId, config) {
  const sessionsDir = path.join(getMemoryPath(memoryId), "sessions");

  if (!fs.existsSync(sessionsDir)) {
    return { toDelete: [], reasons: [] };
  }

  const { maxSessionsPerProject, maxSessionAgeDays } = config.retention;
  const maxAge = Date.now() - maxSessionAgeDays * 24 * 60 * 60 * 1000;

  let sessions = fs
    .readdirSync(sessionsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      name: f,
      path: path.join(sessionsDir, f),
      date: f.split("_")[0],
      dateMs: new Date(f.split("_")[0]).getTime(),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const toDelete = [];
  const reasons = [];

  // 기간 초과
  sessions.forEach((s) => {
    if (s.dateMs < maxAge) {
      toDelete.push(s);
      reasons.push(`${s.name}: ${maxSessionAgeDays}일 초과`);
    }
  });

  // 개수 초과 (기간 초과로 삭제될 것 제외)
  const remaining = sessions.filter((s) => !toDelete.includes(s));
  if (remaining.length > maxSessionsPerProject) {
    const excess = remaining.slice(maxSessionsPerProject);
    excess.forEach((s) => {
      if (!toDelete.includes(s)) {
        toDelete.push(s);
        reasons.push(`${s.name}: 최대 개수(${maxSessionsPerProject}) 초과`);
      }
    });
  }

  return { toDelete, reasons };
}

// 정리 실행
function executeCleanup(toDelete) {
  let deletedCount = 0;
  let freedSize = 0;

  toDelete.forEach((s) => {
    try {
      const stats = fs.statSync(s.path);
      freedSize += stats.size;
      fs.unlinkSync(s.path);
      deletedCount++;
    } catch (e) {
      console.error(`  ❌ 삭제 실패: ${s.name}`);
    }
  });

  return { deletedCount, freedSize };
}

// 확인 프롬프트
async function confirmCleanup() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("진행하시겠습니까? (Y/n): ", (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      resolve(trimmed === "" || trimmed === "y");
    });
  });
}

// 메인 실행
async function main() {
  const args = process.argv.slice(2);
  const allFlag = args.includes("--all");
  const forceFlag = args.includes("--force");

  // 설정 로드
  const configPath = path.join(CENTRAL_STORE, "config.json");
  const config = readJson(configPath, DEFAULT_CONFIG);

  // 대상 메모리 결정
  let targetMemories = [];
  if (allFlag) {
    targetMemories = getMemoryList();
  } else {
    const currentId = getMemoryId();
    if (!currentId) {
      console.log("⚠️  메모리가 연결되지 않았습니다.");
      console.log("   `--all` 옵션으로 모든 메모리를 정리하거나,");
      console.log("   `/workflow-memory switch` 명령어로 메모리를 연결하세요.");
      return;
    }
    targetMemories = [currentId];
  }

  // 분석
  let totalToDelete = [];
  const analysisByMemory = {};

  targetMemories.forEach((memoryId) => {
    const { toDelete, reasons } = analyzeCleanup(memoryId, config);
    if (toDelete.length > 0) {
      analysisByMemory[memoryId] = { toDelete, reasons };
      totalToDelete = totalToDelete.concat(toDelete);
    }
  });

  if (totalToDelete.length === 0) {
    console.log("✓ 정리할 항목이 없습니다.");
    return;
  }

  // 정리 대상 출력
  console.log("정리 대상:\n");

  Object.entries(analysisByMemory).forEach(([memoryId, { toDelete, reasons }]) => {
    console.log(`[${memoryId}] ${toDelete.length}개 세션`);
    if (!forceFlag) {
      reasons.slice(0, 5).forEach((r) => console.log(`  - ${r}`));
      if (reasons.length > 5) {
        console.log(`  ... 외 ${reasons.length - 5}개`);
      }
    }
  });
  console.log();

  // 확인
  if (!forceFlag) {
    const confirmed = await confirmCleanup();
    if (!confirmed) {
      console.log("취소되었습니다.");
      return;
    }
  }

  // 실행
  let totalDeleted = 0;
  let totalFreed = 0;

  Object.entries(analysisByMemory).forEach(([, { toDelete }]) => {
    const { deletedCount, freedSize } = executeCleanup(toDelete);
    totalDeleted += deletedCount;
    totalFreed += freedSize;
  });

  const freedKB = (totalFreed / 1024).toFixed(1);
  console.log(`✓ ${totalDeleted}개 세션 삭제됨`);
  console.log(`✓ 저장 공간 ${freedKB}KB 확보`);
}

main().catch(console.error);
