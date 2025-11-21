# /workflow-implement [기능명]

선택한 기능을 RPI 패턴과 TDD 방식으로 구현합니다.

> ⚠️ **필수 선행 작업**: 이 워크플로우를 실행하기 전에 `/workflow-feature-spec [기능명]`을 먼저 완료해야 합니다.

## 실행 프로세스

### Phase 1: Memory Reading (메모리 읽기)

**Agent: memory-manager**

- `.claude/docs/memory/memory.md` 파일 읽기
- Planning Summary 확인: 구현 계획서 로드
- Active Working Set: 현재 컨텍스트, 의사결정, 제약사항 로드
- Implementation Progress: 진행 중인 작업 및 완료 항목 확인
- 출력: 구현 컨텍스트 요약
  - 구현 계획 (.claude/docs/plans/[기능명]-plan.md)
  - 활성 컨텍스트 (파일, 결정사항, 제약사항)
  - 구현 진행상황

### Phase 2: Implementation (구현)

#### 2.1 TDD Cycle

**Agent: test-runner**

- 🔴 **Red**: 실패하는 테스트 작성
- 🟢 **Green**: 테스트 통과하는 최소 구현
- 🔵 **Refactor**: 코드 개선
- 사이클 반복

#### 2.2 필수 통합 작업

**Agent: implementation-agent**

- **컴포넌트 구현**: UI 및 비즈니스 로직 작성
- **Mock 서비스**: 임시 데이터 처리 계층
- **상태 관리**: Redux/Zustand 통합
- **이벤트 핸들링**: UI와 비즈니스 로직 연결
- **스타일링**: CSS/Tailwind 적용

#### 2.3 선택적 API 연동 (--with-api 옵션)

- **API 클라이언트**: Axios/Fetch 설정
- **엔드포인트 연결**: 백엔드 API와 통합
- **Mock → Real**: Mock 데이터를 실제 API로 전환
- **에러 핸들링**: API 오류 처리

### Phase 3: Memory Update (메모리 업데이트)

**Agent: memory-manager**

- `.claude/docs/memory/memory.md` 업데이트
- Research Summary 업데이트
  - status: "completed"
  - key_findings: 주요 발견사항 추가
- Planning Summary 업데이트
  - status: "completed"
  - verification: 검증 완료 항목
- Implementation Progress 업데이트
  - completed: 완료된 작업 항목 추가
  - pending: 남은 작업 항목 업데이트
  - status: 전체 완료 시 "completed"로 변경
- Historical Memory 업데이트
  - 기능 진행 상황 테이블에 진행률 업데이트
- Active Working Set 갱신
  - 구현 관련 파일 추가
  - 기술적 결정사항 기록
  - 제약사항 업데이트
- Current Focus 갱신
  - primary_goal: 다음 작업 목표
  - working_on: 다음 작업 항목 (또는 null if 완료)
  - phase: "Implementation" (또는 null if 완료)

## 사용자 결정 포인트

🔔 **구현 전 확인 사항**:

- feature-spec 워크플로우가 완료되었는가?
- 구현 계획서 (.claude/docs/plans/[기능명]-plan.md)가 준비되었는가?
- 테스트 시나리오가 명확한가?

🔔 **구현 중 확인 사항**:

- TDD Red-Green-Refactor 사이클을 따르고 있는가?
- Mock 데이터 구조가 적절한가?
- API 연동 여부 결정 (백엔드 준비 시)

## 결과물

- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터 및 서비스
- `tests/[기능명]/` - 테스트 코드
- `src/services/[기능명]/` - API 연동 (선택적)
- `.claude/docs/memory/memory.md` - 업데이트된 프로젝트 메모리

## 관련 워크플로우

- **선행 워크플로우**: `/workflow-feature-spec` - 기능 명세 작성
- **후속 워크플로우**: 통합 테스트 및 E2E 테스트
