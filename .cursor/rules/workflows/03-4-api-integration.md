# API 연동 (Phase 2-4)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-memory.md` - 현재 작업 중인 기능 확인
> 2. `@03-2-ui-design.md` - UI 설계 결과 확인
> 3. `@03-3-implementation.md` - 구현 결과 확인

## 목표 및 범위

**Phase 2-4 목표**: 더미 데이터를 실제 API로 연동합니다. (선택적 - API가 준비된 기능만)

**단계**:

- Step 8: API 연동 (선택적)

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md`에서 현재 작업 중인 기능 확인
2. Phase 2-3 (구현) 완료 확인
3. **API 준비 상태 확인** (실제 API가 준비되었는지)

**Phase 2-3이 완료되지 않았다면 진행 금지**

**API가 준비되지 않았다면 이 단계를 건너뛰고 다음 기능으로 진행**

---

## API 준비 상태 확인

### 🔔 API 준비 상태 확인

"현재 기능 **[기능명]**의 API 연동을 진행하려고 합니다."

**API 준비 상태를 확인해주세요:**

- [ ] **실제 API 준비됨** (연동 진행)
- [ ] **API 아직 준비 안됨** (더미 데이터 유지, 다음 기능으로)
- [ ] **부분적으로 준비됨** (준비된 API만 연동)

**API 준비 상태가 "아직 준비 안됨"인 경우**:

- 이 단계를 건너뛰고 다음 기능으로 진행
- 더미 데이터를 계속 사용
- Phase 3 시작 전에 다시 확인

---

## Step 8: API 연동 (선택적)

### 목표

더미 데이터를 실제 API로 교체하여 실제 백엔드와 연동합니다.

### API 가이드 확인

**AI 작업**: `@00-memory.md`의 "주요 결정 사항 > 아키텍처" 섹션 확인

**API 가이드가 있는 경우**:

- 기존 가이드 (`docs/api-guidelines.md`) 참조
- 정의된 패턴 준수 (네이밍, 에러 포맷, 페이지네이션 등)

**API 가이드가 없는 경우** (첫 API 연동):

#### 🔔 첫 API 연동 시 자동 작업

"API 가이드가 없습니다. 기본 API 패턴을 정의하고 `docs/api-guidelines.md`를 생성하겠습니다."

**자동 생성 작업**:

1. **기본 API 패턴 정의**:

   - 엔드포인트 네이밍: `/api/{resource}`
   - HTTP 메서드 규칙: GET (조회), POST (생성), PUT (수정), DELETE (삭제)
   - 에러 응답 포맷:
     ```typescript
     interface ErrorResponse {
       code: string;
       message: string;
       details?: Record<string, string>;
     }
     ```
   - 페이지네이션 패턴:
     ```typescript
     interface PaginationParams {
       page: number;
       limit: number;
     }
     interface PaginationResponse<T> {
       data: T[];
       page: number;
       limit: number;
       total: number;
       totalPages: number;
     }
     ```
   - 공통 헤더: `Authorization: Bearer {token}`, `Content-Type: application/json`

2. **`docs/api-guidelines.md` 생성**:

   - 위 패턴 문서화
   - 예시 코드 포함
   - 타입 정의 포함

3. **Memory 파일 업데이트**:

   - "주요 결정 사항 > 아키텍처" 섹션에 경로 기록
   - "API 가이드: `docs/api-guidelines.md` (자동 생성)"

4. **현재 기능에서 즉시 적용**:
   - 생성한 패턴으로 API 연동 진행

**이후 기능에서는**:

- 자동 생성된 `docs/api-guidelines.md` 참조
- 기존 패턴 재사용

---

### 8-1. 실제 API 엔드포인트 확인

**AI 작업**: 실제 API 문서 또는 백엔드 개발자와 협의하여 API 엔드포인트 확인

**확인 사항**:

- 실제 API 엔드포인트 URL
- 요청/응답 스키마
- 인증 방식
- 에러 응답 포맷

### 📘 실제 API 확인 예시 (참고용)

상품 목록 조회 기능의 경우:

**실제 API 엔드포인트**:

- `GET https://api.example.com/products`
- `GET https://api.example.com/categories`
- `POST https://api.example.com/wishlist`

**인증**: `Authorization: Bearer {token}`

**응답 포맷**: 기존 Mock API와 동일한 구조

---

### 8-2. API 클라이언트 수정

**작업 내용**: 더미 데이터를 실제 API로 교체

**수정 대상**:

1. **API 엔드포인트 URL 변경**:

   ```typescript
   // 기존 (더미 데이터)
   const API_BASE_URL = "/api";

   // 변경 (실제)
   const API_BASE_URL = "https://api.example.com";
   ```

