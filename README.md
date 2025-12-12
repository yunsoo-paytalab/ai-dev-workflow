# AI-Driven Development Workflow

Claude Code와 함께 체계적으로 개발을 진행하기 위한 워크플로우 시스템입니다.

## 이런 분들에게 추천합니다

- Claude Code로 개발할 때 **체계적인 프로세스**가 필요한 분
- AI에게 맥락을 반복 설명하는 것이 **번거로운** 분
- 기능별로 **명세 → 구현 → 테스트** 순서를 지키고 싶은 분
- 프로젝트 **진행 상황을 추적**하고 싶은 분

## 내 프로젝트에 적용하기

### Step 1. 파일 복사

`.claude` 폴더를 프로젝트 루트에 복사합니다.

```bash
# 예시: ai-dev-workflow 저장소를 클론한 후
cp -r ai-dev-workflow/.claude /your-project/
```

### Step 2. 요구사항 작성

`.claude/docs/requirements.md` 파일에 프로젝트 요구사항을 작성합니다.

```markdown
# 프로젝트 요구사항

## 개요
쇼핑몰 웹사이트 개발

## 기술 스택
- React + TypeScript
- TailwindCSS
- Zustand

## 주요 기능
- 상품 목록 조회
- 장바구니
- 결제
```

### Step 3. 워크플로우 시작

Claude Code에서 아래 명령어를 실행합니다.

```
/workflow start
```

끝! 이제 Claude가 프로젝트 상태를 파악하고 다음 단계를 안내해줍니다.

---

## 기본 사용법

### 0. 레거시 분석 (기존 코드가 있는 경우)

이미 코드가 있는 프로젝트라면 **가장 먼저** 실행하세요.

```
/workflow-legacy-profile
```

위험한 코드 영역을 식별하고, 이후 작업에서 자동으로 주의 사항을 안내받습니다.

> 새 프로젝트라면 이 단계를 건너뛰세요.

### 1. 도메인 정의 (프로젝트 시작 시 1회)

프로젝트의 전체 구조와 기능 목록을 정의합니다.

```
/workflow-domain-definition
```

**결과물:**
- 도메인 정의서 (`domain-definition.md`)
- 기능 목록 (`feature-list.md`)
- 페이지 구조 (`page-structure.md`)

### 2. 기능별 개발 사이클

각 기능마다 아래 과정을 반복합니다.

```
/workflow-feature-spec 로그인     # 요구사항 분석 및 설계
/workflow-implement 로그인        # TDD 방식으로 구현
```

> UI가 필요한 경우: `/workflow-ui 로그인`을 중간에 실행

### 3. 통합 및 완료

모든 기능 구현이 끝나면:

```
/workflow-integrate    # 코드 정리 및 통합
/workflow-e2e          # 최종 테스트
```

---

## 전체 흐름 한눈에 보기

```
/workflow start                    ← 프로젝트 시작
       ↓
/workflow-legacy-profile           ← 레거시 분석 (기존 코드 있을 때만)
       ↓
/workflow-domain-definition        ← 전체 구조 정의
       ↓
┌─────────────────────────────┐
│  각 기능마다 반복:          │
│                             │
│  /workflow-feature-spec     │   ← 명세 작성
│           ↓                 │
│  /workflow-ui (선택)        │   ← UI 구현
│           ↓                 │
│  /workflow-implement        │   ← 로직 구현 (TDD)
└─────────────────────────────┘
       ↓
/workflow-integrate                ← 통합 및 리팩토링
       ↓
/workflow-e2e                      ← 최종 검증
```

---

## 자주 쓰는 커맨드

| 커맨드                            | 언제 사용하나요?                       |
| --------------------------------- | -------------------------------------- |
| `/workflow start`                 | 프로젝트 시작하거나 상태 확인할 때     |
| `/workflow status`                | 현재 진행 상황 확인할 때               |
| `/workflow-legacy-profile`        | 기존 코드가 있는 프로젝트에 적용할 때  |
| `/workflow-domain-definition`     | 프로젝트 구조를 처음 잡을 때           |
| `/workflow-feature-spec [기능명]` | 새 기능 개발 전 설계할 때              |
| `/workflow-implement [기능명]`    | 기능을 실제로 구현할 때                |
| `/workflow help`                  | 전체 커맨드 목록 볼 때                 |

---

## 이 워크플로우가 하는 일

### 1. 컨텍스트 유지

