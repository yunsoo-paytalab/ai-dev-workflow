# UI 설계 (Phase 2-2)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-memory.md` - 현재 작업 중인 기능 확인
> 2. `@03-1-preparation.md` - 기능 선택 완료 확인

## 목표 및 범위

**Phase 2-2 목표**: 선택한 기능의 UI를 설계합니다.

**핵심 전략**: AI Vision으로 전체 구조 파악 → 컴포넌트별 세부 개발

**단계**:

- Step 2-1: AI Vision 페이지 분석
- Step 2-2: 개발 컴포넌트 목록 확정
- Step 2-3: 컴포넌트별 순차 개발 (반복)
- Step 2-4: 공통 컴포넌트 추가 (필요 시)
- Step 2-5: 전체 UI 설계 검수 및 승인

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md`에서 현재 작업 중인 기능 확인
2. Phase 2-1 (기능 선택) 완료 확인

**Phase 2-1이 완료되지 않았다면 진행 금지**

---

## Step 2-1: AI Vision 페이지 분석

### 1-1. 페이지 스크린샷 요청

#### 🔔 사용자 입력 필요

"현재 작업 중인 기능: **[F001 - 상품 목록 조회]**"

"이 기능의 **페이지 스크린샷**을 제공해주세요:"

**요청 사항**:

- 📱 모바일 또는 🖥️ 데스크톱 전체 페이지 스크린샷
- 실제 기기/브라우저 촬영 또는 Figma 캡처

⚠️ **스크린샷을 받을 때까지 다음 단계 진행 금지**

---

### 1-2. AI Vision으로 전체 구조 분석

**분석 항목**:

1. 전체 레이아웃 구조 (Header/Main/Footer, 고정/스크롤 영역)
2. 컴포넌트 계층 구조 (페이지→섹션→컴포넌트 분해)
3. UI 요소 상세 (버튼, 입력, 카드, 리스트 등)
4. 레이아웃 패턴 (Grid/Flex, 반응형)

**분석 결과 템플릿**:

```
📐 전체 레이아웃 구조
┌─────────────────┐
│ Header (고정)    │
├─────────────────┤
│ Filter          │
├─────────────────┤
│ List (스크롤)    │
├─────────────────┤
│ Pagination      │
└─────────────────┘

🏗️ 컴포넌트 계층 구조
ProductListPage
├─ PageHeader
├─ ProductFilter
│  ├─ CategoryFilter
│  └─ PriceRangeFilter
├─ ProductList
│  └─ ProductCard ×N
└─ Pagination

🎯 주요 인터랙션
- 검색, 필터, 정렬, 장바구니 추가

📱 레이아웃 패턴
- 모바일: 1열, 데스크톱: Grid 2-4열
```

---

## Step 2-2: 개발 컴포넌트 목록 확정

### 2-1. 컴포넌트 목록 제안

"Step 2-1 분석 결과를 바탕으로 **개발이 필요한 컴포넌트 목록**을 제안합니다:"

**제안 목록**:

- [ ] ProductListPage (페이지)
- [ ] PageHeader
- [ ] ProductFilter
- [ ] ProductList
- [ ] ProductCard
- [ ] Pagination

**총 N개 컴포넌트**

---

### 2-2. 사용자 컨펌

#### 🔔 사용자 입력 필요

"위 컴포넌트 목록을 확인해주세요:"

**가능한 액션**:

- ✅ 승인 (그대로 진행)
- ➕ 추가 (누락 컴포넌트)
- ➖ 제거 (불필요 컴포넌트)
- 🔀 병합 (컴포넌트 합치기)
- 📝 수정 (이름 변경)

⚠️ **승인받을 때까지 다음 단계 절대 진행 금지**

---

## Step 2-3: 컴포넌트별 순차 개발

> 💡 **중요**: 한 번에 **1개 컴포넌트씩** 순차 처리
>
> 이유: Figma Dev Mode 정확도 향상, 할루시네이션 방지

### 개발 순서

**권장**: 작은 컴포넌트 → 큰 컴포넌트 → 페이지

예시: ProductCard → CategoryFilter → ProductFilter → PageHeader → ProductListPage

---

### 3-1. Props 인터페이스 정의

**현재 컴포넌트**: `ProductCard`

```typescript
// src/features/product/components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}
```

**정의 기준**: Step 2-1 분석 + 요구사항 명세서 + 인터랙션

---

### 3-2. 스켈레톤 코드 생성

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  // ⚠️ return은 빈 Fragment
  return <></>;
}
```

**포함**: Props + 이벤트 핸들러 + 빈 JSX  
**미포함**: JSX 구조, 스타일 (다음 단계)

**파일 자동 생성**

---

### 3-3. Figma 상세 정보 수집

#### 🔔 사용자 입력 필요 (2가지 방법 중 선택)

"**ProductCard** 컴포넌트의 상세 디자인 정보를 제공해주세요:"

**방법 A: Figma Dev Mode URL**

```
URL: https://www.figma.com/design/<fileKey>?node-id=<id>
⚠️ ProductCard 컴포넌트 1개만 선택
```