2. **인증 헤더 추가**:

   ```typescript
   const headers = {
     Authorization: `Bearer ${token}`,
     "Content-Type": "application/json",
   };
   ```

3. **에러 처리 개선**:

   - 실제 API 에러 응답 처리
   - HTTP 상태 코드별 처리
   - 네트워크 에러 처리

4. **더미 데이터 반환 설정**:

   ```typescript
   // 개발/테스트 환경에서 더미 데이터 반환
   const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === "true";

   if (USE_DUMMY_DATA) {
     // 더미 데이터 반환 (실제 API 호출 없이)
     return getDummyData(params);
   }
   ```

5. **API 응답 캐싱**:

   ```typescript
   // API 응답 캐싱으로 성능 최적화
   const cache = new Map();
   const CACHE_TTL = 5 * 60 * 1000; // 5분

   const getCachedData = (key: string) => {
     const cached = cache.get(key);
     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
       return cached.data;
     }
     return null;
   };
   ```

### 📘 API 클라이언트 수정 예시 (참고용)

```typescript
// src/api/product/productApi.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === "true";

// 더미 데이터 생성 함수
const getDummyProducts = (params: ProductParams) => {
  const dummyProducts = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `더미 상품 ${i + 1}`,
    price: Math.floor(Math.random() * 100000) + 1000,
    category: ["electronics", "clothing", "books"][i % 3],
    image: `/images/dummy-product-${i + 1}.jpg`,
    description: `더미 상품 ${i + 1} 설명`,
    inStock: Math.random() > 0.1,
  }));

  const { page = 1, limit = 10, category } = params;
  let filteredProducts = dummyProducts;

  if (category) {
    filteredProducts = dummyProducts.filter((p) => p.category === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return Promise.resolve({
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
  });
};

export const getProducts = async (params: ProductParams) => {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    return getDummyProducts(params);
  }

  // 실제 API 호출
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE_URL}/products?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const getCategories = async () => {
  if (USE_DUMMY_DATA) {
    return Promise.resolve({
      categories: [
        { id: "1", name: "전자제품", slug: "electronics" },
        { id: "2", name: "의류", slug: "clothing" },
        { id: "3", name: "도서", slug: "books" },
      ],
    });
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const addToWishlist = async (productId: string) => {
  if (USE_DUMMY_DATA) {
    // 더미 응답 (항상 성공)
    return Promise.resolve({
      success: true,
      message: "더미 찜하기 성공",
    });
  }

  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};
```

---

### 8-3. 더미 데이터 비활성화

**작업 내용**: 실제 API 연동 시 더미 데이터 비활성화

**수정 사항**:

1. **환경 변수 설정**:

   ```typescript
   // .env
   VITE_USE_DUMMY_DATA=false
   VITE_API_BASE_URL=https://api.example.com
   ```

   **환경별 설정**:

   ```typescript
   // .env.development (개발 환경)
   VITE_USE_DUMMY_DATA=true
   VITE_API_BASE_URL=/api

   // .env.staging (스테이징 환경)
   VITE_USE_DUMMY_DATA=false
   VITE_API_BASE_URL=https://staging-api.example.com
   // .env.production (프로덕션 환경)
   VITE_USE_DUMMY_DATA=false
   VITE_API_BASE_URL=https://api.example.com
   ```

2. **API 클라이언트 설정**:

   ```typescript
   // src/api/config.ts
   export const API_CONFIG = {
     baseURL: import.meta.env.VITE_API_BASE_URL,
     useDummyData: import.meta.env.VITE_USE_DUMMY_DATA === "true",
   };
   ```

3. **더미 데이터 함수 주석 처리** (선택사항):

   ```typescript
   // src/api/product/productApi.ts
   // 더미 데이터 사용 부분을 주석 처리하거나 제거
   // if (USE_DUMMY_DATA) {
   //   return getDummyProducts(params);
   // }
   ```

---

### 8-4. 테스트 업데이트

**작업 내용**: 실제 API 연동에 맞게 테스트 수정

**수정 사항**:

1. **API 테스트 수정**:

   - 더미 데이터 대신 실제 API 호출 테스트
   - 네트워크 에러 시나리오 추가
   - 인증 실패 시나리오 추가

2. **통합 테스트 수정**:
   - 실제 API 응답에 맞게 테스트 데이터 조정
   - 에러 응답 테스트 추가

### 📘 테스트 업데이트 예시 (참고용)

