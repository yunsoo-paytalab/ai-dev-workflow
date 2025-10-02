# AI 개발 워크플로우 커맨드 가이드

## 메인 커맨드

### `/workflow start`

**사용 시점**: 프로젝트 시작 시
**기능**:

- memory.md를 읽어서 현재 진행 상황 파악
- **요구사항 명세서 등 필수 입력 파일 존재 여부 확인**
- **입력 파일 부재 시 사용자에게 파일 첨부 요청 (임의 시작 금지)**
- 다음에 수행해야 할 단계 식별
- 해당 단계의 워크플로우 프롬프트 로드
- 필요한 파일들 자동 참조

**사용법**:

```
/workflow start
```

**⚠️ 중요**: 요구사항 명세서가 없으면 임의로 시작하지 않고 사용자에게 파일 첨부를 요청합니다.

**AI 실행 프롬프트**:

```
다음 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. **요구사항 명세서 등 필수 입력 파일 존재 여부를 확인해주세요**
3. **입력 파일이 없거나 비어있다면, 사용자에게 다음을 요청해주세요:**

"도메인 정의를 시작하기 위해 요구사항 명세서가 필요합니다.
다음 중 하나의 방법으로 요구사항을 제공해주세요:

1. 📄 요구사항 명세서 파일 첨부 (docs/requirements.md)
2. 📋 기존 시스템 아키텍처 문서 첨부 (docs/architecture.md)
3. 📝 비즈니스 프로세스 문서 첨부 (docs/business-process.md)
4. 💬 채팅에서 직접 요구사항 설명

요구사항이 제공되면 memory.md의 '입력 파일 경로' 섹션을 업데이트하고 도메인 정의를 진행하겠습니다."

4. **입력 파일이 존재하면 다음 단계를 식별해주세요**
5. 해당 단계의 워크플로우 프롬프트를 로드해주세요
6. 필요한 파일들을 자동으로 참조해주세요
7. AI 작업을 실행해주세요
8. 결과물을 memory.md의 경로에 저장해주세요
9. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [memory.md에서 읽어온 값]

특별 지시사항:
- **⚠️ 요구사항 명세서가 없으면 임의로 시작하지 마세요**
- Phase 1 "전체 도메인 정의" 완료 시, 식별된 도메인 목록을 memory.md에 동적 추가
- Phase 2, 3의 도메인별 작업 항목을 동적으로 생성
```

### `/workflow next`

**사용 시점**: 현재 단계 완료 후
**기능**:

- memory.md를 읽어서 현재 진행 상황 파악
- 완료된 단계 체크
- 다음 단계 식별 및 실행
- 필요한 파일들 자동 참조

**사용법**:

```
/workflow next
```

**AI 실행 프롬프트**:

```
다음 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. 완료된 단계를 체크해주세요
3. 다음 단계를 식별하고 실행해주세요
4. 필요한 파일들을 자동으로 참조해주세요
5. AI 작업을 실행해주세요
6. 결과물을 memory.md의 경로에 저장해주세요
7. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [memory.md에서 읽어온 값]

특별 지시사항:
- Phase 1 "전체 도메인 정의" 완료 시, 식별된 도메인 목록을 memory.md에 동적 추가
- Phase 2, 3의 도메인별 작업 항목을 동적으로 생성
```

### `/workflow status`

**사용 시점**: 언제든지
**기능**:

- memory.md를 읽어서 전체 진행 상황 표시
- 현재 Phase, Chat, 도메인, 단계 정보 표시
- 완료된 작업과 남은 작업 목록 표시

**사용법**:

```
/workflow status
```

**AI 실행 프롬프트**:

```
다음 정보를 표시해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 전체 진행 상황을 파악해주세요
2. 현재 Phase, 도메인, 단계 정보를 표시해주세요
3. 완료된 작업과 남은 작업 목록을 표시해주세요
4. 다음에 수행해야 할 단계를 안내해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [memory.md에서 읽어온 값]
```

## Phase별 커맨드

### `/workflow phase1`

**사용 시점**: Phase 1 (전체 설계) 작업 시
**기능**:

