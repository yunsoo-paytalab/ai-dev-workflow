# 🚀 AI Dev Workflow v3.1.0 업데이트

> v3.0.0 → v3.1.0 주요 변경사항 및 마이그레이션 가이드

**릴리즈 날짜:** 2025-12-15
**변경 통계:** 57개 파일, 13,500+ 줄 추가, 1,091줄 삭제

---

## 📋 목차

1. [주요 변경사항](#주요-변경사항)
2. [새로운 기능](#새로운-기능)
3. [개선사항](#개선사항)
4. [마이그레이션 가이드](#마이그레이션-가이드)
5. [Breaking Changes](#breaking-changes)

---

## 🎯 주요 변경사항

### 1. 🎯 Implementation Groups 기반 구현 워크플로우 (중요!)

**변경 이유:**

- 기존: feature-spec에서 20개 task 생성 → workflow-implement가 한 번에 구현
- 문제: 작업 단위가 너무 크고, 중간 commit 불가
- 해결: 논리적 그룹 단위로 나누어 구현, 각 그룹마다 검토 및 commit

**이제 이렇게 동작합니다:**

```
20개 task → 4-6개 논리적 그룹으로 구성

Group 1: 타입 및 인터페이스 정의 (3-7개 task)
  → 구현 → 검증 → 개발자 검토 → Commit ✅

Group 2: API 레이어 구현 (3-7개 task)
  → 구현 → 검증 → 개발자 검토 → Commit ✅

Group 3: 비즈니스 로직 (3-7개 task)
  → 구현 → 검증 → 개발자 검토 → Commit ✅

...
```

**영향받는 파일:**

- `.claude/agents/planning-agent.md` - Implementation Groups 섹션 추가
- `.claude/commands/workflow-feature-spec.md` - Phase 3 그룹화 지침 추가
- `.claude/commands/workflow-implement.md` - 그룹별 구현 프로세스로 전면 개편

---

### 2. ⚡ 인터랙티브 vs 배치 실행 모드

**새로운 실행 방식:**

```bash
# 방법 1: 실행 후 모드 선택 (NEW!)
/workflow-implement AUTH-001
# → 실행 시 모드 선택 화면 표시

# 방법 2: 배치 모드 직접 지정
/workflow-implement AUTH-001 --batch
```

**🔹 인터랙티브 모드 (기본, 추천)**

- 각 그룹 완료 후 검토 및 commit 결정
- 중간에 피드백 반영 가능
- 논리적 단위로 commit 생성

**🔹 배치 모드 (`--batch`)**

- 모든 그룹을 한 번에 실행
- 마지막에만 검토
- 빠른 프로토타이핑에 적합

**Phase 0: 실행 모드 선택**

```
📋 Implementation Groups 개요:
  - 전체 그룹: 5개
  - 예상 작업 시간: 중간 규모

🤔 어떤 모드로 진행하시겠어요?

[1] 🎯 인터랙티브 모드 (추천)
    → 각 그룹 완료 후 검토 및 commit
    → 중간에 피드백 반영 가능

[2] ⚡ 배치 모드
    → 모든 그룹을 한 번에 실행
    → 마지막에만 검토
```

---

### 3. 🎨 Figma 디자인 참조 지원

**Phase 2에 Figma URL 확인 추가:**

```markdown
**참고 자료 확인**

1. **API 문서 확인** (API 구현 시)

   - Notion 등 API 문서 URL 확인

2. **Figma 디자인 확인** (UI 구현 시) ⭐ NEW
   - Figma URL 확인
   - Figma MCP를 활용한 디자인 스펙 확인
   - 컴포넌트 구조, 스타일, 인터랙션 파악
```

**적용 파일:**

- `.claude/commands/workflow-feature-spec.md`

---

## 🆕 새로운 기능

### 1. 📊 CLI 대시보드

프로젝트 진행 상황을 한눈에 확인할 수 있는 대시보드 추가

**설치 및 실행:**

```bash
cd .claude/cli
npm install
npm start
```

**기능:**

- 워크플로우 진행 상황 시각화
- Feature 상태 추적
- Task Point 현황

**관련 파일:**

- `.claude/cli/` - 새로운 CLI 대시보드 디렉토리

---

### 2. 📏 Task Point 산정 시스템

Feature 및 Task의 복잡도를 피보나치 수열로 산정

**사용 방법:**

```bash
/workflow-task-point [FEATURE_ID]
```

**산정 기준:**

- 1, 2, 3, 5, 8, 13, 21... (피보나치)
- 복잡도, 불확실성, 리스크 고려
- 자동 검증 및 조정

**관련 파일:**

- `.claude/agents/task-point-estimator.md`
- `.claude/commands/workflow-task-point.md`

---

### 3. 🏷️ Feature/Task 분류 시스템 개선

**새로운 분류 기준:**

```
Feature + Task 구조

Feature (완결된 기능 단위)
├─ 하나의 목적을 달성하는 완결된 기능
├─ 관련 작업이 모두 포함 (타입 + API + 상태 + UI)
└─ Task 1~4개 권장

Task (개별 작업 단위)
├─ API 하나, 컴포넌트 하나, 훅 하나 등
├─ Feature 내 구체적인 작업 단위
└─ 독립적으로 완료 가능
```

**분류 원칙:**

✅ **Feature 기준**
- 완결성: 하나의 목적을 달성
- 단일성: 하나의 동작만 포함 (조회/수정 분리)
- Feature당 1~4개 Task

✅ **좋은 예시**
```
AUTH-001 로그인 기능
  ├─ Task 1: 로그인 API 연동
  ├─ Task 2: 로그인 상태 관리
  └─ Task 3: 로그인 UI 구현

PRODUCT-001 상품 목록 조회
  ├─ Task 1: 상품 목록 API
  └─ Task 2: 상품 목록 컴포넌트
```

❌ **나쁜 예시**
```
❌ 너무 작음 (레이어별 분리)
AUTH-001 인증 타입 정의
AUTH-002 인증 API 연동
AUTH-003 인증 상태 관리

❌ 복합 기능 (분리 필요)
USER-001 회원 정보 조회/수정
ORDER-001 주문 생성/취소/조회
```

**관련 파일:**

- `.claude/agents/feature-classifier.md`

---

### 4. 🔄 요구사항 변경 관리 시스템 (workflow-update) ⭐ NEW

요구사항이 중간에 변경되었을 때 관련 문서를 일괄 업데이트할 수 있는 워크플로우

**사용 방법:**

```bash
# 기본 사용
/workflow-update AUTH-001

# 미리보기만 (실제 수정 없음)
/workflow-update AUTH-001 --dry-run

# 의존성 feature도 함께 업데이트
/workflow-update AUTH-001 --cascade
```

**주요 기능:**

1. **자동 영향 범위 분석**
   - 변경으로 영향받는 모든 문서 자동 탐색
   - 직접 영향 + 간접 영향 (의존성) 파악
   - 구현 파일 체크 (수동 작업 필요 항목)

2. **일괄 업데이트**
   - 여러 문서를 한 번에 업데이트
   - Before/After diff 미리보기
   - 문서별 선택 적용 가능

3. **변경 이력 추적**
   - 자동으로 changelog 생성 (`.claude/docs/changelog/`)
   - 무엇이 언제 왜 변경되었는지 기록
   - 롤백 가능

4. **안전한 변경**
   - 5가지 검토 옵션 (모두 적용, 직접 영향만, 상세 보기, 선택 적용, 취소)
   - Git 충돌 체크
   - 일관성 검증

**워크플로우:**

```
요구사항 변경 발생
    ↓
/workflow-update [FEATURE_ID]
    ↓
변경 내용 입력
    ↓
영향 범위 자동 분석 (impact-analyzer)
    ↓
미리보기 확인 및 승인
    ↓
문서 일괄 업데이트 (document-updater)
    ↓
변경 이력 자동 기록
```

**예시 시나리오:**

```bash
/workflow-update AUTH-001

변경 내용: OAuth 2.0 대신 OAuth 1.0 사용

🔍 영향 범위 분석:
  - 직접 영향: 2개 문서
  - 간접 영향: 2개 문서 (의존성)
  - 수동 작업: 2개 파일 (코드)

[1] 모두 적용 → ✅ 선택
⏳ 업데이트 중...
✅ 완료!

📝 변경 이력: .claude/docs/changelog/AUTH-001-20251215.md
```

**관련 파일:**

- `.claude/commands/workflow-update.md` - 메인 커맨드
- `.claude/agents/impact-analyzer.md` - 영향 분석 에이전트
- `.claude/agents/document-updater.md` - 문서 업데이트 에이전트

**컨텍스트 관리:**

- 에이전트들이 격리된 컨텍스트에서 실행
- 메인 컨텍스트 오염 방지
- 대규모 변경도 안전하게 처리

**장점:**

✅ **시간 절약** - 관련 파일 자동 검색 및 일괄 수정
✅ **일관성 유지** - 모든 문서가 동기화됨
✅ **추적 가능** - 변경 이력 자동 기록
✅ **안전성** - 의존성 체크, 충돌 감지, 미리보기 제공

---

## 🔧 개선사항

### 1. Memory 중앙 저장소 시스템 ⭐ (핵심 개선)

**v3.0.0 이전:**
```
프로젝트별 독립 메모리
→ 프로젝트마다 별도 관리
→ 세션 간 컨텍스트 단절
```

**v3.1.0:**
```
중앙 저장소 방식
~/.claude-aidev-memory/
└── projects/{memory-id}/
    ├── memory.md           # 프로젝트 메모리
    ├── progress.json       # 진행 상황
    └── sessions/           # 세션 기록
```

**핵심 변경사항:**

1. **중앙 저장소 (`~/.claude-aidev-memory/`)**
   - 모든 프로젝트 메모리를 한 곳에서 관리
   - 프로젝트 간 컨텍스트 공유 가능
   - 백업 및 동기화 용이

2. **프로젝트 연결**
   - `.claude/docs/memory/.memory-ref` 파일로 중앙 저장소 연결
   - 심볼릭 링크로 투명한 접근

3. **자동 업데이트**
   - 사용자 입력 및 응답 시 자동 session 파일 업데이트
   - 워크플로우 진행 상황 자동 기록
   - memory-sync hook 개선

4. **통합 진행 상황 관리 (`progress.json`)**
   - 워크플로우 + Feature + Task 통합 관리
   - CLI 대시보드에서 실시간 조회
   - Phase별 진행률 추적

**사용 방법:**

```bash
# 중앙 저장소 초기화 (최초 1회)
/workflow-memory

# 프로젝트 메모리 ID 설정
Enter memory ID: my-project

# 이후 자동으로 중앙 저장소 연결
```

**장점:**

✅ **세션 간 컨텍스트 유지** - 다른 세션에서도 이전 대화 참조
✅ **프로젝트 간 공유** - 여러 프로젝트에서 공통 메모리 사용 가능
✅ **백업 용이** - 한 곳만 백업하면 모든 프로젝트 메모리 보존
✅ **CLI 통합** - 대시보드에서 실시간 진행 상황 확인

**관련 파일:**

- `.claude/commands/workflow-memory.md` - 중앙 저장소 관리
- `.claude/hooks/memory-sync.cjs` - 자동 동기화
- `.claude/agents/memory-manager.md` - 메모리 관리 에이전트

---

### 2. Research와 Design 단계 분리

**이전:** research-agent가 분석 + 설계 모두 담당
**이후:**

- `feature-research-agent` - 요구사항 분석만
- `planning-agent` - 설계 및 구현 계획 수립

**장점:**

- 역할 분리로 더 명확한 책임
- 각 단계별 집중도 향상

**관련 파일:**

- `.claude/agents/feature-research-agent.md` (신규)
- `.claude/agents/planning-agent.md` (개선)
- `.claude/agents/research-agent.md` (삭제)

---

### 3. Test Runner 개선

**추가된 기능:**

- TDD Red-Green-Refactor 사이클 명확화
- 그룹별 테스트 작성 지원
- 한글 describe/it 권장

**관련 파일:**

- `.claude/agents/test-runner.md`

---

### 4. 여러 도메인 에이전트 추가/개선

**새로운 에이전트:**

- `domain-research-agent.md` - 도메인 분석 전문
- `feature-detail-writer.md` - Feature 상세 문서 작성

**개선된 에이전트:**

- `business-logic-mapper.md`
- `debt-analyzer.md`
- `dependency-analyzer.md`
- `domain-definition-writer.md`
- `page-structure-writer.md`
- `risk-classifier.md`
- `structure-analyzer.md`

---

## 📖 마이그레이션 가이드

### 기존 프로젝트에 적용하기

#### 1. 최신 버전 업데이트

```bash
cd your-project
git pull origin main  # 또는 해당 브랜치
```

#### 2. 기존 Feature Spec 마이그레이션 (선택)

**v3.0.0에서 작성한 spec이 있는 경우:**

기존 spec 문서는 그대로 사용 가능하지만, Implementation Groups로 재구성하면 더 좋습니다.

**수동 마이그레이션 예시:**

**이전 (v3.0.0 planning-agent 출력):**

```markdown
## 📋 Implementation Steps (구현 단계)

### Phase 1: 타입 정의

**목표**: 기본 타입 및 인터페이스 정의

**주요 작업**:

- `types.ts`: 기본 타입 정의
- `api.ts`: API 인터페이스 정의

**검증**:

- 자동: `npm run type-check`

### Phase 2: API 구현

**목표**: API 레이어 구현

**주요 작업**:

- `api.ts`: API 함수 구현
- `mocks/api.ts`: Mock 데이터 작성

**검증**:

- 자동: `npm test -- api.test.ts`

### Phase 3: 훅 구현

... (개별 Phase로 나열)
```

**이후 (v3.1.0 planning-agent 출력):**

```markdown
## 4. Implementation Plan

### 4.1 Implementation Groups

> ⚠️ **그룹화 원칙**
> - 논리적으로 관련된 작업들을 하나의 그룹으로 묶음
> - 각 그룹은 독립적으로 검증 가능해야 함
> - 그룹당 3-7개 정도의 task가 적절
> - 의존성 순서를 고려하여 그룹 배치

**Group 1: 타입 및 인터페이스 정의**

- Task: 기본 타입 정의 - `src/types/[기능명].ts`
- Task: API 인터페이스 정의 - `src/types/api.ts`
  **검증:** `npm run type-check` 통과

**Group 2: API 레이어 구현**

- Task: API 클라이언트 함수 작성 - `src/api/[기능명].ts`
- Task: Mock 데이터 작성 - `src/api/mocks/[기능명].ts`
- Task: API 함수 Unit Test - `src/api/__tests__/[기능명].test.ts`
  **검증:** API 관련 테스트 통과

**Group 3: 비즈니스 로직 구현**

- Task: 커스텀 훅 구현 - `src/hooks/use[기능명].ts`
- Task: 유틸리티 함수 구현 - `src/utils/[기능명].ts`
- Task: 비즈니스 로직 Unit Test - `src/hooks/__tests__/use[기능명].test.ts`
  **검증:** 비즈니스 로직 테스트 통과

... (4-6개 그룹)

### 4.2 Detailed Tasks (선택적)

필요한 경우 각 그룹의 task를 더 상세히 나열
```

#### 3. 새로운 워크플로우 사용하기

**v3.1.0 이후:**

```bash
# 1. Feature Spec 작성 (그룹화 포함)
/workflow-feature-spec AUTH-001

# 2. 구현 (모드 선택)
/workflow-implement AUTH-001
# → 실행 모드 선택 화면에서 선택

# 또는 배치 모드로 직접 실행
/workflow-implement AUTH-001 --batch
```

#### 4. CLI 대시보드 설정 (선택)

```bash
cd .claude/cli
npm install
npm start
```

---

## ⚠️ Breaking Changes

### 1. workflow-implement 실행 방식 변경

**v3.0.0:**

```
모든 task를 한 번에 구현 → 마지막에 검토
```

**v3.1.0:**

```
기본: 각 그룹마다 검토 (인터랙티브 모드)
옵션: --batch로 한 번에 구현 (배치 모드)
```

**대응 방법:**

- 기존처럼 한 번에 실행하려면: `--batch` 플래그 사용
- 권장: 인터랙티브 모드 사용 (더 나은 제어)

---

### 2. planning-agent 출력 구조 변경

**v3.0.0:**

```markdown
## 📋 Implementation Steps (구현 단계)

### Phase 1: [단계명]

**목표**: [이 단계의 목표]

**주요 작업**:
- `file1.ts`: 작업 설명
- `file2.ts`: 작업 설명

**검증**:
- 자동: `npm test`

### Phase 2: [단계명]
...
(개별 Phase로 나열)
```

**v3.1.0:**

```markdown
## 4. Implementation Plan

### 4.1 Implementation Groups

**Group 1: [그룹명]**
- Task: 작업 1 - `file1.ts`
- Task: 작업 2 - `file2.ts`
- Task: 작업 3 - `file3.ts`
**검증:** 검증 방법

**Group 2: [그룹명]**
...
(논리적 그룹 + 그룹별 검증 조건)

### 4.2 Detailed Tasks (선택적)

(필요시 상세 task 목록)
```

**대응 방법:**

- 새로운 feature부터는 자동으로 새 구조 적용
- 기존 spec은 그대로 사용 가능하지만 그룹화로 재구성 권장

---

### 3. research-agent 삭제

**v3.0.0:**

- `research-agent.md` - 분석 + 설계

**v3.1.0:**

- `feature-research-agent.md` - 분석만
- `planning-agent.md` - 설계만

**대응 방법:**

- 자동으로 새 에이전트 사용
- 사용자 액션 불필요

---

## 🎓 사용 팁

### 1. 언제 인터랙티브 모드를 사용할까?

**✅ 인터랙티브 모드 추천:**

- 복잡한 기능 구현
- 각 단계별 검토가 중요한 경우
- 중간에 방향 전환 가능성
- 학습 목적

**✅ 배치 모드 추천:**

- 단순한 CRUD 기능
- 명확한 요구사항
- 빠른 프로토타이핑
- 전체 흐름을 한 번에 보고 싶을 때

---

### 2. Implementation Groups 작성 팁

**좋은 그룹화 예시:**

```markdown
**Group 1: 기반 구조**

- 타입 정의
- 인터페이스 정의
  **검증:** 타입 체크 통과

**Group 2: 데이터 레이어**

- API 함수
- Mock 데이터
  **검증:** API 테스트 통과

**Group 3: 비즈니스 로직**

- 커스텀 훅
- 유틸리티
  **검증:** Unit 테스트 통과

**Group 4: UI 레이어**

- 컴포넌트
- 스타일링
  **검증:** Component 테스트 통과
```

**나쁜 그룹화 예시:**

```markdown
❌ Group 1: 파일 1-5 구현
❌ Group 2: 파일 6-10 구현

# → 논리적 의미 없음
```

---

### 3. Figma 디자인 활용

**workflow-feature-spec Phase 2에서:**

```
참고할 Figma URL이 있나요?
→ [Figma URL 제공]
→ Figma MCP가 자동으로 디자인 스펙 파싱
→ Planning 단계에서 디자인 기반 컴포넌트 설계
```

---

### 4. 요구사항 변경 관리 (workflow-update)

**언제 사용할까?**

✅ **workflow-update 사용 시점:**
- 요구사항이 중간에 변경됨
- 여러 문서에 동일한 변경 필요
- 의존성이 있는 feature 함께 수정
- 변경 이력 추적 필요

**사용 전 체크리스트:**

```markdown
1. 변경 내용이 명확한가?
   ❌ "로그인 개선" (모호함)
   ✅ "OAuth 2.0 → OAuth 1.0으로 변경" (명확함)

2. 영향 범위를 대략 파악했는가?
   - 어떤 문서들이 관련되어 있는지
   - 의존성이 있는 다른 feature는 없는지

3. 백업이 필요한가?
   - 대규모 변경이면 git commit 먼저
   - 또는 --dry-run으로 미리보기
```

**실전 워크플로우:**

```bash
# 1단계: 미리보기 (안전)
/workflow-update AUTH-001 --dry-run
# → 어떤 파일이 어떻게 변경되는지 확인

# 2단계: 직접 영향만 업데이트
/workflow-update AUTH-001
# → 선택: [2] 직접 영향만 적용

# 3단계: 의존성도 함께 업데이트
/workflow-update AUTH-002 --cascade
# → 관련 feature 모두 업데이트

# 4단계: 코드 수정 (수동)
# → src/ 파일들 직접 수정

# 5단계: 재구현 (필요시)
/workflow-implement AUTH-001
```

**팁:**

💡 **대규모 변경은 단계별로**
```bash
# Phase 1: 핵심 문서만
/workflow-update CORE-001 --only-spec

# Phase 2: Feature 세부 문서
/workflow-update CORE-001 --only-feature

# Phase 3: 의존성
/workflow-update CORE-001 --cascade
```

💡 **변경 이력 활용**
```
.claude/docs/changelog/ 폴더에서 이전 변경사항 참고
→ 롤백이나 비교할 때 유용
```

---

## 📚 추가 리소스

### 업데이트된 주요 문서

- `.claude/commands/workflow-feature-spec.md` - Feature Spec 워크플로우
- `.claude/commands/workflow-implement.md` - 구현 워크플로우
- `.claude/agents/planning-agent.md` - Planning 에이전트
- `.claude/agents/feature-research-agent.md` - Research 에이전트

### 새로운 문서

- `.claude/cli/README.md` - CLI 대시보드 사용법
- `.claude/commands/workflow-task-point.md` - Task Point 산정
- `.claude/agents/task-point-estimator.md` - Point 산정 에이전트
- `.claude/commands/workflow-update.md` - 요구사항 변경 관리 ⭐ NEW
- `.claude/agents/impact-analyzer.md` - 영향 범위 분석 에이전트 ⭐ NEW
- `.claude/agents/document-updater.md` - 문서 업데이트 에이전트 ⭐ NEW

---

## 🐛 버그 수정

- memory-sync hook 동작 개선
- feature 분류 기준 명확화
- test-runner 호출 누락 수정
- feature-list 문서 구조 개선
- 여러 에이전트 프롬프트 개선

---

## 🙏 피드백

이 업데이트에 대한 피드백이나 문제가 있다면:

1. GitHub Issues에 등록
2. 프로젝트 관리자에게 문의
3. 문서 개선 제안

---

**v3.1.0 업데이트를 통해 더 체계적이고 효율적인 개발 워크플로우를 경험하세요!** 🚀