```typescript
// __tests__/api/product.test.ts

// 기존 더미 데이터 테스트
test("상품 목록 조회 성공 (더미 데이터)", async () => {
  // 더미 데이터 사용
  process.env.VITE_USE_DUMMY_DATA = "true";
  const products = await getProducts({ page: 1 });
  expect(products.products).toHaveLength(10);
});

// 실제 API 테스트로 변경
test("상품 목록 조회 성공 (실제 API)", async () => {
  // 더미 데이터 비활성화
  process.env.VITE_USE_DUMMY_DATA = "false";
  // 실제 API 호출
  const products = await getProducts({ page: 1 });
  expect(products.data).toBeDefined();
  expect(products.totalCount).toBeGreaterThan(0);
});

test("인증 실패 시 에러 처리", async () => {
  // 토큰 없이 API 호출
  await expect(getProducts({ page: 1 })).rejects.toThrow("API Error: 401");
});
```

---

### 8-5. API 연동 검수 및 승인

#### 🛑 사용자 검수 필수

"기능 **[현재 기능명]**의 API 연동이 완료되었습니다."

**연동 결과**:

API 연동:

- ✅ 실제 API 엔드포인트 연동 완료
- ✅ 인증 처리 구현
- ✅ 에러 처리 개선
- ✅ 더미 데이터 비활성화
- ✅ 실제 API 연동 완료

테스트:

- ✅ API 테스트 업데이트 완료
- ✅ 통합 테스트 수정 완료
- ✅ 모든 테스트 통과

파일 수정:

- `src/api/{domain}/` (API 클라이언트 수정)
- `src/mocks/` (더미 데이터 제거)
- `__tests__/api/` (테스트 업데이트)

#### ✅ API 연동 검토

- [ ] 실제 API와 정상 연동되는가?
- [ ] 인증이 올바르게 처리되는가?
- [ ] 에러 처리가 적절한가?
- [ ] 더미 데이터가 올바르게 비활성화되었는가?
- [ ] 테스트가 실제 API에 맞게 수정되었는가?

#### 📝 변경 요청 가능

- API 엔드포인트 수정
- 인증 방식 변경
- 에러 처리 개선
- 테스트 케이스 추가

⚠️ **승인 전까지 다음 기능 진행 금지**

---

## Memory 업데이트

**Step 8 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 워크플로우: 다음 기능 또는 Phase 3 준비
  - API 연동 완료 표시
  - 진행률: 100%

**API 연동 건너뛴 경우**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - API 연동 건너뛰기 사유 기록
  - Mock API 유지 상태 기록

---

## 다음 단계

**Step 8 승인 후**:

→ 다음 기능으로 진행 또는 Phase 3 준비

**API 연동을 건너뛴 경우**:

→ 다음 기능으로 진행 (Mock API 유지)

**모든 기능 완료 시**:

→ `@04-integration.md` (Phase 3 - 통합 및 검증)

**Phase 3 시작 전 API 연동 여부 재확인**:

→ Phase 3 시작 전에 아직 연동되지 않은 API들에 대해 연동 여부 재확인

---

## 더미 데이터 활용 가이드

### 더미 데이터 사용 시나리오

**개발 단계**:

- API가 아직 준비되지 않은 경우
- 프론트엔드 개발을 먼저 진행해야 하는 경우
- UI/UX 테스트를 위한 데이터가 필요한 경우

**테스트 단계**:

- E2E 테스트에서 일관된 데이터가 필요한 경우
- 성능 테스트를 위한 대량 데이터가 필요한 경우
- 다양한 시나리오 테스트가 필요한 경우

### 더미 데이터 설정 방법

1. **환경 변수 설정**:

   ```typescript
   // .env.development
   VITE_USE_DUMMY_DATA = true;
   VITE_DUMMY_DATA_SIZE = 100; // 더미 데이터 개수
   VITE_DUMMY_DATA_DELAY = 300; // 응답 지연 시간 (ms)
   ```

2. **더미 데이터 생성**:

   ```typescript
   // src/mocks/data/product.ts
   export const dummyProducts = Array.from({ length: 20 }, (_, i) => ({
     id: (i + 1).toString(),
     name: `더미 상품 ${i + 1}`,
     price: Math.floor(Math.random() * 100000) + 1000,
     category: ["electronics", "clothing", "books", "home", "sports"][i % 5],
     brand: ["Brand A", "Brand B", "Brand C", "Brand D"][i % 4],
     image: `/images/dummy-product-${i + 1}.jpg`,
     description: `더미 상품 ${i + 1}의 상세 설명입니다.`,
     inStock: Math.random() > 0.1,
     rating: Math.floor(Math.random() * 5) + 1,
     reviewCount: Math.floor(Math.random() * 100),
     createdAt: new Date(
       Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
     ).toISOString(),
   }));

   export const dummyCategories = [
     { id: "1", name: "전자제품", slug: "electronics" },
     { id: "2", name: "의류", slug: "clothing" },
     { id: "3", name: "도서", slug: "books" },
     { id: "4", name: "홈", slug: "home" },
     { id: "5", name: "스포츠", slug: "sports" },
   ];
   ```

