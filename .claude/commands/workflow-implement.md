# /workflow-implement $ARGUMENTS

선택한 기능을 RPI 패턴과 TDD 방식으로 구현합니다.

> ⚠️ **필수 선행 작업**: 이 워크플로우를 실행하기 전에 `/workflow-feature-spec $ARGUMENTS`을 먼저 완료해야 합니다.

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                          | 설명                       |
| ------------ | ----------------------------- | -------------------------- |
| 파일 참조    | `@.claude/docs/specs/auth.md` | 파일 직접 참조             |
| Feature ID   | `AUTH-001`                    | Feature ID로 문서 검색     |
| Feature 이름 | `로그인 기능`                 | Feature 이름으로 문서 검색 |

### 실행 모드 옵션

| 옵션         | 설명                                                        |
| ------------ | ----------------------------------------------------------- |
| (기본)       | **인터랙티브 모드**: 각 그룹 완료 후 검토 및 commit 결정    |
| `--batch`    | **배치 모드**: 모든 그룹을 한 번에 실행하고 마지막에만 검토 |
| `--with-api` | API 연동 포함 (선택적)                                      |

**예시:**

- `/workflow-implement AUTH-001` - 인터랙티브 모드 (각 그룹마다 검토)
- `/workflow-implement AUTH-001 --batch` - 배치 모드 (마지막에만 검토)
- `/workflow-implement AUTH-001 --batch --with-api` - 배치 모드 + API 연동

### 참조 문서 탐색

> ⚠️ **필수 참조 문서**:
>
> - **Research 파일**: `.claude/docs/research/[Feature ID]-research.md` (요구사항)
> - **Plan 파일**: `.claude/docs/plan/[Feature ID]-plan.md` (구현 계획)

**Feature ID 패턴**: `^[A-Z]+(-[A-Z]+)*-\d+$`

- 예: `AUTH-001`, `USER-MGMT-002`, `DASHBOARD-123`

**탐색 로직**:

1. **`$ARGUMENTS`가 `@`로 시작하면** → 해당 파일을 직접 plan 파일로 사용
   - Feature ID 추출 후 해당 research 파일도 로드 시도
   - research 파일이 없으면 에러 발생

2. **Feature ID 패턴 감지 시** (예: `AUTH-001`):

   ```bash
   # Feature ID 추출
   FEATURE_ID="$ARGUMENTS"  # 예: AUTH-001

   # 필수 파일 경로 확인
   RESEARCH_FILE=".claude/docs/research/${FEATURE_ID}-research.md"
   PLAN_FILE=".claude/docs/plan/${FEATURE_ID}-plan.md"
   ```

   **분기 처리**:

   - ✅ **research + plan 모두 존재**:
     - 두 파일을 모두 로드
     - 구현 진행 (Phase 1 시작)

   - ❌ **하나라도 없는 경우**:
     - **에러 메시지 출력**:
       ```
       ❌ 필수 파일이 없습니다:

       누락된 파일:
       - .claude/docs/research/AUTH-001-research.md
       또는
       - .claude/docs/plan/AUTH-001-plan.md

       먼저 다음 명령어를 실행하세요:
       /workflow-feature-spec AUTH-001
       ```
     - 워크플로우 중단

3. **Feature ID 패턴이 아닌 경우** (예: `로그인 기능`):

   - `.claude/docs/plan/` 폴더 내 모든 파일명에서 Feature ID 추출
   - `$ARGUMENTS`와 매칭:
     - Feature 이름 일치 또는 포함 (예: `로그인 기능`)
     - 부분 텍스트 매칭 (예: `로그인` → `로그인 기능` 매칭)
   - **매칭 결과**:
     - ✅ 매칭 성공 → plan 파일과 research 파일을 모두 로드하여 구현 진행
     - ❌ 매칭 실패 → 에러 메시지 + `/workflow-feature-spec` 먼저 실행 안내

**로드된 문서 역할**:

- **Research 파일**: 요구사항 검증의 기준 (1.4.1 단계에서 사용)
- **Plan 파일**: 구현 계획 및 Implementation Groups (1.1~1.3 단계에서 사용)

