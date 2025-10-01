# 기능 구현 (Phase 2-4)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-memory.md` - 현재 작업 중인 기능 확인
> 2. `@03-2-ui-design.md` - UI 설계 결과 확인
> 3. `@03-3-api-design.md` - API 설계 결과 확인

## 목표 및 범위

**Phase 2-4 목표**: 설계를 바탕으로 테스트를 작성하고, 기능을 구현합니다.

**단계**:

- Step 4: 테스트 작성 (Test-First)
- Step 5: 구현 (Green Phase)
- Step 6: 리팩토링 (Refactor Phase)
- Step 7: 기능 검수 및 승인
- Step 8: 다음 기능으로

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md`에서 현재 작업 중인 기능 확인
2. Phase 2-2 (UI 설계) 완료 확인
3. Phase 2-3 (API 설계) 완료 확인

**Phase 2-2, 2-3이 완료되지 않았다면 진행 금지**

---

## Step 4: 테스트 작성 (Test-First) - 예시 포함

### 4-1. 테스트 환경 확인 (최초 1회만)

테스트 도구 설정 여부 확인:

- 단위 테스트 도구 설정 완료?
- 컴포넌트 테스트 도구 설정 완료?
- 테스트 헬퍼 유틸리티 생성 완료?

**미완료 시 테스트 환경 설정 먼저 수행** (아래 부록 참조)

---

### 4-2. 테스트 작성 순서

#### 1) 비즈니스 로직 테스트 (예시)

```typescript
// __tests__/unit/product/filterProducts.test.ts

describe("filterProducts", () => {
  it("카테고리로 필터링", () => {
    const products = mockProducts();
    const filtered = filterProducts(products, { category: "electronics" });
    expect(filtered.every((p) => p.category === "electronics")).toBe(true);
  });

  it("가격 범위로 필터링", () => {
    const products = mockProducts();
    const filtered = filterProducts(products, {
      minPrice: 10000,
      maxPrice: 50000,
    });
    expect(filtered.every((p) => p.price >= 10000 && p.price <= 50000)).toBe(
      true
    );
  });
});
```

#### 2) API 서비스 테스트 (예시)

```typescript
// __tests__/unit/api/productApi.test.ts

describe("ProductAPI", () => {
  it("상품 목록 조회 성공", async () => {
    // MSW 모킹
    const result = await getProducts({ category: "electronics" });
    expect(result.products).toBeDefined();
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("API 에러 처리", async () => {
    // 에러 응답 모킹
    await expect(getProducts()).rejects.toThrow();
  });
});
```

#### 3) 컴포넌트 테스트 (예시)

```typescript
// __tests__/components/product/ProductCard.test.tsx

describe("ProductCard", () => {
  it("상품 정보 렌더링", () => {
    const product = mockProduct();
    render(<ProductCard product={product} onAddToCart={vi.fn()} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(formatPrice(product.price))).toBeInTheDocument();
  });

  it("장바구니 추가 버튼 클릭", async () => {
    const handleAddToCart = vi.fn();
    render(
      <ProductCard product={mockProduct()} onAddToCart={handleAddToCart} />
    );

    await userEvent.click(screen.getByRole("button", { name: /장바구니/ }));
    expect(handleAddToCart).toHaveBeenCalledWith(product.id);
  });
});
```

#### 4) 통합 테스트 (예시)

```typescript
// __tests__/integration/ProductList.test.tsx

describe("ProductList 통합", () => {
  it("상품 목록 조회 및 표시", async () => {
    render(<ProductListPage />);

    expect(screen.getByText("로딩중...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("product-card")).toHaveLength(10);
    });
  });

  it("필터 적용 시 목록 업데이트", async () => {
    render(<ProductListPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("product-card")).toHaveLength(10);
    });

    await userEvent.click(screen.getByText("전자제품"));

    await waitFor(() => {
      expect(screen.getAllByTestId("product-card").length).toBeLessThan(10);
    });
  });
});
```

**테스트 작성 완료 후**:

- [ ] 모든 테스트 실행
- [ ] 테스트 실패 확인 (Red Phase)
- [ ] 실패 이유가 "구현 안됨" 때문인지 확인

---

## Step 5: 구현 (Green Phase) - 예시 포함

### 구현 순서

**1) 비즈니스 로직 구현 (예시)**

```typescript
// src/features/product/utils/filterProducts.ts

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    return true;
  });
}
```

**2) API 서비스 구현 (예시)**

```typescript
// src/api/product/productApi.ts

export async function getProducts(params?: GetProductsParams) {
  const response = await axios.get<ProductsResponse>("/products", { params });
  return response.data;
}
```

**3) React Query 훅 구현 (예시)**

```typescript
// src/features/product/hooks/useProducts.ts

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
}
```

**4) 컴포넌트 로직 구현 (예시)**

```typescript
// src/features/product/components/ProductCard.tsx
// src/features/product/components/ProductFilter.tsx
// src/features/product/components/ProductList.tsx
```

**5) 페이지 로직 구현 (예시)**

```typescript
// src/pages/ProductListPage.tsx

