---
name: workflow-legacy-profile
description: 브라운필드 프로젝트를 위하여 레거시 코드를 분석하고 위험 영역을 식별하는 커맨드
version: 3.2.0
---

# /workflow-legacy-profile

브라운필드 프로젝트를 위한 레거시 코드 분석 및 위험 영역 식별 워크플로우입니다.

> ⚠️ **다른 모든 워크플로우보다 먼저 실행**되어야 합니다.

## 실행 프로세스

### Phase 1: Parallel Deep Analysis (병렬 심층 분석)

⚡ **4개 Agent 동시 실행:**

| Agent                 | 출력                                                  |
| --------------------- | ----------------------------------------------------- |
| structure-analyzer    | `.claude/docs/legacy-analysis/structure-overview.md`  |
| dependency-analyzer   | `.claude/docs/legacy-analysis/dependency-graph.md`    |
| debt-analyzer         | `.claude/docs/legacy-analysis/technical-debt.md`      |
| business-logic-mapper | `.claude/docs/legacy-analysis/core-business-logic.md` |

### Phase 2: Risk Classification (위험도 분류)

> Phase 1 완료 후 순차 실행

**Agent: risk-classifier**

출력:

- `.claude/docs/legacy-analysis/danger-zones.md`
- `.claude/docs/legacy-analysis/no-reference-zones.md`
- `.claude/docs/legacy-analysis/restricted-zones.json` (머신 리더블)

**Danger Zones (위험도별 컨펌):**

- 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Safe

**No-Reference Zones (참고 금지):**

- 🚫 Anti-Pattern, ⛔ Deprecated, 🔧 Hack, 🐛 Known Bug

### Phase 3: Safety Rules Definition

사용자 검토:

- AI가 제안한 danger-zones/no-reference-zones 검토
- 추가 위험 영역 지정
- **restricted-zones.json 최종 확정**

**승인 후:**

```bash
node .claude/hooks/memory-sync.cjs workflow-complete legacy-profile
```

### (Optional) Phase 4: Refactoring Strategy

**Agent: planning-agent** → `.claude/docs/legacy-analysis/refactoring-strategy.md`

- 위험도별 접근 전략
- 점진적 개선 로드맵

## 후속 워크플로우 연계

후속 워크플로우들은:

1. `restricted-zones.json` 자동 로드
2. Danger Zones 수정 시 위험도별 컨펌 프로세스
3. No-Reference Zones는 완전 무시 (읽기도 금지)

## 결과물

```
.claude/docs/legacy-analysis/
├── structure-overview.md
├── dependency-graph.md
├── technical-debt.md
├── core-business-logic.md
├── danger-zones.md
├── no-reference-zones.md
├── restricted-zones.json
└── refactoring-strategy.md (선택)
```
