# API 설계 (Phase 2-3)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-memory.md` - 현재 작업 중인 기능 확인
> 2. `@03-2-ui-design.md` - UI 설계 결과 확인

## 목표 및 범위

**Phase 2-3 목표**: 선택한 기능의 API를 설계합니다.

**단계**:

- Step 3: API 설계

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md`에서 현재 작업 중인 기능 확인
2. Phase 2-2 (UI 설계) 완료 확인

**Phase 2-2가 완료되지 않았다면 진행 금지**

---

## Step 3: API 설계

### 목표

비즈니스 요구사항을 분석하여 이 기능에 필요한 API를 설계합니다.

### API 가이드 확인

**AI 작업**: `@00-memory.md`의 "주요 결정 사항 > 아키텍처" 섹션 확인

**API 가이드가 있는 경우**:

- 기존 가이드 (`docs/api-guidelines.md`) 참조
- 정의된 패턴 준수 (네이밍, 에러 포맷, 페이지네이션 등)

**API 가이드가 없는 경우** (첫 기능):

#### 🔔 첫 기능 API 설계 시 자동 작업

"API 가이드가 없습니다. 기본 API 패턴을 정의하고 `docs/api-guidelines.md`를 생성하겠습니다."

**자동 생성 작업**:

1. **기본 API 패턴 정의**:

   - 엔드포인트 네이밍: `/api/v1/{resource}`
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
   - 생성한 패턴으로 API 설계 진행

**이후 기능에서는**:

- 자동 생성된 `docs/api-guidelines.md` 참조
- 기존 패턴 재사용

---

### 3-1. 비즈니스 요구사항 분석

**질문**: 이 기능이 무엇을 해야 하는가?

### 📘 요구사항 분석 예시 (참고용)

상품 목록 조회 기능의 경우:

- 상품 목록 표시 (필터링, 정렬, 페이지네이션)
- 찜하기 기능
- 카테고리별 필터링

---

### 3-2. 필요한 데이터 파악

각 요구사항에 필요한 데이터를 파악합니다.

### 📘 데이터 분석 예시 (참고용)

상품 목록 조회 기능의 경우:

- 상품 목록 표시 → 상품 배열, 총 개수, 페이지 정보
- 카테고리 필터 → 카테고리 목록
- 찜하기 → 성공/실패 응답

---

### 3-3. API 엔드포인트 설계

**기존 API 가이드 참조** (있는 경우 `docs/api-guidelines.md` 또는 Memory 파일 확인)

### 📘 API 엔드포인트 설계 예시 (참고용)

상품 목록 조회 기능의 경우:

**GET /products** - 상품 목록 조회

Query Parameters:

- `category?: string`
- `minPrice?: number`
- `maxPrice?: number`
- `sort?: 'latest' | 'price_asc' | 'price_desc'`
- `page?: number`
- `limit?: number`

Response:

```typescript
interface GetProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}
```

**GET /categories** - 카테고리 목록

Response:

```typescript
interface GetCategoriesResponse {
  categories: Category[];
}
```

**POST /wishlist** - 찜하기

Body:

```typescript
interface AddToWishlistRequest {
  productId: string;
}
```

Response:

```typescript
interface AddToWishlistResponse {
  success: boolean;
}
```

---

### 3-4. 컴포넌트-API 매핑

어느 컴포넌트가 어느 API를 사용하는지 매핑합니다.

### 📘 컴포넌트-API 매핑 예시 (참고용)

상품 목록 조회 기능의 경우:

| 컴포넌트        | API             | 용도           |
| --------------- | --------------- | -------------- |
| ProductListPage | GET /products   | 상품 목록 조회 |
| ProductFilter   | GET /categories | 카테고리 목록  |
| ProductCard     | POST /wishlist  | 찜하기         |

---

### 3-5. 에러 처리 시나리오

각 API의 에러 케이스를 정의합니다.

### 📘 에러 처리 예시 (참고용)

상품 목록 조회 기능의 경우:

- GET /products 실패 → "상품을 불러올 수 없습니다" 표시
- POST /wishlist 실패 → "찜하기 실패" 토스트 표시
- 네트워크 에러 → 재시도 옵션 제공

---

### 3-6. API 설계 검수 및 승인

#### 🛑 사용자 검수 필수

"기능 [F001 - 상품 목록 조회]의 API 설계가 완료되었습니다."

**설계 결과**:

API 엔드포인트:

- GET /products (상품 목록)
- GET /categories (카테고리 목록)
- POST /wishlist (찜하기)

컴포넌트-API 매핑:

- ProductListPage → GET /products
- ProductFilter → GET /categories
- ProductCard → POST /wishlist

에러 처리:

- API 실패 시 적절한 사용자 피드백
- 재시도 로직 포함

파일 생성:

- `src/api/product/types.ts` (타입 정의)
- `src/api/product/endpoints.ts` (API 함수)

#### ✅ API 설계 검토

- [ ] 비즈니스 요구사항을 충족하는가?
- [ ] API 엔드포인트가 적절한가?
- [ ] 요청/응답 타입이 명확한가?
- [ ] 기존 API 가이드를 따르는가? (있는 경우)
- [ ] 에러 처리가 고려되었는가?
- [ ] 누락된 API가 없는가?

#### 📝 변경 요청 가능

- API 추가/제거
- 요청/응답 타입 수정
- 에러 처리 방식 변경
- 컴포넌트-API 매핑 조정

⚠️ **승인 전까지 테스트 작성 단계 진행 금지**

---

## Memory 업데이트

**Step 3 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 워크플로우: `03-4-implementation`
  - 현재 Step: Step 4 (테스트 작성)
  - 진행률: 60%

---

## 다음 단계

**Step 3 승인 후**:

→ `@03-4-implementation.md` (Phase 2-4 - 기능 구현)

**필요한 작업**:

- Step 4: 테스트 작성
- Step 5: 구현
- Step 6: 리팩토링
- Step 7: 기능 검수
- Step 8: 다음 기능으로
