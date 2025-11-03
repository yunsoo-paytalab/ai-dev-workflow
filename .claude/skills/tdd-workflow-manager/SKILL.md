---
name: tdd-workflow-manager
description: Test-Driven Development의 Red-Green-Refactor 사이클을 관리합니다. 테스트 우선 작성, 최소 구현, 리팩토링 단계를 체계적으로 안내하고 각 단계의 완료 여부를 검증합니다.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# TDD 워크플로우 매니저

## 사용 지침

Test-Driven Development의 핵심 사이클인 Red-Green-Refactor를 단계별로 안내하고 관리합니다.

**전제 조건:**
- **skill:test-case-generator**로 테스트 케이스 명세가 이미 생성되어 있어야 함
- 이 skill은 생성된 테스트 케이스를 하나씩 구현하는 프로세스를 관리함

## TDD 사이클 개요

```
🔴 Red (실패하는 테스트 작성)
    ↓
🟢 Green (테스트를 통과하는 최소 구현)
    ↓
🔵 Refactor (코드 개선 및 최적화)
    ↓
    ↻ 반복
```

## 프로세스

### Phase 1: 🔴 Red - 실패하는 테스트 작성

#### 1.1 테스트 선택

**전제 조건:**
- **skill:test-case-generator**로 이미 생성된 테스트 케이스 목록 필요

**입력:**
- 테스트 케이스 명세 문서 (test-case-generator의 출력)
- 현재 구현 상태

**작업:**
1. 테스트 케이스 목록에서 우선순위 확인
2. 아직 구현되지 않은 테스트 중 가장 높은 우선순위 선택
3. 현재 사이클에서 작성할 테스트 확정

**출력:**
```markdown
📝 현재 사이클 테스트: TC-001

- 기능: 사용자 로그인
- 테스트: should_return_jwt_token_when_valid_credentials
- 우선순위: P0
- 출처: test-case-generator 생성 명세
```

#### 1.2 테스트 코드 작성

**원칙:**

- **AAA 패턴** 준수: Arrange, Act, Assert
- **단일 책임**: 하나의 테스트는 하나의 동작만 검증
- **명확한 이름**: 테스트가 무엇을 검증하는지 이름으로 알 수 있어야 함

**예시:**

```typescript
describe("UserAuthentication", () => {
  it("should_return_jwt_token_when_valid_credentials", async () => {
    // Arrange (준비)
    const email = "user@example.com";
    const password = "validPassword123";
    const mockUser = { id: 1, email };

    // Act (실행)
    const result = await authService.login(email, password);

    // Assert (검증)
    expect(result).toHaveProperty("token");
    expect(result.token).toBeTruthy();
  });
});
```

#### 1.3 테스트 실행 및 실패 확인

**실행:**

```bash
npm test -- [테스트 파일명]
```

**검증:**

- ✅ 테스트가 **실패**해야 함 (아직 구현되지 않았으므로)
- ✅ 실패 이유가 **명확**해야 함
- ❌ 테스트가 통과하면 안 됨 (잘못된 테스트)

**출력:**

```
🔴 RED 단계 완료

테스트 실패 확인:
FAIL src/auth/auth.service.test.ts
  ● should_return_jwt_token_when_valid_credentials
    TypeError: authService.login is not a function

✅ 예상된 실패 - GREEN 단계로 진행 가능
```

---

### Phase 2: 🟢 Green - 최소 구현

#### 2.1 최소 구현 원칙

**목표:**

- 테스트를 **통과**시키는 것
- **최소한의 코드**만 작성
- 완벽한 구현이 아닌 **동작하는 구현**

**지침:**

1. 하드코딩도 괜찮음 (나중에 리팩토링)
2. 엣지 케이스는 무시 (다음 테스트에서 추가)
3. 성능 최적화는 하지 않음 (리팩토링 단계에서)

#### 2.2 구현 작성

**예시:**

```typescript
// 최소 구현 - 테스트만 통과하면 됨
class AuthService {
  async login(email: string, password: string) {
    // 단순히 테스트를 통과시키기 위한 최소 구현
    return {
      token: "dummy-jwt-token",
    };
  }
}
```

#### 2.3 테스트 실행 및 통과 확인

**실행:**

```bash
npm test -- [테스트 파일명]
```

**검증:**

- ✅ 테스트가 **통과**해야 함
- ✅ **모든 이전 테스트**도 여전히 통과해야 함
- ❌ 새로운 테스트 실패가 있으면 안 됨

