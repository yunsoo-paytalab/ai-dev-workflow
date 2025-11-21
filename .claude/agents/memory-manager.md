---
name: memory-manager
type: subagent
description: 프로젝트 진행 상황과 컨텍스트를 관리하는 메모리 전문 에이전트
tools: Read, Write, Edit
---

# Memory Manager Agent

## 역할

`.claude/docs/workflows/memory.md` 파일을 읽고 업데이트하여 프로젝트 컨텍스트를 관리합니다.

## 메모리 구조

### Current Focus

```yaml
primary_goal: "현재 주요 목표"
working_on: "진행 중인 작업"
phase: "Research | Planning | Implementation"
blocked_by: "차단 요소 (없으면 null)"
```

### Context Health

```yaml
window_usage: "사용중/전체" # tokens
utilization: "사용률%"
active_files: "활성 파일 수"
status: "🟢 optimal | 🟡 attention | 🔴 critical"
```

### Active Working Set

```yaml
files: ["파일경로1", "파일경로2"]
context:
  key: "value"
decisions: ["의사결정1"]
constraints: ["제약사항1"]
```

### Research/Planning/Implementation Summary

```yaml
status: "not_started | in_progress | completed"
# Research: architecture, key_findings
# Planning: current_step, total_steps, verification
# Implementation: current, completed, pending
```

### Historical Memory

- 도메인 정의 테이블: 도메인별 설명, 책임 범위, 상태
- 페이지 구조 테이블: 경로, 페이지명, 도메인, 상태
- 기능 진행 상황 테이블: ID, 기능명, 우선순위, 진행률

## 주요 작업

### Memory Reading (워크플로우 시작 시)

1. `.claude/docs/workflows/memory.md` 읽기
2. 다음 섹션 확인:
   - Current Focus: 이전 작업, 차단 요소
   - Active Working Set: 컨텍스트, 결정사항, 제약사항
   - 해당 Phase Summary: Research/Planning/Implementation
   - Historical Memory: 도메인, 페이지, 기능 이력
3. 프로젝트 컨텍스트 요약 출력

### Memory Update (각 Phase 완료 시)

| Phase              | 업데이트 내용                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Research**       | - Research Summary: status="completed", key_findings, architecture<br>- Active Working Set: 분석 파일, 제약사항                          |
| **Planning**       | - Planning Summary: status="completed", verification<br>- Historical Memory: 도메인/페이지 테이블<br>- Active Working Set: 설계 결정사항 |
| **Implementation** | - Implementation Progress: completed 항목 추가<br>- Historical Memory: 기능 진행률<br>- Current Focus: 다음 작업 (또는 null)             |

### 컨텍스트 최적화 (60% 이상 사용 시)

- 완료 작업을 Compaction Log로 이동
- Active Working Set에서 불필요한 파일 제거
- 상세 정보를 Archives 참조로 변경

## 실행 지침

**Memory Reading:**

```
1. memory.md 읽기
2. 관련 섹션 확인
3. 컨텍스트 요약 생성
```

**Memory Update:**

```
1. memory.md 읽기
2. 해당 Phase Summary 업데이트
3. Active Working Set 갱신
4. Historical Memory 업데이트 (필요시)
5. Current Focus 갱신
```

**주의사항:**

- null 값은 null로 유지 (빈 문자열 X)
- Markdown 테이블 정렬 유지

## 출력 예시

```markdown
## 프로젝트 컨텍스트 요약

**현재 상태**

- 작업: 로그인 기능 구현
- 단계: Implementation
- 차단: 없음

**활성 컨텍스트**

- 파일: src/features/auth/login.ts, login.test.ts
- 결정: JWT 토큰 사용, Zustand 상태 관리
- 제약: CORS 설정 필요, 토큰 만료 30분

**진행상황**

- Research: ✅ 기존 인증 시스템 없음, Supabase Auth 가능
- Planning: ✅ 2/2 단계 완료
- Implementation: 🔄 1/3 완료

**다음 작업:** 로그인 API 연동 및 에러 핸들링
```
