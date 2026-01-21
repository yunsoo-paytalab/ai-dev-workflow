---
name: workflow-implement
description: 특정 기능을 TDD 방식으로 구현하는 커맨드
version: 3.2.1
---

# /workflow-implement $ARGUMENTS

선택한 기능을 TDD 방식으로 구현합니다.

> ⚠️ **필수 선행**: `/workflow-feature-spec $ARGUMENTS` 완료

## 인자 처리

feature-resolver 스킬을 사용하여 인자를 해석합니다.

| 입력 형태    | 예시                                  |
| ------------ | ------------------------------------- |
| 파일 참조    | `@.claude/docs/plan/AUTH-001-plan.md` |
| Feature ID   | `AUTH-001`                            |
| Feature 이름 | `로그인 기능`                         |

**옵션:**

- `--batch`: 모든 그룹을 한 번에 실행
- `--with-api`: API 연동 포함

## 필수 참조 문서

- `.claude/docs/research/[Feature ID]-research.md` (요구사항)
- `.claude/docs/plan/[Feature ID]-plan.md` (구현 계획)

## 실행 프로세스

### Phase 0: 실행 모드 선택

> `--batch` 플래그 시 건너뜀

- 인터랙티브 모드: 각 그룹마다 검토/commit
- 배치 모드: 마지막에만 검토/commit

### Phase 1: Implementation by Groups

각 그룹마다:

#### 1.1 그룹 시작

그룹 정보 및 Task 목록 표시

#### 1.2 구현 전 준비

**1. Plan 문서 재확인**

Read `.claude/docs/plan/[Feature ID]-plan.md`에서 현재 그룹의 섹션 찾기

**2. 구현 세부사항 추출**

Plan 문서에서 다음 정보 추출:
- 수정할 파일 목록
- **필요한 import 목록** (Plan 문서에 명시됨)
- 정의할 타입 목록
- 구현할 함수/컴포넌트 목록
- 의존성

**3. 파일별 수정 계획 수립**

각 파일의 섹션별(import, 타입, 함수) 수정사항 파악:

```
예시:
파일: src/entities/cart/api/cart-api.ts
[Import 섹션] → Plan 문서에서 이미 파악됨
  - axios from 'axios'
  - { CartFilter, CartList } from '../model/types'
[함수 섹션]
  - getCartList 완전한 구현
```

#### 1.3 그룹 구현

**1.3.1 핵심 비즈니스 로직 (TDD 적용)**

**TDD 적용 대상:**
- 핵심 계산 로직 (할인, 총액 계산 등)
- 검증 로직 (유효성 검사, 권한 체크 등)
- 복잡한 데이터 변환 로직
- 주요 이벤트 핸들링

**TDD 제외 대상:**
- 타입 정의 (type, interface)
- 단순 CRUD API 호출
- UI 레이아웃 컴포넌트
- 단순 상태 변수

**프로세스:**

핵심 로직이 있는 경우:

```markdown
**Skill 도구를 사용하여 `running-tdd` 스킬을 호출하세요.**
```

> running-tdd 스킬이 🔴 Red → 🟢 Green → 🔵 Refactor 사이클을 진행합니다.

**1.3.2 일반 구현 (타입/API/UI)**

TDD가 필요 없는 부분을 직접 구현:

**파일 수정 최적화 원칙:**

> 📋 **중요**: 같은 섹션을 여러 번 Edit하지 말 것

**올바른 패턴:**

```typescript
// 1. Plan 문서에서 필요한 import 파악
Read .claude/docs/plan/[Feature ID]-plan.md

// 2. 대상 파일 읽기
Read src/entities/cart/api/cart-api.ts

// 3. 섹션별 Edit (파일당 2-4회)
Edit 1: import 섹션 완성
  → Plan 문서에서 파악한 모든 import를 한번에

Edit 2: 타입 섹션 완성 (필요시)
  → 필요한 모든 타입을 한번에

Edit 3: 함수/컴포넌트 섹션 완성
  → 완전한 구현을 한번에
```

**잘못된 패턴:**

```typescript
// ❌ 같은 섹션을 여러 번 수정
Edit 1: import axios 추가
Edit 2: 함수 작성
Edit 3: import CartFilter 추가  // 처음에 한번에!
Edit 4: import apiClient 추가   // 처음에 한번에!
Edit 5: 함수 수정
```

**효과:**
- 파일당 Edit: 13회 → 2-4회 (70-85% 절감)
- 세션당 토큰: 70% 절감
- 비용: $21/세션 절감

#### 1.4 그룹 검증

**1.4.1 요구사항 검증** ⭐

- Research 파일의 요구사항 100% 반영 확인
- 누락 시 즉시 구현 후 재검증

**1.4.2 기술적 검증**

```bash
npm run lint        # 최대 3회 재시도
npm run type-check
npm test
```

#### 1.5 개발자 검토 & Commit

review-and-confirm 스킬(커밋형)을 사용하여 사용자 검토를 진행합니다.

**인터랙티브 모드 선택지:** ✅ Commit하고 다음 | ⏭️ Commit 없이 다음 | 💬 직접 입력

**배치 모드:**

- 자동 git add → 다음 그룹

### 1.7 배치 모드 최종 검토

review-and-confirm 스킬(커밋형)을 사용하여 사용자 검토를 진행합니다.

**선택지:** ✅ 전체 Commit | 📦 그룹별로 나눠 Commit | 💬 직접 입력

## 결과물

- `src/features/[기능명]/` - 비즈니스 로직
- `src/features/[기능명]/mocks/` - Mock 데이터
- `tests/[기능명]/` - 테스트 코드
