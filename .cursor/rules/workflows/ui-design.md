# UI 설계

> ⚠️ **이 파일을 읽기 전에 먼저 읽어야 할 파일**:
>
> 1. `@main-workflow.md` - 전체 프로세스 이해
> 2. `@memory.md` - 현재 진행 상황 확인

## 목표 및 범위

**목표**: Figma 디자인을 분석하여 컴포넌트의 스켈레톤 코드를 생성합니다.

---

## 권장 사항

💡 **권장**: 다음 단계 완료 후 진행을 권장합니다.

**기능 UI 설계 시**:

- 도메인 정의 완료
- 공통 UI 설계 완료 (공통 컴포넌트 재사용)

미완료 시 발생 가능한 문제:

- 컴포넌트 파일 경로가 정의되지 않을 수 있습니다
- 공통 컴포넌트를 재사용하지 못할 수 있습니다
- 디자인 시스템 정보가 부족할 수 있습니다

계속 진행하시겠습니까?

---

## 개발 프로세스

### Step 1: 컴포넌트 정보 수집

#### 🔔 사용자 입력 필요

**질문**: "개발할 컴포넌트 정보를 제공해주세요."

**필수 정보**:

- 컴포넌트명: `_________________`
- Figma URL: `_________________`

**선택 정보**:

- 용도/역할: `_________________`
- 참고사항: `_________________`

⚠️ **컴포넌트 정보를 받을 때까지 다음 단계 진행 금지**

---

### Step 2: Figma 분석

**분석 항목**:

- (필요 시) 전체 레이아웃 구조
- UI 요소 상세 (버튼, 입력, 카드 등)
- 변형(variants), 상태(states), 크기(sizes) 파악
- 레이아웃 패턴 (Grid/Flex, 반응형)
- 인터랙션 (클릭, 열기/닫기 등)

---

### Step 3: 스켈레톤 코드 생성

**포함 내용**:

- ✅ JSX 구조 (Figma 디자인 기반) : 필요 시, 하위 컴포넌트로 분리
- ✅ 최소한의 데이터 변수 (표출용)
- ✅ 기본 CSS 클래스명
- ✅ 시맨틱 HTML 구조
- ✅ ARIA 속성 (접근성)

**포함하지 않는 내용**:

- ❌ Props 인터페이스 (개발자가 필요시 정의)
- ❌ 이벤트 핸들러 (개발자 요청시 생성)
- ❌ 상태 관리 로직 (개발자 요청시 생성)
- ❌ 비즈니스 로직 (개발자 요청시 생성)

#### 스켈레톤 코드 예시

**Dialog 컴포넌트**:

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
- "장바구니 버튼 클릭 이벤트 추가해줘"
- "ProductCard를 props로 제어하도록 수정해줘"

---

### Step 4: 컴포넌트 검수

#### 검수 가이드 (AI용)

**기본 원칙**: 컴포넌트 복잡도에 따라 유동적으로 질문

**항상 질문할 항목**:

- 생성된 컴포넌트가 요구사항과 일치하는가?

**조건부 질문 항목**:

- Figma와 차이가 있는 경우: 의도된 변경인가?
- 접근성이 중요한 컴포넌트: ARIA 속성이 적절한가?
- 공통 컴포넌트인 경우: 재사용성을 고려했는가?
- 복잡한 컴포넌트인 경우: 분리가 필요한가?

**질문 방식**:

- Open-ended 질문 권장 (Yes/No 지양)
- 문제점 발견 시 구체적으로 지적
- 개선 제안 제시

#### 🔔 사용자 검수

"**[컴포넌트명]** 컴포넌트가 생성되었습니다."

**컴포넌트 정보**:

- 이름: `[컴포넌트명]`
- 파일 경로: `[파일경로]`
- 타입: [공통/기능]

**검수를 권장합니다**:

- UI가 Figma와 일치하는가?
- 컴포넌트 구조가 적절한가?
- 접근성이 고려되었는가?
- (공통 컴포넌트의 경우) 재사용성이 충분한가?

**피드백**: (수정 필요 시 즉시 반영)

---

### Step 5: 추가 컴포넌트 개발 여부 확인

#### 🔔 사용자 확인

"추가로 개발할 컴포넌트가 있나요?"

- [ ] **있음** → 다시 `/workflow ui` 또는 `/workflow ui [기능명]` 실행
- [ ] **없음** → Memory 업데이트 후 다음 단계로

---

## Memory 업데이트

**작업 완료 시**: `memory.md`에 진행사항 업데이트

---

## 다음 단계

**컴포넌트 개발 완료 후**:

- 추가 컴포넌트가 있다면: 다시 `/workflow ui` 실행
- 모든 컴포넌트 완료 시: `@feature-implementation.md` (기능 구현)
