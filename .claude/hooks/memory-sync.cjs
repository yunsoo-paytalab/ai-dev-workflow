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
  getConfig,
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
  setCurrentWorkflow,
  getCurrentWorkflow,
  finishCurrentWorkflow,
  completeWorkflow,
  recalculateProgress,
  syncProgressToMemory,
  parseFeatureListToProgress,
  parseDomainDefinitionToProgress,
} = require("./lib/utils.cjs");

// 중앙 저장소 초기화
function initCentralStore() {
  ensureDir(CENTRAL_STORE);
  ensureDir(path.join(CENTRAL_STORE, "projects"));

  // config.json 초기화 (getConfig가 자동으로 기본값 생성)
  getConfig();

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
    console.log(
      "   `/workflow-memory init [id]` 명령어로 메모리를 생성하세요."
    );
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

// 워크플로우 완료 공통 로직 (중복 제거)
function completeCurrentWorkflow(memoryId, workflowName, projectCwd) {
  console.log(`✓ 워크플로우 완료: ${workflowName}`);

  // 워크플로우 완료 표시
  completeWorkflow(memoryId, workflowName);

  // 워크플로우별 문서 파싱
  if (projectCwd) {
    if (workflowName === "domain-definition") {
      const domainResult = parseDomainDefinitionToProgress(
        memoryId,
        projectCwd
      );
      const featureResult = parseFeatureListToProgress(memoryId, projectCwd);
      if (domainResult.success) {
        console.log(
          `✓ domain-definition 파싱: ${domainResult.domains}개 도메인`
        );
      }
      if (featureResult.success) {
        console.log(
          `✓ feature-list 파싱: ${featureResult.features}개 Feature, ${featureResult.tasks}개 Task`
        );
      }
    } else if (workflowName === "task-point") {
      const featureResult = parseFeatureListToProgress(memoryId, projectCwd);
      if (featureResult.success) {
        console.log(
          `✓ feature-list 파싱: ${featureResult.features}개 Feature, ${featureResult.tasks}개 Task`
        );
      }
    }
  }

  // progress.json 재계산 및 memory.md 동기화
  recalculateProgress(memoryId);
  syncProgressToMemory(memoryId);
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

  const sessionId = hookData.session_id || null;

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

  // activeSessions 확인
  if (!meta.activeSessions) {
    meta.activeSessions = {};
  }

  // 세션 처리와 별개로 워크플로우 완료 처리 (폴백)
  const currentWorkflow = getCurrentWorkflow(memoryId);
  if (currentWorkflow) {
    console.log("⚠️  승인 없이 종료됨, 자동 완료 처리");
    completeCurrentWorkflow(memoryId, currentWorkflow, projectCwd);
    finishCurrentWorkflow(memoryId);
  }

  // 세션 정리 (세션을 찾을 수 있으면)
  const currentSession = meta.activeSessions[sessionId];
  if (currentSession) {
    const sessionsDir = path.join(memoryPath, "sessions");
    const sessionFilePath = path.join(sessionsDir, currentSession.file);

    if (fs.existsSync(sessionFilePath)) {
      // 종료 구분선 추가
      const endSection = `---
**종료 시간**: ${getTimestamp()}
`;
      fs.appendFileSync(sessionFilePath, endSection);

      console.log(`✓ 세션 종료: ${currentSession.file}`);
    }

    // lastSessionFile 업데이트 및 activeSessions에서 제거
    meta.lastSessionFile = currentSession.file;
    delete meta.activeSessions[sessionId];
  }

  // meta.json 업데이트
  meta.lastAccess = getTimestamp();
  meta.totalSessions = (meta.totalSessions || 0) + 1;
  writeJson(metaPath, meta);

  // 정리 규칙 적용
  applyCleanupRules(memoryId);
}

// Compact 처리 (PreCompact 훅에서 호출)
// 간소화: 별도 파일 생성 없이 현재 세션 파일을 pendingResume으로 설정
function handleCompact() {
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
    // stdin이 비어있거나 JSON이 아닌 경우 무시
  }

  const sessionId = hookData.session_id || null;

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const memoryPath = getMemoryPath(memoryId);
  const timestamp = getTimestamp();

  // 복사 모드일 경우 로컬 → 중앙 저장소 동기화
  syncMemoryToCentral(memoryId);

  // meta.json 업데이트
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);

  meta.lastAccess = timestamp;
  meta.lastCompact = timestamp;
  meta.compactCount = (meta.compactCount || 0) + 1;

  // activeSessions 확인
  if (!meta.activeSessions) {
    meta.activeSessions = {};
  }

  // 현재 세션 파일이 있으면 pendingResume으로 설정
  const currentSession = meta.activeSessions[sessionId];
  if (currentSession) {
    meta.pendingResume = currentSession.file;
  }

  writeJson(metaPath, meta);

  console.log(`✓ Compact 처리됨 (세션: ${currentSession?.file || "N/A"})`);
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

  // 사용자 프롬프트 가져오기
  const prompt = hookData.prompt || "";
  const sessionId = hookData.session_id || null;

  // 시스템 메시지 필터링
  if (
    !prompt.trim() ||
    prompt.startsWith("<command-name>") ||
    prompt.startsWith("<command-message>") ||
    prompt.startsWith("<local-command") ||
    prompt.includes("<system-reminder>")
  ) {
    return;
  }

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  let meta = readJson(metaPath);

  // activeSessions 초기화
  if (!meta.activeSessions) {
    meta.activeSessions = {};
  }

  // /workflow-* 명령 감지 시 세션 시작
  const workflowMatch = prompt.match(/^\/workflow-(\S+)/);
  if (workflowMatch && sessionId) {
    const workflowName = workflowMatch[1];

    // /workflow-memory는 메모리 관리 커맨드이므로 제외
    if (!workflowName.startsWith("memory")) {
      // 이전 워크플로우가 있으면 자동 완료 처리
      const previousWorkflow = getCurrentWorkflow(memoryId);
      if (previousWorkflow && previousWorkflow !== workflowName) {
        console.log(`⚠️  이전 워크플로우 자동 완료: ${previousWorkflow}`);
        completeCurrentWorkflow(memoryId, previousWorkflow, projectCwd);
        finishCurrentWorkflow(memoryId);
      }

      // 새 워크플로우 설정
      setCurrentWorkflow(memoryId, workflowName);

      // 세션 파일 생성
      const sessionsDir = path.join(memoryPath, "sessions");
      ensureDir(sessionsDir);

      const branch = getCurrentBranchFromPath(projectCwd);
      const safeBranch = branch ? branch.replace(/\//g, "-") : "unknown";
      const dateStr = getDateString();
      const hash = generateShortHash();
      const sessionFileName = `${dateStr}_${safeBranch}_${hash}.md`;
      const sessionFilePath = path.join(sessionsDir, sessionFileName);

      const sessionContent = `# 세션: ${dateStr} ${branch}

## 세션 정보
- **시작 시간**: ${getTimestamp()}
- **브랜치**: ${branch || "N/A"}
- **세션 ID**: ${hash}
- **터미널 세션**: ${sessionId}
- **워크플로우**: /workflow-${workflowName}

## 대화 기록

`;

      fs.writeFileSync(sessionFilePath, sessionContent);

      // meta.json 업데이트 - activeSessions에 추가
      meta.activeSessions[sessionId] = {
        file: sessionFileName,
        workflow: workflowName,
        startedAt: getTimestamp(),
      };
      meta.lastAccess = getTimestamp();
      writeJson(metaPath, meta);

      // 메모리 정보 출력
      console.log("─".repeat(50));
      console.log(`📁 프로젝트 메모리: ${memoryId}`);
      console.log(`📝 세션 파일: ${sessionFileName}`);
      console.log(`🔄 워크플로우: ${workflowName}`);
      console.log("─".repeat(50));
    }
  }

  // 현재 세션 파일 확인 (session_id 기반)
  meta = readJson(metaPath); // 세션 생성 후 다시 읽기
  if (!meta.activeSessions) {
    meta.activeSessions = {};
  }

  const currentSession = meta.activeSessions[sessionId];
  if (!currentSession) {
    return; // 이 터미널에 활성 세션 없음
  }

  const sessionsDir = path.join(memoryPath, "sessions");
  const sessionFilePath = path.join(sessionsDir, currentSession.file);

  if (!fs.existsSync(sessionFilePath)) {
    return;
  }

  // 세션 파일에 사용자 입력 추가
  const timeStr = getTimeString();
  const entry = `### ${timeStr}
**사용자**:
\`\`\`\`
${prompt}
\`\`\`\`

`;

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

  const sessionId = hookData.session_id || null;

  // 프로젝트 경로에서 메모리 ID 확인
  const memoryId = projectCwd ? getMemoryIdFromPath(projectCwd) : getMemoryId();

  if (!memoryId) {
    return; // 메모리 연결 없으면 무시
  }

  const memoryPath = getMemoryPath(memoryId);
  const metaPath = path.join(memoryPath, "meta.json");
  const meta = readJson(metaPath);

  // activeSessions 확인
  if (!meta.activeSessions) {
    return;
  }

  // 현재 세션 확인 (session_id 기반)
  const currentSession = meta.activeSessions[sessionId];
  if (!currentSession) {
    return; // 이 터미널에 활성 세션 없음
  }

  const sessionsDir = path.join(memoryPath, "sessions");
  const sessionFilePath = path.join(sessionsDir, currentSession.file);

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
                .filter((c) => c.type === "text")
                .map((c) => c.text)
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

  // config에서 최대 글자 수 설정 읽기
  const config = getConfig();
  const maxResponseLength = config.session?.maxResponseLength || 2000;

  // 응답 요약
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

  // 글자 수 제한 적용
  if (summary.length > maxResponseLength) {
    summary = summary.slice(0, maxResponseLength) + "...";
  }

  if (usedTools.length > 0) {
    summary += ` [${usedTools.join(", ")}]`;
  }

  // 세션 파일에 응답 추가
  const entry = `**Claude**:
\`\`\`\`
${summary}
\`\`\`\`

`;

  fs.appendFileSync(sessionFilePath, entry);
}