**출력:**

```
🟢 GREEN 단계 완료

테스트 통과 확인:
PASS src/auth/auth.service.test.ts
  ✓ should_return_jwt_token_when_valid_credentials (15ms)

Tests: 1 passed, 1 total

✅ 테스트 통과 - REFACTOR 단계로 진행 가능
```

---

### Phase 3: 🔵 Refactor - 리팩토링

#### 3.1 리팩토링 체크리스트

**코드 품질:**

- [ ] 중복 코드 제거
- [ ] 명확한 변수/함수명
- [ ] 적절한 추상화 레벨
- [ ] 단일 책임 원칙 준수

**성능:**

- [ ] 불필요한 연산 제거
- [ ] 효율적인 알고리즘 사용
- [ ] 메모리 누수 확인

**가독성:**

- [ ] 코드 포맷팅 일관성
- [ ] 주석 필요 시 추가
- [ ] 복잡한 로직 분리

#### 3.2 리팩토링 실행

**원칙:**

- **테스트는 변경하지 않음** (기능은 동일)
- **작은 단위로 리팩토링** (한 번에 하나씩)
- **각 단계마다 테스트 실행** (회귀 방지)

**예시:**

```typescript
// Before (최소 구현)
class AuthService {
  async login(email: string, password: string) {
    return { token: "dummy-jwt-token" };
  }
}

// After (리팩토링)
class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const isValidPassword = await this.validatePassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new AuthenticationError("Invalid password");
    }

    const token = this.tokenGenerator.generate(user.id);
    return { token };
  }

  private async validatePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    // 비밀번호 검증 로직
    return await bcrypt.compare(password, hash);
  }
}
```

#### 3.3 리팩토링 후 검증

**실행:**

```bash
npm test -- [테스트 파일명]
```

**검증:**

- ✅ **모든 테스트**가 여전히 통과해야 함
- ✅ **기능 변경 없음** (테스트 결과 동일)
- ✅ **코드 품질 개선** 확인

**출력:**

```
🔵 REFACTOR 단계 완료

리팩토링 검증:
PASS src/auth/auth.service.test.ts
  ✓ should_return_jwt_token_when_valid_credentials (18ms)

Tests: 1 passed, 1 total

개선 사항:
✅ 의존성 주입 적용
✅ 에러 핸들링 추가
✅ 비밀번호 검증 로직 분리

✅ 리팩토링 완료 - 다음 테스트로 진행 가능
```

---

## TDD 사이클 관리

### 사이클 상태 추적

```markdown
# TDD 진행 상황: [기능명]

## 현재 사이클: 3/10

### Cycle 1: ✅ 완료

- 테스트: should_return_jwt_token_when_valid_credentials
- Red: ✅ | Green: ✅ | Refactor: ✅

### Cycle 2: ✅ 완료

- 테스트: should_throw_error_when_invalid_credentials
- Red: ✅ | Green: ✅ | Refactor: ✅

### Cycle 3: 🔄 진행 중

- 테스트: should_lock_account_after_5_failed_attempts
- Red: ✅ | Green: 🔄 | Refactor: ⏳
```

### 사이클 완료 조건

**Red 완료:**

- [ ] 테스트 코드 작성 완료
- [ ] 테스트 실행 시 실패 확인
- [ ] 실패 이유가 명확함

**Green 완료:**

- [ ] 최소 구현 코드 작성
- [ ] 새 테스트 통과
- [ ] 기존 테스트 모두 통과

**Refactor 완료:**

- [ ] 코드 개선 완료
- [ ] 모든 테스트 여전히 통과
- [ ] 코드 품질 체크리스트 확인

---

## 고급 패턴

### 1. 삼각측량 (Triangulation)

여러 테스트로 구현을 일반화:

```typescript
// Test 1
it("should_return_2_when_adding_1_and_1", () => {
  expect(add(1, 1)).toBe(2);
});

// Test 2
it("should_return_5_when_adding_2_and_3", () => {
  expect(add(2, 3)).toBe(5);
});

// 이제 하드코딩이 아닌 일반화된 구현 필요
function add(a: number, b: number): number {
  return a + b;
}
```

### 2. 명백한 구현 (Obvious Implementation)

간단한 기능은 바로 구현:

