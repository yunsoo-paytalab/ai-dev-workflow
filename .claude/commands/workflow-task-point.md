---
name: workflow-task-point
description: Feature별로 피보나치 수열 기반의 포인트를 산정하는 커맨드
version: 3.2.1
---

# /workflow-task-point

Feature에 포인트를 산정하고 `feature-list.md`를 업데이트합니다.

## 선행 조건

- `/workflow-domain-definition` 완료
- `.claude/docs/domain/feature-list.md` 존재
- `.claude/docs/feature-list/*.md` 세부 파일 존재

## 실행 프로세스

### Phase 1: Feature 분석 & 포인트 산정

task-point-estimator 에이전트를 사용하여 다음을 수행합니다:

- Feature 목록 및 세부 문서 분석
- 복잡도/불확실성 파악
- 포인트 산정

### Phase 2: 문서 업데이트

task-point-estimator 에이전트를 사용하여 다음을 수행합니다:

- Feature 요약 테이블에 포인트 컬럼 추가
- Task 상세 섹션에 포인트 표시
- 13pt 이상 Feature 검토 필요 표시

### Phase 3: Review & Confirm

> 📋 **전제조건**: Phase 2 완료

review-and-confirm 스킬을 사용하여 사용자 검토를 진행합니다.

검토 항목:

- 포인트 검토 및 조정
- 13pt 이상 Feature 분할 필요 여부

**선택지:** ✅ 승인 | 💬 직접 입력

**승인 시:**

```
/workflow-memory complete task-point
```

## 결과물

- `.claude/docs/domain/feature-list.md` (포인트 컬럼 업데이트)
