import { spawn } from "child_process";
import chalk from "chalk";

/**
 * 워크플로우 정의 (start 제외)
 */
export const WORKFLOWS = {
  // Feature 관련
  "feature-spec": {
    command: "/workflow-feature-spec",
    name: "Feature Spec 작성",
    description: "Feature의 상세 명세를 작성합니다",
    icon: "📋",
    requiresArg: true,
    argName: "featureId",
    category: "feature",
  },
  implement: {
    command: "/workflow-implement",
    name: "구현",
    description: "Feature를 구현합니다",
    icon: "🔨",
    requiresArg: true,
    argName: "featureId",
    category: "feature",
  },
  ui: {
    command: "/workflow-ui",
    name: "UI 구현",
    description: "UI 컴포넌트를 구현합니다",
    icon: "🎨",
    requiresArg: true,
    argName: "featureId",
    category: "feature",
  },

  // 프로젝트 관련
  "domain-definition": {
    command: "/workflow-domain-definition",
    name: "도메인 정의",
    description:
      "requirements.md에서 도메인을 분석하고 feature-list를 생성합니다",
    icon: "🏗️",
    requiresArg: false,
    category: "project",
  },
  "legacy-profile": {
    command: "/workflow-legacy-profile",
    name: "레거시 분석",
    description: "기존 코드베이스를 분석합니다",
    icon: "🔍",
    requiresArg: false,
    category: "project",
  },
  integrate: {
    command: "/workflow-integrate",
    name: "통합",
    description: "구현된 기능들을 통합합니다",
    icon: "🔗",
    requiresArg: false,
    category: "project",
  },
  e2e: {
    command: "/workflow-e2e",
    name: "E2E 테스트",
    description: "End-to-End 테스트를 실행합니다",
    icon: "🧪",
    requiresArg: false,
    category: "project",
  },

  // 유틸리티
  status: {
    command: "/workflow status",
    name: "진행 상황",
    description: "현재 진행 상황을 확인합니다",
    icon: "📊",
    requiresArg: false,
    category: "utility",
  },
  reset: {
    command: "/workflow reset",
    name: "워크플로우 리셋",
    description: "워크플로우 상태를 초기화합니다",
    icon: "🔄",
    requiresArg: false,
    category: "utility",
  },
  update: {
    command: "/workflow update",
    name: "메모리 업데이트",
    description: "memory.md 파일을 업데이트합니다",
    icon: "📝",
    requiresArg: false,
    category: "utility",
  },
  help: {
    command: "/workflow help",
    name: "도움말",
    description: "사용 가능한 모든 명령어를 표시합니다",
    icon: "❓",
    requiresArg: false,
    category: "utility",
  },
};

// 설정
let bypassPermissions = false;

/**
 * Bypass Permissions 설정
 * @param {boolean} enabled - 활성화 여부
 */
export function setBypassPermissions(enabled) {
  bypassPermissions = enabled;
}

/**
 * Bypass Permissions 상태 확인
 * @returns {boolean}
 */
export function getBypassPermissions() {
  return bypassPermissions;
}

/**
 * Claude Code CLI 실행 (대화형 모드)
 * @param {string} command - 실행할 명령어 (예: '/workflow-feature-spec')
 * @param {string} arg - 명령어 인자 (예: 'AUTH-001')
 */
export function runClaudeCommand(command, arg = "") {
  // 전체 프롬프트 구성
  const fullPrompt = arg ? `${command} ${arg}` : command;

  return new Promise((resolve, reject) => {
    console.log();
    console.log(chalk.cyan("🤖 Claude Code 실행 중..."));
    console.log(chalk.gray(`   Command: ${fullPrompt}`));
    if (bypassPermissions) {
      console.log(chalk.yellow("   ⚠️  Bypass Permissions: ON"));
    }
    console.log();

    // 인자 구성
    const args = bypassPermissions
      ? ["--dangerously-skip-permissions", fullPrompt]
      : [fullPrompt];

    // 대화형 모드로 Claude 실행
    const claude = spawn("claude", args, {
      stdio: "inherit",
    });

    claude.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "Claude Code CLI가 설치되어 있지 않습니다. `npm install -g @anthropic-ai/claude-code`로 설치하세요."
          )
        );
      } else {
        reject(error);
      }
    });

    claude.on("close", (code) => {
      // 정상 종료 또는 사용자가 종료한 경우 모두 resolve
      resolve();
    });
  });
}

/**
 * 워크플로우 실행
 * @param {string} workflowKey - WORKFLOWS 객체의 키
 * @param {string} arg - 워크플로우 인자 (featureId 등)
 */
export function runWorkflow(workflowKey, arg = "") {
  const workflow = WORKFLOWS[workflowKey];
  if (!workflow) {
    return Promise.reject(new Error(`Unknown workflow: ${workflowKey}`));
  }
  return runClaudeCommand(workflow.command, arg);
}

/**
 * Feature Spec 워크플로우 실행
 */
export function runFeatureSpec(featureId) {
  return runWorkflow("feature-spec", featureId);
}

/**
 * Implement 워크플로우 실행
 */
export function runImplement(featureId) {
  return runWorkflow("implement", featureId);
}

/**
 * Task 상태 업데이트 (Claude에게 요청)
 */
export function updateTaskStatus(taskId, status) {
  return runClaudeCommand(
    `Task ${taskId}의 상태를 ${status}로 업데이트해주세요. feature-list.md 파일을 수정해주세요.`
  );
}
