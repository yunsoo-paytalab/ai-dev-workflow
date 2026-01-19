---
name: workflow-implement
description: 특정 기능을 TDD 방식으로 구현하는 커맨드
version: 3.2.1
---

# /workflow-implement $ARGUMENTS

선택한 기능을 TDD 방식으로 구현합니다.

> ⚠️ **필수 선행**: `/workflow-feature-spec $ARGUMENTS` 완료

## 인자 처리

feature-resolver 스킬을 사용하여 인자를 해석합니다.

| 입력 형태    | 예시                                  |
| ------------ | ------------------------------------- |
| 파일 참조    | `@.claude/docs/plan/AUTH-001-plan.md` |
| Feature ID   | `AUTH-001`                            |
| Feature 이름 | `로그인 기능`                         |

**옵션:**

- `--batch`: 모든 그룹을 한 번에 실행
- `--with-api`: API 연동 포함

## 필수 참조 문서

- `.claude/docs/research/[Feature ID]-research.md` (요구사항)
- `.claude/docs/plan/[Feature ID]-plan.md` (구현 계획)

## 실행 프로세스

### Phase 0: 실행 모드 선택

> `--batch` 플래그 시 건너뜀

- 인터랙티브 모드: 각 그룹마다 검토/commit
- 배치 모드: 마지막에만 검토/commit

### Phase 1: Implementation by Groups

각 그룹마다:

#### 1.1 그룹 시작

그룹 정보 및 Task 목록 표시

#### 1.2 TDD Cycle

running-tdd 스킬의 가이드라인에 따라 TDD 사이클을 진행합니다:

- 🔴 Red: 실패하는 테스트 작성
- 🟢 Green: 테스트 통과하는 최소 구현
- 🔵 Refactor: 코드 개선

#### 1.3 그룹 구현

타입/API/로직/UI/상태관리 구현

#### 1.4 그룹 검증

**1.4.1 요구사항 검증** ⭐

- Research 파일의 요구사항 100% 반영 확인
- 누락 시 즉시 구현 후 재검증

**1.4.2 기술적 검증**

```bash
npm run lint        # 최대 3회 재시도
npm run type-check
npm test
```

#### 1.5 개발자 검토 & Commit

review-and-confirm 스킬(커밋형)을 사용하여 사용자 검토를 진행합니다.

**인터랙티브 모드 선택지:** ✅ Commit하고 다음 | ⏭️ Commit 없이 다음 | 💬 직접 입력

**배치 모드:**

- 자동 git add → 다음 그룹

### 1.7 배치 모드 최종 검토

review-and-confirm 스킬(커밋형)을 사용하여 사용자 검토를 진행합니다.

**선택지:** ✅ 전체 Commit | 📦 그룹별로 나눠 Commit | 💬 직접 입력

## 결과물

- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터
- `tests/[기능명]/` - 테스트 코드
