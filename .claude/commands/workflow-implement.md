# /workflow-implement [기능명]

선택한 기능을 TDD 방식으로 구현합니다.

## 실행 프로세스

1. **준비** → skill:memory-manager로 상태 확인
2. **분석** → 기능 요구사항 및 명세 확인
3. **테스트 케이스 생성** → skill:test-case-generator
   - 기능 명세 기반 테스트 케이스 도출
   - Happy path, Edge cases, Error scenarios 생성
   - 테스트 우선순위 결정
4. **TDD 사이클 실행** → skill:tdd-workflow-manager
   - 🔴 Red: 실패하는 테스트 작성
   - 🟢 Green: 테스트를 통과하는 최소 구현
   - 🔵 Refactor: 코드 개선 및 최적화
   - 사이클 반복
5. **검증** → skill:test-coverage-analyzer로 커버리지 확인
6. **저장** → skill:memory-manager로 진행 상황 업데이트

## 사용자 결정 포인트

🔔 **사용자 입력 필요**:

- 기능명 입력 (예: product-list, cart, checkout)
- 테스트 케이스 검토 및 승인
- 구현 방식 승인
- API 연동 여부 결정

## 결과물

- `src/features/[기능명]/` - 기능 구현 코드
- `tests/[기능명]/` - 테스트 코드
