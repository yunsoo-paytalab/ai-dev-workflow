# AI-Driven Development Workflow

## 개요

이 워크플로우는 AI(Cursor)와 함께 체계적으로 프론트엔드 개발을 진행하기 위한 4단계 개발 프로세스입니다.

## 4단계 개발 프로세스

1. **도메인 정의**: 비즈니스 도메인의 핵심 개념과 규칙을 명확히 정의
2. **UI 컴포넌트 설계**: 사용자 경험을 고려한 UI 설계 및 컴포넌트 구조 정의
3. **테스트 케이스 작성**: 포괄적이고 안전한 테스트 체계 구축
4. **비즈니스 로직 구현**: 테스트를 통과하는 안전하고 효율적인 코드 구현

## Multi-Chat 작업 방식

- **Phase 1**: 전체 설계 (1~2 단계)
- **Phase 2**: 도메인별 상세 작업 (1~3 단계)
- **Phase 3**: 통합 및 구현 (4 단계)

## 빠른 시작

### 1. 프로젝트 시작

```
/workflow start
```

### 2. 현재 상태 확인

```
/workflow status
```

### 3. 다음 단계 진행

```
/workflow next
```

## 주요 커맨드

### 메인 커맨드

- `/workflow start`: 프로젝트 시작
- `/workflow next`: 다음 단계 진행
- `/workflow status`: 현재 상태 확인
- `/workflow update`: 현재 상태를 memory 파일에 수동 업데이트

### 설계 단계 커맨드

- `/workflow domain-design`: 도메인 설계 작업
- `/workflow ui-design`: 공통 UI 설계 작업

### 도메인별 개발 커맨드

- `/workflow domain [domain]`: 도메인별 개발 작업
  - 예: `/workflow domain user`, `/workflow domain product`

### 통합 테스트 커맨드

- `/workflow test [domain]`: 통합 테스트 및 최종 검증
  - 예: `/workflow test user`, `/workflow test product`

### 세부 작업 커맨드

- `/workflow domain [step]`: 도메인 정의 세부 단계
- `/workflow ui [step]`: UI 설계 세부 단계
- `/workflow test [step]`: 테스트 작성 세부 단계
- `/workflow code [step]`: 코드 구현 세부 단계

### 특수 커맨드

- `/workflow reset`: 프로젝트 초기화
- `/workflow help`: 사용 가능한 모든 커맨드 확인

## 파일 구조

```
.cursor/rules/workflows/
├── README.md                          # 📖 전체 워크플로우 사용법 및 가이드
├── main-workflow.md                   # 🎯 메인 워크플로우 가이드 (4단계 프로세스)
├── memory.md                          # 🧠 진행 상황 및 파일 경로 관리 (중앙 관리)
├── memory-template.md                 # 📋 메모리 템플릿 파일
│
├── domain-definition.md               # 🏗️ 도메인 정의 워크플로우 (1단계)
│   ├── 1-1. 도메인 모델 정의
│   ├── 1-2. 도메인 간 연동 분석 및 정의
│   ├── 1-3. 유틸리티 및 설정 인터페이스 정의
│   └── 1-4. 도메인 이벤트 정의
│
├── common-ui.md                       # 🎨 공통 UI 설계 워크플로우 (2단계)
│   ├── 2-1. UI 상태 인터페이스 정의
│   ├── 2-2. Figma MCP ⇒ Code 초안 작성
│   ├── 2-3. 컴포넌트 계층 구조 설계 및 군집화
│   └── 2-4. 디자인 시스템 적용 및 컴포넌트 최적화
│
├── preparation.md                     # 🔧 기능 구현 준비 워크플로우
│   ├── Step 0: 기능 구현 순서 정리
│   └── Step 1: 기능 선택 및 승인
│
├── ui-design.md                       # 🎨 UI 설계 워크플로우
│   └── Step 2: UI 설계
│
├── implementation.md                  # ⚙️ 구현 워크플로우
│   ├── Step 3: 테스트 작성
│   ├── Step 4: 구현 (Mock API 우선)
│   ├── Step 5: 리팩토링
│   ├── Step 6: 기능 검수
│   └── Step 7: 다음 기능으로
│
├── api-integration.md                 # 🔌 API 연동 워크플로우
│   └── Step 8: API 연동
│
└── integration.md                     # 🔗 통합 및 검증 워크플로우
    ├── Step 1: 통합 및 리팩토링
    └── Step 2: E2E 테스트 및 최종 검증
```

### 파일 역할 설명

#### 📋 메인 파일들

