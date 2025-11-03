---
name: test-case-generator
description: 기능 명세를 기반으로 체계적인 테스트 케이스를 생성합니다. Happy path, Edge cases, Error scenarios를 자동으로 도출하고 우선순위를 제안합니다.
allowed-tools: Read, Write, Grep, Glob
---

# 테스트 케이스 생성기

## 사용 지침

기능 명세나 구현 요구사항을 분석하여 포괄적인 테스트 케이스를 생성합니다.

## 입력

- **기능 명세** (docs/features/[기능명]/ui-spec.md 또는 feature-list.md)
- **구현 파일** (선택사항, 기존 코드 분석)

## 프로세스

### 1. 기능 분석

**요구사항 추출:**

- 기능의 핵심 동작 식별
- 입력 파라미터 및 타입 확인
- 출력 결과 및 부작용 파악
- 비즈니스 규칙 추출

**의존성 분석:**

- 외부 API 호출
- 데이터베이스 접근
- 다른 모듈과의 연동
- 상태 변경

### 2. 테스트 케이스 생성

#### 2.1 Happy Path (정상 흐름)

기본적인 성공 시나리오:

- 유효한 입력으로 기대하는 출력 확인
- 기본 사용 흐름 검증
- 일반적인 사용자 행동 패턴

```typescript
// 예시
describe("Happy Path", () => {
  it("should [기대하는 동작]", () => {
    // Given: 정상적인 초기 상태
    // When: 정상적인 입력
    // Then: 기대하는 결과
  });
});
```

#### 2.2 Edge Cases (경계 조건)

경계값 및 특수 상황:

- 최소/최대 값
- 빈 값, null, undefined
- 배열/리스트의 길이 (0개, 1개, 많은 개수)
- 특수 문자, 유니코드
- 타임아웃, 지연

```typescript
describe("Edge Cases", () => {
  it("should handle empty input", () => {});
  it("should handle maximum length", () => {});
  it("should handle special characters", () => {});
});
```

#### 2.3 Error Scenarios (에러 상황)

예상되는 오류 처리:

- 잘못된 입력 타입
- 범위를 벗어난 값
- 권한 없는 접근
- 네트워크 오류
- 서버 에러 응답
- 동시성 문제

```typescript
describe("Error Scenarios", () => {
  it("should throw error when [조건]", () => {});
  it("should handle network failure gracefully", () => {});
});
```

### 3. 우선순위 결정

각 테스트 케이스에 우선순위 할당:

**P0 (Critical):**

- 핵심 비즈니스 로직
- 데이터 손실 방지
- 보안 관련 검증

**P1 (High):**

- 주요 사용자 플로우
- 자주 발생하는 시나리오
- 성능에 영향을 주는 부분

**P2 (Medium):**

- 일반적인 기능 검증
- Edge cases
- UI 인터랙션

**P3 (Low):**

- 드물게 발생하는 시나리오
- 개선 사항 검증

### 4. 테스트 데이터 준비

각 케이스에 필요한 테스트 데이터:

- Mock 데이터 구조
- Fixture 파일
- 테스트용 상수

## 출력 형식

```markdown
# 테스트 케이스 명세: [기능명]

## 기능 개요

[기능 설명]

## Happy Path Tests (P0-P1)

### TC-001: [테스트 이름]

- **설명**: [무엇을 테스트하는가]
- **우선순위**: P0
- **전제 조건**: [Given]
- **실행 단계**: [When]
- **기대 결과**: [Then]
- **테스트 데이터**: [필요한 데이터]

## Edge Cases Tests (P1-P2)

### TC-010: [경계값 테스트]

...

## Error Scenarios Tests (P1-P2)

### TC-020: [에러 처리 테스트]

...

## 테스트 커버리지 목표

- Statement Coverage: 80%
- Branch Coverage: 70%
- Function Coverage: 90%
```

## 가이드라인

### 테스트 작성 원칙

- **FIRST 원칙**: Fast, Independent, Repeatable, Self-validating, Timely
- **AAA 패턴**: Arrange(준비), Act(실행), Assert(검증)
- **단일 책임**: 하나의 테스트는 하나의 동작만 검증

### 명명 규칙

```
should_[예상동작]_when_[조건]
```

예시:

- `should_return_user_list_when_valid_request`
- `should_throw_error_when_invalid_email`
- `should_handle_empty_array_gracefully`

### 커버리지 우선순위

1. **핵심 비즈니스 로직** (최우선)
2. **데이터 변환 로직**
3. **에러 처리**
4. **유틸리티 함수**
5. **UI 컴포넌트**

## 예시

### 입력 (기능 명세)

```
기능: 사용자 로그인
- 이메일과 비밀번호로 로그인
- 성공 시 JWT 토큰 반환
- 실패 시 에러 메시지 반환
```

### 출력 (테스트 케이스)

```typescript
// Happy Path
-should_return_jwt_token_when_valid_credentials -
  should_redirect_to_dashboard_after_login -
  // Edge Cases
  should_trim_email_whitespace -
  should_be_case_insensitive_for_email -
  // Error Scenarios
  should_return_error_when_email_not_found -
  should_return_error_when_password_incorrect -
  should_lock_account_after_5_failed_attempts -
  should_handle_database_connection_error;
```

## 참고

테스트 프레임워크별 적용 방법은 프로젝트의 기술 스택에 따라 조정합니다:

- **Jest/Vitest**: JavaScript/TypeScript
- **Pytest**: Python
- **JUnit**: Java
- **Go testing**: Go
