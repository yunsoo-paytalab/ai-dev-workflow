---
name: planning
description: Research 결과를 바탕으로 기술 설계와 구현 계획을 수립하는 전략 가이드입니다. planning-agent 작업 시 사용하세요.
model: opus
version: 3.2.1
---

# Planning

Research 결과를 바탕으로 기술 설계와 Implementation Plan을 수립합니다.

## Core Principles

**"요구사항 + 관련 파일 참조를 바탕으로 설계하고 실행 계획 수립"**

- Research 문서의 1.4 관련 파일 목록을 우선 참조
- 코드 예시는 핵심 로직과 의사결정이 필요한 경우에만

## Input / Output

- **Input**: `.claude/docs/research/[Feature ID]-research.md`
- **Output**: `.claude/docs/plan/[Feature ID]-plan.md`

## Reference

| 문서 | 설명 | 경로 |
|------|------|------|
| 원칙 가이드 | Planning 수행 원칙 | [guides/principles.md](guides/principles.md) |
| 문서 템플릿 | feature-plan 문서 구조 | [templates/feature-plan.md](templates/feature-plan.md) |

## Planning Process

1. Feature Research 문서 분석 (섹션 1.4 관련 파일 확인)
2. 관련 파일 분석 (재사용 가능한 컴포넌트/패턴 파악)
3. 의사결정 항목 식별
4. Implementation Groups 작성 (4-6개 그룹, 그룹당 3-7개 task)
5. 검증 방법 정의
