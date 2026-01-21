---
name: legacy-analysis-structure-guide
description: 레거시 코드의 구조 개요(Structure Overview) 문서 작성 가이드
version: 3.2.1
---

# Structure Overview 문서 작성 가이드

## 핵심 원칙

프로젝트 전체 구조, 아키텍처 패턴, 진입점을 빠르게 파악합니다.

## 분석 항목

1. **아키텍처**: 레이어 구조, 패턴 (MVC/MVVM/Clean) 식별
2. **진입점**: main/index/app 파일, 라우터 위치
3. **파일 조직**: 네이밍 컨벤션, 폴더 구조
4. **규모**: 파일 수, LOC, 큰 파일 (>500 LOC)

## 분석 방법

```bash
# 구조 스캔
ls -la src/ app/ lib/

# 진입점 찾기
grep -r "main\|index\|app" --include="*.js" --include="*.ts"

# 통계
cloc . --json
```

## 문서 구조

```markdown
# 프로젝트 구조 분석

## 1. 아키텍처 패턴

[식별된 아키텍처 패턴: MVC, MVVM, Clean Architecture 등]

## 2. 디렉토리 구조
```

src/
├── components/ # UI 컴포넌트
├── pages/ # 페이지 컴포넌트
├── services/ # 비즈니스 로직
├── utils/ # 유틸리티 함수
└── ...

```

## 3. 주요 진입점

| 파일 | 역할 | 비고 |
|------|------|------|
| `src/index.tsx` | 앱 진입점 | React 루트 |
| `src/App.tsx` | 메인 컴포넌트 | 라우터 포함 |

## 4. 네이밍 컨벤션

- 컴포넌트: PascalCase
- 유틸리티: camelCase
- 상수: UPPER_SNAKE_CASE

## 5. 프로젝트 규모

| 항목 | 수치 |
|------|------|
| 총 파일 수 | N개 |
| 총 LOC | N줄 |
| 평균 파일 크기 | N줄 |

## 6. 기술 스택

- Frontend: React, TypeScript
- 상태 관리: Redux / Zustand
- 스타일링: Tailwind / styled-components
```
