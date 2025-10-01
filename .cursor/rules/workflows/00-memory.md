# Memory 파일

> 📌 **이 파일의 역할**:
>
> - 프로젝트의 현재 진행 상황을 추적합니다
> - 모든 작업 시작 전 이 파일을 먼저 읽어 상태를 파악하세요
> - 작업 완료 시 이 파일을 업데이트하여 진행 상황을 기록하세요

---

## 전체 진행 상황

### Phase 1: 초기 설계

- [ ] Turn 1: 도메인 정의 (`@01-domain-definition.md`)
- [ ] Turn 2: 공통 UI 설계 (`@02-common-ui.md`)

### Phase 2: 기능별 개발

**Phase 2-1: 준비** (`@03-1-preparation.md`)

- [ ] Step 0: 기능 구현 순서 정리 (최초 1회)
- [ ] Step 1: 기능 선택 및 승인 (각 기능마다)

**Phase 2-2: UI 설계** (`@03-2-ui-design.md`)

- [ ] Step 2: UI 설계 (각 기능마다)

**Phase 2-3: API 설계** (`@03-3-api-design.md`)

- [ ] Step 3: API 설계 (각 기능마다)

**Phase 2-4: 구현** (`@03-4-implementation.md`)

- [ ] Step 4: 테스트 작성 (각 기능마다)
- [ ] Step 5: 구현 (각 기능마다)
- [ ] Step 6: 리팩토링 (각 기능마다)
- [ ] Step 7: 기능 검수 (각 기능마다)
- [ ] Step 8: 다음 기능으로 (각 기능마다)

### Phase 3: 통합 및 검증

- [ ] Step 1: 통합 및 리팩토링
- [ ] Step 2: E2E 테스트 및 최종 검증

---

## 도메인 목록

<!-- Phase 1 Turn 1 완료 후 동적으로 추가됩니다 -->

**예시**:

- User: 사용자 인증 및 프로필 관리
- Product: 상품 관리
- Order: 주문 처리
- Reward: 포인트/리워드 시스템 (별도 도메인)

---

## 기능 목록 및 진행 상황

<!-- Phase 2 Step 0 완료 후 동적으로 추가됩니다 -->

### 기능 구현 순서

**예시**:

그룹 1 (병렬 가능):

- F001: 상품 목록 조회
- F003: 로그인

그룹 2 (F001 완료 후):

- F002: 장바구니 추가
- F006: 상품 상세 조회

그룹 3 (F003 완료 후):

- F004: 마이페이지

### 기능별 상태

**예시**:

- [x] **F001: 상품 목록 조회** (완료)

  - 테스트: 23/23 통과
  - 커버리지: 94%
  - 완료일: 2025-01-15

- [ ] **F002: 장바구니 추가** (진행중)

  - 현재 Phase: Phase 2-3 (API 설계)
  - 현재 Step: Step 3 (API 설계)
  - 진행률: 60%

- [ ] **F003: 로그인** (대기)
  - 의존성: 없음
  - 병렬 진행 가능

---

## 현재 작업 상태

**Phase**: 1 / 2 / 3

**워크플로우**:

- Phase 1: `01-domain-definition` / `02-common-ui`
- Phase 2: `03-1-preparation` / `03-2-ui-design` / `03-3-api-design` / `03-4-implementation`
- Phase 3: `04-integration`

**현재 워크플로우**: `03-3-api-design` (예시)

**작업 중인 기능**:

- 기능 ID: F001
- 기능명: 상품 목록 조회
- 현재 Phase: Phase 2-3 (API 설계)
- 현재 Step: Step 3 (API 설계)
- 현재 파일: `@03-3-api-design.md`
- 진행률: 60%

**진행 중인 검수** (있을 때만 표시):

- 대상: Phase 1 Turn 1
- 상태: 수정 중
- 피드백: "Product와 Cart 도메인 경계 재검토 필요"

---

## 테스트 환경

### 테스트 도구

- 단위 테스트: Vitest
- 컴포넌트 테스트: React Testing Library
- E2E 테스트: Playwright
- 테스트 디렉토리: `__tests__/`

