# /workflow-update $ARGUMENTS

요구사항 변경 시 관련 문서를 일괄 업데이트합니다.

> ⚠️ **주의**: 이 커맨드는 여러 문서를 동시에 수정합니다. 변경 전 반드시 미리보기를 확인하세요.

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                                  | 설명                       |
| ------------ | ------------------------------------- | -------------------------- |
| Feature ID   | `AUTH-001`                            | Feature ID로 문서 검색     |
| 파일 참조    | `@.claude/docs/specs/AUTH-001-spec.md` | 파일 직접 참조             |
| Feature 이름 | `로그인 기능`                         | Feature 이름으로 문서 검색 |

### 옵션

| 옵션         | 설명                           |
| ------------ | ------------------------------ |
| `--cascade`  | 의존성 있는 feature도 함께 업데이트 |
| `--dry-run`  | 실제 적용 없이 미리보기만      |
| `--only-spec` | Spec 문서만 업데이트          |
| `--only-feature` | Feature 세부 문서만 업데이트 |

**예시:**
- `/workflow-update AUTH-001` - 기본 업데이트
- `/workflow-update AUTH-001 --dry-run` - 미리보기만
- `/workflow-update AUTH-001 --cascade` - 의존성 feature도 함께

---

## 실행 프로세스

### Phase 0: Feature 및 변경 내용 확인

**Feature 문서 탐색:**

1. `$ARGUMENTS`가 `@`로 시작 → 해당 파일 직접 참조
2. Feature ID 또는 이름으로 검색:
   - `.claude/docs/feature-list/` 폴더 검색
   - `.claude/docs/specs/` 폴더 검색
3. 매칭되는 Feature 찾기

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
- 옵션 (--cascade 등)

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

  ✓ .claude/docs/specs/AUTH-001-spec.md
    → 섹션 2.3 API 스펙: OAuth 1.0 엔드포인트로 변경
    → 섹션 2.4 데이터 흐름: OAuth 1.0 플로우로 수정
    → 섹션 4.1 Implementation Groups: OAuth 관련 task 재검토

📄 간접 영향 (의존성):
  ⚠️ AUTH-002 - 회원가입 기능
    → OAuth 방식 동일하게 적용 필요
    → --cascade 옵션으로 함께 업데이트 가능

  ⚠️ .claude/docs/domain/authentication.md
    → OAuth 버전 명시 업데이트

💻 구현 파일 (이미 구현된 경우):
  ⚠️ src/features/auth/oauth.ts
  ⚠️ src/features/auth/oauth.test.ts
  → 수동 코드 수정 필요 (이 커맨드는 문서만 업데이트)

📊 요약:
  - 업데이트 대상: 2개 문서
  - 사용자 확인 필요: 2개 문서 (의존성)
  - 수동 작업 필요: 2개 파일 (코드)
```

---

### Phase 2: 사용자 검토 및 승인

**변경 사항 미리보기 제공:**

```
🔍 업데이트 미리보기:

변경될 문서: 2개
영향받는 Feature: 2개 (AUTH-001, AUTH-002)
수동 작업 필요: 2개 파일 (코드)

어떻게 진행하시겠어요?

[1] ✅ 모두 적용
    → 직접 영향 + 간접 영향 모두 업데이트
    → 가장 완전한 업데이트

[2] 📝 직접 영향만 적용
    → AUTH-001 관련 문서만 업데이트
    → 의존성 문서는 제외

[3] 👀 상세 보기
    → 각 문서의 Before/After diff 확인
    → 확인 후 다시 선택

[4] 🔧 선택 적용
    → 문서별로 개별 선택
    → 세밀한 제어

[5] ❌ 취소
    → 업데이트 중단
```

**옵션별 처리:**

- **옵션 1**: 모든 문서 업데이트 (Phase 3로)
- **옵션 2**: 직접 영향 문서만 (Phase 3로)
- **옵션 3**: 상세 diff 보기 후 다시 선택
- **옵션 4**: 문서별 개별 선택 UI 표시
- **옵션 5**: 종료

**옵션 3 선택 시 (상세 보기):**

```
📄 .claude/docs/feature-list/AUTH-001-login.md

변경 1/3:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- OAuth 2.0을 사용한 소셜 로그인
+ OAuth 1.0을 사용한 소셜 로그인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

변경 2/3:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- API는 OAuth 2.0 프로토콜을 준수해야 함
+ API는 OAuth 1.0 프로토콜을 준수해야 함
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

... (모든 변경사항 표시)

[Enter] 다음 문서  [Q] 선택 화면으로
```

**옵션 4 선택 시 (선택 적용):**

```
📋 문서별 선택:

[ ] .claude/docs/feature-list/AUTH-001-login.md (3군데 변경)
[ ] .claude/docs/specs/AUTH-001-spec.md (2섹션 변경)
[ ] AUTH-002 - 회원가입 기능 (의존성, 1군데 변경)
[ ] .claude/docs/domain/authentication.md (1군데 변경)

