# /workflow-implement [기능명]

선택한 기능을 RPI 패턴과 TDD 방식으로 구현합니다.

## 실행 프로세스

### Phase 1: Research (조사)

**Agent: research-agent**

- 기능 요구사항 분석
- 관련 코드베이스 탐색
- 재사용 가능 컴포넌트 확인
- 출력: `docs/research/[기능명]-analysis.md`
- **AgentId 저장**: 재개를 위한 ID 기록

### Phase 2: Planning (계획)

**Agent 체이닝**: Research → Planning 자동 연결

- **Agent: planning-agent**
- 구현 계획 수립
- 테스트 시나리오 설계
- 컴포넌트 구조 설계
- 출력: `docs/plans/[기능명]-plan.md`

### Phase 3: Review & Confirm

**사용자 검토**

- 도메인 경계 적절성 확인
- 기능 배치 검증
- 누락 기능 체크
- 페이지 구조 합리성 확인

### Phase 4: Implementation (구현)

#### 4.1 TDD Cycle

**Agent: test-runner**

- 🔴 **Red**: 실패하는 테스트 작성
- 🟢 **Green**: 테스트 통과하는 최소 구현
- 🔵 **Refactor**: 코드 개선
- 사이클 반복

#### 4.2 필수 통합 작업

- **Mock 서비스**: 임시 데이터 처리
- **상태 관리**: Redux/Zustand 통합
- **이벤트 핸들링**: UI와 비즈니스 로직 연결

#### 4.3 선택적 API 연동 (--with-api 옵션)

- **API 클라이언트**: Axios/Fetch 설정
- **엔드포인트 연결**: 백엔드 API와 통합
- **Mock → Real**: Mock 데이터를 실제 API로 전환

### Phase 5: Memory Update

**Agent: memory-manager**

- 진행 상황 기록
- 의사결정 문서화
- 체크리스트 업데이트

## 사용자 결정 포인트

🔔 **확인 필요**:

- 테스트 시나리오 승인
- Mock 데이터 구조 확인
- API 연동 여부 결정 (백엔드 준비 시)

## 결과물

- `docs/research/[기능명]-analysis.md`
- `docs/plans/[기능명]-plan.md`
- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터 및 서비스
- `tests/[기능명]/` - 테스트 코드
- `src/services/[기능명]/` - API 연동