**방법 B: Figma Plugin 코드 붙여넣기** ⭐ 권장

```
Figma에서 "HTML to Code" 또는 "Anima" 플러그인으로
ProductCard JSX 생성 후 붙여넣기

완료 후 "완료" 입력
```

⚠️ **정보를 받을 때까지 다음 단계 절대 진행 금지**

---

### 3-4. 컴포넌트 완성

"Figma 정보와 **프로젝트 디자인 시스템**을 바탕으로 컴포넌트를 완성합니다:"

> 📌 **디자인 시스템 정보**: `@00-memory.md`의 "디자인 시스템" 섹션 참조
>
> - 디자인 토큰 경로
> - 스타일링 방식 (Tailwind, CSS Modules 등)
> - 기본 스타일 파일

**작업 체크리스트**:

**JSX 구조**:

- [ ] Figma 레이아웃 반영
- [ ] 시맨틱 HTML 사용 (article, section 등)
- [ ] 프로젝트 디자인 시스템 적용

**스타일**:

- [ ] Figma 색상/간격/폰트 추출 적용
- [ ] Tailwind/CSS Modules/Styled Components
- [ ] 반응형 스타일

**UI/UX 동작**:

- [ ] 로딩/에러/빈 상태 처리
- [ ] 호버/포커스 효과
- [ ] 접근성 (aria-label, alt 등)

**구조 예시**:

```typescript
export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  return (
    <article className="product-card">
      {/* 이미지 영역 */}
      <div className="image-wrapper">
        <img src={product.imageUrl} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
      </div>

      {/* 정보 영역 */}
      <div className="info">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>
      </div>

      {/* 버튼 영역 */}
      <div className="actions">
        <button onClick={handleAddToCart}>장바구니</button>
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(product.id)}>❤️</button>
        )}
      </div>
    </article>
  );
}
```

**포함되지 않는 것**:

- ❌ 비즈니스 로직 (Phase 2-4)
- ❌ API 호출 (Phase 2-3, 2-4)
- ❌ 전역 상태 관리 (Phase 2-4)

---

### 3-5. 컴포넌트 검수 (선택적)

**복잡한 컴포넌트의 경우**:

- [ ] UI가 Figma와 유사한가?
- [ ] Props가 올바른가?
- [ ] 이벤트 핸들러가 정상인가?

**피드백**: 수정 필요 시 즉시 반영, 없으면 다음 컴포넌트로

---

### 3-6. 다음 컴포넌트 반복

"다음 컴포넌트: **CategoryFilter**"

→ Step 3-1로 돌아가서 반복

**모든 컴포넌트 완료 시**: Step 2-4로 이동

---

## Step 2-4: 공통 컴포넌트 추가 (필요 시)

### 재사용 가능 컴포넌트 발견 시

#### 🔔 사용자 확인 요청

"컴포넌트 개발 중 **공통 컴포넌트**로 추출 가능한 요소 발견:"

**컴포넌트 정보**:

- 이름: `Pagination`
- 용도: 페이지 네비게이션
- 재사용 가능성: 높음

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

"공통 컴포넌트로 추출할까요?"

- [ ] 승인 → `src/shared/components/`
- [ ] 거부 → 현재 기능에만
- [ ] 보류 → 나중에 결정

**승인 시**: 공통 컴포넌트 생성 + 현재 기능에서 사용 + Memory 기록

---

## Step 2-5: 전체 UI 설계 검수 및 승인

### 5-1. 검수 요청

#### 🛑 사용자 검수 필수

"기능 **[F001 - 상품 목록 조회]**의 UI 설계가 완료되었습니다."

**설계 결과 요약**:

컴포넌트 구조:

```
ProductListPage
├─ PageHeader
├─ ProductFilter
│  ├─ CategoryFilter
│  └─ PriceRangeFilter
├─ ProductList
│  └─ ProductCard ×N
└─ Pagination (공통)
```

생성된 파일:

- `src/pages/ProductListPage.tsx`
- `src/features/product/components/` (7개)
- `src/shared/components/Pagination.tsx` (공통)

**총 9개 파일**

---

### 5-2. 검수 체크리스트

- [ ] 컴포넌트 분리가 적절한가?
- [ ] Props 정의가 명확한가?
- [ ] UI가 Figma와 일치하는가?
- [ ] 반응형이 고려되었는가?
- [ ] 접근성이 고려되었는가?
- [ ] 공통 컴포넌트 추출이 적절한가?

---

### 5-3. 변경 요청 가능

- 컴포넌트 추가/제거/병합
- Props 수정
- 스타일 수정
- 파일 구조 변경

⚠️ **승인 전까지 API 설계 단계 진행 금지**

---

## Memory 업데이트

**Step 2-5 완료 시**:

- `@00-memory.md` 업데이트
  - 현재 워크플로우: `03-3-api-design`
  - 현재 Step: Step 3 (API 설계)
  - 진행률: 40%
- UI 설계 파일 경로 기록
- 컴포넌트 목록 기록

---

## 다음 단계

**Step 2-5 승인 후**: `@03-3-api-design.md` (Phase 2-3 - API 설계)
