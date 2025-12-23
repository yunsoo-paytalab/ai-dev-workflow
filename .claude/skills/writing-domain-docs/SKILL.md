---
name: writing-domain-docs
description: 도메인 정의 워크플로우의 결과 문서들을 작성합니다. domain-research, domain-definition, feature-list, page-structure, user-scenarios 문서 작성 시 사용하세요.
---

# Writing Domain Docs

도메인 정의 단계(`/workflow-domain-definition`)에서 생성되는 문서들의 작성 가이드입니다.

## Workflow Checklist

문서 작성 시 이 체크리스트를 복사하여 사용하세요:

```
Domain Definition Progress:
- [ ] Step 1: 요구사항 분석 (domain-research)
- [ ] Step 2: 도메인 설계 (domain-definition)
- [ ] Step 3: 페이지 구조 설계 (page-structure)
- [ ] Step 4: 유저 시나리오 작성 (user-scenarios)
- [ ] Step 5: Feature 분류 (feature-list)
```

## Document Types

| 문서                 | 설명                             | 가이드                                                           |
| -------------------- | -------------------------------- | ---------------------------------------------------------------- |
| domain-research.md   | 요구사항 및 코드베이스 분석 결과 | [reference/domain-research.md](reference/domain-research.md)     |
| domain-definition.md | 도메인 설계 및 정의 문서         | [reference/domain-definition.md](reference/domain-definition.md) |
| page-structure.md    | 페이지/라우팅 구조 설계          | [reference/page-structure.md](reference/page-structure.md)       |
| user-scenarios.md    | 설계 검증용 유저 시나리오        | [reference/user-scenarios.md](reference/user-scenarios.md)       |
| feature-list.md      | Feature/Task 분류 목록           | [reference/feature-list.md](reference/feature-list.md)           |

## Conditional Workflow

1. 문서 유형을 결정하세요:

   **요구사항 분석 중?** → [domain-research.md](reference/domain-research.md) 참조
   **도메인 설계 중?** → [domain-definition.md](reference/domain-definition.md) 참조
   **페이지 설계 중?** → [page-structure.md](reference/page-structure.md) 참조
   **유저 시나리오 작성 중?** → [user-scenarios.md](reference/user-scenarios.md) 참조
   **Feature 분류 중?** → [feature-list.md](reference/feature-list.md) 참조

## Output Paths

```
.claude/docs/
├── research/
│   └── domain-research.md
├── domain-definition.md
├── page-structure.md
├── user-scenarios.md
└── feature-list.md
```

## Key Principles

1. **분석과 설계 분리**: Research는 분석만, Definition은 설계
2. **완결된 기능 단위**: Feature는 하나의 목적을 달성하는 완결된 기능
3. **사용자 중심**: 페이지 구조는 사용자 플로우 기반
4. **다이어그램은 Mermaid 문법**: 프로젝트/파일 구조를 제외한 다이어그램은 mermaid로 작성
