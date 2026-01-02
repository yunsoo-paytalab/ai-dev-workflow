---
name: writing-legacy-analysis
description: 레거시 코드 분석 결과 문서들을 작성합니다. structure, dependency, debt, business-logic, danger-zones, risk 문서 작성 시 사용하세요.
version: 3.2.0
---

# Writing Legacy Analysis Docs

레거시 분석 워크플로우(`/workflow-legacy-profile`)에서 생성되는 문서들의 작성 가이드입니다.

## Document Types

| 문서                   | 에이전트                | 설명                 | 가이드                                                     |
| ---------------------- | ----------------------- | -------------------- | ---------------------------------------------------------- |
| structure-overview.md  | `structure-analyzer`    | 프로젝트 구조 분석   | [reference/structure.md](reference/structure.md)           |
| dependency-graph.md    | `dependency-analyzer`   | 의존성 그래프        | [reference/dependency.md](reference/dependency.md)         |
| technical-debt.md      | `debt-analyzer`         | 기술 부채 목록       | [reference/debt.md](reference/debt.md)                     |
| core-business-logic.md | `business-logic-mapper` | 핵심 비즈니스 로직   | [reference/business-logic.md](reference/business-logic.md) |
| danger-zones.md        | `risk-classifier`       | 위험 영역 상세       | [reference/danger-zones.md](reference/danger-zones.md)     |
| no-reference-zones.md  | `risk-classifier`       | 참고 금지 영역       | [reference/risk.md](reference/risk.md)                     |
| restricted-zones.json  | `risk-classifier`       | 머신 리더블 제한영역 | [reference/risk.md](reference/risk.md)                     |

## Output Paths

```
.claude/docs/legacy-analysis/
├── structure-overview.md       # 전체 구조 개요
├── dependency-graph.md         # 의존성 그래프 (mermaid)
├── technical-debt.md           # 기술 부채 목록
├── core-business-logic.md      # 핵심 비즈니스 로직
├── danger-zones.md             # 수정 주의 영역 ⚠️
├── no-reference-zones.md       # 참고 금지 영역 🚫
└── restricted-zones.json       # 머신 리더블 제한 영역
```

## Conditional Workflow

1. 문서 유형을 결정하세요:

   **구조 분석 중?** → [structure.md](reference/structure.md) 참조
   **의존성 분석 중?** → [dependency.md](reference/dependency.md) 참조
   **기술 부채 분석 중?** → [debt.md](reference/debt.md) 참조
   **비즈니스 로직 분석 중?** → [business-logic.md](reference/business-logic.md) 참조
   **위험도 분류 중?** → [danger-zones.md](reference/danger-zones.md), [risk.md](reference/risk.md) 참조

## Key Principles

1. **병렬 분석**: 4개 분석 에이전트는 동시에 실행
2. **결과 취합**: risk-classifier가 4개 결과를 종합하여 위험도 분류
3. **다이어그램은 Mermaid 문법**: 의존성 그래프 등은 mermaid로 작성
