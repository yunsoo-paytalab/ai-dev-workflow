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

### Phase 2: Research & Design (조사 및 설계)

> ⚠️ Phase 0에서 로드한 제한 영역 준수

**Agent: research-agent**

**조사 항목:**

- 기능 요구사항 분석
- 관련 코드베이스 탐색
- 재사용 가능 컴포넌트 확인
- 유사 기능 구현 패턴 분석

**설계 항목:**

- 변경 사항 설계 (Before → After)
- 인터페이스/타입 정의
- API 스펙 설계
- 데이터 흐름 설계
- 컴포넌트 구조 (개요만, 상세는 /workflow-ui에서)
- 핵심 로직 설계 (pseudo-code, 핵심 비즈니스 로직은 실제 코드)
- 테스트 설계 (핵심 비즈니스 로직 Unit Test, 핵심 컴포넌트 Component Test)

**출력:** `.claude/docs/specs/[기능명]-spec.md` (섹션 1~4)

### Phase 3: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 요구사항 분석의 정확성 확인
- 기술 설계의 타당성 검토
- 재사용 컴포넌트 선택 검증
- 추가 조사 필요 여부 결정

**API 문서 확인 (API 구현이 필요한 경우)**

- 참고할 API 문서(Notion 등) URL이 있는지 사용자에게 확인
- URL 제공 시: Notion MCP를 활용하여 API 스펙 확인
- API 스펙 기반으로 인터페이스/타입 정의 보완

### Phase 4: Planning (계획)

**Agent: planning-agent**

- Research 결과 기반 구현 계획 수립
- 의사결정 필요 항목 정리
- Phase별 작업 목록 작성 (파일명 + 한 줄 설명)
- 검증 방법 정의

**출력:** `.claude/docs/specs/[기능명]-spec.md` (섹션 5 추가)

### Phase 5: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 의사결정 항목 확인 및 선택
- 구현 순서 검토
- 검증 방법 확인

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
- 기술 설계가 적절한가?
- 재사용 가능한 컴포넌트가 모두 식별되었는가?
- (API 구현 필요 시) 참고할 API 문서 URL이 있는가?

🔔 **Phase 5 확인 사항**:

- 의사결정 항목에 대한 선택이 완료되었는가?
- 구현 순서가 적절한가?
- 검증 방법이 충분한가?

## 결과물

- `.claude/docs/specs/[기능명]-spec.md` - 통합 기능 명세서 (Research + Plan)
- `.claude/docs/memory/memory.md` - 업데이트된 프로젝트 메모리

## 다음 단계

기능 명세가 완료되면 `/workflow-implement [기능명]`을 실행하여 구현을 시작합니다.
