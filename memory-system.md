# 워크플로우 메모리 관리 시스템 분석

> 작성일: 2025-12-23

## 1. 아키텍처 개요

```
~/.claude-aidev-memory/                 # 중앙 저장소 (홈 디렉토리)
├── config.json                         # 전역 설정
├── index.json                          # 프로젝트 인덱스
└── projects/
    └── {memory-id}/                    # 프로젝트별 메모리
        ├── meta.json                   # 메타정보 (세션 수, 현재 워크플로우 등)
        ├── memory.md                   # 사람 읽기용 진행 상황
        ├── progress.json               # 구조화된 진행 데이터
        └── sessions/                   # 대화 세션 기록

.claude/docs/memory/                    # 프로젝트 내부 (심볼릭 링크)
├── .memory-ref                         # 연결된 메모리 ID
└── memory.md → 중앙 저장소 심볼릭 링크
```

## 2. 핵심 구성 요소

### 2.1 Hook 기반 자동 동기화

설정 파일: `.claude/settings.json`

| Hook 이벤트        | 트리거 시점      | 처리 내용                                       |
| ------------------ | ---------------- | ----------------------------------------------- |
| `UserPromptSubmit` | 사용자 입력 시   | 워크플로우 시작 감지, 세션 파일 생성, 대화 기록 |
| `Stop`             | Claude 응답 완료 | 응답 내용을 세션 파일에 기록                    |
| `SessionEnd`       | 세션 종료        | 워크플로우 자동 완료, 정리 규칙 적용            |
| `PreCompact`       | 컨텍스트 압축 전 | 세션 상태 저장 (pendingResume)                  |

### 2.2 데이터 저장 구조

#### `progress.json` - 핵심 진행 데이터

```json
{
  "version": "1.0",
  "lastUpdated": "2024-01-16T15:30:00Z",
  "setup": {
    "workflows": {
      "legacy-profile": { "status": "done", "completedAt": "2024-01-10" },
      "domain-definition": { "status": "done", "completedAt": "2024-01-12" },
      "task-point": { "status": "in_progress", "startedAt": "2024-01-15" }
    },
    "custom": []
  },
  "phases": {
    "phase1": {
      "name": "기반 구축",
      "status": "in_progress",
      "totalPoints": 88,
      "completedPoints": 25,
      "features": ["COMMON-001", "AUTH-001"]
    }
  },
  "domains": {
    "AUTH": {
      "name": "인증",
      "status": "in_progress",
      "totalFeatures": 2,
      "completedFeatures": 0
    }
  },
  "features": {
    "AUTH-001": {
      "name": "사용자 인증",
      "category": "Core",
      "status": "in_progress",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "completedAt": null,
      "note": "로그인 구현 중"
    }
  },
  "tasks": {
    "AUTH-001-001": {
      "name": "Users 테이블 스키마 설계",
      "featureId": "AUTH-001",
      "priority": "high",
      "dependencies": [],
      "status": "done",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-15T14:00:00Z",
      "completedAt": "2024-01-15T14:00:00Z",
      "note": ""
    }
  }
}
```

#### `memory.md` - 사람 읽기용 마크다운

- 워크플로우 체크리스트
- Feature별 진행 상황
- 핵심 결정사항 기록

#### `meta.json` - 메타 정보

```json
{
  "id": "my-app-v2",
  "projectPath": "/Users/user/Projects/my-app",
  "projectName": "my-app",
  "createdAt": "2024-01-15T10:00:00Z",
  "lastAccess": "2024-01-16T15:30:00Z",
  "totalSessions": 12,
  "currentWorkflow": "domain-definition",
  "workflowStartedAt": "2024-01-16T10:00:00Z",
  "activeSessions": {
    "session-uuid": {
      "file": "2024-01-16_main_abc123.md",
      "workflow": "domain-definition",
      "startedAt": "2024-01-16T10:00:00Z"
    }
  }
}
```

## 3. 주요 기능

### 3.1 서브 커맨드 (`/workflow-memory`)