- Phase 1의 현재 Chat 식별
- Chat 1: 전체 도메인 정의 또는 Chat 2: 전체 UI 설계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
/workflow phase1
```

**AI 실행 프롬프트**:

```
Phase 1 (전체 설계) 작업을 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 Phase 1의 현재 Chat을 식별해주세요
2. Chat 1: 전체 도메인 정의 또는 Chat 2: 전체 UI 설계를 실행해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 Phase 1 상태:
- 도메인: [memory.md에서 읽어온 값]
- 단계: [memory.md에서 읽어온 값]
```

### `/workflow phase2 [domain]`

**사용 시점**: Phase 2 (도메인별 상세 작업) 작업 시
**기능**:

- 지정된 도메인의 현재 단계 식별
- 해당 도메인의 다음 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
/workflow phase2 domainA
/workflow phase2 domainB
/workflow phase2 domainC
```

**AI 실행 프롬프트**:

```
Phase 2 (도메인별 상세 작업) - [domain] 작업을 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 [domain]의 현재 단계를 식별해주세요
2. 해당 도메인의 다음 단계를 실행해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 [domain] 상태:
- Phase: Phase 2
- 도메인: [domain]
- 단계: [memory.md에서 읽어온 값]
```

### `/workflow phase3 [domain]`

**사용 시점**: Phase 3 (통합 및 구현) 작업 시
**기능**:

- 지정된 도메인의 현재 구현 단계 식별
- 해당 도메인의 다음 구현 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
/workflow phase3 domainA
/workflow phase3 domainB
/workflow phase3 domainC
```

**AI 실행 프롬프트**:

```
Phase 3 (통합 및 구현) - [domain] 작업을 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 [domain]의 현재 구현 단계를 식별해주세요
2. 해당 도메인의 다음 구현 단계를 실행해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 [domain] 상태:
- Phase: Phase 3
- 도메인: [domain]
- 단계: [memory.md에서 읽어온 값]
```

## 단계별 커맨드

### `/workflow domain [step]`

**사용 시점**: 도메인 정의 단계 작업 시
**기능**:

- 지정된 도메인 정의 단계 실행
- 1-1, 1-2, 1-3, 1-4 중 선택

**사용법**:

```
/workflow domain 1-1
/workflow domain 1-2
/workflow domain 1-3
/workflow domain 1-4
```

**AI 실행 프롬프트**:

```
도메인 정의 [step] 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. [step] 단계의 워크플로우 프롬프트를 로드해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [step]
```

### `/workflow ui [step]`

**사용 시점**: UI 설계 단계 작업 시
**기능**:

- 지정된 UI 설계 단계 실행
- 2-1, 2-2, 2-3, 2-4 중 선택

**사용법**:

```
/workflow ui 2-1
/workflow ui 2-2
/workflow ui 2-3
/workflow ui 2-4
```

**AI 실행 프롬프트**:

```
UI 설계 [step] 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. [step] 단계의 워크플로우 프롬프트를 로드해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [step]
```

### `/workflow test [step]`

**사용 시점**: 테스트 작성 단계 작업 시
**기능**:

- 지정된 테스트 작성 단계 실행
- 3-1, 3-2, 3-3, 3-4 중 선택

**사용법**:

```
/workflow test 3-1
/workflow test 3-2
/workflow test 3-3
/workflow test 3-4
```

**AI 실행 프롬프트**:

```
테스트 작성 [step] 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. [step] 단계의 워크플로우 프롬프트를 로드해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [step]
```

### `/workflow implement [step]`

**사용 시점**: 구현 단계 작업 시
**기능**:

- 지정된 구현 단계 실행
- 4-1, 4-2, 4-3, 4-4 중 선택

**사용법**:

```
/workflow implement 4-1
/workflow implement 4-2
/workflow implement 4-3
/workflow implement 4-4
```

**AI 실행 프롬프트**:

```
구현 [step] 단계를 수행해주세요:

1. .cursor/rules/workflows/00-memory.md 파일을 읽어서 현재 진행 상황을 파악해주세요
2. [step] 단계의 워크플로우 프롬프트를 로드해주세요
3. 필요한 파일들을 자동으로 참조해주세요
4. AI 작업을 실행해주세요
5. 결과물을 memory.md의 경로에 저장해주세요
6. memory.md를 업데이트해주세요

