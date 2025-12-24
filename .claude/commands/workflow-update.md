---
name: workflow-update
description: 요구사항 변경 시 관련 문서를 자동으로 일괄 업데이트하는 커맨드
version: 3.2.0
---

# /workflow-update $ARGUMENTS

요구사항 변경 시 관련 문서를 자동으로 일괄 업데이트합니다.

> ⚠️ 의존성 있는 모든 관련 문서를 자동 업데이트

## 인자 처리

> 💡 **Skill**: `@.claude/skills/feature-resolver/SKILL.md`

| 입력 형태    | 예시                                           |
| ------------ | ---------------------------------------------- |
| Feature ID   | `AUTH-001`                                     |
| 파일 참조    | `@.claude/docs/feature-list/AUTH-001-login.md` |
| Feature 이름 | `로그인 기능`                                  |

## 실행 프로세스

### Phase 0: Feature 및 변경 내용 확인

Feature 정보 표시 → **변경 내용 입력 요청**

### Phase 1: 영향 범위 분석

**Agent: impact-analyzer**

- 직접 영향받는 문서
- 간접 영향받는 문서 (의존성)
- 구현 파일 (수동 작업 필요 표시)

### Phase 2: 사용자 확인

변경될 문서 목록 미리보기 → 진행 여부 결정

### Phase 3: 문서 업데이트 실행

**Agent: document-updater**

- 각 문서 Read → Edit/Write
- 변경 이력 기록

### Phase 4: 검증 및 기록

- 일관성/의존성 체크
- 변경 이력: `.claude/docs/changelog/[FEATURE_ID]-[YYYYMMDD].md`

### Phase 5: 최종 안내

- 업데이트된 문서 목록
- 수동 작업 필요 코드 파일 안내

## 주의사항

- **코드 파일은 수동 수정 필요** (문서만 업데이트)
- 모든 의존성 자동 업데이트 (Phase 2에서 확인)
- 큰 변경 전 git commit/branch 권장
