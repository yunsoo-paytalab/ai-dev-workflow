---
name: running-tdd
description: TDD의 Red-Green-Refactor 사이클을 관리하는 전략 가이드입니다. 구현 작업 시 이 스킬의 가이드라인을 따라 테스트를 먼저 작성하세요.
model: sonnet
version: 3.2.1
---

# Running TDD

Test-Driven Development 사이클을 관리하는 전략 가이드입니다.

## Core Principle

**"테스트 먼저, 최소 구현, 지속적 개선"**

```
🔴 Red (실패 테스트) → 🟢 Green (최소 구현) → 🔵 Refactor (개선) → 반복
```

## 🔴 Red Phase - 실패하는 테스트 작성

**목표:** 구현 전에 실패하는 테스트를 먼저 작성하여 요구사항을 명확히 정의

**AAA 패턴:**

```typescript
it("addItem 호출 시 아이템이 추가되어야 한다", () => {
  // Arrange: 테스트 환경 설정
  const cart = new ShoppingCart();
  const item = { id: "1", price: 100 };

  // Act: 테스트 대상 실행
  cart.addItem(item);

  // Assert: 결과 확인
  expect(cart.items).toContainEqual(item);
});
```

**한글 네이밍:** describe/it 블록은 한글로 작성하여 의도를 명확히 표현

**실패 확인:** `npm test -- [파일] --watch`로 테스트가 예상대로 실패하는지 확인

## 🟢 Green Phase - 최소 구현

**목표:** 테스트를 통과하는 **최소한의 코드**만 작성

**원칙:**
- 테스트 통과만을 목표로 구현
- 하드코딩 허용 (초기 구현 시)
- 과도한 설계 금지 (아직 필요하지 않은 기능 추가 X)

```typescript
// ✅ 최소 구현
class ShoppingCart {
  items = [];
  addItem(item) { this.items.push(item); }
}

// ❌ 과도한 구현
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discounts = new Map(); // 아직 불필요
  }
}
```

## 🔵 Refactor Phase - 코드 개선

**목표:** 테스트를 유지하면서 코드 품질 개선

**개선 항목:**

1. **중복 제거 (DRY):** 반복되는 로직을 함수로 추출
2. **명확한 네이밍:** `calc` → `calculatePriceWithTax`
3. **단일 책임 (SRP):** 하나의 함수는 하나의 일만
4. **매직 넘버 제거:** `0.1` → `TAX_RATE`

## Test Priority

**Priority 1:** 핵심 도메인 로직, 주요 계산 및 변환
**Priority 2:** 사용자 상호작용, 이벤트 핸들링
**Priority 3:** 엣지 케이스, 에러 처리
**Priority 4:** 성능 최적화, 캐싱

## Test Commands

```bash
npm test -- --watch            # Watch 모드로 TDD 시작
npm test -- [file]             # 특정 파일 테스트
npm test -- --coverage         # 커버리지 확인
npm test -- --detectOpenHandles # 열린 핸들 탐지
npm test -- --runInBand        # 순차 실행
```

## Lint Error Handling

> ⚠️ **최대 3회까지만 재시도**

- 3회 시도 후에도 해결되지 않으면 중단
- 해결되지 않은 lint 에러는 사용자에게 보고
- 무한 루프 방지: lint 수정 → 확인 → 실패 시 카운트 증가

## Completion Checklist

### 사이클별 체크

- [ ] **Red**: 테스트 작성 및 실패 확인
- [ ] **Green**: 최소 구현으로 테스트 통과
- [ ] **Refactor**: 코드 개선 (테스트는 여전히 통과)

### 기능 완료 조건

- [ ] 모든 시나리오 테스트 작성
- [ ] 코드 커버리지 80% 이상
- [ ] 리팩토링 완료
