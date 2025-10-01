# 도메인 정의 워크플로우 (Phase 1 Turn 1)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-main-workflow.md` - 전체 프로세스 이해
> 2. `@00-memory.md` - 현재 진행 상황 확인

## 목표

요구사항 명세서를 분석하여 도메인 경계를 설정하고, 페이지 단위 구조를 정의합니다.

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md` 읽기 - 현재 진행 상황 파악
2. 요구사항 명세서 존재 여부 확인

**요구사항 명세서가 없다면**:

- 📄 요구사항 명세서 파일 첨부 요청 (`docs/requirements.md`)
- 📋 기존 시스템 문서 첨부 요청
- 💬 채팅에서 직접 요구사항 설명 요청

⚠️ 요구사항이 제공될 때까지 진행 금지

---

## AI 작업 프로세스

### Step 1: 사용자 입력 수집

#### 🔔 질문 1: 공통 레이아웃 구조

프로젝트의 공통 레이아웃 구조를 알려주세요:

- [ ] Header (있음/없음)
- [ ] Footer (있음/없음)
- [ ] Sidebar (있음/없음)
- [ ] 모바일 하단 네비게이션 (있음/없음)
- [ ] 기타: `_________________`

**특이사항**:

- 로그인 전/후 레이아웃 차이: (있음/없음)
- 관리자/일반 사용자 레이아웃 차이: (있음/없음)
- 기타: `_________________`

#### 🔔 질문 2: 기존 디자인 시스템

- [ ] 있음 → 경로: `_________________`
- [ ] 없음 → Figma URL 제공 예정
- [ ] 부분적 → 설명: `_________________`

⚠️ 위 정보를 모두 받을 때까지 다음 단계 진행 금지

---

### Step 2: 요구사항 분석

**작업 내용**:

1. 요구사항 명세서 분석
2. 핵심 기능 추출
3. 주요 액터(사용자 유형) 식별
4. 데이터 흐름 파악

---

### Step 3: 도메인 경계 식별

#### 도메인 경계 결정 가이드

**기본 원칙**:

1. **액터 중심**: 주 액터가 명확하면 해당 도메인에 포함
2. **단순함 우선**: 복잡하지 않으면 분리하지 않음
3. **변경 격리**: 자주 변경되는 로직은 분리 검토
4. **응집도**: 관련 기능은 같은 도메인에

#### 판단 기준 (순서대로 체크)

각 기능에 대해:

**1. 주 액터가 명확한가?**

- YES → 해당 도메인에 포함 검토
- NO → 다음 단계

**2. 비즈니스 규칙이 복잡한가?**

- YES → 별도 도메인 분리 검토
- NO → 주 도메인에 포함

**3. 3개 이상의 도메인과 연동되는가?**

- YES → 별도 도메인 분리
- NO → 주 도메인에 포함

**4. 자주 변경되는가?** (월 1회 이상)

- YES → 별도 도메인 분리 검토
- NO → 주 도메인에 포함

#### 판단 예시

**예시 1 - 주 도메인에 포함**:

- 케이스: 사용자 알림 설정
- 주 액터: User ✓
- 복잡도: 낮음 (boolean 플래그)
- 관련 도메인: 1개
- **결론**: User 도메인에 포함

**예시 2 - 별도 도메인 분리**:

- 케이스: 포인트/리워드 시스템
- 주 액터: 불명확 (User, Order, Review 모두 관련)
- 복잡도: 높음 (적립/사용/만료 규칙)
- 관련 도메인: 4개 이상
- 변경 빈도: 높음
- **결론**: Reward 도메인으로 분리

---

### Step 4: 페이지 구조 정의

**작업 내용**:

1. 필요한 모든 페이지 식별
2. 페이지별 URL 경로 설계
3. 페이지별 관련 도메인 표시
4. 라우팅 구조 정의 (인증 필요 여부 등)

**주의사항**:

- ✅ 페이지 단위만 정의
- ✅ URL 구조와 라우팅만 설계
- ❌ 페이지 내부의 세부 컴포넌트는 Phase 2에서 정의

---

### Step 5: 기능 목록 도출

각 기능에 대해 다음 정보 도출:

- **기능명**: 명확하고 구체적으로
- **주도 도메인** (primaryDomain): 이 기능의 주인
- **관련 도메인들** (relatedDomains): 연동되는 도메인
- **복잡도**: low / moderate / high
- **설명**: 간단한 설명

**배치 논의가 필요한 경우**:

- 주 도메인이 불명확한 경우
- 여러 도메인 배치 옵션이 있는 경우
- 별도 도메인 분리 여부가 애매한 경우

이 경우 `needsDiscussion: true`로 표시하고 배치 옵션 제시

---

### Step 6: 리소스 식별

주요 데이터 리소스만 식별:

- 예: User, Product, Order, Review, Payment

**주의사항**:

- ✅ 리소스 이름만 나열
- ❌ API 엔드포인트는 Phase 2에서 정의

---

### Step 7: 기술 스택 제안

제안 항목:

- 상태 관리 (서버 상태, 전역 상태, 폼 상태)
- 라우팅
- 필요한 주요 라이브러리

**각 제안에 근거 포함**

---

### Step 8: API 공통 규칙 확인

#### 🔔 사용자 입력 필요

"기존 API 규칙/가이드가 있나요?"

- [ ] **있음** → 경로: `_________________`
- [ ] **없음** → Phase 2에서 필요 시 정의

⚠️ **"없음" 선택 시**: Phase 2 Step 3 (API 설계)에서 공통 패턴을 정의하며 진행합니다.

---

## 출력 형식

```typescript
interface DomainDefinitionOutput {
  // 도메인 목록
  domains: {
    name: string; // 'User', 'Product', 'Order'
    description: string; // '사용자 인증 및 프로필 관리'
    responsibilities: string[]; // ['로그인', '회원가입', '프로필 수정']
  }[];

