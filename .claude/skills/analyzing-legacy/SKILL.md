---
name: analyzing-legacy
description: 레거시 코드베이스를 분석하는 전략 가이드입니다. 4개 분석 에이전트(structure, dependency, debt, business-logic)가 병렬로 작업할 때 사용하세요.
version: 3.2.0
---

# Analyzing Legacy

레거시 프로젝트 분석을 위한 전략 가이드입니다. 4개의 분석 에이전트가 병렬로 실행되어 각자의 분석 결과를 작성합니다.

## Analysis Types

| 분석 유형      | 에이전트                | 설명                           | 가이드                                                     |
| -------------- | ----------------------- | ------------------------------ | ---------------------------------------------------------- |
| Structure      | `structure-analyzer`    | 프로젝트 구조 및 아키텍처 분석 | [reference/structure.md](reference/structure.md)           |
| Dependency     | `dependency-analyzer`   | 모듈/패키지 의존성 분석        | [reference/dependency.md](reference/dependency.md)         |
| Debt           | `debt-analyzer`         | 기술 부채 및 코드 품질 분석    | [reference/debt.md](reference/debt.md)                     |
| Business Logic | `business-logic-mapper` | 핵심 비즈니스 로직 분석        | [reference/business-logic.md](reference/business-logic.md) |

## Core Principles

**"빠른 전체 스캔, 심층 분석은 필요시에만"**

- 4개 에이전트가 병렬로 실행
- 각 에이전트는 독립적으로 분석 수행
- 결과는 `.claude/docs/legacy-analysis/` 디렉토리에 저장
- 분석 후 risk-classifier가 위험도 분류

## Execution Flow

```
[Phase 1: 병렬 분석]
┌─────────────────────────────────────────────────────┐
│  structure-analyzer   →  structure-overview.md      │
│  dependency-analyzer  →  dependency-graph.md        │
│  debt-analyzer        →  technical-debt.md          │
│  business-logic-mapper →  core-business-logic.md    │
└─────────────────────────────────────────────────────┘
                          ↓
[Phase 2: 위험도 분류]
┌─────────────────────────────────────────────────────┐
│  risk-classifier  →  danger-zones.md                │
│                   →  restricted-zones.json          │
└─────────────────────────────────────────────────────┘
```

## Output Paths

```
.claude/docs/legacy-analysis/
├── structure-overview.md      # 프로젝트 구조
├── dependency-graph.md        # 의존성 그래프
├── technical-debt.md          # 기술 부채
├── core-business-logic.md     # 비즈니스 로직
├── danger-zones.md            # 위험 영역 분류
└── restricted-zones.json      # AI 제한 영역 설정
```

## Analysis Commands

### 공통 분석 명령어

```bash
# 프로젝트 구조 빠른 스캔
ls -la src/ app/ lib/ 2>/dev/null

# 파일 통계
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | wc -l

# 설정 파일 확인
ls -la package.json tsconfig.json .eslintrc* 2>/dev/null
```

### Import/Export 분석

```bash
# Import 문 추출
grep -r "^import\|^export" src/ --include="*.ts" --include="*.tsx"

# 순환 의존성 체크 (도구 사용 시)
npx madge --circular src/
```

### 코드 품질 분석

```bash
# TODO/FIXME 검색
grep -rn "TODO\|FIXME\|HACK\|XXX" src/

# 큰 파일 식별
find . -name "*.ts" | xargs wc -l | sort -rn | head -20

# 테스트 커버리지
npm test -- --coverage
```

### Git 기반 분석

```bash
# 변경 빈도 상위 파일
git log --format=format: --name-only | grep -v '^$' | sort | uniq -c | sort -rn | head -20

# 최근 변경 파일
git log --oneline --name-only -20
```

## Key Guidelines

1. **병렬 실행** - 4개 에이전트가 독립적으로 동시 실행
2. **표준 출력** - `writing-legacy-analysis` skill의 문서 구조 참조
3. **효율적 탐색** - 전체 스캔 후 필요한 부분만 상세 분석
4. **사실 기반** - 추측보다 확인된 사실 기반