// 정리 규칙 적용
function applyCleanupRules(memoryId) {
  const config = getConfig();
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

// 워크플로우 완료 처리 (사용자 승인 시 호출)
// Claude가 직접 호출: node .claude/hooks/memory-sync.cjs workflow-complete [workflow-name]
function handleWorkflowComplete() {
  const workflowName = process.argv[3]; // domain-definition, task-point 등
  const projectCwd = process.cwd();
  const memoryId = getMemoryIdFromPath(projectCwd);

  if (!memoryId) {
    console.log("⚠️  메모리가 연결되지 않았습니다.");
    return;
  }

  if (!workflowName) {
    console.log("⚠️  워크플로우 이름이 필요합니다.");
    console.log(
      "   사용법: node .claude/hooks/memory-sync.cjs workflow-complete [workflow-name]"
    );
    return;
  }

  console.log("─".repeat(50));
  console.log(`📋 사용자 승인으로 워크플로우 완료 처리`);

  try {
    completeCurrentWorkflow(memoryId, workflowName, projectCwd);

    // 성공한 경우에만 currentWorkflow 제거
    const currentWorkflow = getCurrentWorkflow(memoryId);
    if (currentWorkflow === workflowName) {
      finishCurrentWorkflow(memoryId);
    }

    console.log("✓ Progress 동기화 완료!");
  } catch (error) {
    console.error("❌ 워크플로우 완료 처리 실패:", error.message);
    console.log("⚠️  currentWorkflow는 유지되어 다시 시도할 수 있습니다.");
    throw error;
  }

  console.log("─".repeat(50));
}

// Progress 동기화 처리 (워크플로우 Phase 완료 시 호출)
// Claude가 직접 호출: node .claude/hooks/memory-sync.cjs sync-progress
function handleSyncProgress() {
  // 현재 디렉토리에서 메모리 ID 확인
  const projectCwd = process.cwd();
  const memoryId = getMemoryIdFromPath(projectCwd);

  if (!memoryId) {
    console.log("⚠️  메모리가 연결되지 않았습니다.");
    return;
  }

  console.log("─".repeat(50));
  console.log("📊 Progress 동기화 시작...");

  // domain-definition.md 파싱
  const domainResult = parseDomainDefinitionToProgress(memoryId, projectCwd);
  if (domainResult.success) {
    console.log(`✓ 도메인 파싱: ${domainResult.domains}개`);
  } else if (domainResult.error !== "domain-definition.md not found") {
    console.log(`⚠️  도메인 파싱 실패: ${domainResult.error}`);
  }

  // feature-list.md 파싱
  const featureResult = parseFeatureListToProgress(memoryId, projectCwd);
  if (featureResult.success) {
    console.log(`✓ Feature 파싱: ${featureResult.features}개`);
    console.log(`✓ Task 파싱: ${featureResult.tasks}개`);
  } else if (featureResult.error !== "feature-list.md not found") {
    console.log(`⚠️  Feature 파싱 실패: ${featureResult.error}`);
  }

  // progress.json 재계산 및 memory.md 동기화
  recalculateProgress(memoryId);
  syncProgressToMemory(memoryId);

  console.log("✓ Progress 동기화 완료!");
  console.log("─".repeat(50));
}

// Feature 상태 업데이트 처리
// Claude가 직접 호출: node .claude/hooks/memory-sync.cjs update-feature-status [featureId] [status]
function handleUpdateFeatureStatus() {
  const featureId = process.argv[3];
  const status = process.argv[4];
  const projectCwd = process.cwd();
  const memoryId = getMemoryIdFromPath(projectCwd);

  if (!memoryId) {
    console.log("⚠️  메모리가 연결되지 않았습니다.");
    return;
  }

  if (!featureId || !status) {
    console.log("⚠️  Feature ID와 상태가 필요합니다.");
    console.log(
      "   사용법: node .claude/hooks/memory-sync.cjs update-feature-status [featureId] [status]"
    );
    return;
  }

  const {
    updateFeatureStatus,
    recalculateProgress,
    syncProgressToMemory,
  } = require("./lib/utils.cjs");

  updateFeatureStatus(memoryId, featureId, status);
  recalculateProgress(memoryId);
  syncProgressToMemory(memoryId);

  console.log(`✓ Feature ${featureId} 상태 업데이트: ${status}`);
}

// 메인 실행
const command = process.argv[2];

switch (command) {
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
  case "sync-progress":
    handleSyncProgress();
    break;
  case "workflow-complete":
    handleWorkflowComplete();
    break;
  case "update-feature-status":
    handleUpdateFeatureStatus();
    break;
  default:
    console.log(
      "사용법: node memory-sync.cjs [user-input|assistant-response|start|end|compact|sync-progress|workflow-complete|update-feature-status]"
    );
    process.exit(1);
}
