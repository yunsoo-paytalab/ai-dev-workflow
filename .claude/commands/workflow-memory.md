# /workflow-memory

프로젝트 메모리를 관리합니다. 중앙 저장소(`~/.claude-memory/`)를 사용하여 세션 간 컨텍스트를 유지합니다.

## 개요

```
~/.claude-memory/                    # 중앙 저장소
├── config.json                      # 전역 설정
├── index.json                       # 프로젝트 인덱스
└── projects/
    └── {memory-id}/                 # 사용자 지정 ID
        ├── meta.json                # 메타정보
        ├── memory.md                # 프로젝트 메모리 (사람 읽기용)
        ├── progress.json            # Task/Feature 진행 상태 (CLI용)
        └── sessions/                # 세션 기록

.claude/docs/memory/                 # 프로젝트 내부 (gitignore)
├── .memory-ref                      # 연결된 메모리 ID
└── memory.md → 심볼릭 링크          # 중앙 저장소 연결
```

### progress.json 구조 (Feature/Task 정의 + 상태 통합)

```json
{
  "version": "1.0",
  "lastUpdated": "2024-01-16T15:30:00Z",
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
    },
    "AUTH-001-002": {
      "name": "JWT 유틸리티 구현",
      "featureId": "AUTH-001",
      "priority": "high",
      "dependencies": ["AUTH-001-001"],
      "status": "in_progress",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "completedAt": null,
      "note": ""
    }
  }
}
```

**역할 분리:**

- `progress.json`: Feature/Task 정의 + 진행 상태 (CLI의 단일 데이터 소스)
- `memory.md`: 컨텍스트, 결정사항, 메모 (사람 읽기용)

> ⚠️ `feature-list.md`는 더 이상 사용하지 않습니다. 모든 Feature/Task 정보는 `progress.json`에서 관리됩니다.

---

## 서브 커맨드

### `/workflow-memory init [id]`

새 메모리를 생성하고 현재 프로젝트에 연결합니다.

**사용법:**

```bash
/workflow-memory init my-app-v2      # ID 직접 지정
/workflow-memory init                # 대화형 입력
```

**AI 실행 지침:**

```
1. ID가 제공되지 않으면 사용자에게 입력 요청
2. ~/.claude-memory/projects/{id}/ 디렉토리 생성
3. 초기 파일 생성:
   - meta.json: 프로젝트 경로, 생성일, 이름
   - memory.md: 템플릿에서 복사
   - sessions/: 빈 디렉토리
4. index.json에 프로젝트 등록
5. .claude/docs/memory/.memory-ref 파일 생성 (ID 저장)
6. .claude/docs/memory/memory.md → 중앙 저장소 심볼릭 링크 생성
7. 결과 메시지 출력

출력 예시:
✓ 메모리 '{id}' 생성됨
✓ 심볼릭 링크 연결됨
  경로: ~/.claude-memory/projects/{id}/
```

---

### `/workflow-memory list`

사용 가능한 모든 메모리 목록을 표시합니다.

**사용법:**

```bash
/workflow-memory list
```

**AI 실행 지침:**

```
1. ~/.claude-memory/index.json 읽기
2. 각 프로젝트의 meta.json에서 상세 정보 수집
3. 현재 연결된 메모리 확인 (.memory-ref)
4. 테이블 형식으로 출력

출력 예시:
사용 가능한 메모리:
  ID              최근 접근       세션 수   상태
  ─────────────────────────────────────────────
→ my-app-v2      2024-01-16      12       현재 연결됨
  my-app-legacy  2024-01-10      8        -
  other-project  2023-12-20      3        -

총 3개 메모리
```

---

### `/workflow-memory switch [id]`

다른 메모리로 전환합니다.

**사용법:**

```bash
/workflow-memory switch my-app-legacy   # ID 직접 지정
/workflow-memory switch                  # 대화형 선택
```

**AI 실행 지침:**

```
1. ID가 제공되지 않으면 /workflow-memory list 실행 후 선택 요청
2. 해당 메모리 존재 여부 확인
3. .memory-ref 파일 업데이트
4. 기존 심볼릭 링크 삭제 후 새로 생성
5. 전환된 메모리 요약 출력

출력 예시:
✓ 메모리 '{id}'로 전환됨
  마지막 세션: 2024-01-10
  기능 상태: AUTH-001 완료, AUTH-002 대기
```

---

### `/workflow-memory status`

현재 연결된 메모리의 상세 상태를 표시합니다.

**사용법:**

```bash
/workflow-memory status
```

**AI 실행 지침:**

```
1. .memory-ref에서 현재 메모리 ID 확인
2. 연결되지 않았으면 안내 메시지 출력
3. 연결되었으면 상세 정보 수집:
   - meta.json: 생성일, 프로젝트 정보
   - memory.md: 현재 상태, 기능 목록
   - sessions/: 세션 수, 최근 세션 목록
4. 포맷팅하여 출력

출력 예시:
📁 메모리: my-app-v2
📍 경로: ~/.claude-memory/projects/my-app-v2/
📊 세션: 12개
💾 메모리 크기: 2.3KB

📈 진행 상태 (progress.json):
  Features: 1 완료, 1 진행중, 1 대기
  Tasks: 5/18 완료 (28%)

최근 세션:
  2024-01-16 15:30  회원가입 구현 진행
  2024-01-16 10:00  로그인 기능 완료
  2024-01-15 14:00  프로젝트 초기 설정

기능 현황:
  ✅ AUTH-001 로그인      완료
  🔄 AUTH-002 회원가입    진행중
  ⏳ DASH-001 대시보드    대기
```

