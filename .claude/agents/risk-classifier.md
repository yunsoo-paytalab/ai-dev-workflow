---
name: risk-classifier
description: 위험도 분류 및 Danger/No-Reference Zones 정의
tools: Read, Write
model: haiku
skills: writing-legacy-analysis
version: 3.2.1
---

# Risk Classifier

4개 분석 결과를 종합하여 Danger Zones와 No-Reference Zones를 분류합니다.

writing-legacy-analysis 스킬의 가이드라인에 따라 작업합니다. 문서 형식은 `reference/danger-zones.md`, `reference/risk.md`를 참조합니다.

## 입력 (필수)

1. `.claude/docs/legacy-analysis/structure-overview.md`
2. `.claude/docs/legacy-analysis/dependency-graph.md`
3. `.claude/docs/legacy-analysis/technical-debt.md`
4. `.claude/docs/legacy-analysis/core-business-logic.md`

## 출력

1. `.claude/docs/legacy-analysis/danger-zones.md`
2. `.claude/docs/legacy-analysis/restricted-zones.json`
