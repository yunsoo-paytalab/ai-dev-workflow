---
name: workflow-e2e
description: E2E 테스트를 작성하고 실행하는 커맨드
version: 3.2.1
---

# /workflow-e2e

E2E 테스트를 작성하고 실행합니다.

> **실제 API 사용**: Mock API가 아닌 실제 API로 테스트

## 실행 프로세스

### Phase 1: 테스트 명세 작성

- 사용자에게 테스트 시나리오/기능 요청
- Critical Path 및 우선순위 확인
- Happy path, 예외 상황 포함

> 💡 **Skill**: `@.claude/skills/review-and-confirm/SKILL.md`

### Phase 2: 깡통 TC 작성

> 📋 **전제조건**: Phase 1 승인 완료

- describe/it 구조만 작성 (구현 없음)
- 설명문은 **한글**로 작성

```typescript
describe("주문 플로우", () => {
  it("상품을 장바구니에 추가할 수 있다", async () => {
    // TODO: 구현 예정
  });
});
```

> 💡 **Skill**: `@.claude/skills/review-and-confirm/SKILL.md`

### Phase 3: 실제 Flow 검증 (Playwright MCP)

> 📋 **전제조건**: Phase 2 승인 완료

- 브라우저에서 실제 Flow 수행
- ✅ 성공 → Phase 4
- ❌ 실패 → 실패 사유 문서화 후 보고

### Phase 4: E2E 테스트코드 작성

- 깡통 TC에 실제 구현 추가
- Page Object Pattern 권장
- 검증 로직 추가

```bash
npx playwright test [테스트파일]
```

## 유의사항

### 로그인 필요 페이지

`storageState` 활용 (세션 저장/재사용)

### 데이터 오염 방지

- 고유 식별자로 테스트 데이터 생성
- 상대값 검증 (절대값 검증 금지)

### 테스트 격리

- 각 테스트 독립적 실행 가능
- 순서 의존 필요 시 `test.describe.serial()` 사용

## 결과물

- `e2e/tests/` - E2E 테스트 코드
- `e2e/.auth/` - 인증 세션 (gitignore)
- `.claude/docs/e2e-test-report.md` - 테스트 리포트
