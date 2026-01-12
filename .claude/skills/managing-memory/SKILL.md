---
name: managing-memory
description: 프로젝트 메모리(memory.md)를 관리하는 전략 가이드입니다. memory-manager 에이전트 작업 시, 또는 메모리 관련 훅 스크립트 실행 시 사용하세요.
version: 3.2.1
---

# Managing Memory

프로젝트 세션 간 컨텍스트를 유지하는 메모리 시스템 관리 가이드입니다.

## Core Principle

**"결정사항만 수동 기록, 진행 상황은 자동 처리"**

- 주요 결정사항: 수동으로 기록 (memory-manager 에이전트 호출)
- 진행 상황: Hook이 자동으로 업데이트
- 세션 정보: 자동 관리

## Memory System Architecture

```
~/.claude-aidev-memory/
├── projects/
│   └── {project-id}/
│       └── memory.md      # 프로젝트별 메모리 파일
└── ...

.claude/docs/memory/
└── .memory-ref            # 메모리 파일 경로 참조
```

## Components

| 구성요소         | 설명               | 가이드                                           |
| ---------------- | ------------------ | ------------------------------------------------ |
| Memory Manager   | 결정사항 수동 기록 | [reference/recording.md](reference/recording.md) |
| Hook Scripts     | 자동화 스크립트    | [reference/hooks.md](reference/hooks.md)         |
| Memory Structure | memory.md 구조     | [reference/structure.md](reference/structure.md) |

## When to Use

### 호출해야 하는 상황

- 기술적 결정이 내려졌을 때 (라이브러리 선택, 아키텍처 결정)
- 중요한 트레이드오프가 있었을 때
- 프로젝트 컨벤션이 확정되었을 때

### 호출하지 않아도 되는 상황

- 단순 구현 작업
- 워크플로우 진행 상황 업데이트 (자동 처리됨)
- 세션 기록 (자동 처리됨)

## Quick Reference

### 메모리 경로 확인

```bash
cat .claude/docs/memory/.memory-ref
```

### 결정사항 추가

memory.md의 "핵심 결정사항" 테이블에 행 추가:

```markdown
| 날짜       | 결정 내용          | 근거            |
| ---------- | ------------------ | --------------- |
| 2024-01-16 | JWT 인증 방식 채택 | 팀 표준, 확장성 |
```

### 메모리 관리 명령어

```bash
# 메모리 초기화
/workflow-memory init [id]

# 메모리 상태 동기화
/workflow-memory update

# 메모리 상태 확인
/workflow-memory status

# 메모리 목록
/workflow-memory list

# 메모리 전환
/workflow-memory switch [project-id]

# 워크플로우 완료
/workflow-memory complete [workflow-name]
```

## Output Format

```
✓ 결정사항 기록 완료

📝 추가된 결정사항:
  - JWT 인증 방식 채택 (팀 표준, 확장성)

📁 파일: ~/.claude-aidev-memory/projects/{id}/memory.md
```