  // 레이아웃 구조 (사용자 입력)
  layouts: {
    header: boolean;
    footer: boolean;
    sidebar: boolean;
    mobileNav: boolean;
    notes: string; // '로그인 전/후 Header 다름'
  };

  // 페이지 목록
  pages: {
    path: string; // '/products/:id'
    name: string; // 'ProductDetailPage'
    relatedDomains: string[]; // ['Product', 'User', 'Cart', 'Review']
    description: string; // '상품 상세 정보, 리뷰, 장바구니 기능'
  }[];

  // 라우팅 구조
  routing: {
    structure: "flat" | "nested";
    authRequired: string[]; // ['/mypage', '/order']
    publicPages: string[]; // ['/login', '/products']
    defaultRedirects: {
      authenticated: string; // '/mypage'
      unauthenticated: string; // '/login'
    };
  };

  // 기능 목록
  features: {
    name: string; // '상품 상세 조회'
    primaryDomain: string; // 'Product'
    relatedDomains: string[]; // ['User', 'Cart', 'Review']
    complexity: "low" | "moderate" | "high";
    description: string;

    // 배치 논의 필요한 경우만
    needsDiscussion?: boolean;
    discussionPoint?: string;
    options?: {
      domain: string;
      pros: string[];
      cons: string[];
    }[];
  }[];

  // 리소스 목록
  resources: string[]; // ['User', 'Product', 'Order']

  // API 공통 규칙
  apiGuidelines?: {
    hasExisting: boolean;
    path?: string; // 기존 가이드 경로 (있는 경우만)
  };

  // 기술 스택 제안
  techStack: {
    stateManagement: {
      server: string; // 'React Query'
      global: string; // 'Zustand'
      form: string; // 'React Hook Form'
    };
    routing: string; // 'React Router'
    majorLibraries: {
      name: string;
      purpose: string;
      reason: string;
    }[];
  };
}
```

---

## 개발자 검수 게이트

### 🛑 사용자 검수 필수

#### ✅ 도메인 구조

- [ ] 도메인 목록이 적절한가?
- [ ] 각 도메인의 책임 범위가 명확한가?
- [ ] 불필요하게 분리된 도메인이 있는가?
- [ ] 너무 비대해진 도메인이 있는가?

#### ✅ 페이지 목록

- [ ] 모든 필요한 페이지가 식별되었는가?
- [ ] 페이지 이름이 명확하고 일관적인가?
- [ ] 페이지 설명이 충분한가?
- [ ] 불필요한 페이지가 있는가?

#### ✅ 라우팅 구조

- [ ] 라우팅 구조가 직관적인가?
- [ ] 인증 필요 페이지가 적절히 구분되었는가?
- [ ] URL 구조가 RESTful한가?

#### ✅ 레이아웃 구조

- [ ] 입력한 레이아웃 정보가 정확한가?
- [ ] 추가로 필요한 레이아웃이 있는가?

#### ✅ 기능 목록

- [ ] 모든 핵심 기능이 포함되었는가?
- [ ] 각 기능의 주도 도메인이 합리적인가?
- [ ] 도메인 배치 논의가 필요한 기능이 적절히 플래그되었는가?

#### ✅ 기술 스택

- [ ] 상태 관리 방식이 요구사항에 적합한가?
- [ ] 제안된 라이브러리가 적절한가?

#### ✅ API 공통 규칙

- [ ] 기존 API 가이드 경로가 정확한가? (있는 경우만)

#### 📝 변경 요청 가능

- 도메인 추가/제거/병합
- 페이지 추가/제거/병합
- 기능 도메인 재배치
- 기술 스택 변경
- 레이아웃 구조 수정

⚠️ **승인 전까지 Phase 1 Turn 2 진행 금지**

---

## Memory 업데이트

**완료 후 작업**:

1. Phase 1 Turn 1 완료 체크
2. 결과물 파일 경로 기록
3. 식별된 도메인 목록 동적 추가
4. Phase 2 준비
5. 현재 작업 상태 업데이트
6. 다음 단계(Phase 1 Turn 2) 안내

---

## 결과물 파일 경로

- `docs/domain-definition.md` - 도메인 정의 및 구조
- `docs/page-structure.md` - 페이지 및 라우팅 구조
- `docs/feature-list.md` - 기능 목록 및 도메인 배치
- `docs/tech-stack.md` - 기술 스택 제안서
