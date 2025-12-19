---
name: workflow-feature-spec
description: 특정 기능의 요구사항을 분석하고 구현 계획을 수립하는 커맨드
version: 3.1.0
---

# /workflow-feature-spec $ARGUMENTS

선택한 기능의 요구사항을 분석하고 구현 계획을 수립합니다.

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                                 | 설명                       |
| ------------ | ------------------------------------ | -------------------------- |
| 파일 참조    | `@.claude/docs/feature-list/auth.md` | 파일 직접 참조             |
| Feature ID   | `AUTH-001`                           | Feature ID로 문서 검색     |
| Feature 이름 | `로그인 기능`                        | Feature 이름으로 문서 검색 |
| 단순 텍스트  | `사용자 인증`                        | 새 Feature로 처리          |

### 참조 문서 탐색

> 💡 **Feature Resolver SKILL 사용**
>
> 상세 로직: `@.claude/skills/feature-resolver/SKILL.md` 참조
>
> ```
> 파라미터:
> - argument: $ARGUMENTS
> - searchPaths: [".claude/docs/feature-list"]
> - allowFallback: true
> ```

**결과에 따른 처리:**

| SKILL 결과     | 처리 방법                                                                       |
| -------------- | ------------------------------------------------------------------------------- |
| `feature-id`   | feature-list 파일 존재 → 로드 → Phase 0부터 시작 (기존 업데이트 또는 새로 작성) |
| `feature-name` | 매칭된 feature-list 파일 로드 → Phase 0부터 시작                                |
| `direct`       | 직접 참조된 feature-list 파일 로드 → Phase 0부터 시작                           |
| `fallback`     | 새 Feature로 처리 → Phase 0부터 시작 (처음부터 작성)                            |

## 실행 프로세스

### Phase 0: Restricted Zones Loading (제한 영역 로드)

`.claude/docs/legacy-analysis/restricted-zones.json` 확인 (있는 경우)

**Danger Zones (위험도별 컨펌 필요):**

- 🔴 Critical: 반드시 명시적 승인 필요
- 🟠 High Risk: 변경 계획 + 승인 필요
- 🟡 Medium Risk: 주의 안내 필요
- 🟢 Safe: 자유롭게 수정 가능

**No-Reference Zones (참고 금지):**

- 🚫 Anti-Pattern, ⛔ Deprecated, 🔧 Hack, 🐛 Known Bug
- 해당 영역의 코드는 읽거나 참고하지 않음

### Phase 1: Research (분석)

> ⚠️ Phase 0에서 로드한 제한 영역 준수
> ⚠️ **설계는 하지 않음** - 분석만 수행

**Phase 시작 시:**

Feature ID를 추출한 후, 다음 명령어로 Feature 상태를 `in_progress`로 업데이트:

```bash
node .claude/hooks/memory-sync.cjs update-feature-status [FEATURE_ID] in_progress
```

**Agent: feature-research-agent**

**입력: 참조 문서 또는 일반 텍스트**

- ✅ **참조 문서 있음**: `.claude/docs/feature-list/[파일명].md` 문서를 읽고, 정의된 요구사항을 기반으로 분석 수행
- ❌ **참조 문서 없음**: `$ARGUMENTS`를 새 Feature 설명으로 간주하고, 해당 텍스트를 기반으로 분석 수행

**분석 항목:**

1. **기능 개요**: 목적과 핵심 가치 제안
2. **사용자 시나리오**: 실제 사용 흐름 및 케이스
3. **비즈니스 규칙**: 규칙, 제약사항, 검증 조건
4. **기존 코드베이스 분석**: 재사용 가능 컴포넌트/패턴, 기술적 제약사항
5. **데이터 연동 요구사항**: API, 상태 관리, 외부 서비스

**출력:** `.claude/docs/research/[Feature ID]-research.md` (섹션 1.1~1.5 작성)

### Phase 2: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 요구사항 분석의 정확성 확인
- 추가 요구사항 필요 여부 결정

**참고 자료 확인**