- **README.md**: 전체 워크플로우의 사용법과 가이드를 제공하는 진입점
- **main-workflow.md**: 4단계 개발 프로세스의 핵심 가이드와 Context 관리 전략
- **memory.md**: 모든 진행 상황과 파일 경로를 중앙에서 관리하는 핵심 파일

#### ⌨️ 커맨드 시스템

- **commands.md**: 사용자가 Cursor 채팅에서 입력할 수 있는 모든 커맨드 목록
- **command-templates.md**: 각 커맨드 실행 시 사용되는 프롬프트 템플릿

#### 🔄 워크플로우 파일들

- **domain-definition.md**: 비즈니스 도메인을 정의하는 워크플로우
- **common-ui.md**: 공통 UI 컴포넌트를 설계하는 워크플로우
- **preparation.md**: 기능 구현 준비 워크플로우
- **ui-design.md**: UI 설계 워크플로우
- **implementation.md**: 구현 워크플로우
- **api-integration.md**: API 연동 워크플로우
- **integration.md**: 통합 및 검증 워크플로우

## 사용 예시

### 시나리오 1: 처음부터 시작

```
1. /workflow start
   → 도메인 설계 시작

2. /workflow next
   → 공통 UI 설계 시작

3. /workflow next
   → 도메인별 개발 시작
```

### 시나리오 2: 설계 단계 작업

```
1. /workflow domain-design
   → 도메인 설계 실행

2. /workflow ui-design
   → 공통 UI 설계 실행
```

### 시나리오 3: 도메인별 개발

```
1. /workflow domain user
   → 사용자 도메인 개발

2. /workflow domain product
   → 상품 도메인 개발

3. /workflow test user
   → 사용자 도메인 통합 테스트
```

### 시나리오 4: 세부 단계 실행

```
1. /workflow domain 1-1
   → 도메인 모델 정의 실행

2. /workflow ui 2-2
   → Figma MCP ⇒ Code 초안 작성 실행

3. /workflow test 3-1
   → 단위 테스트 작성 실행

4. /workflow code 4-1
   → 유틸리티 함수 구현 실행
```

## Context 관리 전략

### 작업 단계별 Context 제한

- **설계 단계**: 전체 도메인 (context 길지만 설계 단계라 괜찮음)
- **도메인별 개발**: 도메인별 작업 (context 길이 제한 내에서 작업)
- **통합 테스트**: 구현 단계 (이미 설계가 완료되어 context 부담 적음)

### 파일 경로 자동 참조

- **입력 파일**: memory.md의 "입력 파일 경로"에서 자동 참조
- **결과물 파일**: memory.md의 "결과물 파일 경로"에 자동 저장
- **참조 파일**: memory.md의 "참조 파일 경로"에서 작업 단계별 자동 참조

## 품질 보장

### 각 단계별 체크리스트

- 도메인 정의: 비즈니스 규칙, 엔티티 관계, 이벤트 정의
- UI 설계: 사용자 경험, 접근성, 성능 최적화
- 테스트 작성: 커버리지 90% 이상, 엣지 케이스 포함
- 구현: 모든 테스트 통과, 성능 요구사항 충족

### 자동 검증

- 타입 안전성 확인
- 테스트 커버리지 확인
- 도메인 간 연동 검증
- 일관성 확인

## 도움말

### 사용 가능한 모든 커맨드 확인

```
/workflow help
```

### 프로젝트 초기화

```
/workflow reset
```

## 핵심 원칙

1. **테스트 우선 개발 (TDD)**: 모든 로직은 테스트 케이스를 통과해야 함
2. **타입 안전성**: TypeScript를 활용한 완전한 타입 안전성 보장
3. **도메인 중심 설계**: 비즈니스 로직을 중심으로 한 아키텍처 설계
4. **일관성 유지**: 전체 시스템의 일관성 있는 설계 및 구현

## 문제 해결

### Context 길이 초과 시

- 작업 단계별로 작업을 나누어 진행
- memory.md의 파일 경로를 활용하여 필요한 파일만 참조

### 진행 상황 파악이 어려울 때

```
/workflow status
```

### 특정 단계에서 문제 발생 시

- 해당 단계의 워크플로우 프롬프트 확인
- 체크리스트를 통한 누락된 부분 파악
- memory.md의 파일 경로 확인

## 추가 정보

- 각 워크플로우 파일에는 상세한 가이드와 체크리스트가 포함되어 있습니다
- memory.md는 전체 프로젝트의 진행 상황과 파일 경로를 관리합니다
- 커맨드 실행 시 자동으로 필요한 파일들을 참조하고 결과물을 저장합니다
