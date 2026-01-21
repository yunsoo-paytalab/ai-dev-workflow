---
name: estimating-points
description: Feature 포인트를 산정하는 전략 가이드입니다. task-point-estimator 에이전트 작업 시 사용하세요.
model: haiku
version: 3.2.1
---

# Estimating Points

Feature 단위의 복잡도와 불확실성을 기반으로 포인트를 산정합니다.

## Core Principle

**"복잡도(Complexity) + 불확실성(Risk) 기반의 피보나치 포인트 산정"**

- 시간 환산 금지 (압박 도구가 아닌 예측 도구)
- Feature 단위로 포인트 산정 (Task별 포인트 산정 안 함)
- **모든 포인트는 피보나치 수열만 사용**: 1, 2, 3, 5, 8, 13, 21...
- 13pt 이상의 Feature는 분할 검토 필요 표시

## Point Values

| 포인트 | 가이드                                           |
| ------ | ------------------------------------------------ |
| 1      | [guides/1pt.md](guides/1pt.md)             |
| 2-3    | [guides/2-3pt.md](guides/2-3pt.md)         |
| 5-8    | [guides/5-8pt.md](guides/5-8pt.md)         |
| 13+    | [guides/13pt-plus.md](guides/13pt-plus.md) |

## Input / Output

- **Input**: `.claude/docs/domain/feature-list.md`, `.claude/docs/feature-list/*.md`
- **Output**: `.claude/docs/domain/feature-list.md` 업데이트 (포인트 컬럼 추가)

## Reference

- 상세 프로세스: [guides/process.md](guides/process.md)