export default function ProductListPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { data, isLoading } = useProducts(filters);
  const { mutate: addToCart } = useAddToCart();

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <ProductFilter filters={filters} onFilterChange={setFilters} />
      <ProductSort />
      <ProductList products={data?.products} onAddToCart={addToCart} />
      <Pagination currentPage={data?.page} totalPages={data?.totalPages} />
    </div>
  );
}
```

**구현 완료 후**:

- [ ] 모든 테스트 실행
- [ ] 테스트 통과 확인 (Green Phase)
- [ ] 타입 에러 없음 확인
- [ ] Linter 통과 확인

---

## Step 6: 리팩토링 (Refactor Phase)

### 리팩토링 체크리스트

- [ ] 중복 코드 제거
- [ ] 함수/컴포넌트 분리 (단일 책임)
- [ ] 변수명/함수명 개선
- [ ] 복잡한 로직에 주석 추가
- [ ] 불필요한 코드 제거
- [ ] 커스텀 훅으로 로직 추출 (필요시)

**리팩토링 범위**:

- ✅ 현재 기능 범위 내에서만
- ❌ 다른 기능 건드리지 않음
- ❌ 과도한 추상화 지양

**리팩토링 완료 후**:

- [ ] 테스트 재실행 → 여전히 통과
- [ ] 코드 가독성 향상 확인

---

## Step 7: 기능 검수 및 승인

### 🛑 사용자 검수

"기능 [F001 - 상품 목록 조회] 구현이 완료되었습니다."

**구현 결과**:

테스트:

- ✅ 작성: 23개
- ✅ 통과: 23/23
- ✅ 커버리지: 94%

구현 파일:

- 비즈니스 로직: `src/features/product/utils/` (2개)
- API 서비스: `src/api/product/` (1개)
- 컴포넌트: `src/pages/`, `src/features/product/components/` (5개)
- 공통 추가: `src/shared/components/Pagination.tsx`

테스트 파일:

- 단위: `__tests__/unit/product/` (2개), `__tests__/unit/api/` (1개)
- 컴포넌트: `__tests__/components/product/` (4개)
- 통합: `__tests__/integration/` (1개)

#### ✅ 검수 항목

- [ ] 기능이 요구사항대로 동작하는가?
- [ ] UI가 디자인대로 구현되었는가?
- [ ] 테스트가 충분한가?
- [ ] 코드 품질이 만족스러운가?
- [ ] 성능이 acceptable한가?
- [ ] 접근성이 고려되었는가?

**승인 여부**:

- [ ] 승인 (다음 기능으로)
- [ ] 수정 필요 (피드백 제공)

⚠️ **승인 전까지 다음 기능 진행 금지**

---

## Step 8: 다음 기능으로

**현재 기능 승인 후**:

1. Memory 업데이트 (완료 표시)
2. 다음 기능 선택 (의존성 고려)
3. `@03-1-preparation.md` Step 1부터 반복

**모든 기능 완료 시**:
→ Phase 3로 이동 (`@04-integration.md` 참조)

---

## Memory 업데이트

**Step 4 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 Step: Step 5 (구현)
  - 진행률: 70%
- 테스트 파일 경로 기록

**Step 5 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 Step: Step 6 (리팩토링)
  - 진행률: 85%
- 구현 파일 경로 기록

**Step 6 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 Step: Step 7 (기능 검수)
  - 진행률: 95%

**Step 7 완료 시**:

- 기능별 상태에 완료 표시
- 테스트 결과 기록
- 다음 기능 또는 Phase 3 준비 안내

**모든 기능 완료 시**:

- Phase 2 완료 표시
- Phase 3 준비 상태 표시

---

## 부록: 테스트 환경 설정 (최초 1회)

### 테스트 도구 선택

#### 🔔 사용자 입력 필요

**질문 1**: 단위 테스트 도구

- [ ] Vitest
- [ ] Jest
- [ ] 기타: `_________________`
- [ ] 없음 (새로 설정)

기존 설정 파일 경로: `_________________`

**질문 2**: 컴포넌트 테스트 라이브러리

- [ ] React Testing Library
- [ ] Enzyme
- [ ] 기타: `_________________`
- [ ] 없음 (새로 설정)

**질문 3**: E2E 테스트 도구

- [ ] Playwright
- [ ] Cypress
- [ ] 기타: `_________________`
- [ ] 없음 (새로 설정)

**질문 4**: 테스트 디렉토리 구조

- [ ] `__tests__/` 폴더 분리
- [ ] 소스 파일과 같은 위치 (`*.test.ts`)
- [ ] 기타: `_________________`

⚠️ **위 정보를 모두 받을 때까지 다음 단계 진행 금지**

### 테스트 환경 구축

**AI 작업**:

1. 선택한 도구 설치 (없는 경우)
2. 설정 파일 생성/확인
3. 테스트 헬퍼 유틸리티 생성
4. 샘플 테스트 작성 및 실행

**결과물**:

- `vitest.config.ts` / `jest.config.js`
- `playwright.config.ts` / `cypress.config.ts`
- `__tests__/setup.ts`
- `__tests__/utils/testHelpers.ts`

**검증**:

- [ ] 샘플 테스트 실행 성공

---

## 결과물 구조 예시

```
src/
├── pages/
│   └── ProductListPage.tsx
├── features/
│   └── product/
│       ├── components/
│       │   ├── ProductCard.tsx
│       │   ├── ProductFilter.tsx
│       │   ├── ProductList.tsx
│       │   └── ProductSort.tsx
│       ├── hooks/
│       │   └── useProducts.ts
│       └── utils/
│           ├── filterProducts.ts
│           └── sortProducts.ts
├── api/
│   └── product/
│       ├── types.ts
│       └── productApi.ts
└── shared/
    └── components/
        └── Pagination.tsx

__tests__/
├── unit/
│   ├── product/
│   └── api/
├── components/
│   └── product/
└── integration/
```
