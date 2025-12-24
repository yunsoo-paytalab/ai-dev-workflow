# 🟢 Green Phase - 최소 구현

## 목표

테스트를 통과하는 **최소한의 코드**만 작성

## 최소 구현 원칙

### 1. 테스트 통과만을 목표

```typescript
// ✅ Good - 최소 구현
class ShoppingCart {
  items = [];

  addItem(item) {
    this.items.push(item);
  }
}
```

### 2. 하드코딩 허용

```typescript
// ✅ OK (초기 구현)
function getDiscount(total) {
  return 0.1; // 나중에 로직 추가
}
```

### 3. 과도한 설계 금지

```typescript
// ❌ Bad - 과도한 구현
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discounts = new Map(); // 아직 불필요
    this.validationRules = []; // 아직 불필요
    this.eventEmitter = new EventEmitter(); // 아직 불필요
  }
}
```

## 구현 예시

### Before (테스트만 존재)

```typescript
// cart.test.ts
it("addItem 호출 시 아이템이 추가되어야 한다", () => {
  const cart = new ShoppingCart();
  cart.addItem({ id: "1", name: "상품", price: 100 });
  expect(cart.items.length).toBe(1);
});
```

### After (최소 구현)

```typescript
// cart.ts
class ShoppingCart {
  items: Item[] = [];

  addItem(item: Item) {
    this.items.push(item);
  }
}
```

## 구현 순서

1. **컴파일 에러 해결**

   - 타입/클래스 정의
   - 함수 시그니처 작성

2. **런타임 에러 해결**

   - 기본 로직 구현
   - 필요한 초기화

3. **Assertion 통과**
   - 반환값 조정
   - 상태 업데이트

## 테스트 실행

```bash
npm test -- [테스트파일]
```

### ✅ 성공

```
PASS  src/__tests__/cart.test.ts
  ✓ 장바구니 › addItem 호출 시 아이템이 추가되어야 한다 (3ms)
```

## Checklist

- [ ] 테스트가 통과하는가?
- [ ] 불필요한 코드가 없는가?
- [ ] 과도한 설계를 하지 않았는가?
- [ ] 다음 테스트로 넘어갈 준비가 되었는가?
