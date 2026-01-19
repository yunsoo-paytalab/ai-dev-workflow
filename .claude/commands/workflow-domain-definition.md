---
name: workflow-domain-definition
description: 프로젝트의 도메인을 정의하고 기능 목록을 작성하는 커맨드
version: 3.2.1
---

# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다.

## 실행 프로세스

### Phase 0: Restricted Zones Loading

loading-restricted-zones 스킬을 사용하여 제한 영역을 로드합니다.

### Phase 1: Research (분석)

> ⚠️ 제한 영역 준수 | **설계 금지** - 분석만 수행

domain-research-agent 에이전트를 사용하여 도메인을 분석하고, 결과를 `.claude/docs/research/domain-research.md`에 저장합니다.

### Phase 2: Review & Confirm

review-and-confirm 스킬을 사용하여 사용자 검토를 진행합니다.

검토 항목: Research 결과 정확성, 추가/누락 사항 확인

### Phase 3: Design & Documentation

> 📋 **전제조건**: Phase 2 승인 완료

#### Phase 3-1: 병렬 실행

다음 2개 에이전트를 동시에 실행합니다:

- domain-definition-writer 에이전트 → `.claude/docs/domain-definition.md`
- page-structure-writer 에이전트 → `.claude/docs/page-structure.md`

#### Phase 3-2: 병렬 실행 (Phase 3-1 완료 후)

다음 2개 에이전트를 동시에 실행합니다:

- feature-classifier 에이전트 → `.claude/docs/feature-list.md`
- user-scenario-writer 에이전트 → `.claude/docs/user-scenarios.md`

### Phase 4: Review & Confirm

> 📋 **전제조건**: Phase 3 완료

review-and-confirm 스킬을 사용하여 사용자 검토를 진행합니다.

검토 항목:

- 도메인 경계, Feature/Task 분류 적절성
- 유저 시나리오 흐름 완성도

**승인 시:**

```
/workflow-memory complete domain-definition
```

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
