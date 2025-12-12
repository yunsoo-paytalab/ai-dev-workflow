#!/usr/bin/env node

/**
 * Claude Memory Sync Hook
 *
 * 사용법:
 *   node memory-sync.cjs workflow-start  # /workflow 커맨드 시작 시
 *   node memory-sync.cjs user-input      # 사용자 입력 시 (UserPromptSubmit)
 *   node memory-sync.cjs assistant-response  # Claude 응답 완료 시 (Stop)
 *   node memory-sync.cjs end             # 세션 종료 시
 *   node memory-sync.cjs compact         # compact 시
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
  getMemoryIdFromPath,
  getMemoryPath,
  getLocalMemoryDir,
  getLocalMemoryFile,
  getTimestamp,
  getDateString,
  getTimeString,
  getCurrentBranch,
  getCurrentBranchFromPath,
  generateShortHash,
  createSymlink,
  syncMemoryToCentral,
} = require("./lib/utils.cjs");

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
// 현재 세션 파일에 종료 시간을 추가하고 마무리합니다.
function handleSessionEnd() {
  // stdin에서 hook 데이터 읽기 (cwd, transcript_path 포함)
  let hookData = {};
  let projectCwd = null;
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (input.trim()) {
      hookData = JSON.parse(input);
      projectCwd = hookData.cwd || null;
    }
  } catch (e) {
    // stdin이 비어있거나 JSON이 아닌 경우 무시
  }

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  // 복사 모드일 경우 로컬 → 중앙 저장소 동기화
  syncMemoryToCentral(memoryId);

  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);

  // 현재 세션 파일이 있으면 종료 시간 추가
  if (meta.currentSessionFile) {
    const sessionsDir = path.join(memoryPath, "sessions");
    const sessionFilePath = path.join(sessionsDir, meta.currentSessionFile);

    if (fs.existsSync(sessionFilePath)) {
      // 종료 구분선 추가
      const endSection = `---
**종료 시간**: ${getTimestamp()}
`;
      fs.appendFileSync(sessionFilePath, endSection);

      console.log(`✓ 세션 종료: ${meta.currentSessionFile}`);
    }

    // lastSessionFile 업데이트 및 currentSessionFile 해제
    meta.lastSessionFile = meta.currentSessionFile;
    delete meta.currentSessionFile;
  }

  // meta.json 업데이트
  meta.lastAccess = getTimestamp();
  meta.totalSessions = (meta.totalSessions || 0) + 1;
  writeJson(metaPath, meta);

  // 정리 규칙 적용
  applyCleanupRules(memoryId);
}

// /workflow 커맨드 시작 처리 (PreToolUse - SlashCommand)
function handleWorkflowStart() {
  // stdin에서 hook 데이터 읽기
  let hookData = {};
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (input.trim()) {
      hookData = JSON.parse(input);
    }
  } catch (e) {
    // stdin이 비어있거나 JSON이 아닌 경우 무시
    return;
  }

  // SlashCommand의 command 확인
  const command = hookData.tool_input?.command || "";

  // /workflow로 시작하지 않으면 무시
  if (!command.startsWith("/workflow")) {
    return;
  }

  const memoryId = getMemoryId();

  if (!memoryId) {
    console.log("─".repeat(50));
    console.log("⚠️  프로젝트 메모리가 연결되지 않았습니다.");
    console.log("   `/workflow-memory init [id]` 명령어로 메모리를 생성하세요.");
    console.log("─".repeat(50));
    return;
  }

  const memoryPath = getMemoryPath(memoryId);
  const memoryFile = path.join(memoryPath, "memory.md");
  const progressFile = path.join(memoryPath, "progress.json");

  if (!fs.existsSync(memoryFile)) {
    console.log("─".repeat(50));
    console.log(`⚠️  메모리 '${memoryId}'를 찾을 수 없습니다.`);
    console.log("   `/workflow-memory init` 명령어로 다시 생성하세요.");
    console.log("─".repeat(50));
    return;
  }

  // index.json 업데이트 (lastAccess)
  const indexPath = path.join(CENTRAL_STORE, "index.json");
  const index = readJson(indexPath, { projects: {} });
  if (index.projects[memoryId]) {
    index.projects[memoryId].lastAccess = getTimestamp();
    writeJson(indexPath, index);
  }

  // meta.json 읽기 및 업데이트
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);
  const pendingResume = meta.pendingResume || null;
  meta.lastAccess = getTimestamp();

  // 세션 파일 생성 (실시간 기록용)
  const sessionsDir = path.join(memoryPath, "sessions");
  ensureDir(sessionsDir);

  const branch = getCurrentBranch();
  const dateStr = getDateString();
  const hash = generateShortHash();
  const sessionFileName = `${dateStr}_${branch}_${hash}.md`;
  const sessionFilePath = path.join(sessionsDir, sessionFileName);

  // 세션 파일 초기 내용 생성
  const sessionContent = `# 세션: ${dateStr} ${branch}

## 세션 정보
- **시작 시간**: ${getTimestamp()}
- **브랜치**: ${branch || "N/A"}
- **세션 ID**: ${hash}
- **워크플로우**: ${command}

## 대화 기록

`;

  fs.writeFileSync(sessionFilePath, sessionContent);

  // meta.json에 현재 세션 파일 저장
  meta.currentSessionFile = sessionFileName;

  // 메모리 내용 출력 (Claude 컨텍스트로 전달)
  console.log("─".repeat(50));
  console.log(`📁 프로젝트 메모리: ${memoryId}`);
  console.log(`📍 경로: ${memoryPath}`);
  console.log(`📝 세션 파일: ${sessionFileName}`);
  console.log("─".repeat(50));

  // 이전 세션 요약 출력 (auto-compact 이후 재시작 시)
  if (pendingResume) {
    const summaryPath = path.join(sessionsDir, pendingResume);
    if (fs.existsSync(summaryPath)) {
      console.log("\n## 이전 세션 요약 (auto-compact 이후 재시작)\n");
      console.log(fs.readFileSync(summaryPath, "utf-8"));
      console.log("─".repeat(50));
    }
    // 플래그 해제
    delete meta.pendingResume;
  }

  // meta.json 저장
  writeJson(metaPath, meta);

  // memory.md 내용 출력
  const memoryContent = fs.readFileSync(memoryFile, "utf-8");
  console.log("\n## 프로젝트 메모리 (memory.md)\n");
  console.log(memoryContent);

  // progress.json이 있으면 요약 출력
  if (fs.existsSync(progressFile)) {
    const progress = readJson(progressFile, {});
    const features = progress.features || {};
    const tasks = progress.tasks || {};

    const featureCount = Object.keys(features).length;
    const taskCount = Object.keys(tasks).length;
    const completedTasks = Object.values(tasks).filter(t => t.status === "done").length;
    const inProgressTasks = Object.values(tasks).filter(t => t.status === "in_progress").length;

    console.log("\n## 진행 상황 (progress.json)\n");
    console.log(`- Features: ${featureCount}개`);
    console.log(`- Tasks: ${completedTasks}/${taskCount} 완료 (${inProgressTasks}개 진행중)`);
  }

  console.log("\n" + "─".repeat(50));
}

// Compact 처리 (PreCompact 훅에서 호출)
function handleCompact() {
  // stdin에서 hook 데이터 읽기 (비동기 처리 불필요 - 이미 전달됨)
  let hookData = {};
  let projectCwd = null;
  try {
    const input = fs.readFileSync(0, "utf-8"); // stdin
    if (input.trim()) {
      hookData = JSON.parse(input);
      projectCwd = hookData.cwd || null;
    }
  } catch (e) {
    // stdin이 비어있거나 JSON이 아닌 경우 무시
  }

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const trigger = hookData.trigger || "unknown";
  const transcriptPath = hookData.transcript_path || null;
  const memoryPath = getMemoryPath(memoryId);

  // 복사 모드일 경우 로컬 → 중앙 저장소 동기화
  syncMemoryToCentral(memoryId);

  // 컴팩트 로그 저장
  const sessionsDir = path.join(memoryPath, "sessions");
  ensureDir(sessionsDir);

  // 프로젝트 경로에서 브랜치 가져오기
  const branch = getCurrentBranchFromPath(projectCwd);
  const dateStr = getDateString();
  const timestamp = getTimestamp();
  const hash = generateShortHash();
  const compactFileName = `${dateStr}_${branch}_compact_${hash}.md`;
  const compactFilePath = path.join(sessionsDir, compactFileName);

  // transcript에서 사용자 메시지 추출하여 요약 저장
  let userMessages = [];
  if (transcriptPath && fs.existsSync(transcriptPath)) {
    try {
      const transcriptContent = fs.readFileSync(transcriptPath, "utf-8");
      const lines = transcriptContent.trim().split("\n");
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.type === "human" && entry.message?.content) {
            userMessages.push(entry.message.content);
          }
        } catch (e) {
          // JSON 파싱 실패 시 무시
        }
      }
    } catch (e) {
      // 파일 읽기 실패 시 무시
    }
  }

  // 요약 파일 저장
  const summaryFileName = `${dateStr}_${branch}_summary_${hash}.md`;
  const summaryFilePath = path.join(sessionsDir, summaryFileName);

  const summaryContent = `# 세션 요약: ${dateStr} ${branch}

## 사용자 요청 목록
${userMessages.length > 0 ? userMessages.map((msg, i) => `${i + 1}. ${msg.slice(0, 200)}${msg.length > 200 ? "..." : ""}`).join("\n") : "- (없음)"}

## 메모
-
`;

  fs.writeFileSync(summaryFilePath, summaryContent);

  const compactContent = `# Compact: ${dateStr} ${branch}

## 정보
- 시간: ${timestamp}
- 트리거: ${trigger}
- 세션 ID: ${hookData.session_id || "N/A"}
- 요약 파일: ${summaryFileName}

## 컨텍스트 스냅샷
> Compact 시점의 메모리 상태가 저장되었습니다.
`;

  fs.writeFileSync(compactFilePath, compactContent);

  // meta.json 업데이트 (pendingResume 플래그 설정)
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);
  meta.lastAccess = timestamp;
  meta.lastCompact = timestamp;
  meta.compactCount = (meta.compactCount || 0) + 1;
  meta.pendingResume = summaryFileName; // 다음 워크플로우 시작 시 참조할 요약 파일
  writeJson(metaPath, meta);

  console.log(`✓ Compact 메모리 저장됨 (${trigger}): ${compactFileName}`);
}

// 사용자 입력 처리 (UserPromptSubmit hook에서 호출)
function handleUserInput() {
  // stdin에서 hook 데이터 읽기
  let hookData = {};
  let projectCwd = null;
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (input.trim()) {
      hookData = JSON.parse(input);
      projectCwd = hookData.cwd || null;
    }
  } catch (e) {
    return; // stdin이 비어있거나 JSON이 아닌 경우 무시
  }

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);

  // 현재 세션 파일이 없으면 무시 (워크플로우 외 입력)
  if (!meta.currentSessionFile) {
    return;
  }

  const sessionsDir = path.join(memoryPath, "sessions");
  const sessionFilePath = path.join(sessionsDir, meta.currentSessionFile);

  if (!fs.existsSync(sessionFilePath)) {
    return;
  }

  // 사용자 프롬프트 가져오기
  const prompt = hookData.prompt || "";

  // 시스템 메시지 필터링
  if (!prompt.trim() ||
      prompt.startsWith("<command-name>") ||
      prompt.startsWith("<command-message>") ||
      prompt.startsWith("<local-command") ||
      prompt.includes("<system-reminder>")) {
    return;
  }

  // 세션 파일에 사용자 입력 추가
  const timeStr = getTimeString();
  const entry = `### ${timeStr}\n**사용자**: ${prompt}\n\n`;

  fs.appendFileSync(sessionFilePath, entry);
}

// Claude 응답 완료 처리 (Stop hook에서 호출)
function handleAssistantResponse() {
  // stdin에서 hook 데이터 읽기
  let hookData = {};
  let projectCwd = null;
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (input.trim()) {
      hookData = JSON.parse(input);
      projectCwd = hookData.cwd || null;
    }
  } catch (e) {
    return; // stdin이 비어있거나 JSON이 아닌 경우 무시
  }

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);

  // 현재 세션 파일이 없으면 무시
  if (!meta.currentSessionFile) {
    return;
  }

  const sessionsDir = path.join(memoryPath, "sessions");
  const sessionFilePath = path.join(sessionsDir, meta.currentSessionFile);

  if (!fs.existsSync(sessionFilePath)) {
    return;
  }

  // transcript에서 마지막 assistant 응답 추출
  const transcriptPath = hookData.transcript_path || null;
  let lastResponse = "";

  if (transcriptPath && fs.existsSync(transcriptPath)) {
    try {
      const transcriptContent = fs.readFileSync(transcriptPath, "utf-8");
      const lines = transcriptContent.trim().split("\n");

      // 역순으로 마지막 assistant 응답 찾기
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const entry = JSON.parse(lines[i]);
          if (entry.type === "assistant" && entry.message?.content) {
            let content = entry.message.content;

            // 배열 형태인 경우
            if (Array.isArray(content)) {
              content = content
                .filter(c => c.type === "text")
                .map(c => c.text)
                .join(" ");
            }

            if (typeof content === "string" && content.trim()) {
              lastResponse = content.trim();
              break;
            }
          }
        } catch (e) {
          // JSON 파싱 실패 시 무시
        }
      }
    } catch (e) {
      // 파일 읽기 실패 시 무시
    }
  }

  if (!lastResponse) {
    return;
  }

  // 응답 요약 (최대 200자 + 도구 사용 요약)
  let summary = lastResponse;

  // 도구 사용 패턴 감지
  const toolPatterns = [
    { pattern: /Read.*file/gi, label: "파일 읽기" },
    { pattern: /Write.*file/gi, label: "파일 작성" },
    { pattern: /Edit.*file/gi, label: "파일 수정" },
    { pattern: /Bash|실행|npm|git/gi, label: "명령 실행" },
    { pattern: /Grep|검색|찾/gi, label: "검색" },
  ];

  const usedTools = [];
  toolPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(lastResponse)) {
      usedTools.push(label);
    }
  });

  // 요약 생성
  if (summary.length > 200) {
    summary = summary.slice(0, 200) + "...";
  }

  if (usedTools.length > 0) {
    summary += ` [${usedTools.join(", ")}]`;
  }

  // 세션 파일에 응답 추가
  const entry = `**Claude**: ${summary}\n\n`;

  fs.appendFileSync(sessionFilePath, entry);
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
  case "workflow-start":
    handleWorkflowStart();
    break;
  case "user-input":
    handleUserInput();
    break;
  case "assistant-response":
    handleAssistantResponse();
    break;
  case "start":
    handleSessionStart();
    break;
  case "end":
    handleSessionEnd();
    break;
  case "compact":
    handleCompact();
    break;
  default:
    console.log("사용법: node memory-sync.cjs [workflow-start|user-input|assistant-response|start|end|compact]");
    process.exit(1);
}
