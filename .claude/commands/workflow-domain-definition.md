---
name: workflow-domain-definition
description: 프로젝트의 도메인을 정의하고 기능 목록을 작성하는 커맨드
version: 3.1.0
---

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

#### Phase 3-2: 병렬 실행 (Feature 분류 + 유저 시나리오)

> ⚠️ Phase 3-1 완료 후 실행

⚡ **IMPORTANT: 2개의 Agent를 병렬로 동시에 실행**

**한 번의 메시지에서 2개의 Task를 호출하여 병렬 실행:**

1. **Agent: feature-classifier**

   - 입력:
     - Research 결과 (`.claude/docs/research/domain-research.md`)
     - 도메인 설계 결과 (`.claude/docs/domain-definition.md`)
   - 도메인 구조를 참고하여 Feature/Task 분류 리스트 작성
   - 출력: `.claude/docs/feature-list.md` (상세 문서 없이 리스트만)

2. **Agent: user-scenario-writer**
   - 입력:
     - Research 결과 (`.claude/docs/research/domain-research.md`)
     - 도메인 설계 결과 (`.claude/docs/domain-definition.md`)
     - 페이지 구조 (`.claude/docs/page-structure.md`)
   - 주요 Actor 정의 및 시나리오 작성
   - Feature 매핑은 빈 칸으로 두고, Phase 4에서 검증
   - 출력: `.claude/docs/user-scenarios.md`

**출력 파일**:

- `.claude/docs/domain-definition.md`
- `.claude/docs/page-structure.md`
- `.claude/docs/feature-list.md` (Feature/Task 리스트)
- `.claude/docs/user-scenarios.md`

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 도메인 경계 적절성 확인
- **Feature 분류 검토** (완결된 기능 단위로 적절하게 분류되었는지)
- **Task 분류 검토** (개별 작업 단위로 적절하게 분류되었는지)
- 누락 기능 체크
- 페이지 구조 합리성 확인
- 엔티티 관계 검토
- **유저 시나리오 ↔ Feature 매핑 검증** (커버리지 확인)

**사용자 승인 후:**

1. **워크플로우 완료 처리** (Bash 실행):

   ```bash
   node .claude/hooks/memory-sync.cjs workflow-complete domain-definition
   ```

2. **수정 요청 시**: Phase 3으로 돌아가 수정 후 다시 검토

### Phase 5: Progress 동기화

**Bash로 실행:**

```bash
node .claude/hooks/memory-sync.cjs sync-progress
```

이 명령은 다음을 수행합니다:

- `domain-definition.md` → progress.json (도메인 정보)
- `feature-list.md` → progress.json (Feature/Task 정보)
- progress.json → memory.md (체크리스트 동기화)

## 다음 단계 안내

Feature 목록이 확정되었으면, **`/workflow-feature-detail`** 커맨드로 **전체 Feature에 대하여 상세 문서**를 작성하세요.

```
/workflow-feature-detail
```

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
- 유저 시나리오가 모든 Feature를 커버하는가?

## 결과물

- `.claude/docs/research/domain-research.md` - 도메인 분석 결과
- `.claude/docs/domain-definition.md` - 도메인 정의 문서
- `.claude/docs/feature-list.md` - Feature/Task 목록
- `.claude/docs/page-structure.md` - 페이지 구조
- `.claude/docs/user-scenarios.md` - 유저 시나리오
