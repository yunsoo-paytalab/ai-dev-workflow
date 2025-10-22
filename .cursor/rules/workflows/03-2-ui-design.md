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

## Step 2-1: 컴포넌트 단위 정의 (개발자 주도)

### 1-1. 컴포넌트 단위 정의 요청

#### 🔔 사용자 입력 필요

"현재 작업 중인 기능: **[F001 - 상품 목록 조회]**"

"이 기능을 개발하기 위해 **컴포넌트 단위**를 정의해주세요:"

**컴포넌트 계층 가이드라인**:

- **기능 단위**: 완전한 기능을 수행하는 독립적인 UI 블록
- **기능적 그룹**: 특정 기능을 수행하는 UI 그룹 (2-3개 기본 요소 조합)
- **기본 요소**: 더 이상 분해할 수 없는 기본 UI 요소

**개발 우선순위**:

- [ ] 기능 단위부터 개발 (전체 기능)
- [ ] 필요시 기능적 그룹으로 분해
- [ ] 필요시 기본 요소로 분해

**템플릿**:

```
### 기능 단위
1. [컴포넌트 단위명]
   - Figma URL: https://www.figma.com/design/...?node-id=...
   - 설명: [기능적 역할과 포함 요소]
   - 포함 요소: [하위 컴포넌트 목록]

### 기능적 그룹 - 선택사항
2. [컴포넌트 단위명]
   - Figma URL: https://www.figma.com/design/...?node-id=...
   - 설명: [기능적 역할과 포함 요소]
   - 포함 요소: [하위 컴포넌트 목록]

### 기본 요소 - 선택사항
3. [컴포넌트 단위명]
   - Figma URL: https://www.figma.com/design/...?node-id=...
   - 설명: [기능적 역할과 포함 요소]
   - 포함 요소: 없음 (최소 단위)
```

**예시**:

```
### 기능 단위
1. ProductListSection
   - Figma URL: https://www.figma.com/design/abc123?node-id=1-2
   - 설명: 상품 목록 전체 기능 (필터 + 리스트 + 페이지네이션)
   - 포함 요소: ProductFilter, ProductList, Pagination

### 기능적 그룹
2. ProductFilter
   - Figma URL: https://www.figma.com/design/abc123?node-id=3-4
   - 설명: 상품 필터링 기능
   - 포함 요소: CategoryFilter, PriceRangeFilter

3. ProductList
   - Figma URL: https://www.figma.com/design/abc123?node-id=5-6
   - 설명: 상품 목록 표시 기능
   - 포함 요소: ProductCard (반복)

### 기본 요소
4. ProductCard
   - Figma URL: https://www.figma.com/design/abc123?node-id=7-8
   - 설명: 개별 상품 카드
   - 포함 요소: 없음 (최소 단위)
```

⚠️ **컴포넌트 단위를 정의할 때까지 다음 단계 진행 금지**

---

### 1-2. 컴포넌트 단위 승인

#### 🔔 사용자 입력 필요

"정의된 컴포넌트 단위를 확인해주세요:"

**가능한 액션**:

- ✅ 승인 (Step 2-2 진행)
- ➕ 추가 (누락 컴포넌트 단위)
- ➖ 제거 (불필요 컴포넌트 단위)
- 🔀 병합 (컴포넌트 단위 합치기)
- 📝 수정 (이름 변경)

⚠️ **승인받을 때까지 다음 단계 절대 진행 금지**

---

## Step 2-2: 컴포넌트 단위별 개발 (순차 처리)

> 💡 **중요**: 한 번에 **1개 컴포넌트 단위씩** 순차 처리
>
> 이유: Figma Dev Mode 정확도 향상, 할루시네이션 방지

### 개발 순서

**권장**: 기능 단위 → 기능적 그룹 → 기본 요소 순서

예시: ProductListSection → ProductFilter → ProductCard

---

### 2-1. 현재 작업 단위 표시

"현재 작업: **[ProductListSection]** 컴포넌트 단위"

---

### 2-2. Figma 분석 (해당 단위만)

**Figma MCP 활용**:

- 현재 컴포넌트 단위만 분석
- 하위 요소들의 구조 파악
- 인터랙션 및 상태 정의

**분석 항목**:

1. 전체 레이아웃 구조
2. 하위 컴포넌트 식별
3. UI 요소 상세 (버튼, 입력, 카드, 리스트 등)
4. 레이아웃 패턴 (Grid/Flex, 반응형)

