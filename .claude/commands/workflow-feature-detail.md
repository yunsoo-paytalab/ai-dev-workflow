---
name: workflow-feature-detail
description: Feature 목록의 모든 Feature에 대해 상세 문서를 일괄 작성하는 커맨드
version: 3.2.1
---

# /workflow-feature-detail

Feature 목록을 기반으로 각 Feature의 상세 문서를 작성합니다.

## 선행 조건

- `/workflow-domain-definition` 완료
- `.claude/docs/feature-list.md` 존재

## 실행 프로세스

### Phase 1: 입력 검증

확인:

1. `.claude/docs/feature-list.md` 존재
2. `.claude/docs/domain-definition.md` 존재
3. Feature ID 목록 추출

### Phase 2: Feature 상세 문서 작성

⚡ **병렬 실행** (Feature 3~5개씩 배치 분할)

```bash
mkdir -p .claude/docs/feature-list
```

**Agent: feature-detail-writer** (배치별 병렬 호출)

### Phase 3: 링크 업데이트

- `.claude/docs/feature-list.md`에 상세 문서 링크 추가
- 모든 Feature 문서 존재 여부 검증

### Phase 4: 워크플로우 완료

```
/workflow-memory complete feature-detail
```

## 선택적 실행

```
/workflow-feature-detail AUTH-001 AUTH-002  # 특정 Feature만 처리
```

## 결과물

- `.claude/docs/feature-list/[기능ID]-[기능명].md`
- `.claude/docs/feature-list.md` (링크 업데이트)

## 다음 단계

- `/workflow-task-point` - 개발 공수 추정
- `/workflow-feature-spec [Feature ID]` - 특정 기능 구현 시작
