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
> ⚠️ **설계는 하지 않음** - 분석만 수행

**Agent: domain-research-agent**

- 요구사항 문서 분석 (requirements.md)
- 기존 코드베이스 탐색
- 기술 스택 및 제약사항 파악
- 비즈니스 요구사항 이해
- 출력: `.claude/docs/research/domain-research.md`

### Phase 2: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- Research 결과 검토
- 분석 내용의 정확성 확인
- 추가 요구사항 또는 누락 사항 파악
- 승인 또는 수정 요청

### Phase 3: Design & Documentation (설계 및 문서화)

> Research 분석 결과를 바탕으로 **설계**와 **문서화**를 수행합니다.

#### Phase 3-1: 병렬 실행 (도메인 설계 + 페이지 설계)

⚡ **IMPORTANT: 2개의 Agent를 병렬로 동시에 실행**

**한 번의 메시지에서 2개의 Task를 호출하여 병렬 실행:**

1. **Agent: domain-definition-writer**

   - Research 결과 (`.claude/docs/research/domain-research.md`)를 바탕으로 도메인 설계 및 문서 작성
   - Bounded Context, 엔티티/인터페이스 설계 포함
   - 출력: `.claude/docs/domain-definition.md`

2. **Agent: page-structure-writer**
   - Research 결과 (`.claude/docs/research/domain-research.md`)를 바탕으로 페이지/라우팅 설계 및 문서 작성
   - 출력: `.claude/docs/page-structure.md`

#### Phase 3-2: 순차 실행 (Feature 분류)

> ⚠️ Phase 3-1 완료 후 실행 - domain-definition.md를 참조하여 더 정확한 분류 수행

**Agent: feature-classifier**

- 입력:
  - Research 결과 (`.claude/docs/research/domain-research.md`)
  - 도메인 설계 결과 (`.claude/docs/domain-definition.md`) ← **추가 참조**
- 도메인 구조를 참고하여 Feature/Task 분류 리스트 작성
- 출력: `.claude/docs/feature-list.md` (상세 문서 없이 리스트만)

**출력 파일**:

- `.claude/docs/domain-definition.md`
- `.claude/docs/page-structure.md`
- `.claude/docs/feature-list.md` (Feature/Task 리스트)

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 도메인 경계 적절성 확인
- **Feature 분류 검토** (완결된 기능 단위로 적절하게 분류되었는지)
- **Task 분류 검토** (개별 작업 단위로 적절하게 분류되었는지)
- 누락 기능 체크
- 페이지 구조 합리성 확인
- 엔티티 관계 검토

**사용자 승인 후:**

1. **워크플로우 완료 처리** (Bash 실행):
   ```bash
   node .claude/hooks/memory-sync.cjs workflow-complete domain-definition
   ```

2. **즉시 Phase 5로 진행** (Feature 상세 문서 작성)

⚠️ **IMPORTANT**:
- 사용자가 승인하면 반드시 위 Bash 명령을 먼저 실행하세요
- 그 다음 Phase 5를 실행해야 합니다. Phase 5를 건너뛰지 마세요
- 수정 요청 시: Phase 3으로 돌아가 수정 후 다시 검토

### Phase 5: Feature Detail Writing (Feature 상세 문서 작성)

⚠️ **필수 단계** - 이 단계를 건너뛰면 후속 워크플로우에서 Feature 상세 정보를 참조할 수 없습니다.

⚡ **IMPORTANT: 병렬 실행으로 처리 시간 단축**

**실행 방법:**

1. **디렉토리 먼저 생성** (병렬 실행 전 필수)
   ```bash
   mkdir -p .claude/docs/feature-list
   ```
2. Feature 목록을 다중 배치로 분할 (한 그룹에 feature 3~4개씩)
3. 각 배치에 대해 feature-detail-writer 에이전트를 **병렬 호출**

**예시 (17개 Feature 기준):**

한 번의 메시지에서 4개의 Task를 병렬 호출:

```
Task 1: feature-detail-writer
- prompt: "다음 Feature만 작성: AUTH-001, AUTH-002, DASH-001, DASH-002, TEST-001"

Task 2: feature-detail-writer
- prompt: "다음 Feature만 작성: TEST-002, TEST-003, PASSER-001, PASSER-002"

Task 3: feature-detail-writer
- prompt: "다음 Feature만 작성: PASSER-003, STORE-001, STORE-002, MSG-001"

Task 4: feature-detail-writer
- prompt: "다음 Feature만 작성: MSG-002, SHARED-001, SHARED-002, SHARED-003, SHARED-004"
```

**배치 분할 기준:**

- 병렬 작업 Agent 수: Feature 수 ÷ 4 (약 4~5개씩)
- 도메인별 그룹핑 권장

**병렬 완료 후:**

- `.claude/docs/feature-list.md`에 상세 문서 링크 일괄 추가
- 모든 Feature 문서 존재 여부 검증

**출력 파일**:

- `.claude/docs/feature-list/[기능ID]-[기능명].md` (각 기능별)
- `.claude/docs/feature-list.md` (상세 문서 링크 업데이트)

**검증:**

- 모든 Feature에 대한 상세 문서 파일 존재 확인
- 링크 연결 정확성 확인

### Phase 6: Progress 동기화

⚠️ **필수 단계** - Feature 상세 문서 작성 완료 후 반드시 실행

**Bash로 실행:**

```bash
node .claude/hooks/memory-sync.cjs sync-progress
```

이 명령은 다음을 수행합니다:

- `domain-definition.md` → progress.json (도메인 정보)
- `feature-list.md` + `feature-list/*.md` → progress.json (Feature/Task 정보)
- progress.json → memory.md (체크리스트 동기화)

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
>
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/\*.md (자동)

**중요한 기술적 결정**이 있었다면 memory-manager 에이전트를 호출하여 기록하세요.

## 사용자 결정 포인트

🔔 **Phase 2 확인 사항** (Research 결과 검토):

- 비즈니스 요구사항이 정확히 분석되었는가?
- 기술적 제약사항이 모두 파악되었는가?
- 추가 조사가 필요한 부분은 없는가?

🔔 **Phase 4 확인 사항** (설계 및 문서화 결과 검토):

- 도메인이 비즈니스 요구사항과 일치하는가?
- Feature가 완결된 기능 단위로 적절하게 분류되었는가?
- Task가 개별 작업 단위로 적절하게 분류되었는가?
- 기능 의존성이 올바르게 정의되었는가?
- UI/UX 흐름이 직관적인가?

## 결과물

- `.claude/docs/research/domain-research.md` - 도메인 분석 결과
- `.claude/docs/domain-definition.md` - 도메인 정의 문서
- `.claude/docs/feature-list.md` - Feature/Task 목록
- `.claude/docs/feature-list/[기능ID]-[기능명].md` - 각 Feature 상세 문서
- `.claude/docs/page-structure.md` - 페이지 구조
