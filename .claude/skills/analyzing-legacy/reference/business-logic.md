# Business Logic Analysis 전략 가이드

## 역할

비즈니스 크리티컬한 코드, 핵심 도메인 로직, 변경 빈도 파악

## 주요 분석 항목

### 1. 비즈니스 크리티컬 영역

- 결제 (Payment, Transaction, Billing)
- 인증 (Auth, Login, Session)
- 주문 (Order, Cart, Checkout)
- 사용자 (User, Account, Profile)

### 2. 핵심 도메인 로직

- Entity 클래스
- Service 레이어
- 비즈니스 규칙
- Validation 로직

### 3. 변경 빈도 (핫스팟)

- Git 히스토리 기반 분석
- > 50회 변경: 핫스팟
- <5회 변경: 안정 영역

### 4. 데이터 흐름

- 입력 → 처리 → 출력 경로
- API → Service → Repository
- State 관리 흐름

## 분석 명령어

```bash
# 비즈니스 키워드 검색
grep -ri "payment\|transaction\|auth\|order\|checkout\|cart" src/ --include="*.ts" --include="*.tsx" | head -50

# 도메인 파일 찾기
find src/ -name "*Service.*" -o -name "*Repository.*" -o -name "*Entity.*" -o -name "*Model.*"

# 변경 빈도 (상위 20개)
git log --format=format: --name-only | grep -v '^$' | sort | uniq -c | sort -rn | head -20

# 최근 변경
git log --oneline --name-only -30 | grep -E "\.ts$|\.tsx$"

# 핵심 비즈니스 로직 파일
grep -l "class.*Service\|function.*calculate\|function.*validate" src/**/*.ts 2>/dev/null
```

## 비즈니스 규칙 식별 패턴

```typescript
// 찾아야 할 패턴들
if (condition) { /* 비즈니스 규칙 */ }
validate(input)
calculate*(...)
process*(...)
handle*(...)
```

## 출력

**파일**: `.claude/docs/legacy-analysis/core-business-logic.md`

**문서 작성**: `writing-legacy-analysis` skill의 `reference/business-logic.md` 참조
