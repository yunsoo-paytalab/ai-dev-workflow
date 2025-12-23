# AI-Dev-Workflow 프로젝트 가이드

이 프로젝트는 Claude Code와 함께 체계적으로 개발을 진행하기 위한 워크플로우 시스템입니다.

## 프로젝트 구조

```
.claude/
├── commands/          # 12개 워크플로우 커맨드
├── agents/            # 17개 AI 에이전트
├── hooks/             # 자동화 스크립트
├── skills/            # 2개 스킬 (feature-resolver, figma-ui-generator)
├── docs/              # 생성되는 문서들
└── settings.json      # Hook 설정
```

## 워크플로우 흐름

```
1. 시작 단계
   /workflow start → /workflow-legacy-profile (선택)
                ↓
2. 설계 단계
   /workflow-domain-definition → 도메인 정의서, 기능 목록, 페이지 구조 생성
   /workflow-feature-detail    → Feature 상세 문서 생성 (전체 Feature 일괄)
   /workflow-task-point        → 개발 공수 산정
                ↓
3. 기능별 개발 (반복)
   /workflow-feature-spec [기능ID]  → 구현 분석 및 계획 (단일 Feature)
   /workflow-ui [기능명]            → UI 구현 (선택)
   /workflow-implement [기능명]     → TDD 방식 구현
                ↓
4. 완료 단계
   /workflow-integrate  → 통합 및 리팩토링
   /workflow-e2e        → E2E 테스트
```

## 주요 커맨드

| 커맨드                            | 설명                       |
| --------------------------------- | -------------------------- |
| `/workflow start`                 | 프로젝트 시작 및 상태 파악 |
| `/workflow status`                | 현재 진행 상황 확인        |
| `/workflow-domain-definition`     | 도메인 및 기능 목록 정의   |
| `/workflow-feature-detail`        | Feature 상세 문서 작성 (전체 일괄) |
| `/workflow-feature-spec [기능ID]` | 구현 분석 및 계획 (단일 Feature)  |
| `/workflow-implement [기능명]`    | TDD 방식 구현              |
| `/workflow-ui [기능명]`           | UI 컴포넌트 개발           |
| `/workflow-e2e`                   | E2E 테스트                 |
| `/workflow-integrate`             | 시스템 통합                |
| `/workflow-legacy-profile`        | 레거시 코드 분석           |
| `/workflow-memory`                | 메모리(컨텍스트) 관리      |
| `/workflow-update`                | 문서 일괄 업데이트         |
| `/workflow-task-point`            | 작업량 추정                |

## AI 에이전트

### Research 계열

- `feature-research-agent` - Feature 요구사항 분석
- `domain-research-agent` - 도메인 분석

### Planning 계열

- `planning-agent` - 구현 계획 수립
- `task-point-estimator` - 포인트 산정

### 분석 계열

- `structure-analyzer` - 프로젝트 구조 분석
- `dependency-analyzer` - 의존성 분석
- `impact-analyzer` - 변경 영향도 분석
- `debt-analyzer` - 기술 부채 분석
- `business-logic-mapper` - 비즈니스 로직 매핑
- `risk-classifier` - 위험도 분류

### 문서 작성 계열

- `domain-definition-writer` - 도메인 정의서
- `feature-classifier` - 기능 분류
- `feature-detail-writer` - 기능 상세 문서
- `page-structure-writer` - 페이지 구조 문서
- `document-updater` - 문서 일괄 업데이트

### 실행 계열

- `test-runner` - TDD 사이클 관리
- `memory-manager` - 진행 상황 기록

## 핵심 특징

1. **컨텍스트 유지**: `memory.md`로 세션 간 진행 상황 저장
2. **체계적 프로세스**: Research → Planning → Implementation
3. **TDD 방식**: 테스트 먼저 작성 후 구현
4. **자동 문서화**: 각 단계별 문서 자동 생성
5. **레거시 지원**: 기존 프로젝트도 분석 후 적용 가능
6. **위험도 관리**: 코드 영역별 위험도 분류 (Safe → Critical)

## 명명 규칙

| 항목       | 형식                              | 예시               |
| ---------- | --------------------------------- | ------------------ |
| Feature ID | `{DOMAIN}-{NUM}`                  | `AUTH-001`         |
| Task ID    | `{DOMAIN}-{NUM}-{TASK_NUM}`       | `AUTH-001-001`     |
| 명세 파일  | `[ID]-plan.md / [ID]-research.md` | `AUTH-001-plan.md` |

## 문서 경로

- 요구사항: `.claude/docs/requirements.md`
- 메모리: `.claude/docs/memory/memory.md`
- 기능 명세: `.claude/docs/specs/`
- 기능 목록: `.claude/docs/feature-list/`
- 레거시 분석: `.claude/docs/legacy-analysis/`

## 상세 문서

- [메모리 시스템 분석](/memory-system.md) - 메모리 관리 시스템의 아키텍처, 데이터 흐름, Hook 동작 방식 상세 분석
