# /workflow-legacy-profile

브라운필드 프로젝트를 위한 레거시 코드 분석 및 위험 영역 식별 워크플로우입니다.
이 분석은 다른 모든 워크플로우보다 **먼저 실행**되어야 합니다.

## 목적

- 기존 레거시 코드베이스의 구조와 위험 요소 파악
- 기술 부채와 danger-zones 식별
- 안전한 리팩토링 경로 제시

## 실행 프로세스

### Phase 1: Parallel Deep Analysis (병렬 심층 분석)

**4개 Agent를 병렬로 동시 실행**

#### Agent 1: structure-analyzer (병렬)

- 프로젝트 아키텍처 파악
- 폴더 구조 및 모듈 조직 분석
- 주요 진입점(entry points) 식별
- 파일 크기 및 통계 수집
- **출력**: `.claude/docs/legacy-analysis/structure-overview.md`

#### Agent 2: dependency-analyzer (병렬)

- 모듈 간 의존 관계 매핑
- 순환 의존성 탐지
- 외부 패키지 의존성 분석
- 결합도 측정
- **출력**: `.claude/docs/legacy-analysis/dependency-graph.md`

#### Agent 3: debt-analyzer (병렬)

- 중복 코드 탐지
- 복잡도가 높은 함수/클래스
- 오래된 패턴 및 deprecated API 사용
- 테스트 커버리지 부족 영역
- 문제 주석 (TODO, FIXME, HACK) 수집
- **출력**: `.claude/docs/legacy-analysis/technical-debt.md`

#### Agent 4: business-logic-mapper (병렬)

- 비즈니스 크리티컬한 코드 영역
- 자주 변경되는 핫스팟
- 핵심 도메인 로직 위치
- 데이터 흐름 추적
- **출력**: `.claude/docs/legacy-analysis/core-business-logic.md`

### Phase 2: Risk Classification (위험도 분류)

**Agent: risk-classifier** (Phase 1의 4개 결과 필요 - 순차 실행)

- Phase 1의 4개 분석 결과 통합
- **Danger Zones 분류** (개발자 컨펌 필수):

  - 🔴 **Critical**: 반드시 명시적 승인 필요
    - 영향 범위 분석 + 테스트 케이스 + 명시적 승인
  - 🟠 **High Risk**: 승인 및 상세 설명 필요
    - 변경 계획 + 리스크 설명 + 승인
  - 🟡 **Medium Risk**: 주의 사항 안내 후 진행
    - 주의 사항 안내 + 권장 사항
  - 🟢 **Safe**: 자유롭게 수정 가능
    - 별도 컨펌 불필요

- **No-Reference Zones 분류** (참고 금지):

  - 🚫 **Anti-Pattern**: God Object, Spaghetti Code 등
  - ⛔ **Deprecated**: 폐기 예정 코드
  - 🔧 **Hack**: TODO, FIXME 등 임시 코드
  - 🐛 **Known Bug**: 알려진 버그

- **출력**:
  - `.claude/docs/legacy-analysis/danger-zones.md` ⚠️
  - `.claude/docs/legacy-analysis/no-reference-zones.md` 🚫
  - `.claude/docs/legacy-analysis/restricted-zones.json` (머신 리더블)

### Phase 3: Safety Rules Definition (안전 규칙 정의)

**사용자 검토 및 확정**

- AI가 제안한 danger-zones 및 no-reference-zones 검토
- 추가 위험 영역 및 참고 금지 영역 지정
- 컨펌 레벨 조정 (필요시)
- 접근 제한 규칙 최종 확정
- **restricted-zones.json** 최종 확정
  - danger-zones: 개발자 컨펌 필수 (위험도별 차등)
  - no-reference-zones: 참고 금지 (읽기도 금지)

**사용자 승인 후:**

**워크플로우 완료 처리** (Bash 실행):
```bash
node .claude/hooks/memory-sync.cjs workflow-complete legacy-profile
```

워크플로우 완료!

### (Optional) Phase 4: Refactoring Strategy (리팩토링 전략)

**Agent: planning-agent**

- 사용자에게 해당 phase 수행 여부를 질문
- 위험도별 접근 전략 수립
- 컨펌 프로세스 정의
- 안전한 리팩토링 경로 제시
- 점진적 개선 로드맵 작성
- **출력**: `.claude/docs/legacy-analysis/refactoring-strategy.md`

