# /workflow-update $ARGUMENTS

요구사항 변경 시 관련 문서를 자동으로 일괄 업데이트합니다.

> ⚠️ **주의**: 이 커맨드는 의존성이 있는 모든 관련 문서를 자동으로 업데이트합니다.

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                                             | 설명                       |
| ------------ | ------------------------------------------------ | -------------------------- |
| Feature ID   | `AUTH-001`                                       | Feature ID로 문서 검색     |
| 파일 참조    | `@.claude/docs/feature-list/AUTH-001-login.md`   | 파일 직접 참조             |
| Feature 이름 | `로그인 기능`                                    | Feature 이름으로 문서 검색 |

---

## 실행 프로세스

### Phase 0: Feature 및 변경 내용 확인

**Feature 문서 탐색:**

> 💡 **Feature Resolver SKILL 사용**
>
> 상세 로직: `@.claude/skills/feature-resolver/SKILL.md` 참조
>
> ```
> 파라미터:
> - argument: $ARGUMENTS
> - searchPaths: [".claude/docs/feature-list"]
> - allowFallback: false
> ```

**결과에 따른 처리:**

| SKILL 결과     | 처리 방법                                                          |
| -------------- | ------------------------------------------------------------------ |
| `feature-id`   | Feature ID 확인 → Feature 정보 표시 → 변경 내용 입력 요청          |
| `feature-name` | 매칭된 Feature 정보 표시 → 변경 내용 입력 요청                     |
| `direct`       | 파일에서 Feature ID 추출 → Feature 정보 표시 → 변경 내용 입력 요청 |
| `error`        | 에러 메시지 표시 → 워크플로우 중단                                 |

**변경 내용 입력 요청:**

```
📋 Feature: AUTH-001 - 로그인 기능

🔄 어떤 변경이 필요한가요?

변경 내용을 구체적으로 입력해주세요:
예시:
  - "OAuth 2.0 대신 OAuth 1.0 사용"
  - "소셜 로그인에 Apple 로그인 추가"
  - "세션 만료 시간 30분 → 1시간으로 변경"
  - "비밀번호 정책: 최소 8자 → 10자로 변경"

변경 내용: _
```

**사용자 입력 후:**

- 변경 내용을 세션에 저장
- Phase 1로 진행

---

### Phase 1: 영향 범위 분석

> ⚠️ **에이전트 호출**: `impact-analyzer`
>
> 격리된 컨텍스트에서 영향 범위를 분석하여 메인 컨텍스트 오염을 방지합니다.

**Agent: impact-analyzer**

**입력:**

- Feature ID
- 변경 내용

**분석 항목:**

1. 직접 영향받는 문서
2. 간접 영향받는 문서 (의존성)
3. 구현 파일 (이미 구현된 경우)
4. 각 문서별 변경 필요 내용

**출력 (에이전트로부터 받음):**

```
🔍 영향 범위 분석 결과:

📄 직접 영향:
  ✓ .claude/docs/feature-list/AUTH-001-login.md
    → "OAuth 2.0" → "OAuth 1.0" (3군데)
    → OAuth 1.0 요구사항 섹션 추가

  ✓ .claude/docs/research/AUTH-001-research.md
    → 섹션 1.4 기존 코드베이스 분석: OAuth 1.0 라이브러리 확인

  ✓ .claude/docs/plan/AUTH-001-plan.md
    → 섹션 2.3 API 스펙: OAuth 1.0 엔드포인트로 변경
    → 섹션 2.4 데이터 흐름: OAuth 1.0 플로우로 수정

📄 간접 영향 (의존성):
  ⚠️ AUTH-002 - 회원가입 기능
    → OAuth 방식 동일하게 적용 필요

  ⚠️ .claude/docs/domain/authentication.md
    → OAuth 버전 명시 업데이트

💻 구현 파일 (이미 구현된 경우):
  ⚠️ src/features/auth/oauth.ts
  ⚠️ src/features/auth/oauth.test.ts
  → 수동 코드 수정 필요 (이 커맨드는 문서만 업데이트)

📊 요약:
  - 업데이트 대상: 5개 문서
  - 수동 작업 필요: 2개 파일 (코드)
```

---

### Phase 2: 사용자 확인

**변경 사항 미리보기 제공:**

```
🔍 업데이트 미리보기:

변경될 문서: 5개
  ✓ .claude/docs/feature-list/AUTH-001-login.md (3군데 변경)
  ✓ .claude/docs/research/AUTH-001-research.md (1섹션 변경)
  ✓ .claude/docs/plan/AUTH-001-plan.md (2섹션 변경)
  ✓ AUTH-002 - 회원가입 기능 (1군데 변경)
  ✓ .claude/docs/domain/authentication.md (1군데 변경)

수동 작업 필요: 2개 파일 (코드)
  ⚠️ src/features/auth/oauth.ts
  ⚠️ src/features/auth/oauth.test.ts

계속 진행하시겠습니까?
```

**사용자 응답:**

- **예**: Phase 3로 진행 (모든 문서 자동 업데이트)
- **아니오**: 워크플로우 중단

---

### Phase 3: 문서 업데이트 실행