---

### 2-3. 전체 단위 코드 변환

**Figma Dev Mode 또는 Plugin 활용**:

- 전체 컴포넌트 단위를 하나의 컴포넌트로 변환
- 기본 JSX 구조 생성
- 스타일 정보 추출

---

### 2-4. 스켈레톤 코드 생성 (개선된 방식)

**포함 내용**:

- ✅ JSX 구조 (Figma 디자인 기반)
- ✅ 최소한의 데이터 변수 (표출용)
- ✅ 기본 CSS 클래스명
- ✅ 시맨틱 HTML 구조
- ✅ ARIA 속성 (접근성)

**포함하지 않는 내용**:

- ❌ Props 인터페이스 (개발자가 필요시 정의)
- ❌ 이벤트 핸들러 (개발자 요청시 생성)
- ❌ 상태 관리 로직 (개발자 요청시 생성)
- ❌ 비즈니스 로직 (개발자 요청시 생성)

**스켈레톤 코드 템플릿**:

```typescript
// src/features/product/components/ProductListSection.tsx

export default function ProductListSection() {
  // 데이터 표출에 필요한 최소한의 값들만 변수로 정의
  const sectionTitle = "상품 목록";
  const productCount = "24개 상품";
  const currentPage = 1;
  const totalPages = 5;

  return (
    <section className="product-list-section">
      {/* 전체 기능의 JSX 구조 */}
      <div className="section-header">
        <h2>{sectionTitle}</h2>
        <span className="product-count">{productCount}</span>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">{/* 필터 관련 JSX */}</div>

      {/* 상품 리스트 영역 */}
      <div className="product-list">{/* 상품 리스트 관련 JSX */}</div>

      {/* 페이지네이션 영역 */}
      <div className="pagination">{/* 페이지네이션 관련 JSX */}</div>
    </section>
  );
}
```

**개발자 추가 작업 안내**:

"스켈레톤 코드가 생성되었습니다. 필요시 다음 작업을 진행하세요:"

- [ ] Props 인터페이스 정의 (필요시)
- [ ] 이벤트 핸들러 추가 (필요시)
- [ ] 상태 관리 로직 추가 (필요시)
- [ ] 비즈니스 로직 추가 (필요시)
- [ ] 스타일 세부 조정 (필요시)

**UX 로직 추가 요청 방법**:

"UX 로직이 필요한 경우 다음과 같이 요청해주세요:"

- "장바구니 버튼 클릭 이벤트 추가해줘"
- "좋아요 토글 기능 추가해줘"
- "상품 데이터를 props로 받도록 수정해줘"

---

### 2-5. 컴포넌트 리팩토링 (개발자 요청시)

#### 분해 요청 확인

#### 🔔 사용자 입력 필요

"**ProductListSection** 컴포넌트를 세부 컴포넌트로 분해할까요?"

**분해 옵션**:

- [ ] 기능적 그룹으로 분해 (ProductFilter, ProductList, Pagination)
- [ ] 기본 요소로 분해 (ProductCard, FilterButton 등)
- [ ] 현재 상태 유지 (분해하지 않음)

**분해 선택 시**: Step 2-6으로 이동
**분해 안함 선택 시**: Step 2-7로 이동

---

### 2-6. 컴포넌트 분해 (선택사항)

**분해 규칙**:

- **기능 단위**: 전체 기능 단위 (현재 작업 중인 단위)
- **기능적 그룹**: 특정 기능을 수행하는 UI 그룹 (필터, 리스트 등)
- **기본 요소**: 기본 UI 요소 (버튼, 입력, 카드 등)

**분해 예시**:

```
ProductListSection (기능 단위)
├─ ProductFilter (기능적 그룹)
│  ├─ CategoryFilter (기본 요소)
│  └─ PriceRangeFilter (기본 요소)
├─ ProductList (기능적 그룹)
│  └─ ProductCard (기본 요소)
└─ Pagination (기능적 그룹)
```

**각 분해된 컴포넌트마다**:

1. Figma 분석 (해당 컴포넌트만)
2. 스켈레톤 코드 생성
3. Props 인터페이스 정의 (개발자 요청시)

---

### 2-7. 컴포넌트 검수 (조건부)

#### 검수 필요 여부 판단

**AI 작업**: 다음 기준 중 **하나라도 해당**하면 사용자 검수 요청

**검수 필요 기준**:

