# AI-Driven Development Workflow

## 개요

이 워크플로우는 AI(Cursor)와 함께 체계적으로 프론트엔드 개발을 진행하기 위한 개발 프로세스입니다.

## 워크플로우 특징

- **유연한 순서**: 원하는 순서로 작업 가능
- **의존성 경고**: 권장 사항 미충족 시 경고 표시 후 계속 진행 가능
- **진행 상황 추적**: memory.md를 통한 중앙 집중식 상태 관리
- **테스트 우선 개발**: Test-First 방식으로 안전한 구현 보장

## 주요 작업 단계

1. **도메인 정의**: 비즈니스 도메인의 핵심 개념과 기능 정의
2. **공통 UI 설계**: 재사용 가능한 공통 컴포넌트 개발
3. **기능 UI 설계**: 기능별 컴포넌트 개발
4. **기능 구현**: 테스트 작성 후 구현 (더미 데이터 우선)
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

### 4. 컴포넌트 개발

```
/workflow-common-ui           # 공통 컴포넌트
/workflow-ui 상품목록          # 기능 컴포넌트
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

#### 2단계: UI 설계

- `/workflow-common-ui`: 공통 컴포넌트 개발 (Dialog, Toast 등)
- `/workflow-ui [기능명]`: 기능별 컴포넌트 개발

#### 3단계: 기능 구현

- `/workflow-implement [기능명]`: 테스트 작성 후 구현 (더미 데이터 우선)

#### 4단계: 통합 및 검증

- `/workflow-integrate`: 시스템 통합 및 리팩토링
- `/workflow-e2e`: E2E 테스트 및 최종 검증

## 파일 구조

```
.cursor/
├── commands/                          # 커맨드 정의 파일
│   ├── workflow.md                    # 메인 커맨드 (start, status, update, help, reset)
│   ├── workflow-domain-definition.md  # 도메인 정의 커맨드
│   ├── workflow-common-ui.md          # 공통 UI 커맨드
│   ├── workflow-ui.md                 # 기능 UI 커맨드
│   ├── workflow-implement.md          # 기능 구현 커맨드
│   ├── workflow-integrate.md          # 통합 커맨드
│   └── workflow-e2e.md                # E2E 테스트 커맨드
│
└── rules/workflows/                   # 워크플로우 가이드 파일
    ├── memory.md                      # 🧠 진행 상황 추적 (중앙 관리)
    ├── memory-template.md             # 📋 메모리 템플릿
    ├── domain-definition.md           # 🏗️ 도메인 정의 가이드
    ├── ui-design.md                   # 🎨 UI 설계 가이드
    ├── feature-implementation.md      # ⚙️ 기능 구현 가이드
    └── system-integration.md          # 🔗 통합 및 E2E 테스트 가이드
```

### 파일 역할 설명

#### 📋 커맨드 파일 (.cursor/commands/)

- **workflow.md**: 메인 커맨드 정의 (start, status, update, help, reset)
- **workflow-domain-definition.md**: 도메인 정의 커맨드
- **workflow-common-ui.md**: 공통 컴포넌트 개발 커맨드
- **workflow-ui.md**: 기능 컴포넌트 개발 커맨드
- **workflow-implement.md**: 기능 구현 커맨드
- **workflow-integrate.md**: 시스템 통합 커맨드
- **workflow-e2e.md**: E2E 테스트 커맨드

#### 🔄 워크플로우 가이드 파일 (.cursor/rules/workflows/)

- **memory.md**: 진행 상황 및 파일 경로 중앙 관리
- **domain-definition.md**: 도메인 및 기능 정의 작업 가이드
- **ui-design.md**: UI 컴포넌트 설계 작업 가이드
- **feature-implementation.md**: 기능 구현 작업 가이드 (테스트, 구현, API 연동)
- **system-integration.md**: 통합 리팩토링 및 E2E 테스트 가이드

## 사용 예시

### 시나리오 1: 처음부터 시작

```bash
# 1. 프로젝트 시작
/workflow start

# 2. 도메인 정의
/workflow-domain-definition

# 3. 공통 컴포넌트 개발
/workflow-common-ui        # Dialog 컴포넌트
/workflow-common-ui        # Toast 컴포넌트

# 4. 기능 컴포넌트 개발
/workflow-ui 상품목록      # ProductList 컴포넌트
/workflow-ui 장바구니      # CartPage 컴포넌트

# 5. 기능 구현
/workflow-implement 상품목록
/workflow-implement 장바구니

# 6. 통합 및 검증
/workflow-integrate
/workflow-e2e
```

### 시나리오 2: 공통 컴포넌트만 개발

```bash
# 디자인 시스템 구축
/workflow-common-ui        # Button 컴포넌트
/workflow-common-ui        # Input 컴포넌트
/workflow-common-ui        # Dialog 컴포넌트
/workflow-common-ui        # Toast 컴포넌트
```

### 시나리오 3: 특정 기능만 빠르게 개발

```bash
# UI 설계 생략하고 바로 구현
/workflow-implement 로그인    # UI 없이 바로 구현 가능
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
- 의존성 미충족 시 경고만 표시
- 사용자 확인 후 계속 진행 가능

### 2. 의존성 경고 시스템

**권장 작업 순서** (필수 아님):

1. 도메인 정의 → 2. 공통 UI → 3. 기능 UI → 4. 기능 구현 → 5. 통합 → 6. E2E

**의존성 체크 예시**:

- 공통 UI: 도메인 정의 완료 권장 (폴더 구조 정보)
- 기능 UI: 도메인 정의 + 공통 UI 완료 권장
- 기능 구현: 도메인 정의 완료 필수
- 통합: 모든 기능 구현 완료 권장
- E2E: 통합 완료 권장

### 3. 중앙 집중식 상태 관리

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

### 의존성 경고가 표시될 때

- 경고 메시지를 확인하고 진행 여부 결정
- 권장 사항이지만 필수는 아님
- 불편함이 없다면 계속 진행 가능

### 특정 작업 가이드 확인

- 각 커맨드 파일 (.cursor/commands/) 확인
- 워크플로우 가이드 파일 (.cursor/rules/workflows/) 확인

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
2. 의존성 체크 및 경고 표시
3. 워크플로우 가이드 파일 참조
4. 작업 수행 및 검수
5. 결과물 저장
6. `memory.md` 업데이트

### 도움이 필요하신가요?

- 각 커맨드 파일에 상세한 가이드가 포함되어 있습니다
- 워크플로우 가이드 파일에 단계별 체크리스트가 있습니다
- `/workflow help` 커맨드로 전체 커맨드 목록 확인 가능