## 실행 프로세스

### Phase 0: 실행 모드 선택

> ⚠️ `--batch` 플래그가 있는 경우 이 단계를 건너뛰고 배치 모드로 진행합니다.

**Spec 문서 확인:**

- Spec 문서의 섹션 4.1 "Implementation Groups" 참조
- 전체 그룹 개수 및 각 그룹의 task 개수 파악

**사용자에게 모드 선택 요청:**

```
📋 Implementation Groups 개요:
  - 전체 그룹: 5개
  - 예상 작업 시간: 중간 규모

🤔 어떤 모드로 진행하시겠어요?

[1] 🎯 인터랙티브 모드 (추천)
    → 각 그룹 완료 후 검토 및 commit
    → 중간에 피드백 반영 가능
    → 세밀한 제어 가능
    추천: 복잡한 feature, 학습 목적

[2] ⚡ 배치 모드
    → 모든 그룹을 한 번에 실행
    → 마지막에만 검토
    → 빠른 구현
    추천: 단순한 feature, 빠른 프로토타이핑
```

**모드 선택 후 진행:**

- 선택한 모드로 Phase 1 시작
- 선택 내용을 세션에 기록

---

### Phase 1: Implementation by Groups (그룹별 구현)

> ⚠️ **핵심 변경사항**: 구현 계획을 논리적 그룹 단위로 나누어 진행하며, 각 그룹 완료 후 개발자 검토 및 commit을 진행합니다.

**선택된 모드:**

🔹 **인터랙티브 모드**

- 각 그룹 완료 후 검토 및 commit 결정
- 중간에 피드백 반영 가능
- 논리적 단위로 commit 생성

🔹 **배치 모드**

- 모든 그룹을 연속으로 실행
- 각 그룹 완료 시 자동으로 git add만 수행 (commit 없음)
- 모든 그룹 완료 후 한 번에 검토 및 commit

---

**그룹별 반복 프로세스:**

각 그룹마다 다음 단계를 순서대로 진행:

#### 1.1 그룹 시작 - 현재 그룹 정보 안내

```
🔹 Group [N]/[전체]: [그룹명]
📋 Task 목록:
  - Task 1: [설명] - `파일명`
  - Task 2: [설명] - `파일명`
  ...
✅ 검증 조건: [이 그룹의 완료 조건]
```

#### 1.2 TDD Cycle (그룹 내 테스트 작성)

> ⚠️ **필수**: 구현 전 반드시 test-runner 에이전트를 먼저 호출해야 합니다.
>
> 호출 방법: "Use the test-runner agent to write tests for [현재 그룹의 기능]"

**Agent: test-runner** (MUST BE USED FIRST)

- 🔴 **Red**: 현재 그룹에 해당하는 실패하는 테스트 작성
- 🟢 **Green**: 테스트 통과하는 최소 구현
- 🔵 **Refactor**: 코드 개선

**테스트 작성 규칙:**

- describe, it 설명문은 **한글**로 작성
- 예: `describe("장바구니", () => { it("아이템 추가 시 목록에 포함되어야 한다", ...) })`

#### 1.3 그룹 구현

**Agent: implementation-agent**

현재 그룹의 task 목록에 따라 구현:

- **타입/인터페이스**: TypeScript 타입 및 인터페이스 정의
- **API 레이어**: API 함수, Mock 데이터
- **비즈니스 로직**: 커스텀 훅, 유틸리티 함수
- **UI 컴포넌트**: 컴포넌트, 스타일링
- **상태 관리**: Redux/Zustand 통합 (필요시)

#### 1.4 그룹 검증

그룹 구현 완료 후, 다음 두 단계로 검증을 수행합니다:

##### 1.4.1 요구사항 검증 ⭐

> ⚠️ **핵심 검증**: research 파일의 요구사항이 모두 반영되었는지 확인

**검증 절차:**

1. **Research 파일 참조**

   - `.claude/docs/research/[Feature ID]-research.md` 읽기
   - 현재 그룹과 관련된 요구사항 식별

