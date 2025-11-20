# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다. RPI 패턴을 적용하여 체계적으로 진행합니다.

## 실행 프로세스

### Phase 0: Restricted Zones Loading (제한 영역 로드)

`docs/legacy-analysis/restricted-zones.json` 확인 (있는 경우)

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

- `docs/workflows/memory.md` 파일 읽기
- Current Focus: 이전 작업 및 차단 요소 확인
- Active Working Set: 현재 컨텍스트, 의사결정, 제약사항 로드
- Research Summary: 이전 조사 결과 확인
- Historical Memory: 도메인, 페이지, 기능 이력 확인
- 출력: 프로젝트 컨텍스트 요약
  - 현재 상태 (마지막 작업, 진행 단계, 차단 요소)
  - 활성 컨텍스트 (파일, 결정사항, 제약사항)
  - 단계별 진행상황

### Phase 2: Research (분석)

> ⚠️ Phase 0에서 로드한 제한 영역 준수

**Agent: research-agent**

- 요구사항 문서 분석 (requirements.md)
- 기존 코드베이스 탐색
- 기술 스택 및 제약사항 파악
- 비즈니스 요구사항 이해
- 출력: `docs/research/domain-analysis.md`
- **AgentId 저장**: 추후 재개를 위해 ID 기록

### Phase 3: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- Research 결과 검토
- 분석 내용의 정확성 확인
- 추가 요구사항 또는 누락 사항 파악
- 승인 또는 수정 요청

### Phase 4: Domain Documentation (도메인 문서화)

**Agent: planning-agent**

- Research 결과를 바탕으로 도메인 모델 설계
- 도메인 경계 정의
- 기능 목록 도출 및 분류
- 페이지 구조 및 라우팅 설계
- 엔티티 및 관계 정의
- 출력:
  - `docs/domain-definition.md`
  - `docs/feature-list.md`
  - `docs/page-structure.md`

### Phase 5: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 도메인 경계 적절성 확인
- 기능 배치 검증
- 누락 기능 체크
- 페이지 구조 합리성 확인
- 엔티티 관계 검토

### Phase 6: Memory Update (메모리 업데이트)

**Agent: memory-manager**

- `docs/workflows/memory.md` 업데이트
- Research Summary 업데이트
  - status: "completed"
  - key_findings: 주요 발견사항 추가
  - architecture: 아키텍처 요약
- Planning Summary 업데이트
  - status: "completed"
  - verification: 검증 완료 항목
- Historical Memory 업데이트
  - 도메인 정의 테이블에 새 도메인 추가
  - 페이지 구조 테이블에 페이지 추가
  - 기능 진행 상황 테이블에 기능 추가
- Active Working Set 갱신
  - 설계 결정사항 기록
  - 제약사항 업데이트
- Current Focus 갱신
  - primary_goal: 다음 단계 목표
  - working_on: null (완료)
  - phase: null

## 사용자 결정 포인트

🔔 **Phase 3 확인 사항**:

- 비즈니스 요구사항이 정확히 분석되었는가?
- 기술적 제약사항이 모두 파악되었는가?
- 추가 조사가 필요한 부분은 없는가?

🔔 **Phase 5 확인 사항**:

- 도메인이 비즈니스 요구사항과 일치하는가?
- 기능 의존성이 올바르게 정의되었는가?
- UI/UX 흐름이 직관적인가?

## 결과물

- `docs/research/domain-analysis.md` - 도메인 분석 결과
- `docs/domain-definition.md` - 도메인 정의 문서
- `docs/feature-list.md` - 기능 목록
- `docs/page-structure.md` - 페이지 구조
- `docs/workflows/memory.md` - 업데이트된 프로젝트 메모리
