# /workflow-feature-spec [기능명]

선택한 기능의 요구사항을 분석하고 구현 계획을 수립합니다.

## 실행 프로세스

### Phase 0: Restricted Zones Loading (제한 영역 로드)

`.claude/docs/legacy-analysis/restricted-zones.json` 확인 (있는 경우)

**Danger Zones (위험도별 컨펌 필요):**

- 🔴 Critical: 반드시 명시적 승인 필요
- 🟠 High Risk: 변경 계획 + 승인 필요
- 🟡 Medium Risk: 주의 안내 필요
- 🟢 Safe: 자유롭게 수정 가능

**No-Reference Zones (참고 금지):**

- 🚫 Anti-Pattern, ⛔ Deprecated, 🔧 Hack, 🐛 Known Bug
- 해당 영역의 코드는 읽거나 참고하지 않음

### Phase 1: Memory Reading (메모리 읽기)

**Agent: memory-manager**

- `.claude/docs/memory/memory.md` 파일 읽기
- Current Focus: 이전 작업 및 차단 요소 확인
- Active Working Set: 현재 컨텍스트, 의사결정, 제약사항 로드
- Implementation Progress: 진행 중인 작업 및 완료 항목 확인
- Historical Memory: 기능 구현 이력 및 패턴 확인
- 출력: 프로젝트 컨텍스트 요약
  - 현재 상태 (마지막 작업, 진행 단계, 차단 요소)
  - 활성 컨텍스트 (파일, 결정사항, 제약사항)
  - 단계별 진행상황

### Phase 2: Research (조사)

> ⚠️ Phase 0에서 로드한 제한 영역 준수

**Agent: research-agent**

- 기능 요구사항 분석
- 관련 코드베이스 탐색
- 재사용 가능 컴포넌트 확인
- 기술 스택 및 라이브러리 조사
- 유사 기능 구현 패턴 분석
- 출력: `.claude/docs/research/[기능명]-analysis.md`
- **AgentId 저장**: 재개를 위한 ID 기록

### Phase 3: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- Research 결과 검토
- 요구사항 분석의 정확성 확인
- 재사용 컴포넌트 선택 검증
- 기술적 접근 방식 승인
- 추가 조사 필요 여부 결정

### Phase 4: Planning (계획)

**Agent: planning-agent**

- 구현 계획 수립
- 테스트 시나리오 설계
- 컴포넌트 구조 설계
- API 인터페이스 정의
- 데이터 플로우 설계
- 출력: `.claude/docs/plans/[기능명]-plan.md`

### Phase 5: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 구현 계획의 타당성 확인
- 테스트 시나리오 검증
- 컴포넌트 구조 승인
- API 설계 검토
- 구현 우선순위 조정

### Phase 6: Memory Update (메모리 업데이트)

**Agent: memory-manager**

- `.claude/docs/memory/memory.md` 업데이트
- Research Summary 업데이트
  - status: "completed"
  - key_findings: 주요 발견사항 추가
- Planning Summary 업데이트
  - status: "completed"
  - verification: 검증 완료 항목
- Active Working Set 갱신
  - 기술적 결정사항 기록
  - 제약사항 업데이트
- Current Focus 갱신
  - primary_goal: 다음 작업 목표 (구현 단계)
  - working_on: 구현 대기
  - phase: "Planning → Implementation"

## 사용자 결정 포인트

🔔 **Phase 3 확인 사항**:

- 요구사항이 명확히 파악되었는가?
- 선택한 기술 스택이 적절한가?
- 재사용 가능한 컴포넌트가 모두 식별되었는가?

🔔 **Phase 5 확인 사항**:

- 테스트 시나리오가 충분한가?
- 컴포넌트 구조가 확장 가능한가?
- API 설계가 RESTful 원칙을 따르는가?
- Mock 데이터 구조가 적절한가?

## 결과물

- `.claude/docs/research/[기능명]-analysis.md` - 기능 분석 문서
- `.claude/docs/plans/[기능명]-plan.md` - 구현 계획서
- `.claude/docs/memory/memory.md` - 업데이트된 프로젝트 메모리

## 다음 단계

기능 명세가 완료되면 `/workflow-implement [기능명]`을 실행하여 구현을 시작합니다.
