---
name: workflow-task-point
description: Feature별로 피보나치 수열 기반의 포인트를 산정하는 커맨드
version: 3.2.0
---

# /workflow-task-point

Feature에 포인트를 산정하고 `feature-list.md`를 업데이트합니다.

## 선행 조건

- `/workflow-domain-definition` 완료
- `.claude/docs/feature-list.md` 존재
- `.claude/docs/feature-list/*.md` 세부 파일 존재

## 실행 프로세스

### Phase 1: Feature 분석 & 포인트 산정

**Agent: task-point-estimator**

- Feature 목록 및 세부 문서 분석
- 복잡도/불확실성 파악
- 포인트 산정

### Phase 2: 문서 업데이트

**Agent: task-point-estimator**

- Feature 요약 테이블에 포인트 컬럼 추가
- Task 상세 섹션에 포인트 표시
- 13pt 이상 Feature 검토 필요 표시

### Phase 3: Review & Confirm

사용자 검토:

- 포인트 검토 및 조정
- 13pt 이상 Feature 분할 필요 여부

**승인 후:**

> 💡 **Skill**: `@.claude/skills/managing-memory/SKILL.md` → `reference/hooks.md#workflow-complete`

`workflow-complete task-point` 실행

## 결과물

- `.claude/docs/feature-list.md` (포인트 컬럼 업데이트)
