# AI 개발 워크플로우 명령어 가이드

## 개요

**유연한 워크플로우 시스템**:

- 원하는 순서대로 작업 수행 가능
- 의존성 미충족 시 경고 표시
- 사용자 확인 후 계속 진행

**워크플로우 구조**:

- `memory.md` - 진행 상황 추적 (`.claude/docs/memory/`에 위치)
- 명령어 파일 `.claude/commands/` - 각각 전체 워크플로우 세부사항 포함

---

## 메인 명령어

### `/workflow start`

**사용 시점**: 프로젝트 시작 시

**기능**:

- `memory.md` 읽어 현재 상태 파악
- 요구사항 명세 확인
- 첫 작업 안내

**사용법**:

```
/workflow start
```

**AI 실행 지침**:

```
다음 단계를 수행해주세요:

1. `.claude/docs/memory/memory.md`를 읽어 현재 진행 상황 파악
2. 기본 프로젝트 정보가 입력되어 있는지 확인
3. 미입력 시: "프로젝트 시작을 위해 기본 정보가 필요합니다. `/workflow-domain-definition` 명령어로 시작하시겠습니까?"
4. 완료 시: 현재 상태와 권장 다음 단계 안내

권장 작업 순서 (참고용):
1. 도메인 정의 (`/workflow-domain-definition`)
2. 각 기능마다 반복:
   - 기능 명세 작성 (`/workflow-feature-spec [Feature ID]`)
   - (필요시) UI 구현 (`/workflow-ui [Feature ID]`)
   - 비즈니스 로직 구현 (`/workflow-implement [Feature ID]`)
3. 시스템 통합 (`/workflow-integrate`)
4. E2E 테스트 (`/workflow-e2e`)
```

---

### `/workflow status`

**사용 시점**: 언제든지

**기능**:

- 전체 진행 상황 표시
- 완료/미완료 작업 목록
- 다음 권장 단계 안내

**사용법**:

```
/workflow status
```

**AI 실행 지침**:

```
다음 정보를 표시해주세요:

1. `.claude/docs/memory/memory.md`를 읽어 전체 진행 상황 파악
2. 다음 정보 표시:

**프로젝트 정보**:
- 프로젝트명: [값]
- 경로: [값]
- 기술 스택: [값]

**진행 상황**:
- ✅ 완료된 작업: [목록]
- 🔄 진행 중: [목록]
- ⏳ 대기 중: [목록]

**기능 진행 상황**:
- [기능 상태 표시]

**권장 다음 단계**:
- [다음 단계 안내]
```

---

### `/workflow update`

**사용 시점**: 메모리 파일 수동 업데이트가 필요할 때

**기능**:

- 현재 진행 상황 분석
- `memory.md` 파일 업데이트
- 완료된 작업 체크

**사용법**:

```
/workflow update
```

**AI 실행 지침**:

```
현재 상태를 메모리 파일에 업데이트해주세요:

1. `.claude/docs/memory/memory.md`를 읽어 현재 진행 상황 파악
2. 프로젝트의 현재 상태 분석:
   - 완료된 작업 확인
   - 현재 진행 중인 작업 파악
   - 파일 시스템 확인
3. `memory.md` 파일 업데이트:
   - 체크리스트 업데이트
   - 기능 진행 상황 테이블 업데이트
4. 업데이트된 내용을 사용자에게 보고
```

---

### `/workflow help`

**사용 시점**: 언제든지

**기능**:

- 사용 가능한 모든 명령어 표시
- 각 명령어 사용법 설명

**사용법**:

```
/workflow help
```

**AI 실행 지침**:

```
사용 가능한 모든 명령어를 표시해주세요:

**메인 명령어**:
- /workflow start - 프로젝트 시작
- /workflow status - 현재 상태 확인
- /workflow update - 메모리 수동 업데이트
- /workflow help - 도움말

**작업 명령어**:
- /workflow-domain-definition - 도메인 정의
- /workflow-feature-spec [Feature ID] - 기능 명세 작성 (요구사항 분석 및 계획)
- /workflow-ui common - 공통 UI 설계
- /workflow-ui [Feature ID] - 기능 UI 설계 (선택)
- /workflow-implement [Feature ID] - 기능 구현 (TDD)
- /workflow-integrate - 통합 및 리팩토링
- /workflow-e2e - E2E 테스트

**특수 명령어**:
- /workflow reset - 프로젝트 초기화

각 명령어에 대한 상세 설명을 표시하세요.
```

---

## 작업 명령어

### `/workflow-domain-definition` - 도메인 정의

📄 상세 문서: `@workflow-domain-definition.md`

### `/workflow-feature-spec [Feature ID]` - 기능 명세 작성

📄 상세 문서: `@workflow-feature-spec.md`

**기능**: 요구사항 분석, 리서치, 구현 계획 수립

### `/workflow-ui [scope]` - UI 설계 및 생성 (선택)

📄 상세 문서: `@workflow-ui.md`

**사용법**:

- `/workflow-ui common` - 공통 컴포넌트 확장
- `/workflow-ui [Feature ID]` - 기능별 UI 생성 (예: product-list, cart)

