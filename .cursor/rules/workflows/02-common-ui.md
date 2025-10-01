# 공통 UI 설계 워크플로우 (Phase 1 Turn 2)

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@00-main-workflow.md` - 전체 프로세스 이해
> 2. `@00-memory.md` - 현재 진행 상황 확인
> 3. `@01-domain-definition.md` 완료 여부 확인

## 목표 및 범위

**목표**: 개발이 필요한 공통 컴포넌트와 레이아웃만 정의합니다.

**범위**:

- ✅ 공통 컴포넌트 (개발 필요한 것만)
- ✅ 레이아웃 컴포넌트 (개발 필요한 것만)
- ❌ 디자인 토큰 (기존 시스템 사용)
- ❌ 기능별 페이지 UI (Phase 2에서 진행)

---

## 사전 요구사항 확인

⚠️ **시작 전 필수 확인**:

1. `@00-memory.md` 읽기 - Phase 1 Turn 1 완료 여부
2. Phase 1 Turn 1 결과물 확인:
   - 도메인 목록
   - 페이지 구조
   - 레이아웃 정보

**Phase 1 Turn 1이 완료되지 않았다면 진행 금지**

---

## AI 작업 프로세스

### Step 1: 개발 필요한 컴포넌트 목록 수집

#### 🔔 질문 1: 기존 디자인 시스템

- [ ] **있음**

  - 경로: `_________________`
  - 사용 라이브러리: `_________________`

- [ ] **없음** → Figma에서 토큰 추출 예정

- [ ] **부분적**
  - 기존 경로: `_________________`

#### 🔔 질문 2: 개발이 필요한 공통 컴포넌트

이미 있는 컴포넌트는 제외하고 작성해주세요.

**템플릿**:

공통 컴포넌트:

1. Dialog
2. Toast
3. `_________________`
4. `_________________`

(필요한 만큼 추가)

기존 컴포넌트 경로 (참고용): `_________________`

#### 🔔 질문 3: 개발이 필요한 레이아웃

Phase 1 Turn 1에서 정의했지만 아직 개발 안된 것만 입력해주세요.

**템플릿**:

레이아웃:

1. Header
2. Footer
3. `_________________`

(필요한 만큼 추가)

기존 레이아웃 경로 (참고용): `_________________`

⚠️ **위 정보를 모두 받을 때까지 다음 단계 진행 금지**

**작업 대상**:

- 사용자가 입력한 컴포넌트 목록만 순차 개발
- 입력되지 않은 것은 작업하지 않음

---

### Step 2: 공통 컴포넌트 개발 (순차 처리)

⚠️ **중요**: 컴포넌트별로 하나씩 순차 처리 (Figma MCP 할루시네이션 방지)

**각 컴포넌트마다 반복**:

1. Figma URL 수집
2. Figma 분석
3. Props 정의
4. 스켈레톤 생성
5. 다음 컴포넌트로

---

#### 2-1. Figma URL 수집 (개별)

**현재 작업 컴포넌트 표시**:

"현재 작업: [Dialog] 컴포넌트"

"Dialog의 Figma URL을 제공해주세요:"

- Dialog URL: `https://www.figma.com/design/<fileKey>?node-id=<id>`

**변형이 여러 파일에 있다면**:

- confirm 변형: `https://...`
- alert 변형: `https://...`

⚠️ URL을 받을 때까지 다음 단계 진행 금지

---

#### 2-2. Figma 분석 (개별 컴포넌트만)

**Figma MCP 활용** (현재 컴포넌트만):

1. **변형(variants)**: confirm, alert, custom 등
2. **상태(states)**: default, hover, disabled 등
3. **크기(sizes)**: sm, md, lg (있다면)
4. **인터랙션**: 클릭, 열기/닫기, 애니메이션

⚠️ **한 번에 하나의 컴포넌트만 분석**

---

#### 2-3. Props 인터페이스 정의 (개별)

**Props 네이밍 규칙**:

- Boolean: `is*`, `has*`, `can*` 접두사
- 이벤트: `on*` 접두사
- `any` 타입 금지

**예시** (Dialog):

```typescript
interface DialogProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  variant?: "confirm" | "alert";
  onClose: () => void;
  onConfirm?: () => void;
}
```

다른 컴포넌트도 동일한 원칙 적용

---

#### 2-4. 스켈레톤 코드 생성 (개별)

**포함 내용**:

- ✅ Props 인터페이스
- ✅ 컴포넌트 시그니처
- ✅ 기본 JSX 구조
- ✅ ARIA 속성
- ❌ 상세 스타일

**예시**:

```typescript
// src/shared/components/Dialog.tsx

interface DialogProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  variant?: "confirm" | "alert";
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Dialog(props: DialogProps) {
  if (!props.isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      <h2>{props.title}</h2>
      <div>{props.content}</div>
      {/* TODO: Phase 2에서 상세 구현 */}
    </div>
  );
}
```

**완료 후 다음 컴포넌트로 이동**

---

### Step 3: 레이아웃 개발 (순차 처리)

⚠️ **중요**: 레이아웃도 하나씩 순차 처리

**각 레이아웃마다 Step 2와 동일하게 반복**:

1. Figma URL 수집
2. Figma 분석
3. Props 정의
4. 스켈레톤 생성
5. 다음 레이아웃으로

**예시**: Header → Footer → Sidebar (있다면) → MobileNav (있다면)

---

## 출력 형식

```typescript
interface CommonUIDesignOutput {
  commonComponents: {
    name: string;
    filePath: string;
    props: string;
    variants: string[];
  }[];

  layoutComponents: {
    name: string;
    filePath: string;
    variants: string[];
  }[];

  designTokens?: {
    filePath: string;
    source: "figma" | "existing";
  };
}
```

---

## 개발자 검수 게이트

### 🛑 사용자 검수 필수

#### ✅ 공통 컴포넌트

- [ ] 필요한 컴포넌트가 모두 개발되었는가?
- [ ] Props 정의가 명확한가?
- [ ] 접근성이 고려되었는가?

#### ✅ 레이아웃 컴포넌트

- [ ] 필요한 레이아웃이 모두 개발되었는가?
- [ ] 반응형이 고려되었는가?

#### ✅ 전체 검토

- [ ] 기존 컴포넌트와 일관성이 있는가?
- [ ] 과도한 구현 없이 기본 구조만 있는가?

#### 📝 변경 요청 가능

- 컴포넌트 추가/제거
- Props 수정

⚠️ **승인 전까지 Phase 2 진행 금지**

---

## Memory 업데이트

**완료 후 작업**:

1. Phase 1 Turn 2 완료 체크
2. 개발된 컴포넌트 목록 기록
3. 결과물 파일 경로 기록
4. Phase 2 준비 안내

---

## 결과물 파일 경로

- 공통 컴포넌트: `src/shared/components/`
- 레이아웃 컴포넌트: `src/shared/components/layout/`
- 디자인 토큰 (새로 생성 시): `src/shared/styles/tokens.ts`
- 문서: `docs/common-components.md`
