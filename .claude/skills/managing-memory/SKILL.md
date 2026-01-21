---
name: managing-memory
description: 프로젝트 메모리(memory.md)를 관리하는 전략 가이드. 주요 결정사항 기록 시 사용.
model: haiku
version: 3.2.1
---

# Managing Memory

프로젝트 세션 간 컨텍스트를 유지하는 메모리 시스템 관리 가이드입니다.

## Core Principle

**"결정사항만 수동 기록, 진행 상황은 자동 처리"**

- 주요 결정사항: 리드 에이전트가 직접 기록
- 진행 상황: Hook이 자동으로 업데이트
- 세션 정보: 자동 관리

## When to Use

### 기록해야 하는 상황

- 기술적 결정이 내려졌을 때 (라이브러리 선택, 아키텍처 결정)
- 중요한 트레이드오프가 있었을 때
- 프로젝트 컨벤션이 확정되었을 때

### 기록하지 않아도 되는 상황

- 단순 구현 작업
- 워크플로우 진행 상황 업데이트 (자동 처리됨)

## Reference

- 기록 가이드: [guides/recording.md](guides/recording.md)
- Hook 스크립트: [guides/hooks.md](guides/hooks.md)
- 메모리 구조: [guides/structure.md](guides/structure.md)
- 명령어: [guides/commands.md](guides/commands.md)
