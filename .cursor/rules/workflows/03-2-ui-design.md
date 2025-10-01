# UI 설계 (Phase 2-2)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-memory.md` - 현재 작업 중인 기능 확인
> 2. `@03-1-preparation.md` - 기능 선택 완료 확인

## 목표 및 범위

**Phase 2-2 목표**: 선택한 기능의 UI를 설계합니다.

**단계**:

- Step 2: UI 설계 (해당 기능만)

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md`에서 현재 작업 중인 기능 확인
2. Phase 2-1 (기능 선택) 완료 확인

**Phase 2-1이 완료되지 않았다면 진행 금지**

---

## Step 2: UI 설계 (해당 기능만)

### 2-1. Figma URL 수집

#### 🔔 사용자 입력 필요

"현재 작업 중인 기능: [F001 - 상품 목록 조회]"

"이 기능의 Figma URL을 제공해주세요:"

**템플릿**:

페이지 전체:

- URL: `https://www.figma.com/design/<fileKey>?node-id=<id>`

주요 섹션 (있다면):

- 상품 목록 영역: `https://...`
- 필터 영역: `https://...`
- 정렬 영역: `https://...`

⚠️ **URL을 받을 때까지 다음 단계 진행 금지**

---

### 2-2. Figma 분석 및 컴포넌트 구조 설계

**Figma MCP 활용**:

1. 페이지 구조 분석
2. 시각적 영역 구분
3. 컴포넌트 계층 설계
4. 재사용 가능한 컴포넌트 식별
5. 인터랙션 분석
6. 반응형 고려사항

**컴포넌트 분해 예시**:

```
ProductListPage (페이지)
├─ ProductFilter (컴포넌트)
│  ├─ CategoryFilter
│  └─ PriceFilter
├─ ProductSort (컴포넌트)
├─ ProductList (컴포넌트)
│  └─ ProductCard (컴포넌트) [반복]
└─ Pagination (컴포넌트)
```

---

### 2-3. Props 인터페이스 정의

각 컴포넌트의 Props 정의:

```typescript
// ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite?: boolean;
}

// ProductFilter.tsx
interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  priceRange: [number, number];
  onCategoryChange: (category: string | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
}

// ProductList.tsx
interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
}
```

---

### 2-4. 스켈레톤 코드 생성

**생성할 파일**:

- `src/pages/ProductListPage.tsx`
- `src/features/product/components/ProductList.tsx`
- `src/features/product/components/ProductCard.tsx`
- `src/features/product/components/ProductFilter.tsx`
- `src/features/product/components/ProductSort.tsx`

**스켈레톤 코드 포함사항**:

- ✅ Props 인터페이스
- ✅ 기본 JSX 구조
- ✅ 이벤트 핸들러 시그니처
- ✅ 요구사항 명세서 기반 UI/UX 동작 로직
- ❌ 비즈니스 로직 (Phase 2-4 Step 5에서 구현)
- ❌ API 연동 (Phase 2-3에서 정의, Phase 2-4 Step 5에서 구현)

---

### 2-5. 공통 컴포넌트 필요 시

UI 설계 중 새로운 공통 컴포넌트 필요 발견 시:

#### 🔔 사용자 확인 요청

"UI 설계 중 새로운 공통 컴포넌트가 필요합니다:"

**컴포넌트 정보**:

- 이름: Pagination
- 용도: 페이지 네비게이션
- 재사용 가능성: 높음 (다른 목록 페이지에서도 사용)

Props 초안:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

"이 컴포넌트를 공통 컴포넌트로 추가할까요?"

- [ ] 승인 (공통 컴포넌트로 추가)
- [ ] 거부 (기능별 컴포넌트로 유지)
- [ ] 보류 (나중에 결정)

**승인 시**:

1. `src/shared/components/Pagination.tsx` 생성
2. 현재 기능에서 즉시 사용
3. 다음 기능에서도 재사용 가능

---

### 2-6. UI 설계 검수 및 승인

#### 🛑 사용자 검수 필수

"기능 [F001 - 상품 목록 조회]의 UI 설계가 완료되었습니다."

**설계 결과**:

컴포넌트 구조:

- ProductListPage
- ProductFilter
- ProductSort
- ProductList
- ProductCard
- Pagination (공통 컴포넌트로 추가)

파일 생성:

- `src/pages/ProductListPage.tsx`
- `src/features/product/components/` (4개 파일)
- `src/shared/components/Pagination.tsx`

#### ✅ UI 설계 검토

- [ ] 컴포넌트 분리가 적절한가?
- [ ] Props 정의가 명확한가?
- [ ] 공통 컴포넌트 추가가 적절한가?
- [ ] 누락된 부분이 있는가?

#### 📝 변경 요청 가능

- 컴포넌트 추가/제거/병합
- Props 수정
- 공통 컴포넌트 결정 변경

⚠️ **승인 전까지 API 설계 단계 진행 금지**

---

## Memory 업데이트

**Step 2 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
  - 현재 워크플로우: `03-3-api-design`
  - 현재 Step: Step 3 (API 설계)
  - 진행률: 40%
- UI 설계 파일 경로 기록

---

## 다음 단계

**Step 2 승인 후**:

→ `@03-3-api-design.md` (Phase 2-3 - API 설계)

**필요한 작업**:

- Step 3: API 설계
