# 메모리 관리 명령어

## 메모리 경로 확인

```bash
cat .claude/docs/memory/.memory-ref
```

## 결정사항 추가

memory.md의 "핵심 결정사항" 테이블에 행 추가:

```markdown
| 날짜       | 결정 내용          | 근거            |
| ---------- | ------------------ | --------------- |
| 2024-01-16 | JWT 인증 방식 채택 | 팀 표준, 확장성 |
```

## 워크플로우 명령어

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