1. **API 문서 확인 (API 구현이 필요한 경우)**

   - 참고할 API 문서(Notion 등) URL이 있는지 사용자에게 확인
   - URL 제공 시: Notion MCP를 활용하여 API 스펙 확인

2. **Figma 디자인 확인 (UI 구현이 필요한 경우)**
   - 참고할 Figma URL이 있는지 사용자에게 확인
   - URL 제공 시: Figma MCP를 활용하여 디자인 스펙 확인
   - 컴포넌트 구조, 스타일, 인터랙션 파악

### Phase 3: Design & Planning (설계 및 계획)

**Agent: planning-agent**

**기존 코드 탐색:**

- 요구사항 기반으로 관련 코드 검색
- 재사용 가능 컴포넌트/패턴 파악
- 기술적 제약사항 확인

**설계 항목:**

- 변경 사항 설계 (Before → After)
- 인터페이스/타입 정의
- API 스펙 설계
- 데이터 흐름 설계
- 컴포넌트 구조 (개요만, 상세는 /workflow-ui에서)
- 핵심 로직 설계 (pseudo-code, 핵심 비즈니스 로직은 실제 코드)
- 테스트 설계 (핵심 비즈니스 로직 Unit Test, 핵심 컴포넌트 Component Test)

**계획 항목 (중요!):**

> ⚠️ **Implementation Groups 작성 필수**
>
> - 논리적으로 관련된 작업들을 그룹으로 묶어 작성
> - 각 그룹은 독립적으로 검증 가능하고 commit 가능한 단위
> - 전체 4-6개 그룹으로 구성 권장
> - 각 그룹에 명확한 검증 조건 명시

- **Implementation Groups**: 논리적 단위로 그룹화된 구현 계획
  - 각 그룹: 3-7개 정도의 관련 task
  - 그룹별 검증 조건 명시
  - 의존성 순서 고려
- **Detailed Tasks**: 필요시 상세 task 목록 (선택적)
- **의사결정 필요 항목 정리**
- **검증 방법 정의**

**입력:** `.claude/docs/research/[Feature ID]-research.md` (Phase 1의 Research 결과)

**출력:** `.claude/docs/plan/[Feature ID]-plan.md` (섹션 2~4 작성)

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 기술 설계의 타당성 검토
- 의사결정 항목 확인 및 선택
- 구현 순서 검토
- 검증 방법 확인

**Phase 완료 시:**

사용자 승인이 완료되면, 다음 명령어로 Feature 상태를 `spec_done`으로 업데이트:

```bash
node .claude/hooks/memory-sync.cjs update-feature-status [FEATURE_ID] spec_done
```

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
>
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/\*.md (자동)

**중요한 기술적 결정**이 있었다면 memory-manager 에이전트를 호출하여 기록하세요.

## 사용자 결정 포인트

🔔 **Phase 2 확인 사항**:

- 요구사항이 명확히 파악되었는가?
- (API 구현 필요 시) 참고할 API 문서 URL이 있는가?
- (UI 구현 필요 시) 참고할 Figma URL이 있는가?

🔔 **Phase 4 확인 사항**:

- 기술 설계가 적절한가?
- 의사결정 항목에 대한 선택이 완료되었는가?
- **Implementation Groups가 논리적으로 잘 구성되었는가?** ⭐
  - 각 그룹이 독립적으로 검증 가능한가?
  - 각 그룹이 commit 가능한 의미있는 단위인가?
  - 그룹별 검증 조건이 명확한가?
- 구현 순서(그룹 순서)가 적절한가?
- 검증 방법이 충분한가?

## 결과물

- `.claude/docs/research/[Feature ID]-research.md` - 요구사항 분석 문서 (Phase 1)
- `.claude/docs/plan/[Feature ID]-plan.md` - 기술 설계 및 구현 계획 문서 (Phase 3)

## 다음 단계

기능 명세가 완료되면 `/workflow-implement [Feature ID]`를 실행하여 구현을 시작합니다.
