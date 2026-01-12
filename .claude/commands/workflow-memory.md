---
name: workflow-memory
description: 프로젝트 전역 메모리를 관리하는 커맨드
version: 3.2.1
---

# /workflow-memory

프로젝트 메모리를 관리합니다.

## 구조

```
~/.claude-aidev-memory/           # 중앙 저장소
├── config.json
├── index.json
└── projects/{id}/
    ├── meta.json
    ├── memory.md
    ├── progress.json
    └── sessions/

.claude/docs/memory/              # 프로젝트 내부
├── .memory-ref                   # 연결된 메모리 ID
└── memory.md → 심볼릭 링크
```

## 서브 커맨드

### `/workflow-memory init [id]`

새 메모리 생성 및 현재 프로젝트에 연결

### `/workflow-memory list`

사용 가능한 모든 메모리 목록 표시

### `/workflow-memory switch [id]`

다른 메모리로 전환

### `/workflow-memory status`

현재 연결된 메모리의 상세 상태 표시

### `/workflow-memory update` ⭐

현재 프로젝트 상태를 전역 메모리에 완전 동기화

- meta.json, progress.json, memory.md 업데이트
- index.json lastAccess 갱신

### `/workflow-memory complete [workflow-name]`

특정 워크플로우를 완료로 표시

- `workflow-name`: 완료할 워크플로우 이름
  - `domain-definition`, `feature-detail`, `task-point`, `legacy-profile` 등
- progress.json에 워크플로우 완료 상태 기록
- memory.md 진행 상황 섹션 업데이트

### `/workflow-memory remove [id]`

메모리 삭제 (`--all` 옵션: 모든 메모리 삭제)

### `/workflow-memory search [query]`

세션 내용 검색 (`--all` 옵션: 모든 메모리에서 검색)

### `/workflow-memory cleanup`

정리 규칙 수동 실행

## Hook 연동

- **SessionStart**: 현재 메모리 로드, 최근 세션 요약 주입
- **SessionEnd**: 세션 요약 생성, memory.md 업데이트, 정리 규칙 적용
