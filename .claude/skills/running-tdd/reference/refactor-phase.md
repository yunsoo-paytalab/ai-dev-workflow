# 🔵 Refactor Phase - 코드 개선

## 목표

테스트를 유지하면서 코드 품질 개선

## 리팩토링 체크리스트

### 1. 중복 제거 (DRY)

```typescript
// Before - 중복
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

function calculateSubtotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// After - 추출
function sumItemPrices(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTotal(items) {
  return sumItemPrices(items);
}
```

### 2. 명확한 네이밍

```typescript
// Before
function calc(a, b) {
  return a + b * 0.1;
}

// After
function calculatePriceWithTax(price, taxRate) {
  return price + price * taxRate;
}
```

### 3. 단일 책임

```typescript
// Before - 여러 책임
function processOrder(order) {
  validateOrder(order);
  calculateTotal(order);
  saveToDatabase(order);
  sendEmail(order);
}

// After - 분리
function processOrder(order) {
  const validatedOrder = validateOrder(order);
  const totaledOrder = calculateTotal(validatedOrder);
  return totaledOrder;
}

function fulfillOrder(order) {
  saveToDatabase(order);
  sendEmail(order);
}
```

### 4. 매직 넘버 제거

```typescript
// Before
if (total > 50000) {
  discount = 0.1;
}

// After
const FREE_SHIPPING_THRESHOLD = 50000;
const BULK_DISCOUNT_RATE = 0.1;

if (total > FREE_SHIPPING_THRESHOLD) {
  discount = BULK_DISCOUNT_RATE;
}
```

## 리팩토링 규칙

### ⚠️ 테스트 수정 금지

```typescript
// ❌ 테스트를 수정하면 안 됨
it("아이템 추가", () => {
  // 이 테스트는 그대로 유지
});

// ✅ 구현만 개선
class ShoppingCart {
  // 내부 구현 개선
}
```

### 검증 명령

```bash
npm test          # 모든 테스트 통과 확인
npm run lint      # 코드 스타일 검사
npm run type-check # 타입 검사
```

## 리팩토링 패턴

| 패턴                 | 적용 상황                           |
| -------------------- | ----------------------------------- |
| Extract Method       | 긴 함수를 작은 함수로 분리          |
| Rename               | 의도를 명확히 하는 이름으로 변경    |
| Replace Magic Number | 상수로 추출                         |
| Extract Class        | 클래스가 너무 많은 책임을 가질 때   |
| Move Method          | 메서드가 다른 클래스에 더 적합할 때 |

## 진행 상황 추적

```markdown
## TDD Progress

### Round 1: 핵심 기능

- [x] 🔴 테스트: 아이템 추가
- [x] 🟢 구현: 최소 구현
- [x] 🔵 리팩토링: 타입 추가, 메서드명 개선

### Round 2: 수량 관리

- [x] 🔴 테스트: 중복 아이템 처리
- [x] 🟢 구현: 수량 로직
- [ ] 🔵 리팩토링: 진행 예정

커버리지: 87%
```

## Checklist

- [ ] 모든 테스트가 여전히 통과하는가?
- [ ] 중복 코드가 제거되었는가?
- [ ] 네이밍이 명확한가?
- [ ] 각 함수/클래스가 단일 책임인가?
- [ ] lint/type-check가 통과하는가?