Claude Code 세션이 바뀌어도 `memory.md` 파일에 진행 상황이 저장됩니다.
다음 세션에서 `/workflow start`만 하면 이전 맥락을 이어갈 수 있습니다.

### 2. 체계적인 개발 프로세스

```
Research (분석) → Planning (설계) → Implementation (구현)
```

무작정 코드부터 짜지 않고, 요구사항 분석과 설계를 먼저 진행합니다.

### 3. TDD 방식 구현

테스트 코드를 먼저 작성하고, 그 다음 구현합니다.
Mock 데이터로 먼저 동작을 확인하고, API 연동은 나중에 합니다.

### 4. 자동 문서화

각 단계에서 분석 문서, 명세서, 계획서가 자동 생성됩니다.
나중에 참고하거나 팀원과 공유할 때 유용합니다.

---

## 실제 사용 예시

### 예시: 쇼핑몰의 장바구니 기능 개발

```bash
# 1. 장바구니 기능 명세 작성
/workflow-feature-spec 장바구니

# Claude가 요구사항을 분석하고 설계 문서를 생성합니다
# → .claude/docs/specs/CART-001-spec.md 생성

# 2. (검토 후) 구현 시작
/workflow-implement 장바구니

# Claude가 TDD 방식으로 구현합니다
# - 테스트 코드 먼저 작성
# - 테스트 통과하는 최소 코드 작성
# - 리팩토링
```

### 예시: 진행 상황 확인

```bash
/workflow status

# 출력 예시:
# ✅ 도메인 정의 완료
# ✅ AUTH-001: 로그인 - 완료
# 🔄 CART-001: 장바구니 - 구현 중
# ⏳ PAY-001: 결제 - 대기
```

---

## 기존 프로젝트에 적용하기 (레거시 분석)

이미 코드가 있는 프로젝트에 워크플로우를 적용할 때는 **레거시 분석을 먼저** 실행하세요.

```
/workflow-legacy-profile
```

### 이 커맨드가 하는 일

1. **코드 구조 분석**: 폴더 구조, 의존성 관계 파악
2. **기술 부채 식별**: 중복 코드, 복잡한 함수, TODO/FIXME 등
3. **위험 영역 분류**: 수정 시 주의가 필요한 코드 식별
4. **안전 규칙 생성**: 후속 작업에서 자동 적용

### 위험 영역 분류

분석 후 코드가 4단계로 분류됩니다:

| 등급                  | 의미                       | 수정 시                |
| --------------------- | -------------------------- | ---------------------- |
| 🟢 **Safe**           | 안전하게 수정 가능         | 자유롭게 진행          |
| 🟡 **Medium Risk**    | 주의 필요                  | 주의 사항 안내         |
| 🟠 **High Risk**      | 영향 범위 큼               | 계획 설명 + 승인 필요  |
| 🔴 **Critical**       | 핵심 비즈니스 로직         | 테스트 + 명시적 승인   |

### 참고 금지 영역

잘못된 패턴의 코드는 "참고 금지"로 분류됩니다:

- 🚫 **Anti-Pattern**: God Object, 스파게티 코드 등
- ⛔ **Deprecated**: 폐기 예정 코드
- 🔧 **Hack**: 임시로 작성된 코드
- 🐛 **Known Bug**: 알려진 버그가 있는 코드

Claude는 이런 코드를 참고하지 않고, 올바른 패턴으로 새로 구현합니다.

### 레거시 프로젝트 권장 순서

```
/workflow-legacy-profile       ← 먼저 실행! (위험 영역 파악)
       ↓
/workflow-domain-definition    ← 도메인 정의
       ↓
(이후 일반 워크플로우와 동일)
```

### 결과물

```
.claude/docs/legacy-analysis/
├── structure-overview.md      # 프로젝트 구조
├── dependency-graph.md        # 의존성 관계
├── technical-debt.md          # 기술 부채 목록
├── danger-zones.md            # 위험 영역 상세
├── no-reference-zones.md      # 참고 금지 영역
└── restricted-zones.json      # 자동 적용 규칙
```

---

## FAQ

### Q. 기존 프로젝트에도 적용할 수 있나요?

네. `.claude` 폴더만 복사하면 됩니다. 레거시 코드가 많다면 `/workflow-legacy-profile`을 먼저 실행하세요.

### Q. 꼭 순서대로 해야 하나요?

아니요. 유연하게 사용 가능합니다. 다만 `feature-spec` → `implement` 순서는 권장합니다.

### Q. 여러 프로젝트를 동시에 관리할 수 있나요?