| 커맨드           | 설명                             |
| ---------------- | -------------------------------- |
| `init [id]`      | 새 메모리 생성 및 프로젝트 연결  |
| `list`           | 사용 가능한 메모리 목록          |
| `switch [id]`    | 다른 메모리로 전환               |
| `status`         | 현재 메모리 상태 표시            |
| `update`         | progress.json → memory.md 동기화 |
| `remove [id]`    | 메모리 삭제                      |
| `cleanup`        | 오래된 세션 정리                 |
| `search [query]` | 세션 내용 검색                   |

### 3.2 자동화 처리 (`memory-sync.cjs`)

핵심 스크립트: `.claude/hooks/memory-sync.cjs`

**주요 함수:**

| 함수                        | 호출 시점          | 동작                                       |
| --------------------------- | ------------------ | ------------------------------------------ |
| `handleUserInput()`         | `UserPromptSubmit` | 워크플로우 감지, 세션 파일 생성, 입력 기록 |
| `handleAssistantResponse()` | `Stop`             | Claude 응답을 세션 파일에 기록             |
| `handleSessionEnd()`        | `SessionEnd`       | 워크플로우 자동 완료, 정리 규칙 적용       |
| `handleCompact()`           | `PreCompact`       | pendingResume 설정                         |
| `handleWorkflowComplete()`  | 수동 호출          | 사용자 승인 시 워크플로우 완료 처리        |
| `handleSyncProgress()`      | 수동 호출          | 문서 파싱 → progress.json 업데이트         |

**워크플로우 감지 로직:**

```javascript
// /workflow-* 명령 감지 시 세션 시작
const workflowMatch = prompt.match(/^\/workflow-(\S+)/);
if (workflowMatch && sessionId) {
  const workflowName = workflowMatch[1];
  // 세션 파일 생성, 워크플로우 상태 업데이트
}
```

### 3.3 유틸리티 함수 (`utils.cjs`)

핵심 라이브러리: `.claude/hooks/lib/utils.cjs`

**Progress 관리:**

| 함수                     | 설명                             |
| ------------------------ | -------------------------------- |
| `readProgress()`         | progress.json 읽기               |
| `writeProgress()`        | progress.json 쓰기               |
| `addFeature()`           | Feature 추가/수정                |
| `addTask()`              | Task 추가/수정                   |
| `updateFeatureStatus()`  | Feature 상태 업데이트            |
| `updateTaskStatus()`     | Task 상태 업데이트               |
| `recalculateProgress()`  | 도메인/Phase 진행률 재계산       |
| `syncProgressToMemory()` | progress.json → memory.md 동기화 |

**문서 파싱:**

| 함수                                | 설명                                      |
| ----------------------------------- | ----------------------------------------- |
| `parseFeatureListToProgress()`      | feature-list.md → progress.json 변환      |
| `parseDomainDefinitionToProgress()` | domain-definition.md → progress.json 변환 |

### 3.4 크로스 플랫폼 지원

```javascript
// 심볼릭 링크 생성 (크로스 플랫폼)
function createSymlink(target, linkPath) {
  if (IS_WINDOWS) {
    try {
      fs.symlinkSync(target, linkPath, "file"); // 1. 심볼릭 링크 시도
    } catch {
      try {
        fs.linkSync(target, linkPath); // 2. 하드링크 시도
      } catch {
        fs.copyFileSync(target, linkPath); // 3. 파일 복사 폴백
      }
    }
  } else {
    fs.symlinkSync(target, linkPath); // macOS/Linux
  }
}
```

## 4. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────┐
│                        워크플로우 실행                               │
│                    (/workflow-domain-definition)                    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     UserPromptSubmit Hook                           │
│  • 워크플로우 감지 (/workflow-* 패턴 매칭)                           │
│  • 세션 파일 생성 (sessions/2024-01-16_main_abc123.md)              │
│  • meta.json 업데이트 (currentWorkflow, activeSessions)             │
│  • progress.json 업데이트 (workflows.status = "in_progress")        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         대화 진행                                    │
│  • UserPromptSubmit: 사용자 입력 → 세션 파일에 기록                  │
│  • Stop: Claude 응답 → 세션 파일에 기록 (요약 + 도구 사용 태그)      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      워크플로우 완료                                 │
│  (자동: SessionEnd / 수동: /workflow-memory complete 호출)           │
│  • completeWorkflow(): progress.json 워크플로우 상태 = "done"        │
│  • parseFeatureListToProgress(): feature-list.md 파싱               │
│  • parseDomainDefinitionToProgress(): domain-definition.md 파싱     │
│  • recalculateProgress(): 도메인/Phase 진행률 재계산                 │
│  • syncProgressToMemory(): progress.json → memory.md 동기화          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       SessionEnd Hook                               │
│  • syncMemoryToCentral(): 로컬 → 중앙 저장소 동기화 (복사 모드)      │
│  • applyCleanupRules(): 정리 규칙 적용                              │
│    - maxSessionsPerProject: 50 (초과 시 오래된 것 삭제)             │
│    - maxSessionAgeDays: 90 (초과 시 삭제)                           │
│  • meta.json 업데이트 (totalSessions++, lastAccess)                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. 설정 파일

