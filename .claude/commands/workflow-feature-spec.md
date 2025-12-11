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

**기본 참조 경로**: `.claude/docs/feature-list/`

**파일 형식**: 각 파일의 첫 줄은 `# Feature ID: Feature 이름` 형식

**탐색 로직**:

1. `$ARGUMENTS`가 `@`로 시작하면 → 해당 파일을 직접 참조 문서로 사용
2. 그 외의 경우, `.claude/docs/feature-list/` 폴더 내 모든 파일의 첫 줄을 읽음
3. `$ARGUMENTS`와 매칭:
   - Feature ID 일치 (예: `AUTH-001`)
   - Feature 이름 일치 또는 포함 (예: `로그인 기능`)
   - 부분 텍스트 매칭 (예: `로그인` → `로그인 기능` 매칭)
4. **매칭 결과에 따른 분기**:
   - ✅ 매칭 성공 → 해당 참조 문서를 기반으로 Phase 2 진행
   - ❌ 매칭 실패 → `$ARGUMENTS`를 일반 텍스트로 처리하여 새 Feature로 Phase 2 진행

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

### Phase 1: Research & Design (조사 및 설계)

> ⚠️ Phase 0에서 로드한 제한 영역 준수

**Agent: feature-research-agent**

**입력: 참조 문서 또는 일반 텍스트**

- ✅ **참조 문서 있음**: `.claude/docs/feature-list/[파일명].md` 문서를 읽고, 정의된 요구사항을 기반으로 조사 및 설계 수행
- ❌ **참조 문서 없음**: `$ARGUMENTS`를 새 Feature 설명으로 간주하고, 해당 텍스트를 기반으로 조사 및 설계 수행

**조사 항목 (참조 문서 기반):**

- 참조 문서의 기능 요구사항 분석 및 구체화
- 관련 코드베이스 탐색
- 재사용 가능 컴포넌트 확인
- 유사 기능 구현 패턴 분석

**설계 항목:**

- 변경 사항 설계 (Before → After)
- 인터페이스/타입 정의
- API 스펙 설계
- 데이터 흐름 설계
- 컴포넌트 구조 (개요만, 상세는 /workflow-ui에서)
- 핵심 로직 설계 (pseudo-code, 핵심 비즈니스 로직은 실제 코드)
- 테스트 설계 (핵심 비즈니스 로직 Unit Test, 핵심 컴포넌트 Component Test)

**출력:** `.claude/docs/specs/[Feature ID]-spec.md` (예: `AUTH-001-spec.md`, 섹션 1~4)

### Phase 2: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 요구사항 분석의 정확성 확인
- 기술 설계의 타당성 검토
- 재사용 컴포넌트 선택 검증
- 추가 조사 필요 여부 결정

**API 문서 확인 (API 구현이 필요한 경우)**

- 참고할 API 문서(Notion 등) URL이 있는지 사용자에게 확인
- URL 제공 시: Notion MCP를 활용하여 API 스펙 확인
- API 스펙 기반으로 인터페이스/타입 정의 보완

### Phase 3: Planning (계획)

**Agent: planning-agent**

- Research 결과 기반 구현 계획 수립
- 의사결정 필요 항목 정리
- Phase별 작업 목록 작성 (파일명 + 한 줄 설명)
- 검증 방법 정의

**출력:** `.claude/docs/specs/[Feature ID]-spec.md` (섹션 5 추가)

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 의사결정 항목 확인 및 선택
- 구현 순서 검토
- 검증 방법 확인

### Phase 5: Memory Update (메모리 업데이트) - 필수

> ⚠️ **필수**: 워크플로우 종료 전 반드시 memory-manager 에이전트를 호출해야 합니다.
>
> 호출 방법: "Use the memory-manager agent to update memory for feature-spec completion"

**Agent: memory-manager** (MUST BE CALLED)

**업데이트 대상:**

1. **progress.json 업데이트:**
   - tasks: 해당 Feature의 구현 작업 항목 추가
   - features[featureId].status: "spec-completed"
   - currentPhase: "feature-spec-completed"

2. **memory.md 업데이트:**
   - 프로젝트 전반에 적용되는 기술적 결정사항
   - 새로 발견된 제약사항
   - 공통 패턴/컨벤션 추가

3. **세션 요약 작성:**
   - 이번 세션에서 수행한 작업 요약
   - 주요 결정사항 기록

## 사용자 결정 포인트

🔔 **Phase 3 확인 사항**:

- 요구사항이 명확히 파악되었는가?
- 기술 설계가 적절한가?
- 재사용 가능한 컴포넌트가 모두 식별되었는가?
- (API 구현 필요 시) 참고할 API 문서 URL이 있는가?

🔔 **Phase 5 확인 사항**:

- 의사결정 항목에 대한 선택이 완료되었는가?
- 구현 순서가 적절한가?
- 검증 방법이 충분한가?

## 결과물

- `.claude/docs/specs/[Feature ID]-spec.md` - 통합 기능 명세서 (Research + Plan)

## 다음 단계

기능 명세가 완료되면 `/workflow-implement .claude/docs/specs/[Feature ID]-spec.md`을 실행하여 구현을 시작합니다.
