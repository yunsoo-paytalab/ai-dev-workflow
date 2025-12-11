#!/usr/bin/env node

/**
 * Claude Memory Switch
 *
 * 다른 메모리로 전환합니다.
 *
 * 사용법:
 *   node memory-switch.js [memory-id]
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  CENTRAL_STORE,
  ensureDir,
  readJson,
  writeJson,
  getMemoryId,
  getMemoryPath,
  getLocalMemoryDir,
  getMemoryRefFile,
  getLocalMemoryFile,
  getTimestamp,
  createSymlink,
} = require("./lib/utils.cjs");

// 메모리 목록 가져오기
function getMemoryList() {
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });
  return Object.keys(index.projects);
}

// 메모리 전환
function switchMemory(memoryId) {
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });

  if (!index.projects[memoryId]) {
    console.log(`❌ 메모리 '${memoryId}'를 찾을 수 없습니다.`);
    console.log("   `/workflow-memory list` 명령어로 사용 가능한 메모리를 확인하세요.");
    return false;
  }

  const memoryPath = getMemoryPath(memoryId);
  const memoryFile = path.join(memoryPath, "memory.md");

  if (!fs.existsSync(memoryFile)) {
    console.log(`❌ 메모리 파일을 찾을 수 없습니다: ${memoryFile}`);
    return false;
  }

  // 로컬 연결 업데이트
  const localMemoryDir = getLocalMemoryDir();
  const memoryRefFile = getMemoryRefFile();
  const localMemoryFile = getLocalMemoryFile();

  ensureDir(localMemoryDir);

  // .memory-ref 업데이트
  fs.writeFileSync(memoryRefFile, memoryId);

  // 심볼릭 링크 재생성 (크로스 플랫폼)
  createSymlink(memoryFile, localMemoryFile);

  // index.json 업데이트
  index.projects[memoryId].lastAccess = getTimestamp();
  writeJson(indexPath, index);

  // meta.json 업데이트
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);
  meta.lastAccess = getTimestamp();
  writeJson(metaPath, meta);

  // 메모리 요약 출력
  const memory = fs.readFileSync(memoryFile, "utf8");
  const workingOnMatch = memory.match(/working_on:\s*(.+)/);
  const workingOn = workingOnMatch ? workingOnMatch[1].trim() : "없음";

  console.log(`✓ 메모리 '${memoryId}'로 전환됨`);
  console.log(`  진행 중: ${workingOn}`);

  return true;
}

// 대화형 선택
async function promptSelection() {
  const memories = getMemoryList();
  const currentId = getMemoryId();

  if (memories.length === 0) {
    console.log("등록된 메모리가 없습니다.");
    return null;
  }

  console.log("사용 가능한 메모리:\n");
  memories.forEach((id, idx) => {
    const marker = id === currentId ? "(현재)" : "";
    console.log(`  ${idx + 1}. ${id} ${marker}`);
  });
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("선택하세요 (번호 또는 ID): ", (answer) => {
      rl.close();
      const trimmed = answer.trim();

      // 번호로 입력한 경우
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= memories.length) {
        resolve(memories[num - 1]);
        return;
      }

      // ID로 입력한 경우
      resolve(trimmed);
    });
  });
}

// 메인 실행
async function main() {
  let memoryId = process.argv[2];

  if (!memoryId) {
    memoryId = await promptSelection();
    if (!memoryId) {
      process.exit(1);
    }
  }

  const currentId = getMemoryId();
  if (memoryId === currentId) {
    console.log(`이미 '${memoryId}' 메모리에 연결되어 있습니다.`);
    return;
  }

  switchMemory(memoryId);
}

main().catch(console.error);