2. **요구사항 체크리스트 생성**

   ```
   📋 현재 그룹 요구사항 검증:

   [Group N]: [그룹명]

   ✅ 필수 요구사항:
     ✅ [요구사항 1] - 구현됨 (파일: xxx.ts)
     ✅ [요구사항 2] - 구현됨 (파일: yyy.ts)
     ❌ [요구사항 3] - 누락됨 ⚠️

   ✅ 비즈니스 규칙:
     ✅ [규칙 1] - 적용됨
     ✅ [규칙 2] - 적용됨

   ✅ 데이터 연동:
     ✅ [API 스펙 1] - 구현됨
   ```

3. **누락 사항 처리**
   - ❌ 누락된 요구사항이 있는 경우:
     - 누락된 요구사항을 즉시 구현
     - 다시 1.4.1 검증 수행
   - ✅ 모든 요구사항 반영된 경우:
     - 1.4.2 기술적 검증으로 진행

##### 1.4.2 기술적 검증

> ⚠️ **Lint 에러 처리 규칙** (무한 루프 방지)
>
> - lint 에러 수정은 **최대 3회까지만 재시도**
> - 3회 시도 후에도 해결되지 않으면 **사용자에게 보고**하고 다음 단계로 진행
> - 절대로 lint 수정을 무한 반복하지 말 것

**자동 검증:**

```bash
npm run lint          # 최대 3회 재시도
npm run type-check
npm test              # 현재 그룹 관련 테스트만
```

**Plan 파일의 검증 조건 확인:**

- Plan 문서의 해당 그룹 "검증" 항목 확인
- 예: "타입 체크 통과", "API 테스트 통과" 등

#### 1.5 개발자 검토 및 Commit 결정 ⭐

**변경사항 요약 제시:**

```
✅ Group [N] 완료: [그룹명]

📝 변경된 파일:
  - src/types/example.ts (new, 50 lines)
  - src/api/example.ts (new, 120 lines)
  - src/api/__tests__/example.test.ts (new, 80 lines)

✅ 검증 결과:
  [1.4.1 요구사항 검증]
  - 필수 요구사항: ✅ 4/4 구현 완료
  - 비즈니스 규칙: ✅ 2/2 적용 완료
  - 데이터 연동: ✅ 1/1 구현 완료

  [1.4.2 기술적 검증]
  - npm run type-check: ✅ 통과
  - npm run lint: ✅ 통과
  - npm test: ✅ 통과 (3/3 tests)

📊 다음 그룹: Group [N+1]/[전체] - [다음 그룹명]
```

**모드별 처리:**

🔹 **인터랙티브 모드** (기본)

사용자 선택 요청:

```
🔍 코드 검토 및 Commit 여부를 결정해주세요:

[1] ✅ Commit하고 다음 그룹 진행
    → git add 후 commit 메시지 자동 생성

[2] 🔄 수정 필요
    → 피드백을 입력해주세요

[3] ⏭️  Commit 없이 다음 그룹 진행
    → 여러 그룹을 묶어서 나중에 commit

[4] ⏸️  작업 일시 중지
    → 여기서 작업 중단
```

**Commit 처리 (옵션 1 선택 시):**

- 변경된 파일들을 git add
- Commit 메시지 생성 (예: `feat: [그룹명] 구현 완료`)
- git commit 실행
- 다음 그룹으로 진행

🔹 **배치 모드** (`--batch`)

자동 처리:

```
✅ Group [N] 완료 - 변경사항 staging
→ git add [변경된 파일들]
→ 다음 그룹 진행
```

- 사용자 입력 없이 자동으로 git add만 수행
- commit은 하지 않음
- 바로 다음 그룹으로 진행

#### 1.6 다음 그룹으로

모든 그룹이 완료될 때까지 1.1 ~ 1.5 반복

#### 1.7 배치 모드 최종 검토 (`--batch` 사용 시)

> ⚠️ 배치 모드로 실행했을 경우에만 이 단계가 진행됩니다.

**모든 그룹 완료 후:**