> ⚠️ **에이전트 호출**: `document-updater`
>
> 격리된 컨텍스트에서 파일을 수정하여 메인 컨텍스트 오염을 방지합니다.

**Agent: document-updater**

**입력:**

- 업데이트할 문서 목록 (Phase 1의 모든 대상)
- 각 문서별 변경 내용
- impact-analyzer의 분석 결과

**처리:**

- 각 문서 Read
- 변경 사항 Edit/Write
- 변경 이력 기록

**출력 (에이전트로부터 받음):**

```
⏳ 문서 업데이트 중...

✅ .claude/docs/feature-list/AUTH-001-login.md
   → 3군데 수정 완료

✅ .claude/docs/research/AUTH-001-research.md
   → 섹션 1.4 수정 완료

✅ .claude/docs/plan/AUTH-001-plan.md
   → 섹션 2.3, 2.4 수정 완료

✅ AUTH-002 - 회원가입 기능
   → 1군데 수정 완료

✅ .claude/docs/domain/authentication.md
   → 1군데 수정 완료

📊 업데이트 결과:
  - 성공: 5개 파일
  - 실패: 0개
```

---

### Phase 4: 검증 및 기록

**자동 검증:**

1. **일관성 체크**

   - 모든 문서에서 이전 내용(예: "OAuth 2.0") 제거 확인
   - 새로운 내용(예: "OAuth 1.0") 일관성 확인

2. **의존성 체크**
   - 모든 의존성 문서가 업데이트되었는지 확인
   - 충돌 가능성 확인

**검증 결과:**

```
✅ 일관성 검증:
  - OAuth 2.0 언급: 0건 (모두 제거됨)
  - OAuth 1.0 언급: 5건 (일관성 있음)

💻 수동 작업 필요:
  - src/features/auth/oauth.ts
  - src/features/auth/oauth.test.ts
  → 코드 수정 필요
```

**변경 이력 기록:**

`.claude/docs/changelog/AUTH-001-20251216.md` 생성:

```markdown
# Feature Update: AUTH-001 - 로그인 기능

**업데이트 날짜:** 2025-12-16
**변경 내용:** OAuth 2.0 대신 OAuth 1.0 사용

## 업데이트된 문서

### .claude/docs/feature-list/AUTH-001-login.md

- OAuth 버전 변경: 2.0 → 1.0 (3군데)

### .claude/docs/research/AUTH-001-research.md

- 섹션 1.4 기존 코드베이스 분석: OAuth 1.0 라이브러리 확인

### .claude/docs/plan/AUTH-001-plan.md

- 섹션 2.3 API 스펙: OAuth 1.0 엔드포인트로 변경
- 섹션 2.4 데이터 흐름: OAuth 1.0 플로우로 수정

### AUTH-002 - 회원가입 기능

- OAuth 버전 업데이트

### .claude/docs/domain/authentication.md

- OAuth 버전 명시 업데이트

## 수동 작업 필요

- [ ] src/features/auth/oauth.ts 코드 수정
- [ ] src/features/auth/oauth.test.ts 테스트 수정
```

---

### Phase 5: 최종 안내

```
🎉 문서 업데이트 완료!

📝 업데이트된 문서: 5개
📋 변경 이력: .claude/docs/changelog/AUTH-001-20251216.md

⚠️ 다음 작업이 필요합니다:

1. 수동 코드 수정:
   - src/features/auth/oauth.ts
   - src/features/auth/oauth.test.ts

2. 구현 재검토:
   - 이미 구현된 경우 /workflow-implement AUTH-001 재실행 검토

💡 추천 다음 단계:
   /workflow-implement AUTH-001  # 코드 수정
```

---

## 사용자 결정 포인트

🔔 **Phase 0**:

- 어떤 변경이 필요한가?

🔔 **Phase 2**:

- 분석된 영향 범위를 확인하고 계속 진행할까?

🔔 **Phase 5**:

- 수동 작업 진행 여부

---

## 변경 이력 관리

**자동 생성되는 changelog:**

```
.claude/docs/changelog/
├── AUTH-001-20251216.md
├── AUTH-001-20251210.md
├── AUTH-002-20251214.md
└── ...
```

**형식:**

- `[FEATURE_ID]-[YYYYMMDD].md`
- 날짜별로 변경 이력 추적
- 롤백 시 참조 가능

---

## 주의사항

⚠️ **코드 파일은 수동 수정 필요**

- 이 커맨드는 문서만 업데이트
- 구현 파일(`src/`, `tests/`)은 개발자가 직접 수정

⚠️ **모든 의존성 자동 업데이트**

- 한 feature 변경이 다른 feature에 영향을 주면 자동으로 함께 업데이트
- Phase 2에서 영향 범위를 확인하고 진행 여부 결정

⚠️ **백업 권장**

- 큰 변경 전 git commit 또는 branch 생성
- 문제 시 롤백 가능

---

## 관련 워크플로우

- **선행**: 요구사항 변경 발생
- **후속**: `/workflow-implement` 재실행 (구현 파일 수정)

---

## 문제 해결

### 의존성이 너무 많아요

→ Phase 2에서 영향 범위를 확인 후 진행 여부 결정

### 실수로 잘못 변경했어요

→ git revert 또는 changelog 참조하여 롤백
