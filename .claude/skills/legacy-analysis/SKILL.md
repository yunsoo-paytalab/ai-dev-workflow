---
name: legacy-analysis
description: 레거시 코드베이스 분석 및 결과 문서 작성 가이드. /workflow-legacy-profile에서 사용.
model: sonnet
version: 3.2.1
---

# Legacy Analysis

레거시 프로젝트를 분석하고 결과 문서를 작성하는 통합 가이드입니다.

## Analysis Types

| 분석 유형 | 가이드 | 출력 문서 |
|-----------|--------|-----------|
| Structure | [guides/structure.md](guides/structure.md) | `structure-overview.md` |
| Dependency | [guides/dependency.md](guides/dependency.md) | `dependency-graph.md` |
| Debt | [guides/debt.md](guides/debt.md) | `technical-debt.md` |
| Business Logic | [guides/business-logic.md](guides/business-logic.md) | `core-business-logic.md` |
| Risk Classification | [guides/risk.md](guides/risk.md) | `danger-zones.md`, `restricted-zones.json` |

## Core Principles

**"리드 에이전트가 직접 분석, 빠른 전체 스캔"**

- 병렬 서브에이전트 대신 리드가 Grep/Glob으로 직접 분석
- 결과는 `.claude/docs/legacy-analysis/` 디렉토리에 저장

## Execution Flow

```
[Phase 1: 분석] → structure/dependency/debt/business-logic.md
[Phase 2: 위험도 분류] → danger-zones.md, restricted-zones.json
```

## Output Paths

```
.claude/docs/legacy-analysis/
├── structure-overview.md       # 전체 구조 개요
├── dependency-graph.md         # 의존성 그래프 (mermaid)
├── technical-debt.md           # 기술 부채 목록
├── core-business-logic.md      # 핵심 비즈니스 로직
├── danger-zones.md             # 수정 주의 영역 ⚠️
└── restricted-zones.json       # 머신 리더블 제한 영역
```

## Reference

- 분석 명령어: [guides/commands.md](guides/commands.md)
