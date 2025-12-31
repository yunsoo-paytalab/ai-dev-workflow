---
name: workflow-domain-definition
description: 프로젝트의 도메인을 정의하고 기능 목록을 작성하는 커맨드
version: 3.2.0
---

# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다.

## 실행 프로세스

### Phase 0: Restricted Zones Loading

> 💡 **Skill**: `@.claude/skills/loading-restricted-zones/SKILL.md`

### Phase 1: Research (분석)

> ⚠️ 제한 영역 준수 | **설계 금지** - 분석만 수행

**Agent: domain-research-agent** → `.claude/docs/research/domain-research.md`

### Phase 2: Review & Confirm

사용자 검토: Research 결과 정확성, 추가/누락 사항 확인

### Phase 3: Design & Documentation

#### Phase 3-1: 병렬 실행

⚡ **2개 Agent 동시 실행:**

| Agent                    | 출력                                |
| ------------------------ | ----------------------------------- |
| domain-definition-writer | `.claude/docs/domain-definition.md` |
| page-structure-writer    | `.claude/docs/page-structure.md`    |

#### Phase 3-2: 병렬 실행 (Phase 3-1 완료 후)

⚡ **2개 Agent 동시 실행:**

| Agent                | 출력                             |
| -------------------- | -------------------------------- |
| feature-classifier   | `.claude/docs/feature-list.md`   |
| user-scenario-writer | `.claude/docs/user-scenarios.md` |

### Phase 4: Review & Confirm

사용자 검토:

- 도메인 경계, Feature/Task 분류 적절성
- 유저 시나리오 흐름 완성도

**승인 후:**

> 💡 **Skill**: `@.claude/skills/managing-memory/SKILL.md` → `reference/hooks.md#workflow-complete`

`workflow-complete domain-definition` 실행

### Phase 5: Progress 동기화

> 💡 **Skill**: `@.claude/skills/managing-memory/SKILL.md` → `reference/hooks.md#sync-progress`

`sync-progress` 실행

## 다음 단계

```
/workflow-feature-detail
```

## 결과물

| 파일                                       | 설명              |
| ------------------------------------------ | ----------------- |
| `.claude/docs/research/domain-research.md` | 도메인 분석       |
| `.claude/docs/domain-definition.md`        | 도메인 정의       |
| `.claude/docs/feature-list.md`             | Feature/Task 목록 |
| `.claude/docs/page-structure.md`           | 페이지 구조       |
| `.claude/docs/user-scenarios.md`           | 유저 시나리오     |