```
🎉 모든 그룹 구현 완료!

📝 전체 변경사항:
  Group 1: 타입 및 인터페이스 정의
    - src/types/example.ts (new)
    - src/types/api.ts (new)

  Group 2: API 레이어 구현
    - src/api/example.ts (new)
    - src/api/mocks/example.ts (new)
    - src/api/__tests__/example.test.ts (new)

  ... (모든 그룹 요약)

✅ 전체 검증 결과:
  [요구사항 검증]
  - Research 파일 기준: ✅ 전체 요구사항 100% 반영
  - 필수 요구사항: ✅ 15/15 구현 완료
  - 비즈니스 규칙: ✅ 8/8 적용 완료
  - 데이터 연동: ✅ 5/5 구현 완료

  [기술적 검증]
  - npm run type-check: ✅ 통과
  - npm run lint: ✅ 통과
  - npm test: ✅ 통과 (15/15 tests)

📊 Staging 상태:
  - 변경된 파일: 12개
  - 추가된 라인: 850 lines
  - 삭제된 라인: 20 lines
```

**최종 검토 및 Commit:**

```
🔍 전체 변경사항을 검토하고 Commit 여부를 결정해주세요:

[1] ✅ 전체 변경사항 Commit
    → 하나의 commit으로 생성

[2] 🔄 수정 필요
    → 피드백을 입력해주세요
    → 수정 후 다시 검토

[3] 📦 그룹별로 나누어 Commit
    → 각 그룹을 개별 commit으로 생성
    → 더 세밀한 히스토리 관리

[4] ⏸️  Commit 보류
    → 수동으로 commit 처리
```

**Commit 처리:**

- 옵션 1: 전체를 하나의 commit으로
- 옵션 3: 각 그룹을 개별 commit으로 분리

#### 1.8 선택적 API 연동 (--with-api 옵션)

모든 그룹 완료 후, 필요시 진행:

- **API 클라이언트**: Axios/Fetch 설정
- **엔드포인트 연결**: 백엔드 API와 통합
- **Mock → Real**: Mock 데이터를 실제 API로 전환
- **에러 핸들링**: API 오류 처리

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
>
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/\*.md (자동)

**중요한 기술적 결정**이 있었다면 memory-manager 에이전트를 호출하여 기록하세요.

## 사용자 결정 포인트

🔔 **Phase 0: 실행 모드 선택** (`--batch` 플래그 없는 경우):

- feature-spec 워크플로우가 완료되었는가?
- Implementation Groups가 명확히 정의되었는가?
- **어떤 모드로 진행할까요?**
  - [1] 인터랙티브 모드 (추천) - 각 그룹마다 검토
  - [2] 배치 모드 - 마지막에만 검토

🔔 **인터랙티브 모드 - 각 그룹 완료 후**:

- ✅ **Commit 여부 결정**
  - 옵션 1: Commit하고 다음 그룹 진행
  - 옵션 2: 수정 필요 (피드백 제공)
  - 옵션 3: Commit 없이 다음 그룹 진행
  - 옵션 4: 작업 일시 중지

🔔 **배치 모드 - 모든 그룹 완료 후**:

- ✅ **전체 변경사항 검토 및 Commit 결정**
  - 옵션 1: 전체를 하나의 commit으로
  - 옵션 2: 수정 필요
  - 옵션 3: 그룹별로 나누어 commit
  - 옵션 4: Commit 보류 (수동 처리)

🔔 **구현 중 확인 사항**:

- TDD Red-Green-Refactor 사이클을 따르고 있는가?
- **Research 파일의 요구사항이 모두 반영되었는가?** ⭐ (1.4.1 검증)
- 각 그룹의 검증 조건이 충족되는가? (1.4.2 검증)
- Mock 데이터 구조가 적절한가?
- API 연동 여부 결정 (백엔드 준비 시)

## 결과물

- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터 및 서비스
- `tests/[기능명]/` - 테스트 코드
- `src/services/[기능명]/` - API 연동 (선택적)

## 관련 워크플로우

- **선행 워크플로우**: `/workflow-feature-spec` - 기능 명세 작성
- **후속 워크플로우**: 통합 테스트 및 E2E 테스트
