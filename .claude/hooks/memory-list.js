#!/usr/bin/env node

/**
 * Claude Memory List
 *
 * 사용 가능한 모든 메모리 목록을 표시합니다.
 *
 * 사용법:
 *   node memory-list.js
 *
 * 지원 플랫폼: Windows, macOS, Linux
 */

const {
  CENTRAL_STORE,
  readJson,
  getMemoryId,
  getSessionCount,
  formatDate,
} = require("./lib/utils");
const path = require("path");
const fs = require("fs");

// 메인 실행
function main() {
  const indexPath = path.join(CENTRAL_STORE, "index.json");

  if (!fs.existsSync(indexPath)) {
    console.log("등록된 메모리가 없습니다.");
    console.log("`/workflow-memory init [id]` 명령어로 메모리를 생성하세요.");
    return;
  }

  const index = readJson(indexPath, { projects: {} });
  const currentMemoryId = getMemoryId();
  const projects = Object.entries(index.projects);

  if (projects.length === 0) {
    console.log("등록된 메모리가 없습니다.");
    console.log("`/workflow-memory init [id]` 명령어로 메모리를 생성하세요.");
    return;
  }

  console.log("사용 가능한 메모리:\n");
  console.log("  ID                    최근 접근       세션 수   상태");
  console.log("  ─────────────────────────────────────────────────────────");

  projects
    .sort((a, b) => {
      const dateA = a[1].lastAccess || "";
      const dateB = b[1].lastAccess || "";
      return dateB.localeCompare(dateA);
    })
    .forEach(([id, info]) => {
      const isCurrent = id === currentMemoryId;
      const marker = isCurrent ? "→" : " ";
      const status = isCurrent ? "현재 연결됨" : "-";
      const sessionCount = getSessionCount(id);
      const lastAccess = formatDate(info.lastAccess);

      const idPadded = id.padEnd(20);
      const datePadded = lastAccess.padEnd(14);
      const countPadded = String(sessionCount).padEnd(8);

      console.log(`${marker} ${idPadded} ${datePadded} ${countPadded} ${status}`);
    });

  console.log(`\n총 ${projects.length}개 메모리`);
}

main();
