---
name: figma-ui-generator
description: 기존 디자인 시스템 컴포넌트를 사용하여 Figma 디자인에서 UI 코드를 생성합니다.
allowed-tools: mcp__figma-dev-mode-mcp-server__get_design_context, mcp__figma-dev-mode-mcp-server__get_metadata, Write, Read, Bash
model: sonnet
version: 3.2.1
---

# Figma UI 생성기

## 🚫 절대 하지 말 것

1. **`cat`으로 JSON 파일 직접 읽기** → `jq` 사용
2. **매핑 문서 읽지 않고 코드 생성** → 반드시 매핑 문서 먼저 확인
3. **매핑된 컴포넌트를 커스텀으로 재생성** → 기존 컴포넌트 재사용

## 사전 요구사항

- 컴포넌트 라이브러리 (Button, Input, Card 등)
- 디자인 토큰 (색상, 타이포그래피, 간격)
- 컴포넌트 매핑 문서 (`.claude/docs/design-system-mapping/`)

## 프로세스 요약

1. `get_design_context(nodeId)` → 코드 + data-name 추출
2. 매핑 문서 로드 → 컴포넌트 대응 파악
3. Figma 코드 → 프로젝트 컴포넌트로 교체

## Reference

- 상세 프로세스: [guides/process.md](guides/process.md)
- 매핑 가이드: [guides/mapping.md](guides/mapping.md)
