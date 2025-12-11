#!/usr/bin/env node

/**
 * Claude Memory Remove
 *
 * 메모리를 삭제합니다.
 *
 * 사용법:
 *   node memory-remove.js <memory-id> [--force]
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  CENTRAL_STORE,
  readJson,
  writeJson,
  getMemoryId,
  getSessionCount,
  getMemoryRefFile,
  getLocalMemoryFile,
  formatDate,
  deleteFolderRecursive,
} = require("./lib/utils.cjs");

// 메모리 삭제
function removeMemory(memoryId) {
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });

  if (!index.projects[memoryId]) {
    console.log(`❌ 메모리 '${memoryId}'를 찾을 수 없습니다.`);
    return false;
  }

  const memoryPath = path.join(CENTRAL_STORE, "projects", memoryId);

  // 프로젝트 폴더 삭제
  deleteFolderRecursive(memoryPath);

  // index.json에서 제거
  delete index.projects[memoryId];
  writeJson(indexPath, index);

  // 현재 연결된 메모리인 경우 로컬 연결 해제
  const currentId = getMemoryId();
  const memoryRefFile = getMemoryRefFile();
  const localMemoryFile = getLocalMemoryFile();

  if (currentId === memoryId) {
    if (fs.existsSync(memoryRefFile)) {
      fs.unlinkSync(memoryRefFile);
    }
    if (fs.existsSync(localMemoryFile)) {
      const stats = fs.lstatSync(localMemoryFile);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(localMemoryFile);
      }
    }
  }

  console.log(`✓ 메모리 '${memoryId}' 삭제됨`);
  return true;
}

// 확인 프롬프트
async function confirmRemoval(memoryId) {
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });
  const info = index.projects[memoryId];

  const sessionCount = getSessionCount(memoryId);
  const createdAt = formatDate(info?.createdAt);

  console.log(`⚠️  '${memoryId}' 메모리를 삭제합니다.`);
  console.log(`    - 세션 ${sessionCount}개`);
  console.log(`    - 생성일: ${createdAt}`);
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("정말 삭제하시겠습니까? (y/N): ", (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

// 메인 실행
async function main() {
  const args = process.argv.slice(2);
  const forceFlag = args.includes("--force");
  const memoryId = args.find((arg) => !arg.startsWith("--"));

  if (!memoryId) {
    console.log("사용법: node memory-remove.js <memory-id> [--force]");
    process.exit(1);
  }

  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });

  if (!index.projects[memoryId]) {
    console.log(`❌ 메모리 '${memoryId}'를 찾을 수 없습니다.`);
    console.log("   `/workflow-memory list` 명령어로 사용 가능한 메모리를 확인하세요.");
    process.exit(1);
  }

  if (forceFlag) {
    removeMemory(memoryId);
  } else {
    const confirmed = await confirmRemoval(memoryId);
    if (confirmed) {
      removeMemory(memoryId);
    } else {
      console.log("취소되었습니다.");
    }
  }
}

main().catch(console.error);
