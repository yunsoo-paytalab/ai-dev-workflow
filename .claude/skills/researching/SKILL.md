---
name: researching
description: 도메인 분석 및 Feature 분석을 위한 Research 수행 전략 가이드입니다. domain-research, feature-research 작업 시 사용하세요.
model: opus
version: 3.2.1
---

# Researching

Research 단계에서 요구사항을 분석하고 코드베이스를 탐색하는 전략 가이드입니다.

## Research Types

| 유형             | 에이전트                 | 전략 가이드                                  | 문서 템플릿                                              |
| ---------------- | ------------------------ | -------------------------------------------- | -------------------------------------------------------- |
| Domain Research  | `domain-research-agent`  | [guides/domain.md](guides/domain.md)   | [templates/domain-research.md](templates/domain-research.md) |
| Feature Research | `feature-research-agent` | [guides/feature.md](guides/feature.md) | [templates/feature-research.md](templates/feature-research.md) |

## Core Principles

**"분석만, 설계는 다음 단계에서"**

- 발견한 사실만 기록
- 설계 (엔티티 정의, 인터페이스 설계 등)는 하지 않음
- 추측보다 확인된 사실 기반
- 불확실한 부분은 명시적으로 표시

## Conditional Workflow

1. Research 유형을 결정하세요:

   **프로젝트 전체 도메인 분석?** → [domain.md](guides/domain.md) 참조
   **단일 Feature 요구사항 분석?** → [feature.md](guides/feature.md) 참조

## Output Paths

```
.claude/docs/research/
├── domain-research.md      # 프로젝트 도메인 분석
├── AUTH-001-research.md    # Feature별 Research
├── ORDER-001-research.md
└── ...
```
