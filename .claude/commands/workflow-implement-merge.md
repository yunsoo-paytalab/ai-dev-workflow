---
name: workflow-implement-merge
description: 병렬 구현이 완료된 Worktree들을 main 브랜치에 병합하는 커맨드
version: 3.2.0
---

# /workflow-implement-merge $ARGUMENTS

병렬 구현이 완료된 Feature들을 main 브랜치에 순차적으로 병합합니다.

> ⚠️ **필수 선행**: `/workflow-implement-parallel [Group]` 실행 완료

## 인자 처리

> 💡 **Skill**: `@.claude/skills/feature-resolver/SKILL.md` (enableGroupSearch: true)

| 입력 형태  | 예시      | 설명                   |
| ---------- | --------- | ---------------------- |
| Group 이름 | `인증`    | Group 이름으로 검색    |
| Group 번호 | `Group 1` | Group 번호로 검색      |
| Group 번호 | `1`       | 숫자만으로도 검색 가능 |

## 실행 프로세스

### Phase 0: 상태 확인

```
1. memory.md에서 해당 Group의 병렬 구현 상태 로드
2. 각 Feature의 현재 상태 확인
3. 사용자에게 현황 표시
```

#### 상태 표시 예시

```
📊 Group "인증" 병합 현황

| Feature   | Status      | Commits | 변경 파일 |
| --------- | ----------- | ------- | --------- |
| AUTH-001  | ✅ completed | 5       | 12        |
| AUTH-002  | ✅ completed | 3       | 8         |
| AUTH-003  | 🔄 in_progress | 2    | 4         |

완료: 2/3
```

### Phase 1: 사용자 선택

> 💡 **Skill**: `@.claude/skills/review-and-confirm/SKILL.md` (다중 선택형)

**선택지:** ✅ 완료된 것만 병합 | ⏳ 모두 완료 대기 | 💬 직접 입력

### Phase 2: 순차 병합

> ⚠️ **충돌 발생 시**: 해당 Feature 스킵 + 나머지 계속

```bash
# main 브랜치로 이동
git checkout main

# 순차적으로 병합
git merge worktree/AUTH-001 --no-ff -m "feat(AUTH-001): [Feature 이름] 구현"
git merge worktree/AUTH-002 --no-ff -m "feat(AUTH-002): [Feature 이름] 구현"
# ...
```

#### 병합 결과 처리

각 Feature 병합 후:

| 결과    | 처리                        |
| ------- | --------------------------- |
| ✅ 성공 | Worktree 제거 + 브랜치 삭제 |
| ⚠️ 충돌 | 스킵 + 사용자에게 알림      |

#### 성공 시 정리

```bash
# Worktree 제거
git worktree remove .worktrees/AUTH-001

# 브랜치 삭제
git branch -d worktree/AUTH-001
```

### Phase 3: 결과 보고

```
📋 병합 완료 보고

✅ 성공: AUTH-001, AUTH-002
⚠️ 스킵 (충돌): 없음
🔄 미완료: AUTH-003

충돌 해결이 필요한 경우:
  1. 해당 worktree로 이동: cd .worktrees/AUTH-003
  2. main 변경사항 동기화: git rebase main
  3. 충돌 해결 후 다시 병합 시도
```

### Phase 4: memory.md 업데이트

```markdown
## Parallel Implementation: [Group 이름]

| Feature  | Status   | Branch            | Merged At        |
| -------- | -------- | ----------------- | ---------------- |
| AUTH-001 | merged   | (deleted)         | 2024-01-15 14:30 |
| AUTH-002 | merged   | (deleted)         | 2024-01-15 14:31 |
| AUTH-003 | conflict | worktree/AUTH-003 | -                |

Completed: [완료 시간]
```

## 충돌 해결 가이드

### 수동 해결 방법

```bash
# 1. 충돌 발생한 worktree로 이동
cd .worktrees/AUTH-003

# 2. main 기준으로 rebase
git fetch origin main
git rebase main

# 3. 충돌 해결
# ... 파일 수정 ...

# 4. rebase 계속
git add .
git rebase --continue

# 5. 메인으로 돌아가서 다시 병합 시도
cd ../..
/workflow-implement-merge [Group]
```

### 충돌 발생 시 선택지

```
⚠️ AUTH-003 병합 중 충돌 발생!

충돌 파일:
  - src/api/auth.ts
  - src/types/auth.ts
```

> 💡 **Skill**: `@.claude/skills/review-and-confirm/SKILL.md` (다중 선택형)

**선택지:** ⏭️ 스킵 후 계속 | ⏸️ 병합 중단 | 🔧 수동 해결 | 💬 직접 입력

## 옵션

| 옵션        | 설명                                   |
| ----------- | -------------------------------------- |
| `--force`   | 완료된 Feature만 자동 병합 (확인 없이) |
| `--dry-run` | 실제 병합 없이 시뮬레이션              |

## 에러 처리

### 진행 중인 병렬 구현 없음

```
❌ 진행 중인 병렬 구현이 없습니다.

먼저 실행: /workflow-implement-parallel [Group]
```

### 모든 Feature 미완료

```
⚠️ 완료된 Feature가 없습니다.

현재 상태:
  - AUTH-001: in_progress
  - AUTH-002: in_progress
  - AUTH-003: in_progress

상태 확인: /workflow-implement-status [Group]
```

## 결과물

- main 브랜치에 병합된 Feature 코드
- 정리된 worktree 및 브랜치
- 업데이트된 memory.md

## 다음 단계

```
/workflow-integrate        - 통합 및 리팩토링
/workflow-e2e              - E2E 테스트
```
