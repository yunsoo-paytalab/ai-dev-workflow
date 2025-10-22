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

#### 🔔 Step 1 완료 확인

**AI 작업**: 위 3개 질문에 대한 사용자 응답을 모두 받은 후, 다음 확인을 요청합니다.

"Step 1이 완료되었습니다. 다음 정보를 확인해주세요:"

**수집된 정보 요약**:

- 기존 디자인 시스템: `_________________`
- 개발할 공통 컴포넌트: `_________________` (N개)
- 개발할 레이아웃: `_________________` (N개)

**이 정보로 Step 2 (공통 컴포넌트 개발)를 시작할까요?**

- [ ] 승인 (Step 2 시작)
- [ ] 수정 필요 (정보 수정)
- [ ] 보류 (나중에 진행)

⚠️ **사용자 승인을 받을 때까지 Step 2 진행 금지**

**작업 대상**:

- 사용자가 입력한 컴포넌트 목록만 순차 개발
- 입력되지 않은 것은 작업하지 않음

---

### Step 2: 공통 컴포넌트 개발 (순차 처리)

⚠️ **시작 전 필수 확인**: Step 1에서 사용자 승인을 받았는지 확인

**AI 작업**: Step 1 완료 확인이 승인되었는지 확인 후 진행

**승인되지 않은 경우**: Step 1으로 돌아가서 사용자 승인 요청

**승인된 경우**: 아래 프로세스 진행

---

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

### 📘 Props 정의 예시 (참고용)

Dialog 컴포넌트의 경우:

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

다른 컴포넌트도 동일한 원칙을 적용하여 정의합니다.

---

#### 2-4. 스켈레톤 코드 생성 (개선된 방식)

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

### 📘 스켈레톤 코드 예시 (개선된 방식)

Dialog 컴포넌트의 경우:

```typescript
// src/shared/components/Dialog.tsx

export default function Dialog() {
  // 데이터 표출에 필요한 최소한의 값들만 변수로 정의
  const dialogTitle = "확인";
  const dialogContent = "정말로 삭제하시겠습니까?";
  const confirmText = "확인";
  const cancelText = "취소";

  return (
    <div role="dialog" aria-modal="true" className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2 className="dialog-title">{dialogTitle}</h2>
          <button className="dialog-close-btn" aria-label="닫기">
            ×
          </button>
        </div>

        <div className="dialog-content">
          <p className="dialog-message">{dialogContent}</p>
        </div>

        <div className="dialog-actions">
          <button className="dialog-cancel-btn">{cancelText}</button>
          <button className="dialog-confirm-btn">{confirmText}</button>
        </div>
      </div>
    </div>
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

- "Dialog 열기/닫기 기능 추가해줘"
- "확인 버튼 클릭 이벤트 추가해줘"
- "Dialog props로 제어하도록 수정해줘"

**완료 후 다음 컴포넌트로 이동**

---

### Step 3: 레이아웃 개발 (순차 처리)

⚠️ **시작 전 필수 확인**: Step 2 (공통 컴포넌트 개발) 완료 여부 확인

**AI 작업**: Step 2가 완료되었는지 확인 후 진행

**미완료인 경우**: Step 2로 돌아가서 완료 후 진행

**완료된 경우**: 아래 프로세스 진행

---

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

**AI 자동 수행** (사용자 개입 불필요):

**Step 2 완료 시**:

- `@00-memory.md`의 "현재 작업 상태" 업데이트
- 공통 컴포넌트 개발 완료 표시
- Step 3 준비 상태 표시

**Step 3 완료 시**:

- `@00-memory.md`의 "테스트 환경" 섹션 업데이트
- 선택된 테스트 도구 및 설정 기록
- Phase 1 Turn 2 준비 상태 표시

**완료 후 작업**:

1. Phase 1 Turn 2 완료 체크
2. 개발된 컴포넌트 목록 기록
3. 결과물 파일 경로 기록
4. Phase 2 준비 안내

---

## 결과물 파일 경로

> 📌 **컴포넌트 및 디자인 시스템 경로는 `@00-memory.md` 참조**:
>
> - **폴더 구조** 섹션: 공통 컴포넌트, 레이아웃, 스타일 경로
> - **디자인 시스템** 섹션: 토큰, 테마, 스타일 가이드 경로

**문서 경로**:

- `docs/common-components.md` - 공통 컴포넌트 목록 및 사용법
