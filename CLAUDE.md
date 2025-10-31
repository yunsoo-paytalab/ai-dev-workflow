# AI 개발 워크플로우 가이드

## 프로젝트 개요

이 프로젝트는 체계적인 AI 기반 개발 워크플로우 시스템입니다. 도메인 정의부터 E2E 테스트까지 단계별 커맨드를 통해 프로젝트를 진행할 수 있습니다.

## 중요 원칙

1. **유연한 워크플로우**: 반드시 순서를 따를 필요 없이 필요한 단계로 바로 진행 가능
2. **의존성 경고**: 권장 순서를 따르지 않을 경우 경고 표시 후 사용자 확인
3. **자동 메모리 업데이트**: 각 작업 완료 시 `docs/workflows/memory.md` 자동 업데이트
4. **한글 응답**: 모든 응답은 한글로 제공

## 워크플로우 커맨드 체계

### 메인 커맨드

- `/workflow start` - 프로젝트 시작 및 현재 상태 파악
- `/workflow status` - 현재 진행 상황 확인
- `/workflow update` - 메모리 수동 업데이트
- `/workflow help` - 도움말
- `/workflow reset` - 프로젝트 초기화

### 작업 커맨드 (권장 순서)

1. `/workflow-domain-definition` - 도메인 정의 및 기능 목록 작성
2. `/workflow-common-ui` - 공통 UI 컴포넌트 설계
3. `/workflow-ui [기능명]` - 기능별 UI 컴포넌트 설계
4. `/workflow-implement [기능명]` - 기능 구현 (Test-First 방식)
5. `/workflow-integrate` - 시스템 통합 및 리팩토링
6. `/workflow-e2e` - E2E 테스트 및 배포 준비

### 각 단계별 세부 작업 (간략 요약)

#### 1. 도메인 정의 (`/workflow-domain-definition`)

1. 요구사항 분석
2. 도메인 경계 설정
3. 페이지 구조 정의
4. 기능 목록 도출
5. (선택) 기능 간 의존성 분석 및 구현 순서 최적화

#### 2. 공통 UI (`/workflow-common-ui`)

1. 디자인 시스템 정의
2. 공통 컴포넌트 식별
3. UI 명세 작성
4. 코드 생성

#### 3. 기능 UI (`/workflow-ui [기능명]`)

1. 화면 구조 설계
2. 컴포넌트 분할
3. 인터랙션 정의
4. UI 명세 작성

#### 4. 기능 구현 (`/workflow-implement [기능명]`)

1. 테스트 먼저 작성
2. 최소 구현
3. 리팩토링
4. 통합 테스트

#### 5. 시스템 통합 (`/workflow-integrate`)

1. 기능 연결
2. 상태 관리 통합
3. 라우팅 설정
4. 성능 최적화

#### 6. E2E 테스트 (`/workflow-e2e`)

1. 시나리오 작성
2. 테스트 구현
3. 실행 및 검증
4. 배포 준비

## 커맨드 실행 시 자동 작업

각 커맨드 실행 시 다음 작업이 자동으로 수행됩니다:

1. **메모리 파일 읽기**: `docs/workflows/memory.md`에서 현재 진행 상황 파악
2. **권장사항 체크**: 필요한 이전 단계 완료 여부 확인
3. **워크플로우 파일 참조**: 해당 작업의 상세 프로세스 확인
4. **작업 실행**: 단계별 체크리스트에 따라 작업 수행
5. **결과물 저장**: 지정된 경로에 결과물 저장
6. **메모리 업데이트**: 완료된 작업 체크 및 진행 상황 업데이트

## 의존성 경고 시스템

권장 순서를 따르지 않을 경우 다음과 같은 경고 표시:

```
💡 권장 사항

다음 단계가 완료되지 않았습니다:
- [권장 단계명]

완료되지 않은 경우 발생할 수 있는 문제:
- [구체적인 문제 1]
- [구체적인 문제 2]

계속 진행하시겠습니까? (y/n)
```

## 파일 구조

### 커맨드 파일

- `.claude/commands/workflow.md` - 메인 커맨드 및 전체 가이드
- `.claude/commands/workflow-domain-definition.md` - 도메인 정의 상세
- `.claude/commands/workflow-common-ui.md` - 공통 UI 개발
- `.claude/commands/workflow-ui.md` - 기능 UI 개발
- `.claude/commands/workflow-implement.md` - 기능 구현
- `.claude/commands/workflow-integrate.md` - 시스템 통합
- `.claude/commands/workflow-e2e.md` - E2E 테스트

### 메모리 파일

- `docs/workflows/memory.md` - 현재 프로젝트 진행 상황
- `docs/workflows/memory-template.md` - 신규 프로젝트용 템플릿

### 결과물 저장 경로

- `docs/domain-definition.md` - 도메인 정의
- `docs/page-structure.md` - 페이지 구조
- `docs/feature-list.md` - 기능 목록
- `docs/tech-stack.md` - 기술 스택
- `docs/implementation-order.md` - 구현 순서
- `docs/common-ui.md` - 공통 UI 명세
- `docs/features/[기능명]/ui-spec.md` - 기능별 UI 명세
- `docs/features/[기능명]/test-spec.md` - 테스트 명세
- `src/` - 실제 구현 코드

## 사용자 상호작용 원칙

1. **🔔 사용자 입력 필요**: 중요한 결정이 필요한 시점에 명확히 표시
2. **검수 권장사항**: 각 단계 완료 시 검수할 항목 명시
3. **피드백 즉시 반영**: 사용자 피드백 받으면 즉시 수정 후 진행

## 주의사항

- 요구사항 명세가 없으면 작업 진행 전 반드시 확보
- 각 단계의 결과물은 지정된 경로에 체계적으로 저장
- 메모리 파일은 프로젝트의 Single Source of Truth
- 모든 커맨드는 현재 진행 상황을 고려하여 실행

## 커맨드별 핵심 목표

1. **도메인 정의**: 명확한 도메인 경계와 기능 목록 도출
2. **공통 UI**: 재사용 가능한 공통 컴포넌트 설계
3. **기능 UI**: 기능별 화면 구성과 인터랙션 설계
4. **기능 구현**: Test-First 방식으로 안정적인 구현
5. **시스템 통합**: 전체 시스템 연결 및 최적화
6. **E2E 테스트**: 사용자 시나리오 기반 통합 테스트

이 가이드를 따라 체계적이고 효율적인 AI 기반 개발을 진행하세요.