네. 메모리가 중앙 저장소(`~/.claude-aidev-memory/`)에서 프로젝트별로 관리됩니다.

```bash
/workflow-memory init my-project-1    # 첫 번째 프로젝트
/workflow-memory switch my-project-2  # 다른 프로젝트로 전환
```

### Q. Claude Code 세션이 끊기면 어떻게 되나요?

Hook이 자동으로 진행 상황을 저장합니다. 다음 세션에서 `/workflow start`하면 이어서 작업할 수 있습니다.

---

## 폴더 구조

```
.claude/
├── commands/          # 워크플로우 커맨드 정의
├── agents/            # AI 에이전트 (자동 호출됨)
├── hooks/             # 자동 저장 스크립트
├── docs/              # 생성되는 문서들
│   ├── memory/        # 진행 상황 추적
│   ├── specs/         # 기능 명세서
│   ├── feature-list/  # 기능 목록
│   └── requirements.md # ← 여기에 요구사항 작성
└── settings.json      # Hook 설정
```

---

## 더 알아보기

### 전체 커맨드 목록

<details>
<summary>클릭해서 펼치기</summary>

#### 메인 커맨드

| 커맨드             | 설명                       |
| ------------------ | -------------------------- |
| `/workflow start`  | 프로젝트 시작 및 상태 파악 |
| `/workflow status` | 현재 진행 상황 확인        |
| `/workflow update` | memory.md 수동 업데이트    |
| `/workflow help`   | 전체 커맨드 목록           |
| `/workflow reset`  | 프로젝트 초기화            |

#### 작업 커맨드

| 커맨드                            | 설명                        |
| --------------------------------- | --------------------------- |
| `/workflow-domain-definition`     | 도메인, 기능 목록 정의      |
| `/workflow-feature-spec [기능명]` | 요구사항 분석 및 설계       |
| `/workflow-ui [기능명]`           | UI 컴포넌트 개발 (선택)     |
| `/workflow-implement [기능명]`    | TDD 방식 구현               |
| `/workflow-integrate`             | 시스템 통합 및 리팩토링     |
| `/workflow-e2e`                   | E2E 테스트 및 최종 검증     |
| `/workflow-legacy-profile`        | 레거시 코드 분석            |
| `/workflow-task-point [기능명]`   | 작업량 추정                 |

#### 메모리 관리

| 커맨드                         | 설명               |
| ------------------------------ | ------------------ |
| `/workflow-memory init [id]`   | 새 메모리 초기화   |
| `/workflow-memory status`      | 메모리 상태 확인   |
| `/workflow-memory list`        | 메모리 목록 조회   |
| `/workflow-memory switch [id]` | 다른 메모리로 전환 |

</details>

### AI 에이전트

<details>
<summary>클릭해서 펼치기</summary>

워크플로우 실행 시 자동으로 호출되는 전문 에이전트들입니다.

| 에이전트                   | 역할                   |
| -------------------------- | ---------------------- |
| `memory-manager`           | 진행 상황 기록         |
| `research-agent`           | 코드베이스 분석        |
| `planning-agent`           | 구현 계획 수립         |
| `test-runner`              | TDD 사이클 관리        |
| `domain-definition-writer` | 도메인 정의서 작성     |
| `feature-classifier`       | 기능 분류              |
| `feature-detail-writer`    | 기능 상세 문서         |
| `task-point-estimator`     | 작업량 추정            |
| `dependency-analyzer`      | 의존성 분석            |
| `risk-classifier`          | 위험도 분류            |

</details>

### 명명 규칙

<details>
<summary>클릭해서 펼치기</summary>

| 항목       | 형식                        | 예시               |
| ---------- | --------------------------- | ------------------ |
| Feature ID | `{DOMAIN}-{NUM}`            | `AUTH-001`         |
| Task ID    | `{DOMAIN}-{NUM}-{TASK_NUM}` | `AUTH-001-001`     |
| 명세 파일  | `[ID]-spec.md`              | `AUTH-001-spec.md` |

</details>

---

## 문제 해결

### "memory.md를 찾을 수 없다"는 오류

```bash
/workflow-memory init my-project
```

### 진행 상황이 저장되지 않음

```bash
/workflow-memory status    # 상태 확인
/workflow update           # 수동 저장
```

### 이전 프로젝트로 돌아가고 싶음

```bash
/workflow-memory list              # 목록 확인
/workflow-memory switch 프로젝트ID
```

---

## 라이선스

MIT License
