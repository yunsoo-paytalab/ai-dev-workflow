# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다. RPI 패턴을 적용하여 체계적으로 진행합니다.

## 실행 프로세스

### Phase 1: Research (분석)
**Agent: research-agent**
- 요구사항 문서 분석 (requirements.md)
- 기존 코드베이스 탐색
- 기술 스택 및 제약사항 파악
- 출력: `docs/research/domain-analysis.md`
- **AgentId 저장**: 추후 재개를 위해 ID 기록

### Phase 2: Planning (설계)
**Agent 체이닝**: Research 결과를 기반으로 자동 연결
- **Agent: planning-agent**
- Research 결과를 바탕으로 도메인 모델 설계
- 도메인 경계 정의
- 기능 목록 도출 및 분류
- 페이지 구조 및 라우팅 설계
- 출력:
  - `docs/domain-definition.md`
  - `docs/feature-list.md`
  - `docs/page-structure.md`

### Phase 3: Review & Confirm
**사용자 검토**
- 도메인 경계 적절성 확인
- 기능 배치 검증
- 누락 기능 체크
- 페이지 구조 합리성 확인

### Phase 4: Memory Update
**Agent: memory-manager**
- 프로젝트 상태 업데이트
- 의사결정 기록
- 체크리스트 갱신
- Agent ID 저장 (재개용)

## 사용자 결정 포인트

🔔 **필수 확인 사항**:
- 도메인이 비즈니스 요구사항과 일치하는가?
- 기능 의존성이 올바르게 정의되었는가?
- UI/UX 흐름이 직관적인가?

## Agent 체이닝 & 재개

### 자동 체이닝
```
"먼저 research-agent로 요구사항을 분석한 후,
planning-agent로 도메인 설계를 진행해주세요"
```

### Agent 재개
```
"Agent abc123을 재개하여 추가 도메인을 정의해주세요"
```

## 예시 명령어
```bash
# 기본 실행 (전체 체이닝)
/workflow-domain-definition

# 특정 요구사항 파일 지정
/workflow-domain-definition --requirements=specs/v2-requirements.md

# 이전 작업 재개
/workflow-domain-definition --resume=abc123

# 특정 단계부터 시작
/workflow-domain-definition --start-from=planning
```

## 결과물
- `docs/research/domain-analysis.md`
- `docs/domain-definition.md`
- `docs/feature-list.md`
- `docs/page-structure.md`
