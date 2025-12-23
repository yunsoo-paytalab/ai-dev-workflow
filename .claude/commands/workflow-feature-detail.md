---
name: workflow-feature-detail
description: Feature 목록의 모든 Feature에 대해 상세 문서를 일괄 작성하는 커맨드
version: 1.0.0
---

# /workflow-feature-detail

Feature 목록(`.claude/docs/feature-list.md`)을 기반으로 각 Feature의 상세 문서를 작성합니다.

## 선행 조건

- `/workflow-domain-definition` 완료
- `.claude/docs/feature-list.md` 존재 (Feature/Task 목록 확정)

## 실행 프로세스

### Phase 1: 입력 검증

**확인 사항:**

1. `.claude/docs/feature-list.md` 존재 여부
2. `.claude/docs/domain-definition.md` 존재 여부 (참조용)
3. Feature 목록에서 전체 Feature ID 추출

**검증 실패 시:**

```
⚠️ feature-list.md가 존재하지 않습니다.
먼저 /workflow-domain-definition을 실행하세요.
```

### Phase 2: Feature 상세 문서 작성

⚡ **IMPORTANT: 병렬 실행으로 처리 시간 단축**

**실행 방법:**

1. **디렉토리 먼저 생성** (병렬 실행 전 필수)

   ```bash
   mkdir -p .claude/docs/feature-list
   ```

2. Feature 목록을 다중 배치로 분할 (한 그룹에 Feature 3~5개씩)
3. 각 배치에 대해 feature-detail-writer 에이전트를 **병렬 호출**

**예시 (12개 Feature 기준):**

한 번의 메시지에서 3개의 Task를 병렬 호출:

```
Task 1: feature-detail-writer
- prompt: "다음 Feature만 작성: AUTH-001, AUTH-002, AUTH-003, DASH-001"

Task 2: feature-detail-writer
- prompt: "다음 Feature만 작성: DASH-002, USER-001, USER-002, USER-003"

Task 3: feature-detail-writer
- prompt: "다음 Feature만 작성: ORDER-001, ORDER-002, ORDER-003, ORDER-004"
```

**배치 분할 기준:**

- 병렬 작업 Agent 수: Feature 수 ÷ 4 (약 3~5개씩)
- 도메인별 그룹핑 권장 (관련 Feature끼리 묶기)

### Phase 3: 링크 업데이트 및 검증

**병렬 완료 후:**

1. `.claude/docs/feature-list.md`에 상세 문서 링크 일괄 추가
2. 모든 Feature 문서 존재 여부 검증

**검증 방법:**

```bash
# 생성된 파일 목록 확인
ls -la .claude/docs/feature-list/

# feature-list.md의 Feature 수와 비교
grep -c "^| [A-Z]" .claude/docs/feature-list.md
```

### Phase 4: Progress 동기화

**Bash로 실행:**

```bash
node .claude/hooks/memory-sync.cjs sync-progress
```

이 명령은 다음을 수행합니다:

- `feature-list.md` + `feature-list/*.md` → progress.json (Feature/Task 정보)
- progress.json → memory.md (체크리스트 동기화)

### Phase 5: 워크플로우 완료 처리

**Bash로 실행:**

```bash
node .claude/hooks/memory-sync.cjs workflow-complete feature-detail
```

## 선택적 실행

특정 Feature만 작성하거나 업데이트할 수 있습니다:

```
/workflow-feature-detail AUTH-001 AUTH-002
```

이 경우 지정된 Feature만 처리하고, 나머지는 건드리지 않습니다.

## 출력 파일

- `.claude/docs/feature-list/[기능ID]-[기능명].md` (각 기능별)
- `.claude/docs/feature-list.md` (상세 문서 링크 업데이트)

## 다음 단계 안내

Feature 상세 문서 작성이 완료되면:

1. **포인트 산정**: `/workflow-task-point` - 개발 공수 추정
2. **기능 구현**: `/workflow-feature-spec [Feature ID]` - 특정 기능 구현 시작

## 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
>
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/\*.md (자동)
