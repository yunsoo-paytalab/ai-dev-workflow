# /workflow-domain-definition

프로젝트의 도메인을 정의하고 기능 목록을 작성합니다.

## 실행 프로세스

1. **초기 확인**

   - `docs/workflows/memory.md` 읽기 (현재 상태 파악)
   - 요구사항 파일 존재 확인 (requirements.md)

2. **도메인 정의** → skill:domain-processor

   - 요구사항 분석 및 도메인 설계
   - 문서 생성 (domain-definition.md, page-structure.md, feature-list.md)

3. **사용자 검토 및 최종 확정**

   - 생성된 문서 검토
   - 도메인 경계 및 기능 배치 확인
   - 필요시 수정

4. **상태 저장** → skill:memory-manager
   - memory.md 업데이트 (도메인 목록, 페이지 구조, 기능 진행 상황)
   - 체크리스트 업데이트

## 사용자 결정 포인트

### 필수 입력 (1단계)

- 요구사항 명세 (requirements.md)

### 사용자 검토 및 승인 (3단계)

🔔 **최종 확정 전 필수 확인**:

- 도메인 경계가 적절한가?
- 기능이 올바른 도메인에 속해있는가?
- 누락된 기능이 없는가?
- 페이지 구조가 합리적인가?
- 기능 의존성이 정확한가?

## 결과물

- `docs/domain-definition.md` - 도메인 정의서
- `docs/page-structure.md` - 페이지 구조
- `docs/feature-list.md` - 기능 목록
