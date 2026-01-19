#!/usr/bin/env node

/**
 * Skill Auto-Activation Hook
 *
 * UserPromptSubmit 훅에서 호출되어 사용자 프롬프트를 분석하고,
 * 관련 스킬의 규칙을 Claude 컨텍스트에 주입합니다.
 *
 * 사용법:
 *   node skill-activator.cjs
 *
 * stdin으로 Claude Code hook 데이터를 받습니다.
 * stdout으로 출력된 내용은 Claude의 컨텍스트에 추가됩니다.
 */

const fs = require("fs");
const path = require("path");

/**
 * 프로젝트 루트 디렉토리 찾기
 * @param {string} startDir 시작 디렉토리
 * @returns {string|null} 프로젝트 루트 또는 null
 */
function findProjectRoot(startDir) {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, ".claude"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

/**
 * skill-rules.json 로드
 * @param {string} projectRoot 프로젝트 루트
 * @returns {object|null} 스킬 규칙 또는 null
 */
function loadSkillRules(projectRoot) {
  const rulesPath = path.join(projectRoot, ".claude", "skills", "skill-rules.json");
  if (!fs.existsSync(rulesPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(rulesPath, "utf-8"));
  } catch (e) {
    return null;
  }
}

/**
 * 프롬프트가 스킬 트리거와 매칭되는지 확인
 * @param {string} prompt 사용자 프롬프트
 * @param {object} triggers 트리거 설정
 * @returns {boolean} 매칭 여부
 */
function matchesTriggers(prompt, triggers) {
  const lowerPrompt = prompt.toLowerCase();

  // 키워드 매칭
  if (triggers.keywords) {
    for (const keyword of triggers.keywords) {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        return true;
      }
    }
  }

  // 의도 패턴 매칭 (정규식)
  if (triggers.intentPatterns) {
    for (const pattern of triggers.intentPatterns) {
      try {
        const regex = new RegExp(pattern, "i");
        if (regex.test(prompt)) {
          return true;
        }
      } catch (e) {
        // 잘못된 정규식 무시
      }
    }
  }

  // 워크플로우 패턴 매칭
  if (triggers.workflowPatterns) {
    for (const pattern of triggers.workflowPatterns) {
      if (prompt.includes(pattern)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 우선순위를 숫자로 변환
 * @param {string} priority 우선순위 문자열
 * @returns {number} 우선순위 숫자
 */
function priorityToNumber(priority) {
  const map = { critical: 0, high: 1, medium: 2, low: 3 };
  return map[priority] ?? 99;
}

/**
 * 매칭된 스킬 찾기
 * @param {string} prompt 사용자 프롬프트
 * @param {object} skillRules 스킬 규칙
 * @returns {Array} 매칭된 스킬 목록
 */
function findMatchingSkills(prompt, skillRules) {
  const matched = [];

  for (const [skillName, skill] of Object.entries(skillRules.skills || {})) {
    if (matchesTriggers(prompt, skill.triggers || {})) {
      matched.push({
        name: skillName,
        ...skill,
      });
    }
  }

  // 우선순위 정렬
  matched.sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));

  return matched;
}

/**
 * 스킬 활성화 메시지 생성
 * @param {Array} skills 매칭된 스킬 목록
 * @returns {string} 활성화 메시지
 */
function generateActivationMessage(skills) {
  if (skills.length === 0) {
    return "";
  }

  const lines = [];
  lines.push("━".repeat(60));
  lines.push("🎯 SKILL AUTO-ACTIVATION");
  lines.push("━".repeat(60));

  // 우선순위별 그룹화
  const priorityEmoji = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  };

  for (const skill of skills) {
    const emoji = priorityEmoji[skill.priority] || "⚪";
    lines.push("");
    lines.push(`${emoji} [${skill.priority?.toUpperCase()}] ${skill.name}`);
    lines.push(`   ${skill.description || ""}`);

    // 규칙이 있으면 출력 (특히 review-and-confirm)
    if (skill.rules && skill.rules.length > 0) {
      lines.push("");
      for (const rule of skill.rules) {
        lines.push(`   ${rule}`);
      }
    }
  }

  lines.push("");
  lines.push("━".repeat(60));
  lines.push("위 스킬의 규칙을 반드시 준수하여 작업을 진행하세요.");
  lines.push("━".repeat(60));

  return lines.join("\n");
}

/**
 * 메인 실행
 */
function main() {
  // stdin에서 hook 데이터 읽기
  let hookData = {};
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (input.trim()) {
      hookData = JSON.parse(input);
    }
  } catch (e) {
    // stdin이 비어있거나 JSON이 아닌 경우 종료
    process.exit(0);
  }

  const prompt = hookData.prompt || "";
  const cwd = hookData.cwd || process.cwd();

  // 시스템 메시지 필터링
  if (
    !prompt.trim() ||
    prompt.startsWith("<command-name>") ||
    prompt.startsWith("<command-message>") ||
    prompt.startsWith("<local-command") ||
    prompt.includes("<system-reminder>")
  ) {
    process.exit(0);
  }

  // 프로젝트 루트 찾기
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) {
    process.exit(0);
  }

  // 스킬 규칙 로드
  const skillRules = loadSkillRules(projectRoot);
  if (!skillRules) {
    process.exit(0);
  }

  // 매칭된 스킬 찾기
  const matchedSkills = findMatchingSkills(prompt, skillRules);

  // 활성화 메시지 생성 및 출력
  const message = generateActivationMessage(matchedSkills);
  if (message) {
    // stdout으로 출력 → Claude 컨텍스트에 주입됨
    console.log(message);
  }

  process.exit(0);
}

main();