[Space] 선택/해제  [A] 전체 선택  [Enter] 적용
```

---

### Phase 3: 문서 업데이트 실행

> ⚠️ **에이전트 호출**: `document-updater`
>
> 격리된 컨텍스트에서 파일을 수정하여 메인 컨텍스트 오염을 방지합니다.

**Agent: document-updater**

**입력:**
- 업데이트할 문서 목록
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

✅ .claude/docs/specs/AUTH-001-spec.md
   → 섹션 2.3, 2.4 수정 완료

⚠️ AUTH-002 - 회원가입 기능
   → 사용자가 별도 검토 필요 (선택하지 않음)

✅ .claude/docs/domain/authentication.md
   → 1군데 수정 완료

📊 업데이트 결과:
  - 성공: 3개 파일
  - 건너뜀: 1개 파일
  - 실패: 0개
```

---

### Phase 4: 검증 및 기록

**자동 검증:**

1. **일관성 체크**
   - 모든 문서에서 이전 내용(예: "OAuth 2.0") 제거 확인
   - 새로운 내용(예: "OAuth 1.0") 일관성 확인

2. **의존성 체크**
   - 업데이트하지 않은 의존성 문서 경고
   - 충돌 가능성 확인

**검증 결과:**

```
✅ 일관성 검증:
  - OAuth 2.0 언급: 0건 (모두 제거됨)
  - OAuth 1.0 언급: 5건 (일관성 있음)

⚠️ 주의사항:
  - AUTH-002 (회원가입)은 아직 OAuth 2.0 사용 중
  - 나중에 별도로 업데이트 권장

💻 수동 작업 필요:
  - src/features/auth/oauth.ts
  - src/features/auth/oauth.test.ts
  → 코드 수정 필요
```

**변경 이력 기록:**

`.claude/docs/changelog/AUTH-001-20251215.md` 생성:

```markdown
# Feature Update: AUTH-001 - 로그인 기능

**업데이트 날짜:** 2025-12-15
**변경 내용:** OAuth 2.0 대신 OAuth 1.0 사용

## 업데이트된 문서

### .claude/docs/feature-list/AUTH-001-login.md
- OAuth 버전 변경: 2.0 → 1.0 (3군데)

### .claude/docs/specs/AUTH-001-spec.md
- 섹션 2.3 API 스펙: OAuth 1.0 엔드포인트로 변경
- 섹션 2.4 데이터 흐름: OAuth 1.0 플로우로 수정

### .claude/docs/domain/authentication.md
- OAuth 버전 명시 업데이트

## 수동 작업 필요

- [ ] src/features/auth/oauth.ts 코드 수정
- [ ] src/features/auth/oauth.test.ts 테스트 수정

## 관련 Feature

- AUTH-002 (회원가입) - 별도 업데이트 권장
```

---

### Phase 5: 최종 안내

```
🎉 문서 업데이트 완료!

📝 업데이트된 문서: 3개
📋 변경 이력: .claude/docs/changelog/AUTH-001-20251215.md

⚠️ 다음 작업이 필요합니다:

1. 수동 코드 수정:
   - src/features/auth/oauth.ts
   - src/features/auth/oauth.test.ts

2. 의존성 Feature 검토:
   - AUTH-002 (회원가입)도 OAuth 1.0으로 변경 필요
   → /workflow-update AUTH-002 실행 권장

3. 구현 재검토:
   - 이미 구현된 경우 /workflow-implement AUTH-001 재실행 검토

💡 추천 다음 단계:
   /workflow-update AUTH-002  # 의존성 feature도 업데이트
```

---

## 사용자 결정 포인트

🔔 **Phase 0**:
- 어떤 변경이 필요한가?

🔔 **Phase 2** (가장 중요!):
- 어떤 범위로 업데이트할까?
  - [1] 모두 적용
  - [2] 직접 영향만
  - [3] 상세 보기
  - [4] 선택 적용
  - [5] 취소

🔔 **Phase 5**:
- 수동 작업 진행 여부
- 의존성 feature 업데이트 여부

---

## 옵션별 동작

### `--cascade`
```bash
/workflow-update AUTH-001 --cascade
```
- 의존성이 있는 모든 feature를 함께 업데이트
- 사용자 확인 없이 자동으로 관련 문서 모두 수정
- 대규모 변경 시 유용

### `--dry-run`
```bash
/workflow-update AUTH-001 --dry-run
```
- 실제 파일 수정 없음
- 영향 범위와 변경 내용만 미리보기
- 안전하게 확인 가능

### `--only-spec`
```bash
/workflow-update AUTH-001 --only-spec
```
- Spec 문서만 업데이트
- Feature 세부 문서, 도메인 문서 등은 제외

### `--only-feature`
```bash
/workflow-update AUTH-001 --only-feature
```
- Feature 세부 문서만 업데이트
- Spec 문서는 제외

---

## 변경 이력 관리

**자동 생성되는 changelog:**

```
.claude/docs/changelog/
├── AUTH-001-20251215.md
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

⚠️ **의존성 확인 필수**
- 한 feature 변경이 다른 feature에 영향
- 반드시 의존성 feature도 업데이트

⚠️ **백업 권장**
- 큰 변경 전 git commit 또는 branch 생성
- 문제 시 롤백 가능

---

## 관련 워크플로우

- **선행**: 요구사항 변경 발생
- **후속**: `/workflow-implement` 재실행 (구현 파일 수정)

---

## 문제 해결

### 변경이 너무 많아요
→ `--only-spec` 또는 `--only-feature`로 범위 좁히기

### 의존성이 복잡해요
→ `--dry-run`으로 먼저 확인 후 하나씩 처리

### 실수로 잘못 변경했어요
→ git revert 또는 changelog 참조하여 롤백
