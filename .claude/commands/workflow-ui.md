---
name: workflow-ui
description: Figma 디자인을 기반으로 UI를 구현하는 커맨드
version: 3.2.1
---

# /workflow-ui $1 $2

Figma 디자인을 기반으로 UI 컴포넌트를 생성합니다.

## 인자 처리

```
/workflow-ui [대상: $1] [Figma URL: $2]
```

| 입력 형태    | 예시                                   | 설명                              |
| ------------ | -------------------------------------- | --------------------------------- |
| 파일 + URL   | `/path/page.tsx https://figma.com/...` | 대상 파일과 Figma URL             |
| 파일만       | `/path/page.tsx`                       | 대상 파일 (URL은 사용자에게 요청) |
| 예약어       | `common`                               | 공통 컴포넌트 확장                |
| Feature ID   | `AUTH-001`                             | Feature ID로 검색                 |
| Feature 이름 | `로그인 기능`                          | Feature 이름으로 검색             |
| 파일 참조    | `@.claude/docs/plan/AUTH-001-plan.md`  | 파일 직접 참조                    |

> 💡 Feature ID/이름 해석: `.claude/skills/feature-resolver/SKILL.md`

## 전제 조건

✅ 디자인 시스템 구축됨 (컴포넌트 라이브러리, 디자인 토큰, 테마)

## 실행 프로세스

### Phase 1: 디자인 시스템 분석

1. **컴포넌트 매핑 문서 로드** (필수)
   - Platform Web: `.claude/docs/design-system-mapping/platform-web.md`
2. 기존 구조 파악:
   - `src/components/ui/` 컴포넌트 라이브러리
   - 디자인 토큰 체계
   - 테마 시스템

### Phase 2: Figma UI 생성

**Skill 도구를 사용하여 `figma-ui-generator` 스킬을 호출하세요.**

호출 전 아래 정보를 컨텍스트에 명시한 후 Skill을 호출하세요:

- 대상 파일 경로: `$1`
- Figma URL 또는 Node ID: `$2`
- 매핑 문서 경로: Phase 1에서 로드한 문서 경로

### Phase 3: 코드 생성 및 검토

- 생성된 코드 리뷰
- 기존 컴포넌트와 일관성 확인
- 테스트 코드 생성 (필요 시)