---

### `/workflow-memory remove [id]`

메모리를 삭제합니다.

**사용법:**

```bash
/workflow-memory remove my-app-legacy
```

**AI 실행 지침:**

```
1. 해당 메모리 존재 여부 확인
2. 삭제 대상 정보 표시 (세션 수, 생성일 등)
3. 사용자 확인 요청 (AskUserQuestion 사용)
4. 확인 시:
   - ~/.claude-memory/projects/{id}/ 디렉토리 삭제
   - index.json에서 제거
   - 현재 연결된 메모리였다면 .memory-ref 및 심볼릭 링크 삭제
5. 결과 메시지 출력

출력 예시:
⚠️  'my-app-legacy' 메모리를 삭제합니다.
    - 세션 8개
    - 생성일: 2023-12-01

[사용자 확인 후]
✓ 메모리 'my-app-legacy' 삭제됨
```

---

### `/workflow-memory export [id]`

메모리를 파일로 내보냅니다.

**사용법:**

```bash
/workflow-memory export my-app-v2           # 특정 메모리
/workflow-memory export                      # 현재 연결된 메모리
```

**AI 실행 지침:**

```
1. ID 미지정 시 현재 연결된 메모리 사용
2. 내보내기 대상:
   - memory.md
   - sessions/ (모든 세션 파일)
   - meta.json
3. ZIP 파일로 압축
4. 저장 경로: ~/Downloads/{id}_{날짜}.zip

출력 예시:
✓ 내보내기 완료: ~/Downloads/my-app-v2_2024-01-16.zip
  - memory.md
  - sessions/ (12개 파일)
  - meta.json
```

---

### `/workflow-memory search [query]`

세션 내용을 검색합니다.

**사용법:**

```bash
/workflow-memory search "JWT 토큰"
/workflow-memory search "로그인" --all      # 모든 메모리에서 검색
```

**AI 실행 지침:**

```
1. 현재 메모리의 sessions/ 및 memory.md 검색
2. --all 옵션 시 모든 메모리 검색
3. 매칭된 내용과 파일 정보 출력

출력 예시:
검색 결과 (3건):

[2024-01-16] session_a1b2.md
  "...JWT 토큰 저장 방식을 localStorage로 결정..."

[2024-01-15] session_c3d4.md
  "...JWT 인증 방식 채택, 팀 표준에 따름..."

[memory.md]
  "...핵심 결정: JWT 인증 (팀 표준)..."
```

---

### `/workflow-memory cleanup`

정리 규칙을 수동으로 실행합니다.

**사용법:**

```bash
/workflow-memory cleanup                 # 현재 메모리
/workflow-memory cleanup --all           # 모든 메모리
```

**AI 실행 지침:**

```
1. config.json의 정리 규칙 확인:
   - maxSessionsPerProject: 50
   - maxSessionAgeDays: 90
2. 정리 대상 파악 후 사용자 확인 요청
3. 확인 시 정리 실행

출력 예시:
정리 대상:
  - 90일 초과 세션: 3개
  - 최대 개수 초과: 2개

[사용자 확인 후]
✓ 5개 세션 삭제됨
✓ 저장 공간 15KB 확보
```

---

## 설정 파일

### `~/.claude-memory/config.json`

```json
{
  "version": "1.0",
  "retention": {
    "maxSessionsPerProject": 50,
    "maxSessionAgeDays": 90
  },
  "summarization": {
    "model": "claude-sonnet-4-20250514",
    "maxTokens": 500
  }
}
```

### `~/.claude-memory/index.json`

```json
{
  "projects": {
    "my-app-v2": {
      "path": "/Users/user/Projects/my-app",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastAccess": "2024-01-16T15:30:00Z"
    }
  }
}
```

### `~/.claude-memory/projects/{id}/meta.json`

```json
{
  "id": "my-app-v2",
  "projectPath": "/Users/user/Projects/my-app",
  "projectName": "my-app",
  "createdAt": "2024-01-15T10:00:00Z",
  "lastAccess": "2024-01-16T15:30:00Z",
  "totalSessions": 12
}
```

---

## Hook 연동

세션 시작/종료 시 자동으로 메모리가 동기화됩니다.

**SessionStart Hook:**

- 현재 메모리 로드
- 최근 세션 요약 주입

**SessionEnd Hook:**

- 세션 요약 생성 (Claude API)
- sessions/{날짜}\_{branch}.md 저장
- memory.md 업데이트
- 정리 규칙 적용

---

## 관련 커맨드

- `/workflow start` - 메모리 연결 확인 후 프로젝트 시작
- `/workflow status` - 현재 상태 확인 (메모리 포함)
- `/workflow update` - 메모리 수동 업데이트
