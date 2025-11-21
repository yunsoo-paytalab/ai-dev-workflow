# AI-Driven Development Workflow

## 개요

이 워크플로우는 AI(Cursor)와 함께 체계적으로 프론트엔드 개발을 진행하기 위한 개발 프로세스입니다.

## 워크플로우 특징

- **유연한 순서**: 원하는 순서로 작업 가능
- **진행 상황 추적**: memory.md를 통한 중앙 집중식 상태 관리
- **테스트 우선 개발**: Test-First 방식으로 안전한 구현 보장

## 주요 작업 단계

1. **도메인 정의**: 비즈니스 도메인의 핵심 개념과 기능 정의
2. **기능 명세 작성** (기능별): 요구사항 분석, 리서치, 구현 계획 수립
3. **UI 구현** (필요시): Figma 기반 UI 컴포넌트 개발
4. **비즈니스 로직 구현**: TDD 방식으로 구현 (Mock 데이터 우선)
5. **시스템 통합**: 중복 코드 제거 및 전체 구조 개선
6. **E2E 테스트**: 최종 품질 검증 및 배포 준비

## 빠른 시작

### 1. 프로젝트 시작

```
/workflow start
```

### 2. 현재 상태 확인

```
/workflow status
```

### 3. 도메인 정의

```
/workflow-domain-definition
```

### 4. 기능 명세 작성

```
/workflow-feature-spec 상품목록   # 요구사항 분석 및 계획
/workflow-feature-spec 장바구니   # 요구사항 분석 및 계획
```

### 5. UI 구현 (필요시)

```
/workflow-ui common            # 공통 컴포넌트
/workflow-ui 상품목록          # 기능별 UI
```

### 6. 비즈니스 로직 구현

```
/workflow-implement 상품목록   # TDD 방식 구현
/workflow-implement 장바구니   # TDD 방식 구현
```

## 주요 커맨드

### 메인 커맨드

- `/workflow start`: 프로젝트 시작 및 상태 확인
- `/workflow status`: 현재 진행 상황 확인
- `/workflow update`: memory.md 수동 업데이트
- `/workflow help`: 사용 가능한 모든 커맨드 확인
- `/workflow reset`: 프로젝트 초기화

### 작업 커맨드

#### 1단계: 도메인 정의

- `/workflow-domain-definition`: 도메인 목록, 페이지 구조, 기능 목록 정의

#### 2단계: 기능 명세 작성 (기능별)

- `/workflow-feature-spec [기능명]`: 요구사항 분석, 리서치, 구현 계획 수립

#### 3단계: UI 구현 (필요시)

- `/workflow-ui common`: 공통 컴포넌트 개발 (Button, Input, Dialog 등)
- `/workflow-ui [기능명]`: 기능별 UI 컴포넌트 설계

#### 4단계: 비즈니스 로직 구현

- `/workflow-implement [기능명]`: TDD 방식으로 구현 (Mock 데이터 우선)
  - **필수 선행**: `/workflow-feature-spec [기능명]` 완료

#### 5단계: 통합 및 검증

- `/workflow-integrate`: 시스템 통합 및 리팩토링
- `/workflow-e2e`: E2E 테스트 및 최종 검증

## 파일 구조

```
.claude/
├── commands/                          # 워크플로우 명령어 정의
│   ├── workflow.md                    # 메인 커맨드 (start, status, update, help, reset)
│   ├── workflow-domain-definition.md  # 도메인 정의
│   ├── workflow-feature-spec.md       # 기능 명세 작성 ⭐ NEW
│   ├── workflow-ui.md                 # UI 구현 (선택)
│   ├── workflow-implement.md          # 비즈니스 로직 구현 (TDD)
│   ├── workflow-integrate.md          # 시스템 통합
│   ├── workflow-e2e.md                # E2E 테스트
│   └── workflow-legacy-profile.md     # 레거시 코드 분석
│
├── agents/                            # AI 에이전트 정의
│   ├── research-agent.md              # 리서치 전문 에이전트
│   ├── planning-agent.md              # 계획 수립 전문 에이전트
│   ├── memory-manager.md              # 메모리 관리 에이전트
│   ├── test-runner.md                 # TDD 사이클 관리
│   └── ...
│
├── docs/                              # 워크플로우 문서 ⭐
│   ├── memory/                        # 프로젝트 메모리
│   │   ├── memory.md                  # 🧠 진행 상황 추적 (중앙 관리)
│   │   └── memory-template.md         # 📋 메모리 템플릿
│   ├── research/                      # 기능 분석 문서 (생성 예정)
│   ├── plans/                         # 구현 계획서 (생성 예정)
│   ├── legacy-analysis/               # 레거시 분석
│   └── feature-list/                  # 기능 목록
│
└── skills/                            # Claude 스킬
    └── figma-ui-generator/            # Figma 기반 UI 생성
```