```typescript
// 너무 명백한 경우 테스트만 작성하고 바로 올바른 구현
it("should_return_uppercase", () => {
  expect(toUpper("hello")).toBe("HELLO");
});

function toUpper(str: string): string {
  return str.toUpperCase(); // 명백한 구현
}
```

### 3. 가짜 구현 (Fake It)

하드코딩 후 점진적 일반화:

```typescript
// Step 1: 하드코딩
function calculate() {
  return 42;
}

// Step 2: 다른 테스트 추가로 일반화 유도
// Step 3: 진짜 구현으로 대체
```

---

## 사용자 인터랙션 포인트

### 1. 사이클 시작 시

```
🔴 RED 단계 시작

다음 테스트를 작성합니다:
- TC-003: should_handle_empty_password

준비되셨나요?
[계속] [건너뛰기] [일시정지]
```

### 2. 각 단계 완료 시

```
🟢 GREEN 단계 완료

테스트가 통과했습니다!

다음 단계:
[리팩토링 진행] [다음 테스트로]
```

### 3. 문제 발생 시

```
⚠️ 경고: 예상치 못한 테스트 실패

새로 작성한 코드가 기존 테스트를 실패시켰습니다:
- should_validate_email_format (기존 테스트)

원인 분석이 필요합니다.
[코드 복구] [디버깅] [건너뛰기]
```

---

## 출력 파일

### TDD 세션 로그

`docs/features/[기능명]/tdd-log.md`:

```markdown
# TDD 세션 로그: 사용자 인증

## 세션 정보

- 시작: 2025-01-15 10:00
- 종료: 2025-01-15 12:30
- 총 사이클: 8개
- 통과율: 100%

## 사이클 기록

### Cycle 1 (10:00-10:15)

- **테스트**: should_return_jwt_token_when_valid_credentials
- **Red**: 10:00 - 테스트 작성 및 실패 확인
- **Green**: 10:08 - 최소 구현으로 통과
- **Refactor**: 10:12 - 의존성 주입 적용
- **결과**: ✅ 성공

### Cycle 2 (10:15-10:30)

...

## 학습 내용

- bcrypt 사용법 학습
- JWT 토큰 생성 구현
- 에러 핸들링 패턴 적용

## 개선 사항

- 테스트 실행 속도: 2.3s → 1.1s
- 코드 커버리지: 0% → 85%
```

---

## 가이드라인

### TDD의 황금률

1. **테스트 없이 프로덕션 코드를 작성하지 않는다**
2. **실패하는 테스트 없이 새 테스트를 작성하지 않는다**
3. **테스트를 통과할 만큼만 코드를 작성한다**

### 좋은 TDD 습관

- **작은 단계**: 한 번에 하나의 테스트만
- **빠른 피드백**: 테스트는 빠르게 실행되어야 함
- **명확한 실패**: 실패 메시지가 문제를 즉시 알려줘야 함
- **점진적 개선**: 작은 리팩토링을 자주

### 피해야 할 것

- ❌ 테스트 없이 구현 먼저 하기
- ❌ 여러 테스트를 한 번에 작성
- ❌ 과도한 구현 (테스트 이상으로)
- ❌ 리팩토링 단계 건너뛰기

---

## 예시 시나리오

### 완전한 TDD 사이클

```
📋 기능: 장바구니에 상품 추가

🔴 Cycle 1: Red
┌─────────────────────────────────────┐
│ Test: should_add_item_to_cart       │
│ Result: FAIL ❌                      │
│ Reason: addToCart is not a function │
└─────────────────────────────────────┘

🟢 Cycle 1: Green
┌─────────────────────────────────────┐
│ Implementation:                      │
│   function addToCart(item) {        │
│     return [item]                   │
│   }                                 │
│ Result: PASS ✅                      │
└─────────────────────────────────────┘

🔵 Cycle 1: Refactor
┌─────────────────────────────────────┐
│ Improvements:                        │
│   - Type 추가                        │
│   - 인터페이스 정의                  │
│ Result: PASS ✅                      │
└─────────────────────────────────────┘

🔴 Cycle 2: Red
┌─────────────────────────────────────┐
│ Test: should_increase_quantity       │
│ Result: FAIL ❌                      │
│ Reason: quantity not updated        │
└─────────────────────────────────────┘

... 계속 반복 ...
```

## 통합 도구

- **테스트 러너**: Jest, Vitest, Pytest, JUnit
- **커버리지 도구**: Istanbul, Coverage.py
- **CI/CD**: GitHub Actions, GitLab CI
