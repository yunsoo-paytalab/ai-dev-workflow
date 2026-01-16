---
name: researching
description: 도메인 분석 및 Feature 분석을 위한 Research 수행 전략 가이드입니다. domain-research, feature-research 작업 시 사용하세요.
version: 3.2.1
---

# Researching

Research 단계에서 요구사항을 분석하고 코드베이스를 탐색하는 전략 가이드입니다.

## Research Types

| 유형             | 에이전트                 | 설명                       | 가이드                                       |
| ---------------- | ------------------------ | -------------------------- | -------------------------------------------- |
| Domain Research  | `domain-research-agent`  | 프로젝트 전체 도메인 분석  | [reference/domain.md](reference/domain.md)   |
| Feature Research | `feature-research-agent` | 단일 Feature 요구사항 분석 | [reference/feature.md](reference/feature.md) |

## Core Principles

**"분석만, 설계는 다음 단계에서"**

- 발견한 사실만 기록
- 설계 (엔티티 정의, 인터페이스 설계 등)는 하지 않음
- 추측보다 확인된 사실 기반
- 불확실한 부분은 명시적으로 표시

## Conditional Workflow

1. Research 유형을 결정하세요:

   **프로젝트 전체 도메인 분석?** → [domain.md](reference/domain.md) 참조
   **단일 Feature 요구사항 분석?** → [feature.md](reference/feature.md) 참조

## Search Strategy

### 1. 요구사항 기반 분석

```
탐색 전략:
1. 요구사항에서 핵심 키워드 추출 (기능명, 도메인, 컴포넌트 등)
2. 키워드 기반으로 관련 파일/디렉토리만 검색
3. 불필요한 영역 스킵: node_modules, dist, build, .git, coverage 등
```

### 2. 효율적 코드베이스 탐색

```bash
# Grep으로 키워드 검색 → 관련 파일 식별
grep -r "keyword" src/ --include="*.ts" --include="*.tsx"

# 파일 전체 읽기 지양, 관련 함수/클래스만 확인
# 검색 결과가 너무 많으면 범위를 좁혀서 재검색
```

### 3. 탐색 깊이 조절

| 관련도    | 분석 수준   |
| --------- | ----------- |
| 직접 관련 | 상세 분석   |
| 간접 관련 | 개요만 파악 |
| 무관      | 스킵        |

## Output Paths

```
.claude/docs/research/
├── domain-research.md      # 프로젝트 도메인 분석
├── AUTH-001-research.md    # Feature별 Research
├── ORDER-001-research.md
└── ...
```

## Key Guidelines

1. **범위 제한 우선** - 요구사항과 직접 관련된 영역만 탐색
2. **효율적 탐색** - Grep/Glob으로 키워드 검색 우선
3. **Context 효율화** - 중복 정보 제거, 핵심 정보 위주로 요약
4. **정확성 우선** - 추측보다 확인된 사실 기반
