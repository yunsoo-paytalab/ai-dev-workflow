---
name: writing-feature-docs
description: Feature 관련 문서들을 작성합니다. feature-detail(상세 문서), feature-research(구현 분석), feature-plan(구현 계획) 작성 시 사용하세요.
---

# Writing Feature Docs

Feature 관련 워크플로우에서 생성되는 문서들의 작성 가이드입니다.

## Document Types

| 문서             | 워크플로우                 | 설명                          | 가이드                                                         |
| ---------------- | -------------------------- | ----------------------------- | -------------------------------------------------------------- |
| feature-detail   | `/workflow-feature-detail` | Feature 상세 문서 (전체 일괄) | [reference/feature-detail.md](reference/feature-detail.md)     |
| feature-research | `/workflow-feature-spec`   | 단일 Feature 구현 분석        | [reference/feature-research.md](reference/feature-research.md) |
| feature-plan     | `/workflow-feature-spec`   | 단일 Feature 구현 계획        | [reference/feature-plan.md](reference/feature-plan.md)         |

## Workflow Distinction

```
설계 단계 (전체 Feature)
└── /workflow-feature-detail
    └── feature-detail.md (각 Feature별)

개발 단계 (단일 Feature)
└── /workflow-feature-spec [Feature ID]
    ├── feature-research.md (구현 분석)
    └── feature-plan.md (구현 계획)
```

## Conditional Workflow

1. 문서 유형을 결정하세요:

   **전체 Feature 상세 작성?** → [feature-detail.md](reference/feature-detail.md) 참조
   **단일 Feature 구현 분석?** → [feature-research.md](reference/feature-research.md) 참조
   **단일 Feature 구현 계획?** → [feature-plan.md](reference/feature-plan.md) 참조

## Output Paths

```
.claude/docs/
├── feature-list/
│   ├── AUTH-001-login.md        (feature-detail)
│   ├── AUTH-002-signup.md       (feature-detail)
│   └── ...
├── research/
│   ├── AUTH-001-research.md     (feature-research)
│   └── ...
└── plan/
    ├── AUTH-001-plan.md         (feature-plan)
    └── ...
```

## Key Principles

1. **상세 vs 분석**: feature-detail은 Task 정의, feature-research는 구현 분석
2. **설계 정보 참조**: domain-definition.md의 엔티티/규칙 참조
3. **의사결정 필요시만**: 코드 예시는 의사결정이 필요한 경우에만
4. **다이어그램은 Mermaid 문법**: 프로젝트/파일 구조를 제외한 다이어그램은 mermaid로 작성
