---
name: legacy-analysis-commands-guide
description: 레거시 코드 분석을 위한 명령어 가이드
version: 3.2.1
---

# 레거시 분석 명령어

## 공통 분석 명령어

```bash
# 프로젝트 구조 빠른 스캔
ls -la src/ app/ lib/ 2>/dev/null

# 파일 통계
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | wc -l

# 설정 파일 확인
ls -la package.json tsconfig.json .eslintrc* 2>/dev/null
```

## Import/Export 분석

```bash
# Import 문 추출
grep -r "^import\|^export" src/ --include="*.ts" --include="*.tsx"

# 순환 의존성 체크 (도구 사용 시)
npx madge --circular src/
```

## 코드 품질 분석

```bash
# TODO/FIXME 검색
grep -rn "TODO\|FIXME\|HACK\|XXX" src/

# 큰 파일 식별
find . -name "*.ts" | xargs wc -l | sort -rn | head -20

# 테스트 커버리지
npm test -- --coverage
```

## Git 기반 분석

```bash
# 변경 빈도 상위 파일
git log --format=format: --name-only | grep -v '^$' | sort | uniq -c | sort -rn | head -20

# 최근 변경 파일
git log --oneline --name-only -20
```

## Output Paths

```
.claude/docs/legacy-analysis/
├── structure-overview.md
├── dependency-graph.md
├── technical-debt.md
├── core-business-logic.md
├── danger-zones.md
└── restricted-zones.json
```
