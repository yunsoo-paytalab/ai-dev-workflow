# /workflow-e2e

E2E 테스트를 작성하고 실행합니다.

> **실제 API 사용**: Mock API가 아닌 실제 API를 사용하여 테스트합니다.

## 실행 프로세스

### Phase 1: 테스트 명세 작성

#### 1.1 TC 요청

- 사용자에게 테스트할 시나리오/기능 요청
- Critical Path 및 우선순위 확인

#### 1.2 E2E 테스트 명세 작성

- 주요 사용자 플로우 식별
- Happy path, 예외 상황 포함
- 테스트 데이터 요구사항 정의

#### 1.3 🔔 사용자 검토 (명세 승인)

**사용자 확인 필요:**

- 테스트 시나리오가 요구사항을 충족하는가?
- 누락된 케이스가 없는가?

---

### Phase 2: 깡통 TC 작성

#### 2.1 테스트 구조 작성

- describe/it 구조만 작성 (구현 없음)
- 테스트 흐름을 코드로 표현
- describe, it 설명문은 **한글**로 작성

```typescript
describe("주문 플로우", () => {
  it("상품을 장바구니에 추가할 수 있다", async () => {
    // TODO: 구현 예정
  });

  it("장바구니에서 주문을 진행할 수 있다", async () => {
    // TODO: 구현 예정
  });
});
```

#### 2.2 🔔 사용자 검토 (플로우 확인)

**사용자 확인 필요:**

- 테스트 플로우가 실제 사용자 행동과 일치하는가?
- 단계별 순서가 올바른가?

---

### Phase 3: 실제 Flow 검증 (Playwright MCP)

#### 3.1 Playwright MCP로 실제 화면에서 Flow 수행

> Playwright MCP 도구를 사용하여 실제 브라우저에서 Flow를 수행합니다.

**수행 절차:**

1. 브라우저 실행 및 페이지 이동
2. 각 단계별 액션 수행
3. 예상 결과 확인

#### 3.2 결과에 따른 분기

| 결과    | 액션                                 |
| ------- | ------------------------------------ |
| ✅ 성공 | Phase 4로 진행 (E2E 테스트코드 작성) |
| ❌ 실패 | 실패 사유 문서화 후 사용자에게 보고  |

**실패 시 문서화 내용:**

- 실패한 단계
- 예상 결과 vs 실제 결과
- 스크린샷 (가능한 경우)
- 추정 원인

---

### Phase 4: E2E 테스트코드 작성

#### 4.1 테스트 코드 구현

- 깡통 TC에 실제 구현 추가
- Page Object Pattern 적용 권장
- 검증 로직 추가

#### 4.2 테스트 실행 및 안정성 확인

```bash
npx playwright test [테스트파일]
```

---

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/*.md (자동)

**테스트 리포트**는 `.claude/docs/e2e-test-report.md`에 작성하세요.

---

## 유의사항

### 1. 로그인이 필요한 페이지 처리

> **권장 방식**: `storageState` 활용 (로그인 세션 저장/재사용)

**Setup 파일 구성:**

```typescript
// e2e/auth.setup.ts
import { test as setup } from "@playwright/test";

setup("로그인 세션 저장", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', process.env.TEST_EMAIL);
  await page.fill('[name="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("/dashboard");

  // 세션 저장
  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
```

**테스트에서 세션 재사용:**

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "logged-in-tests",
      dependencies: ["setup"],
      use: { storageState: "e2e/.auth/user.json" },
    },
  ],
});
```

### 2. 데이터 오염 방지

> **권장 방식**: 고유 데이터 + 상대값 검증

#### 2.1 테스트용 고유 데이터 사용

```typescript
// 고유 식별자로 테스트 데이터 생성
const testId = `test_${Date.now()}`;
const testProduct = {
  name: `테스트상품_${testId}`,
  price: 10000,
};
```

#### 2.2 상대값 검증 (절대값 검증 금지)

```typescript
// ❌ Bad: 절대값 검증 (다른 테스트에 영향받음)
expect(await getCartItemCount()).toBe(3);

// ✅ Good: 상대값 검증 (독립적)
const beforeCount = await getCartItemCount();
await addItemToCart(testProduct);
expect(await getCartItemCount()).toBe(beforeCount + 1);
```

#### 2.3 테스트 후 정리 (권장)

```typescript
test.afterEach(async () => {
  // 테스트에서 생성한 데이터 정리
  await cleanupTestData(testId);
});
```

### 3. 테스트 실행 순서 의존성 방지

> **원칙**: 각 테스트는 독립적으로 실행 가능해야 함

#### 3.1 테스트 간 데이터 공유 금지

```typescript
// ❌ Bad: 테스트 간 데이터 공유
let sharedOrder; // 다른 테스트에서 사용

test("주문 생성", async () => {
  sharedOrder = await createOrder();
});

test("주문 취소", async () => {
  await cancelOrder(sharedOrder.id); // sharedOrder에 의존
});

// ✅ Good: 각 테스트가 독립적
test("주문 취소", async () => {
  // 자체적으로 주문 생성
  const order = await createOrder();
  await cancelOrder(order.id);
});
```

#### 3.2 순서 의존이 필요한 경우

> 부득이하게 순서가 필요한 경우 `test.describe.serial()` 사용

```typescript
test.describe.serial("주문 전체 플로우", () => {
  let orderId: string;

  test("1. 주문 생성", async () => {
    orderId = await createOrder();
  });

  test("2. 결제 진행", async () => {
    await processPayment(orderId);
  });

  test("3. 배송 확인", async () => {
    await verifyShipping(orderId);
  });
});
```

#### 3.3 테스트 격리 체크리스트

- [ ] 각 테스트가 자체 setup을 가지고 있는가?
- [ ] 다른 테스트 실행 여부와 관계없이 통과하는가?
- [ ] 테스트 순서를 바꿔도 결과가 동일한가?

---

## 결과물

- `e2e/tests/` - E2E 테스트 코드
- `e2e/.auth/` - 인증 세션 파일 (gitignore 권장)
- `.claude/docs/e2e-test-report.md` - 테스트 리포트

---

## 관련 도구

- **Playwright MCP**: 실제 브라우저 Flow 검증에 사용
- **storageState**: 로그인 세션 관리
