---
name: workflow-implement-parallel
description: Group 단위로 여러 Feature를 Git Worktree를 활용하여 병렬로 구현하는 커맨드
version: 3.2.1
---

# /workflow-implement-parallel $ARGUMENTS

선택한 Group의 Feature들을 Git Worktree를 활용하여 병렬로 구현합니다.

> ⚠️ **필수 선행**: Group 내 모든 Feature에 대해 `/workflow-feature-spec` 완료

## 인자 처리

feature-resolver 스킬(enableGroupSearch: true)을 사용하여 인자를 해석합니다.

| 입력 형태  | 예시      | 설명                    |
| ---------- | --------- | ----------------------- |
| Group 이름 | `인증`    | Group 내 Feature들 병렬 |
| Group 번호 | `Group 1` | Group 번호로 검색       |
| Group 번호 | `1`       | 숫자만으로도 검색 가능  |

## 필수 참조 문서

- `.claude/docs/domain/feature-list.md` (Group 정보)
- `.claude/docs/plan/[Feature ID]-plan.md` (각 Feature 구현 계획)
- `.claude/docs/research/[Feature ID]-research.md` (각 Feature 요구사항)

## 실행 프로세스

### Phase 0: Group 정보 로드

```
1. feature-resolver로 Group 해석
2. Group 내 Feature 목록 추출 → features 배열에 저장
   예: features = ["AUTH-001", "AUTH-002", "AUTH-003"]
3. 각 Feature의 plan 파일 존재 여부 확인
   - 누락 시 에러 + /workflow-feature-spec 안내
```

> ⚠️ **이후 모든 Phase에서는 이 `features` 배열에 포함된 Feature들만 처리합니다.**

### Phase 1: Worktree 환경 준비

#### 1.1 디렉토리 및 .gitignore 설정

```bash
# .worktrees 폴더 생성
mkdir -p .worktrees

# .gitignore에 추가 (없으면)
echo ".worktrees/" >> .gitignore
```

#### 1.2 Worktree 생성

`features` 배열의 각 Feature에 대해:

```bash
git worktree add .worktrees/[Feature ID] -b worktree/[Feature ID]
```

예시 (features = ["AUTH-001", "AUTH-002", "AUTH-003"]인 경우):

```bash
git worktree add .worktrees/AUTH-001 -b worktree/AUTH-001
git worktree add .worktrees/AUTH-002 -b worktree/AUTH-002
git worktree add .worktrees/AUTH-003 -b worktree/AUTH-003
```

#### 1.3 상태 기록 (memory.md)

`features` 배열의 Feature들만 기록:

```markdown
## Parallel Implementation: [Group 이름]

| Feature  | Status      | Branch            | Worktree Path       |
| -------- | ----------- | ----------------- | ------------------- |
| AUTH-001 | in_progress | worktree/AUTH-001 | .worktrees/AUTH-001 |
| AUTH-002 | in_progress | worktree/AUTH-002 | .worktrees/AUTH-002 |
| AUTH-003 | in_progress | worktree/AUTH-003 | .worktrees/AUTH-003 |

Started: [시작 시간]
```

### Phase 2: 병렬 구현 실행

> ⚠️ **필수**: Task 에이전트로 병렬 실행
>
> ⚠️ **중요**: Phase 0에서 추출한 **해당 Group의 Feature 목록**에 대해서만 실행합니다.
> 다른 Group이나 feature-list.md의 전체 Feature에 대해 실행하지 마세요.

Phase 0에서 추출한 `features` 배열의 각 항목에 대해 **Task 에이전트**(running-tdd 스킬 적용)를 병렬로 실행:

```
Task 에이전트 × N (N = Feature 수)
├─ Feature: AUTH-001
│  ├─ Working Directory: .worktrees/AUTH-001
│  ├─ Plan: .claude/docs/plan/AUTH-001-plan.md
│  └─ TDD Cycle 실행
├─ Feature: AUTH-002
│  ├─ Working Directory: .worktrees/AUTH-002
│  └─ ...
└─ Feature: AUTH-003
   └─ ...
```

#### 에이전트 실행 지침

각 Task 에이전트는 다음을 수행:

**1. 환경 설정**
   - 해당 worktree 디렉토리로 이동
   - Plan 파일 읽기

**2. 각 Implementation Group 구현**

**2.1 구현 전 준비**
   - Plan 문서에서 현재 그룹 섹션 찾기
   - 구현 세부사항 추출:
     - 수정할 파일 목록
     - **필요한 import 목록** (Plan 문서에 명시됨)
     - 정의할 타입/함수 목록

**2.2 핵심 비즈니스 로직 (TDD 적용)**

TDD 적용 대상:
- 핵심 계산 로직 (할인, 총액 계산 등)
- 검증 로직 (유효성 검사, 권한 체크 등)
- 복잡한 데이터 변환 로직

핵심 로직이 있는 경우:

```markdown
**Skill 도구를 사용하여 `running-tdd` 스킬을 호출하세요.**
```

**2.3 일반 구현 (타입/API/UI)**

파일 수정 최적화 원칙:

> 📋 **중요**: 같은 섹션을 여러 번 Edit하지 말 것

```typescript
// 1. Plan 문서에서 필요한 import 파악
Read .claude/docs/plan/[Feature ID]-plan.md

// 2. 대상 파일 읽기
Read src/entities/cart/api.ts

// 3. 섹션별 Edit (파일당 2-4회)
Edit 1: import 섹션 완성 (Plan에서 파악한 모든 import 한번에)
Edit 2: 타입 섹션 완성
Edit 3: 함수/컴포넌트 섹션 완성
```

**2.4 그룹 완료**
   - Lint/Type-check/Test 검증
   - 그룹 커밋

**3. 완료 처리**
   - 모든 그룹 완료 시 memory.md 상태 업데이트

### Phase 3: 완료 처리

모든 에이전트 완료 후:

```
1. 각 Feature 상태 확인
2. memory.md 업데이트
3. 다음 단계 안내

✅ 모든 Feature 구현 완료!

다음 단계:
  /workflow-implement-status [Group]  - 상태 확인
  /workflow-implement-merge [Group]   - main에 병합
```

## 에러 처리

### Plan 파일 누락

```
❌ AUTH-002의 plan 파일이 없습니다.

해결: /workflow-feature-spec AUTH-002
```

### Worktree 생성 실패

```
❌ Worktree 생성 실패: AUTH-001

원인: 브랜치 'worktree/AUTH-001'이 이미 존재합니다.
해결: git branch -D worktree/AUTH-001
```

### 이미 진행 중인 병렬 구현

```
⚠️ 이미 진행 중인 병렬 구현이 있습니다.

현재 진행 중: Group "인증"
  - AUTH-001: in_progress
  - AUTH-002: completed
```

review-and-confirm 스킬(다중 선택형)을 사용하여 사용자 선택을 받습니다.

**선택지:** ▶️ 기존 작업 계속 | 🔄 새로 시작 | 💬 직접 입력

## 결과물

- `.worktrees/[Feature ID]/` - 각 Feature의 작업 공간
- `worktree/[Feature ID]` - 각 Feature의 브랜치
- `memory.md` - 병렬 구현 상태 추적

## 다음 단계

```
/workflow-implement-status [Group]  - 진행 상태 확인
/workflow-implement-merge [Group]   - main에 병합
```
