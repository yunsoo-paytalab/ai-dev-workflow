# 메모리 Hook 스크립트 가이드

## 개요

메모리 시스템은 Hook 스크립트를 통해 자동화됩니다. 대부분의 경우 자동으로 실행되지만, 필요시 수동으로 실행할 수 있습니다.

## Hook 스크립트 목록

| 스크립트           | 설명                   | 자동 실행          |
| ------------------ | ---------------------- | ------------------ |
| memory-init.cjs    | 프로젝트 메모리 초기화 | 워크플로우 시작 시 |
| memory-sync.cjs    | 메모리 동기화          | 주요 작업 완료 시  |
| memory-status.cjs  | 메모리 상태 확인       | -                  |
| memory-list.cjs    | 메모리 목록 조회       | -                  |
| memory-switch.cjs  | 프로젝트 메모리 전환   | -                  |
| memory-cleanup.cjs | 미사용 메모리 정리     | -                  |
| memory-remove.cjs  | 특정 메모리 삭제       | -                  |

## 사용법

### memory-init.cjs

프로젝트의 메모리를 초기화합니다.

```bash
node .claude/hooks/memory-init.cjs
```

**동작:**

1. 프로젝트 ID 생성/확인
2. `~/.claude-aidev-memory/projects/{id}/memory.md` 생성
3. `.claude/docs/memory/.memory-ref` 경로 기록

### memory-sync.cjs

메모리 파일을 동기화합니다.

```bash
node .claude/hooks/memory-sync.cjs [message]
```

**인자:**

- `message` (선택): 동기화 메시지

**동작:**

1. 현재 진행 상황 업데이트
2. 타임스탬프 기록
3. 변경사항 저장

### memory-status.cjs

현재 메모리 상태를 확인합니다.

```bash
node .claude/hooks/memory-status.cjs
```

**출력:**

- 현재 프로젝트 ID
- 메모리 파일 경로
- 마지막 업데이트 시간
- 메모리 크기

### memory-list.cjs

모든 프로젝트 메모리를 조회합니다.

```bash
node .claude/hooks/memory-list.cjs
```

**출력:**

- 프로젝트 ID 목록
- 각 프로젝트의 마지막 업데이트 시간

### memory-switch.cjs

다른 프로젝트의 메모리로 전환합니다.

```bash
node .claude/hooks/memory-switch.cjs [project-id]
```

**인자:**

- `project-id`: 전환할 프로젝트 ID

### memory-cleanup.cjs

오래된 미사용 메모리를 정리합니다.

```bash
node .claude/hooks/memory-cleanup.cjs
```

### memory-remove.cjs

특정 프로젝트의 메모리를 삭제합니다.

```bash
node .claude/hooks/memory-remove.cjs [project-id]
```

## 자동 실행 설정

Hook은 `.claude/settings.json`에서 설정됩니다:

```json
{
  "hooks": {
    "PreToolExecution": [...],
    "PostToolExecution": [...]
  }
}
```

## 워크플로우 명령어

커맨드에서 워크플로우 진행 상황을 기록할 때 사용합니다.

### workflow-complete

워크플로우 완료를 기록합니다. 사용자 승인 후 호출합니다.

```bash
node .claude/hooks/memory-sync.cjs workflow-complete [workflow-name]
```

**인자:**

- `workflow-name`: 완료된 워크플로우 이름 (domain-definition, feature-detail, task-point, legacy-profile 등)

**동작:**

1. memory.md의 진행 상황 업데이트
2. 워크플로우 완료 타임스탬프 기록
3. 다음 단계 안내

### sync-progress

현재 프로젝트 상태를 메모리에 동기화합니다.

```bash
node .claude/hooks/memory-sync.cjs sync-progress
```

**동작:**

1. .claude/docs/ 내 문서 존재 여부 확인
2. progress.json 업데이트
3. memory.md 진행 상황 섹션 갱신

### update-feature-status

특정 Feature의 상태를 업데이트합니다.

```bash
node .claude/hooks/memory-sync.cjs update-feature-status [featureId] [status]
```

**인자:**

- `featureId`: Feature ID (예: AUTH-001)
- `status`: 상태 값 (pending, in_progress, spec_done, implemented, tested)

**동작:**

1. progress.json에서 해당 Feature 상태 업데이트
2. 전체 진행률 재계산
3. memory.md 동기화

## 주의사항

1. **자동 처리 우선** - 대부분의 경우 Hook이 자동으로 처리
2. **수동 실행 최소화** - 필요한 경우에만 수동 실행
3. **삭제 주의** - memory-remove.cjs는 복구 불가
