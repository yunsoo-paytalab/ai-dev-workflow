---
name: test-case-generator
description: 기능 명세를 기반으로 체계적인 테스트 케이스를 생성합니다. Happy path, Edge cases, Error scenarios를 자동으로 도출하고 우선순위를 제안합니다.
allowed-tools: Read, Write, Grep, Glob
---

# 테스트 케이스 생성기

## 사용 지침

기능 명세나 구현 요구사항을 분석하여 포괄적인 테스트 케이스를 생성합니다.

## 입력

- **기능 명세**: `docs/features/[기능명]/ui-spec.md` 또는 `docs/feature-list.md`
- **구현 파일**: 선택사항, 기존 코드 분석

## 프로세스

### 1. 기능 분석

**요구사항 추출:**

- 핵심 동작 식별
- 입력 파라미터 및 타입 확인
- 출력 결과 및 부작용 파악
- 비즈니스 규칙 추출

**의존성 분석:**

- 외부 API 호출
- 데이터베이스 접근
- 다른 모듈과의 연동
- 상태 변경

---

### 2. 테스트 케이스 생성

세 가지 타입으로 분류:

- **Happy Path**: 정상 흐름
- **Edge Cases**: 경계 조건
- **Error Scenarios**: 에러 상황

---

### 3. 우선순위 결정

- **P0 (Critical)**: 핵심 로직, 보안
- **P1 (High)**: 주요 플로우
- **P2 (Medium)**: 일반 기능, Edge cases
- **P3 (Low)**: 드문 시나리오

---

### 4. 테스트 데이터 준비

각 케이스에 필요한 테스트 데이터:

- Mock 데이터 구조
- Fixture 파일
- 테스트용 상수

---

## 출력

`docs/features/[기능명]/test-spec.md`
