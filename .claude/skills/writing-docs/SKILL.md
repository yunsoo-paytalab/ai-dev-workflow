---
name: writing-docs
description: 도메인 정의 및 Feature 상세 문서 작성 가이드. domain-definition, feature-list, page-structure, user-scenarios, feature-detail 문서 작성 시 사용.
model: sonnet
version: 3.3.0
---

# Writing Docs

도메인 정의 및 Feature 상세 문서의 작성 가이드입니다.

## Document Types

| 문서 | 워크플로우 | 가이드 | 템플릿 |
|------|------------|--------|--------|
| domain-definition.md | `/workflow-domain-definition` | [guides/domain-definition.md](guides/domain-definition.md) | [templates/domain-definition.md](templates/domain-definition.md) |
| page-structure.md | `/workflow-domain-definition` | [guides/page-structure.md](guides/page-structure.md) | [templates/page-structure.md](templates/page-structure.md) |
| user-scenarios.md | `/workflow-domain-definition` | [guides/user-scenarios.md](guides/user-scenarios.md) | [templates/user-scenarios.md](templates/user-scenarios.md) |
| feature-list.md | `/workflow-domain-definition` | [guides/feature-list.md](guides/feature-list.md) | [templates/feature-list.md](templates/feature-list.md) |
| feature-detail.md | `/workflow-feature-detail` | [guides/feature-detail.md](guides/feature-detail.md) | [templates/feature-detail.md](templates/feature-detail.md) |

> **Note**: research 문서는 `researching` 스킬, plan 문서는 `planning` 스킬 참조

## Output Paths

```
.claude/docs/
├── domain/
│   ├── domain-definition.md
│   ├── page-structure.md
│   ├── user-scenarios.md
│   └── feature-list.md
└── feature-list/
    ├── AUTH-001-login.md        (feature-detail)
    ├── AUTH-002-signup.md       (feature-detail)
    └── ...
```

## Key Principles

1. **설계 중심**: Research 결과를 바탕으로 설계 문서 작성
2. **완결된 기능 단위**: Feature는 하나의 목적을 달성하는 완결된 기능
3. **Task 정의 중심**: 각 Feature의 Task 분해 및 구현 요소 명시
4. **다이어그램은 Mermaid 문법**: 프로젝트/파일 구조를 제외한 다이어그램은 mermaid로 작성
