# Technical Debt Analysis 전략 가이드

## 역할

코드 복잡도, 중복 코드, 테스트 커버리지 등 기술 부채 식별

## 주요 분석 항목

### 1. 코드 복잡도

- 함수별 Cyclomatic Complexity
- > 10 주의, >20 즉시 개선 필요
- 중첩 깊이 (>4단계 위험)

### 2. 중복 코드

- 10줄 이상 중복 블록
- 복사-붙여넣기 패턴
- 추상화 가능 영역

### 3. 큰 파일/함수

- 함수 >100줄
- 클래스/파일 >500줄
- God Object 패턴

### 4. Deprecated API

- var 사용
- eval 사용
- callback hell 패턴
- any 타입 남용

### 5. 테스트 커버리지

- 파일별 커버리지
- <30% 위험
- 테스트 없는 파일

### 6. 문제 주석

- TODO
- FIXME
- HACK
- XXX

## 분석 명령어

```bash
# 문제 주석 검색
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx"

# var 사용
grep -rn "var " src/ --include="*.js" --include="*.ts"

# any 타입
grep -rn ": any" src/ --include="*.ts" --include="*.tsx"

# 큰 파일
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20

# 테스트 커버리지
npm test -- --coverage 2>/dev/null

# Lint 이슈
npm run lint 2>/dev/null | head -50
```

## 우선순위 매트릭스

| 우선순위 | 기준                       |
| -------- | -------------------------- |
| Critical | 복잡도 >20, 보안 취약점    |
| High     | 복잡도 >15, 중복 >30줄     |
| Medium   | 복잡도 >10, 큰 파일 >500줄 |
| Low      | TODO 주석, 경미한 이슈     |

## 출력

**파일**: `.claude/docs/legacy-analysis/technical-debt.md`

**문서 작성**: `writing-legacy-analysis` skill의 `reference/debt.md` 참조