### 파일 역할 설명

#### 📋 커맨드 파일 (.claude/commands/)

- **workflow.md**: 메인 커맨드 정의 (start, status, update, help, reset)
- **workflow-domain-definition.md**: 도메인 정의 (전체 프로젝트 도메인 모델)
- **workflow-feature-spec.md**: 기능 명세 작성 (요구사항 분석 및 계획) ⭐ NEW
- **workflow-ui.md**: UI 구현 (Figma 기반, 선택적)
- **workflow-implement.md**: 비즈니스 로직 구현 (TDD 방식)
- **workflow-integrate.md**: 시스템 통합 및 리팩토링
- **workflow-e2e.md**: E2E 테스트 및 최종 검증

#### 🤖 AI 에이전트 (.claude/agents/)

전문화된 AI 에이전트들:

- **research-agent**: 코드베이스 탐색 및 기능 분석
- **planning-agent**: 구현 계획 수립 및 테스트 시나리오 설계
- **memory-manager**: 프로젝트 메모리 관리 및 컨텍스트 유지
- **test-runner**: TDD Red-Green-Refactor 사이클 관리
- **feature-documenter**: 기능 문서 생성 및 관리

#### 📚 워크플로우 문서 (.claude/docs/)

- **memory/**: 프로젝트 진행 상황 추적 (중앙 관리)
- **research/**: 기능별 분석 문서 (feature-spec에서 생성)
- **plans/**: 구현 계획서 (feature-spec에서 생성)
- **legacy-analysis/**: 레거시 코드 분석 결과
- **feature-list/**: 기능 목록 및 분류

#### 🎨 스킬 (.claude/skills/)

- **figma-ui-generator**: Figma 디자인을 React 컴포넌트로 변환

## 사용 예시

### 시나리오 1: 처음부터 시작 (권장)

```bash
# 1. 프로젝트 시작
/workflow start

# 2. 도메인 정의
/workflow-domain-definition

# 3. 각 기능마다 반복
# 3-1. 기능 명세 작성
/workflow-feature-spec 상품목록   # 요구사항 분석 및 계획
/workflow-feature-spec 장바구니   # 요구사항 분석 및 계획

# 3-2. UI 구현 (필요시)
/workflow-ui common              # 공통 컴포넌트
/workflow-ui 상품목록            # 기능별 UI

# 3-3. 비즈니스 로직 구현
/workflow-implement 상품목록     # TDD 방식
/workflow-implement 장바구니     # TDD 방식

# 4. 통합 및 검증
/workflow-integrate
/workflow-e2e
```

### 시나리오 2: 기능 명세 먼저 작성

```bash
# 모든 기능의 명세를 먼저 작성
/workflow-feature-spec 상품목록
/workflow-feature-spec 장바구니
/workflow-feature-spec 결제

# 검토 및 승인 후 구현 시작
/workflow-implement 상품목록
/workflow-implement 장바구니
/workflow-implement 결제
```

### 시나리오 3: UI가 필요 없는 경우

```bash
# API 서비스나 비즈니스 로직만 필요한 경우
/workflow-feature-spec 결제처리
/workflow-implement 결제처리     # UI 없이 바로 구현
```

### 시나리오 4: 진행 상황 확인

```bash
# 현재 상태 확인
/workflow status

# Memory 수동 업데이트
/workflow update
```

## 워크플로우 특징

### 1. 유연한 작업 순서

- 원하는 순서대로 작업 가능
- 필요한 단계부터 시작 가능

**권장 작업 순서** (참고용):

1. **도메인 정의** → 2. **각 기능마다 반복** (기능 명세 → UI 구현(필요시) → 비즈니스 로직 구현) → 3. **통합** → 4. **E2E**

### 2. 중앙 집중식 상태 관리

**memory.md 파일 역할**:

- 프로젝트 기본 정보 저장
- 진행 상황 체크리스트 관리
- 기능별 진행상황 추적
- 파일 경로 중앙 관리
- 주요 결정 사항 기록

## 품질 보장

### Test-First 개발 방식

**기능 구현 프로세스**:

1. 테스트 작성 (더미 데이터 기반)
2. 구현 (더미 데이터 우선)
3. 리팩토링
4. API 연동 (선택)

**테스트 체크리스트**:

- 단위 테스트: 각 함수/컴포넌트별
- 통합 테스트: 기능 간 연동
- E2E 테스트: 사용자 플로우

### 각 단계별 검수

- **도메인 정의**: 기능 목록, 페이지 구조 확인
- **UI 설계**: Figma 일치도, 반응형 체크
- **기능 구현**: 테스트 통과, 더미 데이터 동작 확인
- **통합**: 중복 코드 제거, 성능 최적화
- **E2E**: 전체 플로우 동작 확인

## 도움말

### 사용 가능한 모든 커맨드 확인

```bash
/workflow help
```

### 프로젝트 초기화

```bash
/workflow reset
```

## 문제 해결

### 진행 상황 파악이 어려울 때

```bash
/workflow status
```

### Memory 파일 업데이트가 필요할 때

```bash
/workflow update
```

### 특정 작업 가이드 확인

- 각 커맨드 파일 (`.claude/commands/`) 확인
- 메모리 파일 (`.claude/docs/memory/`) 확인
- 분석 문서 (`.claude/docs/research/`) 및 계획서 (`.claude/docs/plans/`) 확인

## 핵심 원칙

1. **Test-First 개발**: 테스트 작성 → 구현 → 리팩토링
2. **더미 데이터 우선**: API 연동은 선택적으로, 우선 더미 데이터로 구현
3. **단계별 검수**: 각 단계마다 사용자 검수 진행
4. **유연한 워크플로우**: 원하는 순서대로 작업 가능
5. **중앙 집중식 관리**: memory.md를 통한 진행 상황 추적
6. **타입 안전성**: TypeScript를 활용한 완전한 타입 안전성 보장

## 추가 정보

### 커맨드 실행 시 자동 작업

1. `memory.md` 읽어 현재 상태 파악
2. 필요한 스킬 순차 실행 (메모리 기반 데이터 전달)
3. 작업 수행 및 검수
4. 결과물 저장 (.claude/docs/ 또는 src/)
5. `.claude/docs/memory/memory.md` 업데이트

### 에이전트 기반 워크플로우

**기능 명세 작성 프로세스** (`/workflow-feature-spec`):

```
1. memory-manager: 프로젝트 컨텍스트 로드
   ↓
2. research-agent: 요구사항 분석 및 코드베이스 탐색
   ↓ .claude/docs/research/[기능명]-analysis.md
3. planning-agent: 구현 계획 및 테스트 시나리오 수립
   ↓ .claude/docs/plans/[기능명]-plan.md
4. memory-manager: 진행 상황 업데이트
```

**비즈니스 로직 구현 프로세스** (`/workflow-implement`):

```
1. memory-manager: 구현 계획 로드
   ↓
2. test-runner: TDD Red-Green-Refactor 사이클 관리
   ↓ 테스트 코드 + 구현 코드
3. memory-manager: 완료 상황 업데이트
```

**장점**:

- 전문화된 AI 에이전트가 각 단계 담당
- 메모리 기반 컨텍스트 유지
- 체계적인 문서 생성 및 관리

### 도움이 필요하신가요?

- 각 커맨드 파일 (`.claude/commands/`)에 상세한 가이드가 포함되어 있습니다
- 메모리 파일 (`.claude/docs/memory/memory.md`)에 진행 상황이 추적됩니다
- `/workflow help` 커맨드로 전체 커맨드 목록 확인 가능
