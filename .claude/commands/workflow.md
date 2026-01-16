---
name: workflow
description: AI 개발 프로세스의 기본 커맨드
version: 3.2.1
---

# AI 개발 워크플로우

유연한 워크플로우 시스템 - 원하는 순서대로 작업 가능 (의존성 미충족 시 경고)

## 메인 명령어

### `/workflow start`

프로젝트 시작 및 현재 상태 파악

### `/workflow status`

전체 진행 상황 표시

### `/workflow help`

**아래 섹션들을 순서대로 그대로 출력하세요:**

1. "## 작업 명령어" 테이블 전체
2. "## 병렬 구현 명령어 (Git Worktree)" 테이블과 설명 전체
3. "## 특수 명령어" 테이블 전체
4. "## 권장 작업 순서" 코드블록 전체

요약하지 말고 원본 그대로 출력할 것.

### `/workflow reset`

프로젝트 초기화

## 작업 명령어

| 명령어                         | 설명                          |
| ------------------------------ | ----------------------------- |
| `/workflow-domain-definition`  | 도메인 정의 및 기능 목록 작성 |
| `/workflow-feature-detail`     | 전체 Feature 상세 문서 작성   |
| `/workflow-task-point`         | 개발 공수 산정                |
| `/workflow-feature-spec $ARGS` | 요구사항 분석 및 구현 계획    |
| `/workflow-ui $ARGS`           | Figma 기반 UI 구현            |
| `/workflow-implement $ARGS`    | TDD 방식 구현 (단일)          |
| `/workflow-integrate`          | 통합 및 리팩토링              |
| `/workflow-e2e`                | E2E 테스트                    |

## 병렬 구현 명령어 (Git Worktree)

| 명령어                               | 설명                          |
| ------------------------------------ | ----------------------------- |
| `/workflow-implement-parallel $ARGS` | Group 단위 병렬 TDD 구현 시작 |
| `/workflow-implement-status $ARGS`   | 병렬 구현 진행 상태 확인      |
| `/workflow-implement-merge $ARGS`    | 완료된 Worktree를 main에 병합 |

> **병렬 구현**: Git Worktree를 활용하여 동일 Group의 여러 Feature를 동시에 개발합니다.
> 각 Feature는 독립된 브랜치와 작업 공간(`.worktrees/[Feature-ID]/`)에서 진행됩니다.

## 특수 명령어

| 명령어                     | 설명                          |
| -------------------------- | ----------------------------- |
| `/workflow-legacy-profile` | 레거시 코드 분석 (브라운필드) |
| `/workflow-memory`         | 메모리 관리                   |
| `/workflow-update $ARGS`   | 문서 일괄 업데이트            |

## $ARGUMENTS 입력 형태

- 파일 참조: `@.claude/docs/feature-list/auth.md`
- Feature ID: `AUTH-001`
- Feature 이름: `로그인 기능`
- Group: `인증` (병렬 실행)
- 일반 텍스트: `소셜 로그인 추가`

## 권장 작업 순서

```
0. /workflow-memory init [메모리 ID]
1. /workflow-legacy-profile     (브라운필드 시)
2. /workflow-domain-definition
3. /workflow-feature-detail
4. /workflow-task-point
5. 각 Feature마다:
   - /workflow-feature-spec [Feature ID]
   - /workflow-ui [Feature ID] (필요 시)
   - /workflow-implement [Feature ID]

   또는 병렬 구현 (Group 단위):
   - /workflow-implement-parallel [Group]
   - /workflow-implement-status [Group]  (진행 확인)
   - /workflow-implement-merge [Group]   (완료 후 병합)
6. /workflow-integrate
7. /workflow-e2e
8. /workflow-memory remove [메모리 ID]
```

## 파일 구조

```
.claude/
├── commands/          # 워크플로우 커맨드
├── agents/            # AI 에이전트
├── skills/            # 스킬 (가이드/템플릿)
├── hooks/             # 자동화 스크립트
└── docs/              # 생성 문서
    ├── memory/        # 메모리 (심볼릭 링크)
    ├── research/      # 분석 결과
    ├── plan/          # 구현 계획
    ├── feature-list/  # Feature 상세
    └── legacy-analysis/
```
