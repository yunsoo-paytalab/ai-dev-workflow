# Dependency Analysis 전략 가이드

## 역할

내부 모듈 의존성, 순환 의존성, 외부 패키지 의존성 분석

## 주요 분석 항목

### 1. 내부 의존성

- import/require 문 추출
- 모듈 간 의존 관계 매핑
- 단방향 의존성 확인

### 2. 순환 의존성

- A → B → C → A 패턴 탐지
- 순환 고리 식별
- 해결 우선순위 결정

### 3. 외부 의존성

- package.json dependencies 분석
- devDependencies vs dependencies 구분
- 보안 취약점 체크

### 4. 결합도 측정

- 모듈별 의존도 (Fan-in, Fan-out)
- 허브 모듈 식별 (>10 의존)
- 고립 모듈 식별

## 분석 명령어

```bash
# Import 추출
grep -rh "^import.*from\|^const.*require" src/ --include="*.js" --include="*.ts" --include="*.tsx" | sort | uniq -c | sort -rn

# 특정 모듈 의존도
grep -r "import.*from.*moduleName" src/ --include="*.ts"

# 순환 의존성 (도구 사용)
npx madge --circular src/

# 패키지 분석
npm outdated 2>/dev/null
npm audit --json 2>/dev/null | head -100

# 패키지 크기
npm ls --depth=0
```

## 출력

**파일**: `.claude/docs/legacy-analysis/dependency-graph.md`

**문서 작성**: `writing-legacy-analysis` skill의 `reference/dependency.md` 참조
