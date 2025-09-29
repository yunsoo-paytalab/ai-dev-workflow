# 개발 프로세스 커맨드 가이드

## 메인 커맨드

### `@workflow start`

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
@workflow start
```

**⚠️ 중요**: 요구사항 명세서가 없으면 임의로 시작하지 않고 사용자에게 파일 첨부를 요청합니다.

### `@workflow next`

**사용 시점**: 현재 단계 완료 후
**기능**:

- memory.md를 읽어서 현재 진행 상황 파악
- 완료된 단계 체크
- 다음 단계 식별 및 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow next
```

### `@workflow status`

**사용 시점**: 언제든지
**기능**:

- memory.md를 읽어서 전체 진행 상황 표시
- 현재 Phase, Chat, 도메인, 단계 정보 표시
- 완료된 작업과 남은 작업 목록 표시

**사용법**:

```
@workflow status
```

## Phase별 커맨드

### `@workflow phase1`

**사용 시점**: Phase 1 (전체 설계) 작업 시
**기능**:

- Phase 1의 현재 Chat 식별
- Chat 1: 전체 도메인 정의 또는 Chat 2: 전체 UI 설계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow phase1
```

### `@workflow phase2 [domain]`

**사용 시점**: Phase 2 (도메인별 상세 작업) 작업 시
**기능**:

- 지정된 도메인의 현재 단계 식별
- 해당 도메인의 다음 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow phase2 domainA
@workflow phase2 domainB
@workflow phase2 domainC
```

### `@workflow phase3 [domain]`

**사용 시점**: Phase 3 (통합 및 구현) 작업 시
**기능**:

- 지정된 도메인의 현재 구현 단계 식별
- 해당 도메인의 다음 구현 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow phase3 domainA
@workflow phase3 domainB
@workflow phase3 domainC
```

## 단계별 커맨드

### `@workflow domain [step]`

**사용 시점**: 도메인 정의 단계 작업 시
**기능**:

- 지정된 도메인 정의 단계 실행
- 1-1, 1-2, 1-3, 1-4 중 선택

**사용법**:

```
@workflow domain 1-1
@workflow domain 1-2
@workflow domain 1-3
@workflow domain 1-4
```

### `@workflow ui [step]`

**사용 시점**: UI 설계 단계 작업 시
**기능**:

- 지정된 UI 설계 단계 실행
- 2-1, 2-2, 2-3, 2-4 중 선택

**사용법**:

```
@workflow ui 2-1
@workflow ui 2-2
@workflow ui 2-3
@workflow ui 2-4
```

### `@workflow test [step]`

**사용 시점**: 테스트 작성 단계 작업 시
**기능**:

- 지정된 테스트 작성 단계 실행
- 3-1, 3-2, 3-3, 3-4 중 선택

**사용법**:

```
@workflow test 3-1
@workflow test 3-2
@workflow test 3-3
@workflow test 3-4
```

### `@workflow implement [step]`

**사용 시점**: 구현 단계 작업 시
**기능**:

- 지정된 구현 단계 실행
- 4-1, 4-2, 4-3, 4-4 중 선택

**사용법**:

```
@workflow implement 4-1
@workflow implement 4-2
@workflow implement 4-3
@workflow implement 4-4
```

## 도메인별 커맨드

### `@workflow domainA`

**사용 시점**: 도메인 A 작업 시
**기능**:

- 도메인 A의 현재 단계 식별
- 다음 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow domainA
```

### `@workflow domainB`

**사용 시점**: 도메인 B 작업 시
**기능**:

- 도메인 B의 현재 단계 식별
- 다음 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow domainB
```

### `@workflow domainC`

**사용 시점**: 도메인 C 작업 시
**기능**:

- 도메인 C의 현재 단계 식별
- 다음 단계 실행
- 필요한 파일들 자동 참조

**사용법**:

```
@workflow domainC
```

## 특수 커맨드

### `@workflow reset`

**사용 시점**: 프로젝트 초기화 시
**기능**:

- memory.md 초기화
- 모든 진행 상황 리셋
- 처음부터 시작

**사용법**:

```
@workflow reset
```

### `@workflow help`

**사용 시점**: 언제든지
**기능**:

- 사용 가능한 모든 커맨드 목록 표시
- 각 커맨드의 사용법 설명

**사용법**:

```
@workflow help
```

## 커맨드 실행 흐름

### 1. 메인 커맨드 실행

```
@workflow start
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
@workflow domain 1-1
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

### 3. 도메인별 커맨드 실행

```
@workflow domainA
↓
memory.md 읽기
↓
도메인 A의 현재 단계 식별
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

## 사용 예시

### 프로젝트 시작

```
@workflow start
```

### 현재 상태 확인

```
@workflow status
```

### 다음 단계 진행

```
@workflow next
```

### 특정 단계 실행

```
@workflow domain 1-1
@workflow ui 2-2
@workflow test 3-1
@workflow implement 4-1
```

### 특정 도메인 작업

```
@workflow domainA
@workflow phase2 domainB
@workflow phase3 domainC
```

### 도움말

```
@workflow help
```
