---
name: planning
description: Research 결과를 바탕으로 기술 설계와 구현 계획을 수립하는 전략 가이드입니다. planning-agent 작업 시 사용하세요.
version: 3.2.1
---

# Planning

Research 결과(Feature Research 문서)와 기존 코드를 분석하여 기술 설계와 Implementation Plan을 수립하는 전략 가이드입니다.

## Core Principles

**"요구사항 + 관련 파일 참조를 바탕으로 설계하고 실행 계획 수립"**

- Research 문서의 1.4 관련 파일 목록을 우선 참조
- 필요시 추가 코드 탐색
- 설계와 구현 계획을 체계적으로 작성
- 코드 예시는 핵심 로직과 의사결정이 필요한 경우에만

## Input

- Feature Research 문서 (`.claude/docs/research/[Feature ID]-research.md`)
  - 1.4 관련 파일 목록 참조하여 중복 탐색 최소화

## Output

- Feature Plan 문서를 `.claude/docs/plan/` 디렉토리에 저장
- 파일명: `[기능 ID]-plan.md` (예: `AUTH-001-plan.md`)
- 문서 작성: `writing-feature-docs` skill의 `feature-plan.md` 참조

## Planning Process

### 1. Feature Research 문서 분석

- `.claude/docs/research/[Feature ID]-research.md` 읽기
- 섹션 1.4 관련 파일 목록 확인
- 구현 범위 파악

### 2. 관련 파일 분석

- Research 문서 1.4에 나열된 파일 우선 읽기
- 재사용 가능한 컴포넌트/패턴 파악
- 필요시 추가 코드 탐색

### 3. 의사결정 항목 식별

- 여러 옵션이 있는 경우
- 사용자 확인이 필요한 경우
- 리스크가 있는 경우

### 4. Implementation Groups 작성

> ⚠️ **그룹화 원칙**
>
> - 논리적으로 관련된 작업들을 하나의 그룹으로 묶음
> - 각 그룹은 독립적으로 검증 가능해야 함
> - 그룹당 3-7개 정도의 task가 적절
> - 의존성 순서를 고려하여 그룹 배치
> - 전체 4-6개 그룹으로 구성 권장

### 5. 검증 방법 정의

- 각 그룹별 검증 조건 명시
- 자동화 가능한 검증 우선
- 수동 확인 항목

## Planning Principles

### 1. 그룹화

- 논리적으로 관련된 작업들을 묶음
- 각 그룹은 독립적으로 검증 가능
- 개발자가 검토하기 적절한 크기 (그룹당 3-7개 task)
- 전체 4-6개 그룹으로 구성

### 2. 간결함

- 파일명 + 한 줄 설명
- 코드 예시는 의사결정 필요시에만
- 섹션 1과 중복 금지

### 3. 실행 가능성

- 명확한 순서
- 검증 가능한 단위
- 의존성 고려
- 각 그룹에 검증 조건 명시

### 4. 검수 용이성

- 의사결정 항목을 맨 앞에
- 체크리스트 형태
- 그룹별로 commit 가능한 단위

## Code Example Guidelines

### ✅ 포함해야 하는 경우

1. **의사결정이 필요한 경우**
   - 여러 구현 방법 중 선택이 필요할 때
   - 트레이드오프가 있을 때
   - 사용자 확인이 필요할 때

### ❌ 포함하지 않는 경우

1. **이미 섹션 1에 있는 내용**

   - Before/After 코드
   - 인터페이스 정의
   - 핵심 로직

2. **명확한 구현**
   - 표준 패턴으로 구현 가능한 경우
   - 특별한 고려사항 없는 경우