3. **더미 데이터 함수**:

   ```typescript
   // src/mocks/data/product.ts (같은 파일에 추가)
   export const getDummyProducts = (params: any) => {
     const {
       category,
       page = 1,
       limit = 10,
       sort,
       minPrice,
       maxPrice,
       brand,
       inStock,
     } = params;

     let filtered = [...dummyProducts];

     // 필터링
     if (category) {
       filtered = filtered.filter((p) => p.category === category);
     }
     if (minPrice !== undefined) {
       filtered = filtered.filter((p) => p.price >= minPrice);
     }
     if (maxPrice !== undefined) {
       filtered = filtered.filter((p) => p.price <= maxPrice);
     }
     if (brand) {
       filtered = filtered.filter((p) => p.brand === brand);
     }
     if (inStock) {
       filtered = filtered.filter((p) => p.inStock);
     }

     // 정렬
     switch (sort) {
       case "price_asc":
         filtered.sort((a, b) => a.price - b.price);
         break;
       case "price_desc":
         filtered.sort((a, b) => b.price - a.price);
         break;
       case "name_asc":
         filtered.sort((a, b) => a.name.localeCompare(b.name));
         break;
       case "name_desc":
         filtered.sort((a, b) => b.name.localeCompare(a.name));
         break;
       case "rating_desc":
         filtered.sort((a, b) => b.rating - a.rating);
         break;
       case "newest":
         filtered.sort(
           (a, b) =>
             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         );
         break;
     }

     // 페이지네이션
     const startIndex = (page - 1) * limit;
     const endIndex = startIndex + limit;
     const paginatedProducts = filtered.slice(startIndex, endIndex);

     return Promise.resolve({
       products: paginatedProducts,
       totalCount: filtered.length,
       page,
       totalPages: Math.ceil(filtered.length / limit),
     });
   };

   export const getDummyCategories = () => {
     return Promise.resolve({
       categories: dummyCategories,
     });
   };

   export const addToDummyWishlist = (productId: string) => {
     return Promise.resolve({
       success: true,
       message: "더미 찜하기 성공",
     });
   };
   ```

### 더미 데이터 성능 최적화

1. **지연 시뮬레이션**:

   ```typescript
   // src/mocks/data/product.ts (같은 파일에 추가)
   export const simulateApiDelay = (min: number = 100, max: number = 500) => {
     const delay = Math.floor(Math.random() * (max - min + 1)) + min;
     return new Promise((resolve) => setTimeout(resolve, delay));
   };
   ```

2. **에러 시뮬레이션**:

   ```typescript
   // src/mocks/data/product.ts (같은 파일에 추가)
   export const simulateApiError = (errorRate: number = 0.1) => {
     if (Math.random() < errorRate) {
       const errors = [
         { status: 500, message: "서버 오류가 발생했습니다" },
         { status: 404, message: "요청한 리소스를 찾을 수 없습니다" },
         { status: 403, message: "접근 권한이 없습니다" },
         { status: 401, message: "인증이 필요합니다" },
       ];
       const error = errors[Math.floor(Math.random() * errors.length)];
       throw new Error(`${error.status}: ${error.message}`);
     }
   };
   ```

3. **캐싱 전략**:

   ```typescript
   // src/mocks/data/product.ts (같은 파일에 추가)
   const cache = new Map();
   const CACHE_TTL = 5 * 60 * 1000; // 5분

   export const getCachedDummyData = (key: string, generator: () => any) => {
     const cached = cache.get(key);
     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
       return Promise.resolve(cached.data);
     }

     const data = generator();
     cache.set(key, {
       data,
       timestamp: Date.now(),
     });

     return Promise.resolve(data);
   };
   ```

---

## API 연동 건너뛰기 시 주의사항

**더미 데이터 유지 시**:

- 더미 데이터 계속 사용
- 실제 API 준비 시 나중에 연동 가능
- Phase 3 시작 전에 연동 여부 재확인

**Phase 3 시작 전 재확인**:

- 아직 연동되지 않은 API 목록 확인
- 각 API별 연동 여부 재확인
- 연동 가능한 API만 선별적으로 연동
