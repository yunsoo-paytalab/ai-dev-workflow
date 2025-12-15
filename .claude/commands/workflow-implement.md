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

### Phase 1: Implementation by Groups (그룹별 구현)

> ⚠️ **핵심 변경사항**: 구현 계획을 논리적 그룹 단위로 나누어 진행하며, 각 그룹 완료 후 개발자 검토 및 commit을 진행합니다.

**Spec 문서 확인:**
- Spec 문서의 섹션 4.1 "Implementation Groups" 참조
- 각 그룹의 task 목록 및 검증 조건 확인

**그룹별 반복 프로세스:**

각 그룹마다 다음 단계를 순서대로 진행:

#### 1.1 그룹 시작 - 현재 그룹 정보 안내

```
🔹 Group [N]/[전체]: [그룹명]
📋 Task 목록:
  - Task 1: [설명] - `파일명`
  - Task 2: [설명] - `파일명`
  ...
✅ 검증 조건: [이 그룹의 완료 조건]
```

#### 1.2 TDD Cycle (그룹 내 테스트 작성)

> ⚠️ **필수**: 구현 전 반드시 test-runner 에이전트를 먼저 호출해야 합니다.
>
> 호출 방법: "Use the test-runner agent to write tests for [현재 그룹의 기능]"

**Agent: test-runner** (MUST BE USED FIRST)

- 🔴 **Red**: 현재 그룹에 해당하는 실패하는 테스트 작성
- 🟢 **Green**: 테스트 통과하는 최소 구현
- 🔵 **Refactor**: 코드 개선

**테스트 작성 규칙:**
- describe, it 설명문은 **한글**로 작성
- 예: `describe("장바구니", () => { it("아이템 추가 시 목록에 포함되어야 한다", ...) })`

#### 1.3 그룹 구현

**Agent: implementation-agent**

현재 그룹의 task 목록에 따라 구현:

- **타입/인터페이스**: TypeScript 타입 및 인터페이스 정의
- **API 레이어**: API 함수, Mock 데이터
- **비즈니스 로직**: 커스텀 훅, 유틸리티 함수
- **UI 컴포넌트**: 컴포넌트, 스타일링
- **상태 관리**: Redux/Zustand 통합 (필요시)

#### 1.4 그룹 검증

> ⚠️ **Lint 에러 처리 규칙** (무한 루프 방지)
>
> - lint 에러 수정은 **최대 3회까지만 재시도**
> - 3회 시도 후에도 해결되지 않으면 **사용자에게 보고**하고 다음 단계로 진행
> - 절대로 lint 수정을 무한 반복하지 말 것

**자동 검증:**
```bash
npm run lint          # 최대 3회 재시도
npm run type-check
npm test              # 현재 그룹 관련 테스트만
```

**그룹별 검증 조건 확인:**
- Spec 문서의 해당 그룹 "검증" 항목 확인
- 예: "타입 체크 통과", "API 테스트 통과" 등

#### 1.5 개발자 검토 및 Commit 결정 ⭐

**변경사항 요약 제시:**
```
✅ Group [N] 완료: [그룹명]

📝 변경된 파일:
  - src/types/example.ts (new, 50 lines)
  - src/api/example.ts (new, 120 lines)
  - src/api/__tests__/example.test.ts (new, 80 lines)

✅ 검증 결과:
  - npm run type-check: ✅ 통과
  - npm run lint: ✅ 통과
  - npm test: ✅ 통과 (3/3 tests)

📊 다음 그룹: Group [N+1]/[전체] - [다음 그룹명]
```

**사용자 선택 요청:**

```
🔍 코드 검토 및 Commit 여부를 결정해주세요:

[1] ✅ Commit하고 다음 그룹 진행
    → git add 후 commit 메시지 자동 생성

[2] 🔄 수정 필요
    → 피드백을 입력해주세요

[3] ⏭️  Commit 없이 다음 그룹 진행
    → 여러 그룹을 묶어서 나중에 commit

[4] ⏸️  작업 일시 중지
    → 여기서 작업 중단
```

**Commit 처리 (옵션 1 선택 시):**
- 변경된 파일들을 git add
- Commit 메시지 생성 (예: `feat: [그룹명] 구현 완료`)
- git commit 실행
- 다음 그룹으로 진행

#### 1.6 다음 그룹으로

모든 그룹이 완료될 때까지 1.1 ~ 1.5 반복

#### 1.7 선택적 API 연동 (--with-api 옵션)

모든 그룹 완료 후, 필요시 진행:

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
- Implementation Groups가 명확히 정의되었는가?
- 각 그룹의 검증 조건이 명확한가?

🔔 **각 그룹 완료 후** (가장 중요!):

- ✅ **Commit 여부 결정**
  - 옵션 1: Commit하고 다음 그룹 진행
  - 옵션 2: 수정 필요 (피드백 제공)
  - 옵션 3: Commit 없이 다음 그룹 진행
  - 옵션 4: 작업 일시 중지

🔔 **구현 중 확인 사항**:

- TDD Red-Green-Refactor 사이클을 따르고 있는가?
- 각 그룹의 검증 조건이 충족되는가?
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
