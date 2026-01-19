---
name: workflow-feature-spec
description: 특정 기능의 요구사항을 분석하고 구현 계획을 수립하는 커맨드
version: 3.2.1
---

# /workflow-feature-spec $ARGUMENTS

선택한 기능의 요구사항을 분석하고 구현 계획을 수립합니다.

## 인자 처리

feature-resolver 스킬을 사용하여 인자를 해석합니다.

| 입력 형태    | 예시                                 | 설명                              |
| ------------ | ------------------------------------ | --------------------------------- |
| **Group**    | `인증`                               | Group 내 Feature들을 병렬 실행 ⭐ |
| 파일 참조    | `@.claude/docs/feature-list/auth.md` | 파일 직접 참조                    |
| Feature ID   | `AUTH-001`                           | Feature ID로 검색                 |
| Feature 이름 | `로그인 기능`                        | Feature 이름으로 검색             |
| 단순 텍스트  | `사용자 인증`                        | 새 Feature로 처리                 |

### Group 병렬 실행

`type: 'group'`인 경우:

```
1. Group 정보 표시 (이름, Feature 목록, 선행 조건)
2. Phase 1: Research 병렬 실행 (feature-research-agent × N)
3. Phase 2: Research 결과 검토
4. Phase 3: Plan 병렬 실행 (planning-agent × N)
5. Phase 4: Plan 결과 검토
```

## 실행 프로세스

### Phase 0: Restricted Zones Loading

loading-restricted-zones 스킬을 사용하여 제한 영역을 로드합니다.

### Phase 1: Research (분석)

> ⚠️ 제한 영역 준수 | **설계 금지** - 분석만 수행

**시작 시:**

managing-memory 스킬의 `update-feature-status` 훅을 사용하여 `update-feature-status [FEATURE_ID] in_progress` 실행 후 feature-research를 수행

feature-research-agent 에이전트를 사용하여 요구사항을 분석하고, 결과를 `.claude/docs/research/[Feature ID]-research.md`에 저장합니다.

### Phase 2: Review & Confirm

review-and-confirm 스킬을 사용하여 사용자 검토를 진행합니다.

검토 항목:

- 요구사항 분석 정확성
- API 문서 URL 확인 (필요 시)
- Figma URL 확인 (필요 시)

### Phase 3: Design & Planning

> 📋 **전제조건**: Phase 2 승인 완료

planning-agent 에이전트를 사용하여 기술 설계 및 구현 계획을 수립하고, 결과를 `.claude/docs/plan/[Feature ID]-plan.md`에 저장합니다.

> ⚠️ **Implementation Groups 작성 필수** (4-6개 그룹, 각 그룹 3-7개 task)

### Phase 4: Review & Confirm

> 📋 **전제조건**: Phase 3 완료

review-and-confirm 스킬을 사용하여 사용자 검토를 진행합니다.

검토 항목:

- 기술 설계 타당성
- Implementation Groups 구성 적절성
- 의사결정 항목 확인

**승인 시:**

managing-memory 스킬의 `update-feature-status` 훅을 사용하여 `update-feature-status [FEATURE_ID] spec_done` 실행

## 결과물

| 파일                                             | 설명                   |
| ------------------------------------------------ | ---------------------- |
| `.claude/docs/research/[Feature ID]-research.md` | 요구사항 분석          |
| `.claude/docs/plan/[Feature ID]-plan.md`         | 기술 설계 및 구현 계획 |

## 다음 단계

```
/workflow-implement [Feature ID]
```
