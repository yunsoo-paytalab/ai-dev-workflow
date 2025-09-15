# 전체 진행 상황

## Phase 1: 전체 설계 (1~2 단계)

- [ ] 전체 도메인 정의
- [ ] 전체 UI 설계

## Phase 2: 도메인별 완전한 개발 (1~4 단계)

<!-- - [ ] 도메인별 상세 작업 (1~3 단계) (동적으로 추가됨) -->
<!-- - [ ] 도메인별 구현 (4 단계) (동적으로 추가됨) -->

## Phase 3: 전체 시스템 통합 및 최종 검증

- [ ] 통합 및 최종 검증

# 도메인별 진행 상황

## 식별된 도메인 목록

- [ ] 도메인 목록이 Phase 1 완료 후 동적으로 추가됩니다

## 도메인별 작업 상태

<!-- - [ ] 도메인별 작업 상태가 동적으로 추가됩니다 -->

# 도메인 간 연동 상태

- [ ] 도메인 간 연동 정의 (동적으로 추가됨)
- [ ] 공통 인터페이스 정의
- [ ] 이벤트 버스 설계

# 공통 작업 상태

- [ ] 공통 유틸리티 함수 정의
- [ ] 공통 설정 인터페이스 정의
- [ ] 공통 테스트 유틸리티 설정
- [ ] 디자인 시스템 정의
- [ ] 성능 벤치마크 기준 설정

# 파일 경로 관리

## 입력 파일 경로

### 요구사항 및 설계 문서

- 요구사항 명세서: `docs/requirements.md`
- 기존 시스템 아키텍처: `docs/architecture.md`
- 비즈니스 프로세스 문서: `docs/business-process.md`

### 디자인 파일

- 공통 디자인 모듈: `/packages/ui`

### 설정 파일

- 환경 설정: `.env`, `config/`
- API 서버 설정: `config/api.ts`
- 테스트 설정: `jest.config.js`, `playwright.config.ts`

## 결과물 파일 경로

<!-- 결과물 파일 경로는 각 워크플로우에서 동적으로 추가됩니다 -->

## 참조 파일 경로

### 필수 참조 (모든 Turn)

- 메인 메모리: `@memory.md`
- 워크플로우 프롬프트: `.cursor/rules/workflows/`

### Phase별 참조

#### Phase 1

- 전체 도메인 설계: `src/entities/`
- 전체 UI 설계: `src/features/`

#### Phase 2

- 현재 도메인 이전 작업: `src/entities/[current-domain]/`
- 공통 인터페이스: `src/shared/interfaces/`
- 디자인 시스템: `src/shared/design-system/`
- 연동 도메인 코드: `src/entities/[related-domain]/`

#### Phase 3

- 모든 도메인 완성 코드: `src/entities/`, `src/features/`
- 통합 테스트 케이스: `__tests__/integration/`
- 성능 벤치마크: `docs/performance/`

# 현재 작업 상태

<!-- 현재 작업 상태는 각 워크플로우에서 동적으로 업데이트됩니다 -->