## 제한 영역 처리 규칙

### 자동 적용 규칙

모든 후속 워크플로우에서:

#### Danger Zones (개발자 컨펌 필수)

**🔴 Critical 수정 시**:

1. **영향 범위 분석**: 변경 시 영향받는 모듈 및 기능 분석
2. **테스트 케이스 작성**: 최소 3개 이상 테스트 케이스
3. **위험성 명시**: 사용자에게 명확히 설명
4. **명시적 승인 필요**: "예/아니오" 응답 필수
5. **거부 시**: 대안 제시 또는 작업 중단

**🟠 High Risk 수정 시**:

1. **변경 계획 제시**: 구체적인 수정 내용
2. **리스크 설명**: 예상 위험 요소
3. **승인 필요**: 사용자 확인 필요
4. **거부 시**: 대안 제시

**🟡 Medium Risk 수정 시**:

1. **주의 사항 안내**: 주의가 필요한 부분 설명
2. **권장 사항 제시**: 권장 접근 방법
3. **(선택적) 확인**: 필요시 사용자 확인

**🟢 Safe**:

- 자유롭게 수정 가능
- 별도 컨펌 불필요

#### No-Reference Zones (참고 금지)

1. **완전 차단**: 코드를 읽거나 참고하지 않음
2. **패턴 무시**: 해당 코드의 패턴이나 로직을 따라하지 않음
3. **대안 제시**: 올바른 패턴으로 새롭게 구현
4. **경고 시스템**: 접근 시도 시 🚫 차단 메시지

### Danger Zones 우회 전략

수정이 필요하지만 위험도가 높은 경우:

1. **어댑터 패턴**: 기존 코드를 래핑하는 새 인터페이스
2. **점진적 마이그레이션**: 새 코드 작성 후 단계적 전환
3. **Strangler Fig 패턴**: 기존 기능을 점진적으로 대체

## 사용 예시

```bash
# 기본 실행 (전체 분석)
/workflow-legacy-profile

# 특정 디렉토리만 분석
/workflow-legacy-profile --path=src/legacy

# 간단한 분석 (danger-zones만)
/workflow-legacy-profile --quick

# 이전 분석 업데이트
/workflow-legacy-profile --update
```

## 결과물

```
.claude/docs/legacy-analysis/
├── structure-overview.md       # 전체 구조 개요
├── dependency-graph.md        # 의존성 그래프 (mermaid)
├── technical-debt.md          # 기술 부채 목록
├── core-business-logic.md     # 핵심 비즈니스 로직
├── danger-zones.md            # 수정 금지 영역 상세 ⚠️
├── no-reference-zones.md      # 참고 금지 영역 상세 🚫
├── refactoring-strategy.md    # 리팩토링 전략
└── restricted-zones.json      # 머신 리더블 제한 영역 정의
```

## 다른 워크플로우와의 연계

**이 분석은 반드시 다른 워크플로우보다 먼저 실행되어야 합니다.**

후속 워크플로우들은:

1. `restricted-zones.json` 자동 로드
2. danger-zones 수정 시 위험도별 컨펌 프로세스 진행:
   - 🔴 Critical: 반드시 명시적 승인
   - 🟠 High Risk: 상세 설명 + 승인
   - 🟡 Medium Risk: 주의 안내
   - 🟢 Safe: 자유롭게 수정
3. no-reference-zones는 완전히 무시 (읽기도 금지)
4. 컨펌 없이 수정 가능한 Safe 영역 우선 작업

## 권장 실행 순서

```
1. /workflow-legacy-profile     # 레거시 분석 (필수 첫 단계)
2. /workflow-domain-definition  # 도메인 정의
3. /workflow-ui [기능]         # UI 개발
4. /workflow-implement [기능]   # 기능 구현
```

## 주의사항

⚠️ **중요**:

- Danger zones는 위험도별로 개발자 컨펌이 필요합니다
- 🔴 Critical 영역 수정 시: 반드시 명시적 승인 필요
- 🟠 High Risk 수정 시: 변경 계획 + 리스크 설명 + 승인 필요
- 🟡 Medium Risk 수정 시: 주의 사항 안내 후 진행
- No-reference zones는 절대 참고하지 않습니다
- 모든 분석 결과는 사용자 검토 후 확정됩니다