### `/workflow-implement [Feature ID]` - 기능 구현

📄 상세 문서: `@workflow-implement.md`

**필수 선행**: `/workflow-feature-spec [Feature ID]` 완료

### `/workflow-integrate` - 통합 및 리팩토링

📄 상세 문서: `@workflow-integrate.md`

### `/workflow-e2e` - E2E 테스트

📄 상세 문서: `@workflow-e2e.md`

---

## 특수 명령어

### `/workflow reset`

**사용 시점**: 프로젝트 초기화 시

**기능**:

- `memory.md` 초기화
- 모든 진행 상황 리셋
- 처음부터 다시 시작

**사용법**:

```
/workflow reset
```

**AI 실행 지침**:

```
프로젝트를 초기화해주세요:

1. `.claude/docs/memory/memory-template.md` 파일 읽기
2. `.claude/docs/memory/memory.md` 파일을 템플릿으로 덮어쓰기
3. 메시지 표시: "프로젝트가 초기화되었습니다. `/workflow start` 명령어로 시작해주세요."
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

### 기능 명세 작성 (요구사항 분석 및 계획)

```
/workflow-feature-spec product-list
/workflow-feature-spec cart
```

### UI 구현 (필요시)

```
/workflow-ui common          # 공통 컴포넌트 확장
/workflow-ui product-list    # ProductList UI
/workflow-ui cart            # Cart UI
```

### 기능 구현 (TDD)

```
/workflow-implement product-list
/workflow-implement cart
```

### 시스템 통합

```
/workflow-integrate
```

### E2E 테스트

```
/workflow-e2e
```

### 메모리 업데이트

```
/workflow update
```

### 도움말

```
/workflow help
```

---

## 명령어 실행 시 자동 작업

### 1. Memory.md 읽기

```
.claude/docs/memory/memory.md 파일을 읽어 다음을 파악:
- 기본 프로젝트 정보
- 기술 스택
- 도메인 목록
- 페이지 구조
- 진행 상황 체크리스트
- 기능 진행 상황
- 주요 결정사항
```

### 2. 워크플로우 파일 참조

```
해당 작업의 워크플로우 파일 참조:
- workflow-domain-definition.md
- workflow-ui.md
- workflow-implement.md
- workflow-integrate.md
- workflow-e2e.md
```

### 3. 작업 실행

```
워크플로우 파일의 프로세스를 따라 작업 수행:
- 단계별 체크리스트 확인
- 필요 시 사용자 입력 요청
- AI 작업 실행
- 사용자 검수 진행
```

### 4. 결과물 저장

```
지정된 경로에 결과물 저장:
- 각 워크플로우 파일의 "결과물" 섹션 참조
```

### 5. Memory.md 업데이트

```
memory.md 업데이트:
- 완료된 작업 체크박스 체크
- 기능 진행 상황 테이블 업데이트
```

---

## 권장 작업 순서 (참고용)

> 💡 **참고용**: 이 순서를 따르지 않아도 됩니다.

1. **도메인 정의** (`/workflow-domain-definition`)

   - 프로젝트 전체 도메인 모델 정의

2. **각 기능마다 반복**:

   1. **기능 명세 작성** (`/workflow-feature-spec [Feature ID]`)

      - 요구사항 분석
      - 리서치
      - 구현 계획 수립

   2. **UI 구현** (필요시, `/workflow-ui [Feature ID]`)

      - Figma 디자인이 있는 경우
      - UI 컴포넌트가 필요한 경우

   3. **비즈니스 로직 구현** (`/workflow-implement [Feature ID]`)
      - TDD 방식으로 구현
      - Mock 데이터 사용

3. **시스템 통합** (`/workflow-integrate`)

   - 기능 간 연결
   - 리팩토링

4. **E2E 테스트** (`/workflow-e2e`)
   - 전체 시나리오 테스트

---

## 파일 구조

### 명령어 파일

**메인 파일**:

- `.claude/commands/workflow.md` - 메인 명령어 및 전체 가이드
  - `/workflow start` - 프로젝트 시작
  - `/workflow status` - 현재 상태 확인
  - `/workflow update` - 메모리 수동 업데이트
  - `/workflow help` - 도움말
  - `/workflow reset` - 프로젝트 초기화

**작업 명령어 파일** (각각 전체 워크플로우 세부사항 포함):

- `.claude/commands/workflow-domain-definition.md` - 도메인 정의 상세 단계
- `.claude/commands/workflow-feature-spec.md` - 기능 명세 작성 (요구사항 분석 및 계획)
- `.claude/commands/workflow-ui.md` - UI 컴포넌트 개발 (공통/기능별, 선택)
- `.claude/commands/workflow-implement.md` - 기능 구현 (TDD 방식)
- `.claude/commands/workflow-integrate.md` - 시스템 통합 및 리팩토링
- `.claude/commands/workflow-e2e.md` - E2E 테스트 및 배포 준비

### 메모리 파일

- `.claude/docs/memory/memory.md` - 현재 프로젝트 진행 상황 추적
- `.claude/docs/memory/memory-template.md` - 신규 프로젝트용 메모리 템플릿
