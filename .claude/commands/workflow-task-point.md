---
name: workflow-task-point
description: 도메인 정의 단계에서 식별한 Task별로 피보나치 수열 기반의 포인트를 산정하는 커맨드
version: 3.1.1
---

# /workflow-task-point

Feature에 포인트를 산정하고 `feature-list.md`를 업데이트합니다.

## 선행 조건

- `workflow-domain-definition` 완료
- `.claude/docs/feature-list.md` 존재
- `.claude/docs/feature-list/*.md` 세부 파일 존재

## 실행 프로세스

### Phase 1: Feature 분석 & 포인트 산정

**Agent: task-point-estimator**

1. Feature 목록 (`.claude/docs/feature-list.md`) 분석
2. Feature 세부 문서 (`.claude/docs/feature-list/*.md`) 분석
3. 각 Feature의 복잡도/불확실성 파악 (Task 내용 참고)
4. 포인트 산정

### Phase 2: 문서 업데이트

**Agent: task-point-estimator**

1. `.claude/docs/feature-list.md` 업데이트
   - Feature 요약 테이블에 포인트 컬럼 추가
   - Task 상세 섹션의 Feature 헤더에 포인트 표시 (예: `### HOURS-001: 영업시간 조회 (3pt)`)
   - Task 상세 테이블에 "산정 기준" 컬럼 추가 (포인트 컬럼 없음)
2. 검토 필요 항목 표시 (13pt 이상 Feature)

### Phase 3: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 산정된 포인트 검토 및 조정
- 13pt 이상 Feature의 분할 필요 여부 확인
- 검토 완료 후 "개발 공수" 필드 직접 입력

**사용자 승인 후:**

**워크플로우 완료 처리** (Bash 실행):

```bash
node .claude/hooks/memory-sync.cjs workflow-complete task-point
```

워크플로우 완료!

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
>
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/\*.md (자동)

## 사용자 결정 포인트

🔔 **Phase 3 확인 사항**:

- Feature 포인트가 작업 난이도를 적절히 반영하는가?
- 13pt 이상 Feature는 분할이 필요한가?

## 결과물

- `.claude/docs/feature-list.md` (포인트 컬럼 업데이트)