현재 작업 상태:
- Phase: [memory.md에서 읽어온 값]
- 도메인: [memory.md에서 읽어온 값]
- 단계: [step]
```

## 특수 커맨드

### `/workflow reset`

**사용 시점**: 프로젝트 초기화 시
**기능**:

- memory.md 초기화
- 모든 진행 상황 리셋
- 처음부터 시작

**사용법**:

```
/workflow reset
```

**AI 실행 프롬프트**:

```
프로젝트를 초기화해주세요:

1. .cursor/rules/workflows/00-memory-template.md 파일을 읽어주세요
2. .cursor/rules/workflows/00-memory.md 파일을 템플릿으로 덮어써주세요
3. 모든 진행 상황을 리셋해주세요
4. 처음부터 시작할 수 있도록 설정해주세요

초기화 완료 후:
- Phase: Phase 1
- Chat: Chat 1
- 도메인: 전체
- 단계: 1-1) 도메인 모델 정의
```

### `/workflow help`

**사용 시점**: 언제든지
**기능**:

- 사용 가능한 모든 커맨드 목록 표시
- 각 커맨드의 사용법 설명

**사용법**:

```
/workflow help
```

**AI 실행 프롬프트**:

```
사용 가능한 모든 커맨드를 표시해주세요:

1. 메인 커맨드 목록
2. Phase별 커맨드 목록
3. 단계별 커맨드 목록
4. 도메인별 커맨드 목록
5. 특수 커맨드 목록
6. 각 커맨드의 사용법 설명
```

## 커맨드 실행 흐름

### 1. 메인 커맨드 실행

```
/workflow start
↓
memory.md 읽기
↓
현재 진행 상황 파악
↓
요구사항 명세서 등 필수 입력 파일 확인
↓
입력 파일 부재 시 → 사용자에게 파일 첨부 요청 (임의 시작 금지)
↓
입력 파일 존재 시 → 다음 단계 식별
↓
해당 단계의 워크플로우 프롬프트 로드
↓
필요한 파일들 자동 참조
↓
AI 작업 실행
↓
결과물 저장
↓
memory.md 업데이트
```

### 2. 단계별 커맨드 실행

```
/workflow domain 1-1
↓
memory.md 읽기
↓
1-1 단계 워크플로우 프롬프트 로드
↓
필요한 파일들 자동 참조
↓
AI 작업 실행
↓
결과물 저장
↓
memory.md 업데이트
```

## 사용 예시

### 프로젝트 시작

```
/workflow start
```

### 현재 상태 확인

```
/workflow status
```

### 다음 단계 진행

```
/workflow next
```

### 특정 단계 실행

```
/workflow domain 1-1
/workflow ui 2-2
/workflow test 3-1
/workflow implement 4-1
```

### 특정 도메인 작업

```
/workflow phase2 domainA
/workflow phase3 domainB
```

### 도움말

```
/workflow help
```

## 커맨드 실행 시 자동 수행 작업

### 1. Memory.md 읽기

```
.cursor/rules/workflows/00-memory.md 파일을 읽어서 다음 정보를 파악해주세요:
- 현재 Phase
- 현재 Chat
- 현재 도메인
- 현재 단계
- 완료된 작업 목록
- 남은 작업 목록
- 파일 경로 정보
```

### 2. 다음 단계 식별

```
현재 진행 상황을 바탕으로 다음에 수행해야 할 단계를 식별해주세요:
- 현재 단계가 완료되었는지 확인
- 다음 단계가 무엇인지 결정
- 해당 단계의 워크플로우 프롬프트 로드
```

### 3. 필요한 파일 자동 참조

```
memory.md의 파일 경로 정보를 참조하여 필요한 파일들을 자동으로 로드해주세요:
- 입력 파일 경로에서 필요한 파일들 로드
- 참조 파일 경로에서 Phase별 파일들 로드
- 이전 단계 결과물 파일들 로드
```

### 4. AI 작업 실행

```
해당 단계의 워크플로우 프롬프트에 따라 AI 작업을 실행해주세요:
- 단계별 체크리스트 확인
- AI 요청 내용 실행
- 품질 기준 검증
```

### 5. 결과물 저장

```
결과물을 memory.md의 결과물 경로에 저장해주세요:
 - 워크플로우별 결과물 경로는 각 워크플로우의 프롬프트를 참고
```

### 6. Memory.md 업데이트

```
memory.md를 업데이트해주세요:
- 완료된 단계 체크
- 결과물 파일 경로 기록
- 다음 단계 안내
- 현재 작업 상태 업데이트
```
