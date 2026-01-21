---
name: workflow-feature-detail
description: Feature 목록의 모든 Feature에 대해 상세 문서를 일괄 작성하는 커맨드
version: 3.2.1
---

# /workflow-feature-detail

Feature 목록을 기반으로 각 Feature의 상세 문서를 작성합니다.

## 선행 조건

- `/workflow-domain-definition` 완료
- `.claude/docs/domain/feature-list.md` 존재

## 실행 프로세스

### Phase 1: 입력 검증

확인:

1. `.claude/docs/domain/feature-list.md` 존재
2. `.claude/docs/domain/domain-definition.md` 존재
3. Feature ID 목록 추출

### Phase 2: 입력 데이터 로드

다음 파일들을 **1회만** 로드합니다:

- `.claude/docs/research/domain-research.md`
- `.claude/docs/domain/domain-definition.md`
- `.claude/docs/domain/feature-list.md`
- `.claude/docs/domain/user-scenarios.md`

```bash
mkdir -p .claude/docs/feature-list
```

### Phase 3: Feature 상세 문서 작성

⚡ **병렬 실행** (Feature 3~5개씩 배치 분할)

feature-detail-writer 에이전트를 배치별로 병렬 호출합니다.

**호출 시 prompt에 포함할 정보:**

- 해당 배치의 Feature 정보 (feature-list.md에서 추출)
- 관련 도메인 정의 (domain-definition.md에서 추출)
- 관련 유저 시나리오 (user-scenarios.md에서 추출)

> 에이전트가 파일을 다시 읽지 않도록 필요한 정보를 prompt에 포함

### Phase 4: 링크 업데이트

- `.claude/docs/domain/feature-list.md`에 상세 문서 링크 추가
- 모든 Feature 문서 존재 여부 검증

### Phase 5: 워크플로우 완료

```
/workflow-memory complete feature-detail
```

## 선택적 실행

```
/workflow-feature-detail AUTH-001 AUTH-002  # 특정 Feature만 처리
```

## 결과물

- `.claude/docs/feature-list/[기능ID]-[기능명].md`
- `.claude/docs/domain/feature-list.md` (링크 업데이트)

## 다음 단계

- `/workflow-task-point` - 개발 공수 추정
- `/workflow-feature-spec [Feature ID]` - 특정 기능 구현 시작