1. **구조 복잡도**:

   - [ ] JSX 중첩 레벨이 3단계 이상
   - [ ] 조건부 렌더링이 3개 이상

2. **외부 의존성**:
   - [ ] API 호출 포함 (React Query 등)
   - [ ] 전역 상태 사용 (Zustand, Context 등)
   - [ ] 라우팅 관련 로직 (useNavigate 등)

**검수 불필요 (자동 진행)**:

- 위 기준에 모두 해당하지 않는 단순 컴포넌트

---

#### 검수 요청 (해당 시)

#### 🔔 사용자 입력 필요

"**ProductListSection** 컴포넌트 검수가 필요합니다."

**검수 이유**: JSX 중첩 레벨 3단계 이상

**검수 체크리스트**:

- [ ] UI가 Figma와 유사한가?
- [ ] 구조가 과도하게 복잡하지 않은가?
- [ ] 스타일이 적절한가?

**피드백**:

- 수정 필요 시: 즉시 반영
- 문제 없음: 다음 컴포넌트로

---

### 2-8. 다음 컴포넌트 단위로 이동

"다음 컴포넌트 단위: **ProductFilter**"

→ Step 2-1로 돌아가서 반복

**모든 컴포넌트 단위 완료 시**: Step 2-3으로 이동

---

## Step 2-3: 공통 컴포넌트 추가 (필요 시)

### 재사용 가능 컴포넌트 발견 시

#### 🔔 사용자 확인 요청

"컴포넌트 개발 중 **공통 컴포넌트**로 추출 가능한 요소 발견:"

**컴포넌트 정보**:

- 이름: `Pagination`
- 용도: 페이지 네비게이션
- 재사용 가능성: 높음
- 현재 위치: `src/features/product/components/Pagination.tsx`

**추출 제안**:

"이 컴포넌트를 공통 컴포넌트로 추출할까요?"

- [ ] 승인 → `src/shared/components/Pagination.tsx`로 이동
- [ ] 거부 → 현재 기능에만 유지
- [ ] 보류 → 나중에 결정

**승인 시**:

1. 공통 컴포넌트 생성
2. 현재 기능에서 공통 컴포넌트 사용
3. Memory 기록

---

## Step 2-4: 전체 UI 설계 검수 및 승인

### 4-1. 검수 요청

#### 🛑 사용자 검수 필수

"기능 **[F001 - 상품 목록 조회]**의 UI 설계가 완료되었습니다."

**설계 결과 요약**:

컴포넌트 구조:

```
ProductListSection (기능 단위)
├─ ProductFilter (기능적 그룹)
│  ├─ CategoryFilter (기본 요소)
│  └─ PriceRangeFilter (기본 요소)
├─ ProductList (기능적 그룹)
│  └─ ProductCard (기본 요소)
└─ Pagination (기능적 그룹) → 공통 컴포넌트로 추출
```

생성된 파일:

- `src/features/product/components/ProductListSection.tsx`
- `src/features/product/components/ProductFilter.tsx`
- `src/features/product/components/ProductList.tsx`
- `src/features/product/components/ProductCard.tsx`
- `src/shared/components/Pagination.tsx` (공통)

**총 5개 파일**

---

### 4-2. 검수 체크리스트

- [ ] 컴포넌트 단위 분리가 적절한가?
- [ ] 컴포넌트 계층 구조가 잘 적용되었는가?
- [ ] UI가 Figma와 일치하는가?
- [ ] 반응형이 고려되었는가?
- [ ] 접근성이 고려되었는가?
- [ ] 공통 컴포넌트 추출이 적절한가?
- [ ] 스켈레톤 코드가 개발자 친화적인가?

---

### 4-3. 변경 요청 가능

- 컴포넌트 단위 추가/제거/병합
- 컴포넌트 계층 조정
- 스타일 수정
- 파일 구조 변경
- Props 인터페이스 추가 (개발자 요청시)

⚠️ **승인 전까지 API 설계 단계 진행 금지**

---

## Memory 업데이트

**Step 2-4 완료 시**:

- `@00-memory.md` 업데이트
  - 현재 워크플로우: `03-3-api-design`
  - 현재 Step: Step 3 (API 설계)
  - 진행률: 40%
- UI 설계 파일 경로 기록
- 컴포넌트 단위 목록 기록
- 컴포넌트 계층 구조 기록

---

## 다음 단계

**Step 2-4 승인 후**: `@03-3-api-design.md` (Phase 2-3 - API 설계)