### 설정 파일 경로

- 단위 테스트: `vitest.config.ts`
- E2E 테스트: `playwright.config.ts`
- 테스트 헬퍼: `__tests__/setup.ts`

---

## 테스트 현황

**테스트 통계**:

- 단위 테스트: 45/45 통과
- 컴포넌트 테스트: 23/23 통과
- 통합 테스트: 8/8 통과
- E2E 테스트: 0/0 (미실행)

**커버리지**:

- 전체: 92%
- 목표: 90%

### 실패한 테스트

(실패한 테스트가 있다면 여기 기록)

현재: 없음

---

## 결과물 파일 경로

### Phase 1 결과물

**문서**:

- `docs/domain-definition.md`
- `docs/page-structure.md`
- `docs/feature-list.md`
- `docs/tech-stack.md`

**코드**:

- `src/shared/components/` - 공통 컴포넌트
- `src/shared/components/layout/` - 레이아웃
- `src/shared/styles/tokens.ts` - 디자인 토큰 (새로 생성 시)

### Phase 2 결과물 (기능별)

**F001 - 상품 목록 조회**:

- 페이지: `src/pages/ProductListPage.tsx`
- 컴포넌트: `src/features/product/components/`
- API: `src/api/product/`
- 테스트: `__tests__/unit/product/`, `__tests__/components/product/`

**F002 - 장바구니 추가**:

- (구현 시 추가)

### Phase 3 결과물

- 공통 모듈: `src/shared/utils/`, `src/shared/hooks/`
- 통합 테스트: `__tests__/integration/cross-domain/`
- E2E 테스트: `e2e/`

---

## 주요 결정 사항

<!-- 중요한 결정을 간략히 기록 (각 1-2줄) -->

### 도메인 설계

**예시**:

- Reward 도메인 분리: 복잡한 비즈니스 규칙, 여러 도메인 연동, 자주 변경
- 튜토리얼 User 도메인 포함: 간단한 플래그, User의 온보딩 상태 관리

### 기술 스택

**예시**:

- 상태 관리: Zustand (가볍고 간단, 타입 안전성 우수)
- 폼 관리: React Hook Form (성능, 유효성 검증)
- E2E 테스트: Playwright (빠르고 안정적)

### 아키텍처

**예시**:

- Feature-Slice 구조: 도메인별 응집도, 유지보수성
- API 계층 분리: 타입 안전성, 재사용성

---

## 다음 단계 안내

**현재 단계**: Phase 1 Turn 1 (도메인 정의)

**완료 조건**:

- [ ] 도메인 목록 정의
- [ ] 페이지 구조 정의
- [ ] 기능 목록 도출
- [ ] 사용자 검수 완료

**다음 단계**: Phase 1 Turn 2 (공통 UI 설계)

**워크플로우**: `@02-common-ui.md`

**필요한 입력**:

- 공통 컴포넌트 Figma URL
- 레이아웃 컴포넌트 Figma URL

**예상 소요 시간**: 2-3시간

---

## 현재 진행 중인 검수

<!-- 검수 진행 중일 때만 표시, 승인 후 제거 -->

**예시**:

대상: Phase 1 Turn 1 (도메인 정의)  
일시: 2025-10-01 14:30  
상태: 수정 중

**피드백**:

- Product와 Cart 도메인 경계 재검토
- 페이지 "/cart"를 추가
- API 엔드포인트는 Phase 2로 연기

**조치 사항**:

- [ ] Product/Cart 경계 문서 업데이트
- [ ] 페이지 목록에 CartPage 추가
- [ ] API 관련 내용 제거

---

## 프로젝트 정보

**프로젝트명**: (프로젝트 이름)

**시작일**: 2025-10-01

**목표 완료일**: (목표 날짜)

**주요 목표**:

- (프로젝트의 핵심 목표)

**기술 스택 요약**:

- Frontend: React + TypeScript
- 상태 관리: Zustand + React Query
- 테스트: Vitest + Playwright
- 스타일: (CSS Modules / Tailwind / Styled-components)
