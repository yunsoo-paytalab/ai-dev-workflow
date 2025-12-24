# Structure Analysis 전략 가이드

## 역할

프로젝트 전체 구조, 아키텍처 패턴, 진입점을 빠르게 파악

## 주요 분석 항목

### 1. 아키텍처 패턴 식별

- 레이어 구조 (Layered, Clean Architecture)
- 패턴 (MVC, MVVM, Flux/Redux)
- 모놀리식 vs 모듈러

### 2. 진입점 파악

- main/index/app 파일 위치
- 라우터 설정
- 서버 시작점

### 3. 파일 조직

- 네이밍 컨벤션 (camelCase, PascalCase, kebab-case)
- 폴더 구조 패턴
- 기능별/레이어별 조직

### 4. 프로젝트 규모

- 파일 수 및 LOC
- 큰 파일 식별 (>500 LOC)
- 디렉토리별 분포

## 분석 명령어

```bash
# 구조 스캔
ls -la src/ app/ lib/ 2>/dev/null
tree -L 3 -d src/ 2>/dev/null || find src/ -type d | head -50

# 진입점 찾기
grep -rl "main\|createApp\|ReactDOM.render" --include="*.js" --include="*.ts" --include="*.tsx" | head -10

# 라우터 찾기
grep -rl "Router\|Route\|createBrowserRouter" --include="*.tsx" --include="*.jsx" | head -10

# 통계
find . -name "*.ts" -o -name "*.tsx" | wc -l
cloc . --json 2>/dev/null || find . -name "*.ts" | xargs wc -l | tail -1
```

## 출력

**파일**: `.claude/docs/legacy-analysis/structure-overview.md`

**문서 작성**: `writing-legacy-analysis` skill의 `reference/structure.md` 참조
