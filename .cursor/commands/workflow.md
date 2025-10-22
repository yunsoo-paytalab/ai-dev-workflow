# AI 개발 워크플로우 커맨드 가이드

## 개요

**유연한 워크플로우 시스템**:

- 원하는 순서로 작업 가능
- 의존성 미충족 시 경고만 표시
- 사용자 확인 후 계속 진행 가능

**7개 워크플로우 파일**:

- `memory.md` - 진행 상황 추적
- `domain-definition.md` - 도메인 및 기능 정의
- `ui-design.md` - UI 설계 (공통 + 기능)
- `feature-implementation.md` - 기능 구현 및 API 연동
- `system-integration.md` - 통합 및 E2E 테스트

---

## 메인 커맨드

### `/workflow start`

**사용 시점**: 프로젝트 시작 시

**기능**:

- `memory.md` 읽고 현재 상태 파악
- 요구사항 명세서 확인
- 첫 작업 안내

**사용법**:

```
/workflow start
```

**AI 실행 프롬프트**:

```
다음 단계를 수행해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 진행 상황을 파악해주세요
2. 프로젝트 기본 정보가 입력되었는지 확인해주세요
3. 미입력 시: "프로젝트를 시작하기 위해 기본 정보가 필요합니다. `/workflow-domain-definition` 커맨드로 시작하시겠습니까?"
4. 입력 완료 시: 현재 상태와 권장 다음 단계를 안내해주세요

권장 작업 순서 (참고용):
1. 도메인 정의 (`/workflow-domain-definition`)
2. 공통 UI 설계 (`/workflow-common-ui`)
3. 기능별 UI 설계 (`/workflow-ui [기능명]`)
4. 기능별 구현 (`/workflow-implement [기능명]`)
5. 시스템 통합 (`/workflow-integrate`)
6. E2E 테스트 (`/workflow-e2e`)
```

---

### `/workflow status`

**사용 시점**: 언제든지

**기능**:

- 전체 진행 상황 표시
- 완료/미완료 작업 목록
- 권장 다음 단계 안내

**사용법**:

```
/workflow status
```

**AI 실행 프롬프트**:

```
다음 정보를 표시해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 전체 진행 상황을 파악해주세요
2. 다음 정보를 표시해주세요:

**프로젝트 정보**:
- 프로젝트명: [값]
- 경로: [값]
- 기술 스택: [값]

**진행 상황**:
- ✅ 완료된 작업: [목록]
- 🔄 진행 중: [목록]
- ⏳ 대기 중: [목록]

**기능 진행상황**:
- [기능별 상태 표시]

**권장 다음 단계**:
- [다음 단계 안내]
```

---

### `/workflow update`

**사용 시점**: Memory 파일 수동 업데이트 필요 시

**기능**:

- 현재 진행 상황 분석
- `memory.md` 파일 업데이트
- 완료된 작업 체크

**사용법**:

```
/workflow update
```

**AI 실행 프롬프트**:

```
현재 상태를 memory 파일에 업데이트해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 진행 상황을 파악해주세요
2. 프로젝트의 현재 상태를 분석해주세요:
   - 완료된 작업들 확인
   - 현재 진행 중인 작업 파악
   - 파일 시스템 확인
3. `memory.md` 파일을 업데이트해주세요:
   - 체크리스트 업데이트
   - 기능 진행상황 표 업데이트
4. 업데이트된 내용을 사용자에게 보고해주세요
```

---

### `/workflow help`

**사용 시점**: 언제든지

**기능**:

- 사용 가능한 모든 커맨드 표시
- 각 커맨드의 사용법 설명

**사용법**:

```
/workflow help
```

**AI 실행 프롬프트**:

```
사용 가능한 모든 커맨드를 표시해주세요:

**메인 커맨드**:
- /workflow start - 프로젝트 시작
- /workflow status - 현재 상태 확인
- /workflow update - Memory 수동 업데이트
- /workflow help - 도움말

**작업 커맨드**:
- /workflow-domain-definition - 도메인 정의
- /workflow-common-ui - 공통 UI 설계
- /workflow-ui [기능명] - 기능 UI 설계
- /workflow-implement [기능명] - 기능 구현
- /workflow-integrate - 통합 및 리팩토링
- /workflow-e2e - E2E 테스트

**특수 커맨드**:
- /workflow reset - 프로젝트 초기화

각 커맨드의 상세 설명과 함께 표시해주세요.
```

---

## 작업 커맨드

### `/workflow-domain-definition` - 도메인 정의

📄 상세 문서: `@domain-definition-cmd.md`

### `/workflow-common-ui` - 공통 UI 설계

📄 상세 문서: `@common-ui-cmd.md`

### `/workflow-ui [기능명]` - 기능 UI 설계

📄 상세 문서: `@ui-cmd.md`

### `/workflow-implement [기능명]` - 기능 구현

📄 상세 문서: `@implement-cmd.md`

### `/workflow-integrate` - 통합 및 리팩토링

📄 상세 문서: `@integrate-cmd.md`

### `/workflow-e2e` - E2E 테스트

📄 상세 문서: `@e2e-cmd.md`

---

## 특수 커맨드

### `/workflow reset`

**사용 시점**: 프로젝트 초기화 시

**기능**:

- `memory.md` 초기화
- 모든 진행 상황 리셋
- 처음부터 시작

**사용법**:

```
/workflow reset
```

**AI 실행 프롬프트**:

```
프로젝트를 초기화해주세요:

1. `.cursor/rules/workflows/memory-template.md` 파일을 읽어주세요
2. `.cursor/rules/workflows/memory.md` 파일을 템플릿으로 덮어써주세요
3. "프로젝트가 초기화되었습니다. `/workflow start` 커맨드로 시작하세요." 메시지 표시
```

---

## 사용 예시

### 프로젝트 시작

```
/workflow start
```

### 현재 상태 확인

```
/workflow status
```

### 도메인 정의

```
/workflow-domain-definition
```

### 공통 컴포넌트 개발

```
/workflow-common-ui    # Dialog 컴포넌트
/workflow-common-ui    # Toast 컴포넌트
/workflow-common-ui    # Header 컴포넌트
```

### 기능 컴포넌트 개발

```
/workflow-ui 상품목록    # ProductList 컴포넌트
/workflow-ui 상품목록    # ProductCard 컴포넌트
/workflow-ui 장바구니    # CartPage 컴포넌트
```

### 기능 구현

```
/workflow-implement 상품목록
/workflow-implement 장바구니
```

### 시스템 통합

```
/workflow-integrate
```

### E2E 테스트

```
/workflow-e2e
```

### Memory 업데이트

```
/workflow update
```

### 도움말

```
/workflow help
```

---

## 의존성 경고 시스템

### 경고 표시 형식

```
💡 권장 사항

다음 단계가 완료되지 않았습니다:
- [권장 단계명]

미완료 시 발생 가능한 문제:
- [구체적 문제점 1]
- [구체적 문제점 2]

계속 진행하시겠습니까? (y/n)
```

### 의존성 체크 항목

**공통 UI 설계**:

- 도메인 정의 완료 (폴더 구조 정보)

**기능 UI 설계**:

- 도메인 정의 완료
- 공통 UI 설계 완료 (공통 컴포넌트 재사용)

**기능 구현**:

- 도메인 정의 완료 (기능 목록 필요)
- 해당 기능 UI 설계 완료 (권장)

**시스템 통합**:

- 모든 (또는 대부분의 핵심) 기능 구현 완료

**E2E 테스트**:

- 시스템 통합 완료

---

## 커맨드 실행 시 자동 수행 작업

### 1. Memory.md 읽기

```
.cursor/rules/workflows/memory.md 파일을 읽어 다음 정보를 파악:
- 프로젝트 기본 정보
- 기술 스택
- 도메인 목록
- 페이지 구조
- 진행 체크리스트
- 기능 진행상황
- 주요 결정 사항
```

### 2. 권장 사항 확인

```
작업 시작 전 권장 사항 확인:
- 필요한 이전 단계 완료 여부 확인
- 미완료 시 경고 메시지 표시
- 사용자 확인 대기
```

### 3. 워크플로우 파일 참조

```
해당 작업의 워크플로우 파일 참조:
- domain-definition.md
- ui-design.md
- feature-implementation.md
- system-integration.md
```

### 4. 작업 실행

```
워크플로우 파일의 프로세스를 따라 작업 수행:
- 단계별 체크리스트 확인
- 사용자 입력 필요 시 요청
- AI 작업 실행
- 사용자 검수 진행
```

### 5. 결과물 저장

```
결과물을 지정된 경로에 저장:
- 각 워크플로우 파일의 "결과물 파일 경로" 섹션 참조
```

### 6. Memory.md 업데이트

```
memory.md 업데이트:
- 완료된 작업 체크박스 체크
- 기능 진행상황 표 업데이트
```

---

## 권장 작업 순서 (참고)

> 💡 **참고용**: 아래 순서를 따르지 않아도 됩니다.

1. **도메인 정의** (`/workflow-domain-definition`)
2. **공통 UI** (`/workflow-common-ui`)
3. **기능별 반복**:
   - 기능 UI (`/workflow-ui [기능명]`)
   - 기능 구현 (`/workflow-implement [기능명]`)
4. **시스템 통합** (`/workflow-integrate`)
5. **E2E 테스트** (`/workflow-e2e`)

---

## 파일 구조

### 커맨드 파일

**메인 파일**:

- `.cursor/commands/workflow.md` - 메인 커맨드 및 전체 가이드
  - `/workflow start` - 프로젝트 시작
  - `/workflow status` - 현재 상태 확인
  - `/workflow update` - Memory 수동 업데이트
  - `/workflow help` - 도움말
  - `/workflow reset` - 프로젝트 초기화

**작업 커맨드 파일**:

- `.cursor/commands/workflow-domain-definition.md` - `/workflow-domain-definition`
- `.cursor/commands/workflow-common-ui.md` - `/workflow-common-ui`
- `.cursor/commands/workflow-ui.md` - `/workflow-ui [기능명]`
- `.cursor/commands/workflow-implement.md` - `/workflow-implement [기능명]`
- `.cursor/commands/workflow-integrate.md` - `/workflow-integrate`
- `.cursor/commands/workflow-e2e.md` - `/workflow-e2e`

### 워크플로우 가이드 파일

- `.cursor/rules/workflows/memory.md` - 진행 상황 추적
- `.cursor/rules/workflows/memory-template.md` - Memory 템플릿
- `.cursor/rules/workflows/domain-definition.md` - 도메인 정의 워크플로우
- `.cursor/rules/workflows/ui-design.md` - UI 설계 워크플로우
- `.cursor/rules/workflows/feature-implementation.md` - 기능 구현 워크플로우
- `.cursor/rules/workflows/system-integration.md` - 통합 및 E2E 테스트 워크플로우
