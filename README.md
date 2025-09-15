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
@workflow start
```

### 2. 현재 상태 확인

```
@workflow status
```

### 3. 다음 단계 진행

```
@workflow next
```

## 주요 커맨드

### 메인 커맨드

- `@workflow start`: 프로젝트 시작
- `@workflow next`: 다음 단계 진행
- `@workflow status`: 현재 상태 확인

### Phase별 커맨드

- `@workflow phase1`: Phase 1 (전체 설계) 작업
- `@workflow phase2 [domain]`: Phase 2 (도메인별 상세 작업)
- `@workflow phase3 [domain]`: Phase 3 (통합 및 구현)

### 단계별 커맨드

- `@workflow domain [step]`: 도메인 정의 단계
- `@workflow ui [step]`: UI 설계 단계
- `@workflow test [step]`: 테스트 작성 단계
- `@workflow implement [step]`: 구현 단계

### 도메인별 커맨드

- `@workflow domainA`: 도메인 A 작업
- `@workflow domainB`: 도메인 B 작업
- `@workflow domainC`: 도메인 C 작업

## 파일 구조

```
.cursor/rules/workflows/
├── README.md                          # 📖 전체 워크플로우 사용법 및 가이드
├── main-workflow.md                   # 🎯 메인 워크플로우 가이드 (4단계 프로세스)
├── memory.md                          # 🧠 진행 상황 및 파일 경로 관리 (중앙 관리)
│
├── commands.md                        # ⌨️ 커맨드 가이드 (사용자 명령어)
├── command-templates.md               # 📝 커맨드 실행 프롬프트 템플릿
│
├── domain-definition.md               # 🏗️ 도메인 정의 워크플로우 (1단계)
│   ├── 1-1. 도메인 모델 정의
│   ├── 1-2. 도메인 간 연동 분석 및 정의
│   ├── 1-3. 유틸리티 및 설정 인터페이스 정의
│   └── 1-4. 도메인 이벤트 정의
│
├── ui-design.md                       # 🎨 UI 컴포넌트 설계 워크플로우 (2단계)
│   ├── 2-1. UI 상태 인터페이스 정의
│   ├── 2-2. Figma MCP ⇒ Code 초안 작성
│   ├── 2-3. 컴포넌트 계층 구조 설계 및 군집화
│   └── 2-4. 디자인 시스템 적용 및 컴포넌트 최적화
│
├── test-writing.md                    # 🧪 테스트 케이스 작성 워크플로우 (3단계)
│   ├── 3-1. 단위 테스트 작성
│   ├── 3-2. 컴포넌트 테스트 작성
│   ├── 3-3. 통합 테스트 작성
│   └── 3-4. E2E 테스트 작성
│
├── implementation.md                  # ⚙️ 비즈니스 로직 구현 워크플로우 (4단계)
│   ├── 4-1. 유틸리티 함수 구현
│   ├── 4-2. API 함수 구현
│   ├── 4-3. 컴포넌트 로직 구현
│   └── 4-4. 통합 및 최종 검증
│
└── multi-chat.md                      # 💬 Multi-Chat 작업 방식 (Phase별 가이드)
    ├── Phase 1: 전체 설계 (Chat 1-2)
    ├── Phase 2: 도메인별 상세 작업 (Chat 3-5)
    └── Phase 3: 통합 및 구현 (Chat 6-9)
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

- **domain-definition.md**: 비즈니스 도메인을 정의하는 1단계 워크플로우
- **ui-design.md**: UI 컴포넌트를 설계하는 2단계 워크플로우
- **test-writing.md**: 테스트 케이스를 작성하는 3단계 워크플로우
- **implementation.md**: 비즈니스 로직을 구현하는 4단계 워크플로우

#### 💬 Multi-Chat 가이드

- **multi-chat.md**: 9개의 Chat으로 나누어진 작업 방식과 각 Chat별 상세 가이드

## 사용 예시

### 시나리오 1: 처음부터 시작

```
1. @workflow start
   → Phase 1, Chat 1, 전체 도메인 정의 시작

2. @workflow next
   → Phase 1, Chat 2, 전체 UI 설계 시작

3. @workflow next
   → Phase 2, Chat 3, 도메인 A 상세 작업 시작
```

### 시나리오 2: 특정 단계 실행

```
1. @workflow domain 1-1
   → 도메인 모델 정의 실행

2. @workflow ui 2-2
   → Figma MCP ⇒ Code 초안 작성 실행

3. @workflow test 3-1
   → 단위 테스트 작성 실행
```

### 시나리오 3: 도메인별 작업

```
1. @workflow domainA
   → 도메인 A의 다음 단계 실행

2. @workflow phase2 domainB
   → Phase 2에서 도메인 B 작업

3. @workflow phase3 domainC
   → Phase 3에서 도메인 C 구현
```

## Context 관리 전략

### Phase별 Context 제한

- **Phase 1**: 전체 도메인 (context 길지만 설계 단계라 괜찮음)
- **Phase 2**: 도메인별 작업 (context 길이 제한 내에서 작업)
- **Phase 3**: 구현 단계 (이미 설계가 완료되어 context 부담 적음)

### 파일 경로 자동 참조

- **입력 파일**: memory.md의 "입력 파일 경로"에서 자동 참조
- **결과물 파일**: memory.md의 "결과물 파일 경로"에 자동 저장
- **참조 파일**: memory.md의 "참조 파일 경로"에서 Phase별 자동 참조

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
@workflow help
```

### 프로젝트 초기화

```
@workflow reset
```

## 핵심 원칙

1. **테스트 우선 개발 (TDD)**: 모든 로직은 테스트 케이스를 통과해야 함
2. **타입 안전성**: TypeScript를 활용한 완전한 타입 안전성 보장
3. **도메인 중심 설계**: 비즈니스 로직을 중심으로 한 아키텍처 설계
4. **일관성 유지**: 전체 시스템의 일관성 있는 설계 및 구현

## 문제 해결

### Context 길이 초과 시

- Phase별로 작업을 나누어 진행
- memory.md의 파일 경로를 활용하여 필요한 파일만 참조

### 진행 상황 파악이 어려울 때

```
@workflow status
```

### 특정 단계에서 문제 발생 시

- 해당 단계의 워크플로우 프롬프트 확인
- 체크리스트를 통한 누락된 부분 파악
- memory.md의 파일 경로 확인

## 추가 정보

- 각 워크플로우 파일에는 상세한 가이드와 체크리스트가 포함되어 있습니다
- memory.md는 전체 프로젝트의 진행 상황과 파일 경로를 관리합니다
- 커맨드 실행 시 자동으로 필요한 파일들을 참조하고 결과물을 저장합니다
