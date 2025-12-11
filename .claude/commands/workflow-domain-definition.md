# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다. RPI 패턴을 적용하여 체계적으로 진행합니다.

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

### Phase 1: Research (분석)

> ⚠️ Phase 0에서 로드한 제한 영역 준수

**Agent: research-agent**

- 요구사항 문서 분석 (requirements.md)
- 기존 코드베이스 탐색
- 기술 스택 및 제약사항 파악
- 비즈니스 요구사항 이해
- 출력: `.claude/docs/research/domain-analysis.md`
- **AgentId 저장**: 추후 재개를 위해 ID 기록

### Phase 2: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- Research 결과 검토
- 분석 내용의 정확성 확인
- 추가 요구사항 또는 누락 사항 파악
- 승인 또는 수정 요청

### Phase 3: Domain Documentation (도메인 문서화)

⚡ **IMPORTANT: 3개의 Agent를 병렬로 동시에 실행**

**한 번의 메시지에서 3개의 Task를 모두 호출하여 병렬 실행:**

1. **Agent: domain-definition-writer**

   - Research 결과 (`.claude/docs/research/domain-analysis.md`)를 바탕으로 도메인 정의 문서 작성
   - 출력: `.claude/docs/domain-definition.md`

2. **Agent: feature-classifier**

   - Research 결과 (`.claude/docs/research/domain-analysis.md`)를 바탕으로 Feature/Task 분류 리스트 작성
   - 출력: `.claude/docs/feature-list.md` (상세 문서 없이 리스트만)

3. **Agent: page-structure-writer**
   - Research 결과 (`.claude/docs/research/domain-analysis.md`)를 바탕으로 페이지 구조 문서 작성
   - 출력: `.claude/docs/page-structure.md`

**출력 파일**:

- `.claude/docs/domain-definition.md`
- `.claude/docs/feature-list.md` (Feature/Task 리스트)
- `.claude/docs/page-structure.md`

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 도메인 경계 적절성 확인
- **Feature 분류 검토** (완결된 기능 단위로 적절하게 분류되었는지)
- **Task 분류 검토** (개별 작업 단위로 적절하게 분류되었는지)
- 누락 기능 체크
- 페이지 구조 합리성 확인
- 엔티티 관계 검토

**사용자 승인 후 자동 진행:**

- 승인 시: **즉시 Phase 5로 진행** (Feature 상세 문서 작성)
- 수정 요청 시: Phase 3으로 돌아가 수정 후 다시 검토

⚠️ **IMPORTANT**: 사용자가 승인하면 반드시 Phase 5를 실행해야 합니다. Phase 5를 건너뛰지 마세요.

### Phase 5: Feature Detail Writing (Feature 상세 문서 작성)

⚠️ **필수 단계** - 이 단계를 건너뛰면 후속 워크플로우에서 Feature 상세 정보를 참조할 수 없습니다.

**Agent: feature-detail-writer**

**실행 방법:**

```
Task 도구를 사용하여 feature-detail-writer 에이전트 호출:
- subagent_type: "feature-detail-writer"
- prompt: "Feature 목록(.claude/docs/feature-list.md)을 바탕으로 각 Feature의 상세 문서를 작성하세요."
```

**에이전트 작업 내용:**

1. `.claude/docs/feature-list/` 디렉토리 생성
2. 각 Feature마다 상세 문서 작성: `[기능ID]-[기능명].md`
3. `.claude/docs/feature-list.md`에 상세 문서 링크 추가

**출력 파일**:

- `.claude/docs/feature-list/[기능ID]-[기능명].md` (각 기능별)
- `.claude/docs/feature-list.md` (상세 문서 링크 업데이트)

**검증:**

- 모든 Feature에 대한 상세 문서 파일 존재 확인
- 링크 연결 정확성 확인

### Phase 6: Memory Update (메모리 업데이트) - 필수

> ⚠️ **필수**: 워크플로우 종료 전 반드시 memory-manager 에이전트를 호출해야 합니다.
>
> 호출 방법: "Use the memory-manager agent to update memory for domain-definition completion"

**Agent: memory-manager** (MUST BE CALLED)

**업데이트 대상:**

1. **memory.md 업데이트:**
   - 기술 스택 섹션
   - 도메인 목록 섹션
   - 페이지 구조 섹션
   - 체크리스트: "도메인 정의 완료" 체크

2. **progress.json 업데이트:**
   - features: 도메인 정의에서 도출된 기능 목록 추가
   - tasks: 다음 단계 작업 항목 추가
   - currentPhase: "domain-definition-completed"

3. **세션 요약 작성:**
   - 이번 세션에서 수행한 작업 요약
   - 주요 결정사항 기록

## 사용자 결정 포인트

🔔 **Phase 3 확인 사항**:

- 비즈니스 요구사항이 정확히 분석되었는가?
- 기술적 제약사항이 모두 파악되었는가?
- 추가 조사가 필요한 부분은 없는가?

🔔 **Phase 5 확인 사항**:

- 도메인이 비즈니스 요구사항과 일치하는가?
- Feature가 완결된 기능 단위로 적절하게 분류되었는가?
- Task가 개별 작업 단위로 적절하게 분류되었는가?
- 기능 의존성이 올바르게 정의되었는가?
- UI/UX 흐름이 직관적인가?

## 결과물

- `.claude/docs/research/domain-analysis.md` - 도메인 분석 결과
- `.claude/docs/domain-definition.md` - 도메인 정의 문서
- `.claude/docs/feature-list.md` - Feature/Task 목록
- `.claude/docs/feature-list/[기능ID]-[기능명].md` - 각 Feature 상세 문서
- `.claude/docs/page-structure.md` - 페이지 구조
