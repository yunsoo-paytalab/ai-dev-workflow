#!/usr/bin/env node

/**
 * Claude Memory Status
 *
 * 현재 연결된 메모리의 상세 상태를 표시합니다.
 *
 * 사용법:
 *   node memory-status.js
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const fs = require("fs");
const path = require("path");
const {
  CENTRAL_STORE,
  readJson,
  getMemoryId,
  getMemoryPath,
  getFileSize,
} = require("./lib/utils.cjs");

// 메모리 내용 파싱
function parseMemoryStatus(memoryContent) {
  const result = {
    workingOn: "null",
    phase: "null",
    blockedBy: "null",
    features: [],
  };

  // working_on 추출
  const workingMatch = memoryContent.match(/working_on:\s*(.+)/);
  if (workingMatch) result.workingOn = workingMatch[1].trim();

  // phase 추출
  const phaseMatch = memoryContent.match(/phase:\s*(.+)/);
  if (phaseMatch) result.phase = phaseMatch[1].trim().split("#")[0].trim();

  // blocked_by 추출
  const blockedMatch = memoryContent.match(/blocked_by:\s*(.+)/);
  if (blockedMatch) result.blockedBy = blockedMatch[1].trim();

  // 기능 상태 테이블 파싱
  const featureTableMatch = memoryContent.match(
    /\| ID \| 기능 \| 상태 \| 비고 \|[\s\S]*?\n((?:\|.+\|[\s\S]*?)+?)(?=\n\n|\n\*\*|$)/
  );
  if (featureTableMatch) {
    const rows = featureTableMatch[1]
      .split("\n")
      .filter((row) => row.trim().startsWith("|") && !row.includes("---"));

    rows.forEach((row) => {
      const cols = row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cols.length >= 3 && cols[0] !== "-") {
        result.features.push({
          id: cols[0],
          name: cols[1],
          status: cols[2],
          note: cols[3] || "-",
        });
      }
    });
  }

  return result;
}

// 메인 실행
function main() {
  const memoryId = getMemoryId();

  if (!memoryId) {
    console.log("⚠️  메모리가 연결되지 않았습니다.");
    console.log("   `/workflow-memory init [id]` 명령어로 메모리를 생성하세요.");
    console.log("   `/workflow-memory list` 명령어로 사용 가능한 메모리를 확인하세요.");
    return;
  }

  const memoryPath = getMemoryPath(memoryId);
  const memoryFile = path.join(memoryPath, "memory.md");
  const sessionsDir = path.join(memoryPath, "sessions");

  if (!fs.existsSync(memoryPath)) {
    console.log(`❌ 메모리 '${memoryId}'를 찾을 수 없습니다.`);
    return;
  }

  // 세션 정보
  let sessions = [];
  if (fs.existsSync(sessionsDir)) {
    sessions = fs
      .readdirSync(sessionsDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse();
  }

  // 메모리 파일 파싱
  let memoryStatus = { workingOn: "-", phase: "-", blockedBy: "-", features: [] };
  if (fs.existsSync(memoryFile)) {
    const memoryContent = fs.readFileSync(memoryFile, "utf8");
    memoryStatus = parseMemoryStatus(memoryContent);
  }

  // 출력
  console.log(`📁 메모리: ${memoryId}`);
  console.log(`📍 경로: ${memoryPath}${path.sep}`);
  console.log(`📊 세션: ${sessions.length}개`);
  console.log(`💾 메모리 크기: ${getFileSize(memoryFile)}`);
  console.log();

  // 현재 상태
  console.log("현재 상태:");
  console.log(`  진행 중: ${memoryStatus.workingOn}`);
  console.log(`  단계: ${memoryStatus.phase}`);
  console.log(`  차단: ${memoryStatus.blockedBy}`);
  console.log();

  // 최근 세션
  if (sessions.length > 0) {
    console.log("최근 세션:");
    sessions.slice(0, 5).forEach((session) => {
      const name = session.replace(".md", "");
      console.log(`  ${name}`);
    });
    console.log();
  }

  // 기능 현황
  if (memoryStatus.features.length > 0) {
    console.log("기능 현황:");
    memoryStatus.features.forEach((f) => {
      console.log(`  ${f.status} ${f.id} ${f.name}`);
    });
  }
}

main();
