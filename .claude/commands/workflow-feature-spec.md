---
name: workflow-feature-spec
description: 특정 기능의 요구사항을 분석하고 구현 계획을 수립하는 커맨드
version: 3.2.0
---

# /workflow-feature-spec $ARGUMENTS

선택한 기능의 요구사항을 분석하고 구현 계획을 수립합니다.

## 인자 처리

> 💡 **Skill**: `@.claude/skills/feature-resolver/SKILL.md`

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

> 💡 **Skill**: `@.claude/skills/loading-restricted-zones/SKILL.md`

### Phase 1: Research (분석)

> ⚠️ 제한 영역 준수 | **설계 금지** - 분석만 수행

**시작 시:**

```bash
node .claude/hooks/memory-sync.cjs update-feature-status [FEATURE_ID] in_progress
```

**Agent: feature-research-agent** → `.claude/docs/research/[Feature ID]-research.md`

### Phase 2: Review & Confirm

사용자 검토:

- 요구사항 분석 정확성
- API 문서 URL 확인 (필요 시)
- Figma URL 확인 (필요 시)

### Phase 3: Design & Planning

**Agent: planning-agent** → `.claude/docs/plan/[Feature ID]-plan.md`

> ⚠️ **Implementation Groups 작성 필수** (4-6개 그룹, 각 그룹 3-7개 task)

### Phase 4: Review & Confirm

사용자 검토:

- 기술 설계 타당성
- Implementation Groups 구성 적절성
- 의사결정 항목 확인

**승인 후:**

```bash
node .claude/hooks/memory-sync.cjs update-feature-status [FEATURE_ID] spec_done
```

## 결과물

| 파일                                             | 설명                   |
| ------------------------------------------------ | ---------------------- |
| `.claude/docs/research/[Feature ID]-research.md` | 요구사항 분석          |
| `.claude/docs/plan/[Feature ID]-plan.md`         | 기술 설계 및 구현 계획 |

## 다음 단계

```
/workflow-implement [Feature ID]
```