### `~/.claude-aidev-memory/config.json`

```json
{
  "version": "1.0",
  "retention": {
    "maxSessionsPerProject": 50,
    "maxSessionAgeDays": 90
  },
  "summarization": {
    "enabled": true,
    "maxLength": 500
  },
  "session": {
    "maxResponseLength": 2000
  },
  "defaultProgress": {
    "setup": {
      "workflows": {},
      "custom": []
    },
    "phases": {},
    "domains": {},
    "features": {},
    "tasks": {}
  }
}
```

## 6. 에이전트 연동

### `memory-manager` 에이전트

파일: `.claude/agents/memory-manager.md`

**역할:** 주요 결정사항을 memory.md에 기록

**호출 시점:**

- 기술적 결정이 내려졌을 때 (라이브러리 선택, 아키텍처 결정)
- 중요한 트레이드오프가 있었을 때
- 프로젝트 컨벤션이 확정되었을 때

**호출하지 않아도 되는 상황:**

- 단순 구현 작업
- 워크플로우 진행 상황 업데이트 (Hook에서 자동 처리)
- 세션 기록 (Hook에서 자동 처리)

## 7. 강점과 특징

| 강점                      | 설명                                        |
| ------------------------- | ------------------------------------------- |
| **세션 간 컨텍스트 유지** | 중앙 저장소로 여러 세션에서 진행 상황 공유  |
| **자동 문서화**           | Hook으로 대화 내용 자동 기록                |
| **구조화된 진행 추적**    | JSON 기반으로 프로그래매틱 접근 가능        |
| **프로젝트 분리**         | 메모리 ID로 여러 프로젝트 독립 관리         |
| **정리 규칙**             | 자동으로 오래된 세션 삭제 (기본: 50개/90일) |
| **크로스 플랫폼**         | Windows/macOS/Linux 모두 지원               |
| **이중 저장**             | 사람 읽기용(md) + 기계 읽기용(json) 병행    |

## 8. 주의사항

1. **메모리 연결 필수**: `/workflow-memory init` 실행 전에는 메모리 기능 비활성화
2. **심볼릭 링크**: Windows에서 개발자 모드 필요 (없으면 복사 모드로 동작)
3. **수동 업데이트**: `/workflow-memory update`로 프로젝트 상태 수동 동기화 가능
4. **워크플로우 자동 완료**: 세션 종료 시 진행 중인 워크플로우가 자동 완료됨

## 9. 관련 파일 목록

```
.claude/
├── agents/
│   └── memory-manager.md           # 메모리 매니저 에이전트
├── commands/
│   └── workflow-memory.md          # 메모리 관리 커맨드
├── hooks/
│   ├── memory-sync.cjs             # 메인 동기화 스크립트
│   ├── memory-init.cjs             # 메모리 초기화
│   ├── memory-list.cjs             # 메모리 목록
│   ├── memory-switch.cjs           # 메모리 전환
│   ├── memory-status.cjs           # 메모리 상태
│   ├── memory-remove.cjs           # 메모리 삭제
│   ├── memory-cleanup.cjs          # 세션 정리
│   └── lib/
│       ├── utils.cjs               # 유틸리티 함수
│       └── config.defaults.json    # 기본 설정값
├── settings.json                   # Hook 설정
└── docs/
    └── memory/
        ├── .memory-ref             # 연결된 메모리 ID
        └── memory.md               # 심볼릭 링크
```
