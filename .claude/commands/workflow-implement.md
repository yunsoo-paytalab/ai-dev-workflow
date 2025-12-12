# /workflow-implement $ARGUMENTS

선택한 기능을 RPI 패턴과 TDD 방식으로 구현합니다.

> ⚠️ **필수 선행 작업**: 이 워크플로우를 실행하기 전에 `/workflow-feature-spec $ARGUMENTS`을 먼저 완료해야 합니다.

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                          | 설명                       |
| ------------ | ----------------------------- | -------------------------- |
| 파일 참조    | `@.claude/docs/specs/auth.md` | 파일 직접 참조             |
| Feature ID   | `AUTH-001`                    | Feature ID로 문서 검색     |
| Feature 이름 | `로그인 기능`                 | Feature 이름으로 문서 검색 |

### 참조 문서(구현 계획서) 탐색

**기본 참조 경로**: `.claude/docs/specs/`

**파일 형식**: 각 파일의 첫 줄은 `# Feature Spec: Feature ID Feature 이름` 형식

**탐색 로직**:

1. `$ARGUMENTS`가 `@`로 시작하면 → 해당 파일을 직접 참조 문서로 사용
2. 그 외의 경우, `.claude/docs/specs/` 폴더 내 모든 파일의 첫 줄을 읽음
3. `$ARGUMENTS`와 매칭:
   - Feature ID 일치 (예: `AUTH-001`)
   - Feature 이름 일치 또는 포함 (예: `로그인 기능`)
   - 부분 텍스트 매칭 (예: `로그인` → `로그인 기능` 매칭)
4. **매칭 결과에 따른 분기**:
   - ✅ 매칭 성공 → 해당 spec 문서를 기반으로 구현 진행
   - ❌ 매칭 실패 → `$ARGUMENTS`를 일반 텍스트로 처리하여 구현 진행

## 실행 프로세스

### Phase 1: Implementation (구현)

#### 1.1 TDD Cycle (필수)

> ⚠️ **필수**: 구현 전 반드시 test-runner 에이전트를 먼저 호출해야 합니다.
>
> 호출 방법: "Use the test-runner agent to write tests for [기능명]"

**Agent: test-runner** (MUST BE USED FIRST)

- 🔴 **Red**: 실패하는 테스트 작성 (한글로 describe/it 작성)
- 🟢 **Green**: 테스트 통과하는 최소 구현
- 🔵 **Refactor**: 코드 개선
- 사이클 반복

**테스트 작성 규칙:**
- describe, it 설명문은 **한글**로 작성
- 예: `describe("장바구니", () => { it("아이템 추가 시 목록에 포함되어야 한다", ...) })`

#### 1.2 필수 통합 작업

**Agent: implementation-agent**

- **컴포넌트 구현**: UI 및 비즈니스 로직 작성
- **Mock 서비스**: 임시 데이터 처리 계층
- **상태 관리**: Redux/Zustand 통합
- **이벤트 핸들링**: UI와 비즈니스 로직 연결
- **스타일링**: CSS/Tailwind 적용

#### 1.3 코드 검증

> ⚠️ **Lint 에러 처리 규칙** (무한 루프 방지)
>
> - lint 에러 수정은 **최대 3회까지만 재시도**
> - 3회 시도 후에도 해결되지 않으면 **사용자에게 보고**하고 다음 단계로 진행
> - 절대로 lint 수정을 무한 반복하지 말 것

```bash
npm run lint      # 최대 3회 재시도
npm run type-check
npm test
```

#### 1.4 선택적 API 연동 (--with-api 옵션)

- **API 클라이언트**: Axios/Fetch 설정
- **엔드포인트 연결**: 백엔드 API와 통합
- **Mock → Real**: Mock 데이터를 실제 API로 전환
- **에러 핸들링**: API 오류 처리

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/*.md (자동)

**중요한 기술적 결정**이 있었다면 memory-manager 에이전트를 호출하여 기록하세요.

## 사용자 결정 포인트

🔔 **구현 전 확인 사항**:

- feature-spec 워크플로우가 완료되었는가?
- 테스트 시나리오가 명확한가?

🔔 **구현 중 확인 사항**:

- TDD Red-Green-Refactor 사이클을 따르고 있는가?
- Mock 데이터 구조가 적절한가?
- API 연동 여부 결정 (백엔드 준비 시)

## 결과물

- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터 및 서비스
- `tests/[기능명]/` - 테스트 코드
- `src/services/[기능명]/` - API 연동 (선택적)

## 관련 워크플로우

- **선행 워크플로우**: `/workflow-feature-spec` - 기능 명세 작성
- **후속 워크플로우**: 통합 테스트 및 E2E 테스트
