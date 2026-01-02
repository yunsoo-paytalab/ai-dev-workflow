---
name: running-tdd
description: TDD의 Red-Green-Refactor 사이클을 관리하는 전략 가이드입니다. test-runner 에이전트 작업 시 사용하세요.
version: 3.2.0
---

# Running TDD

Test-Driven Development 사이클을 관리하는 전략 가이드입니다.

## Core Principle

**"테스트 먼저, 최소 구현, 지속적 개선"**

```
🔴 Red (실패 테스트) → 🟢 Green (최소 구현) → 🔵 Refactor (개선) → 반복
```

## TDD Phases

| Phase       | 목표                   | 가이드                                                     |
| ----------- | ---------------------- | ---------------------------------------------------------- |
| 🔴 Red      | 실패하는 테스트 작성   | [reference/red-phase.md](reference/red-phase.md)           |
| 🟢 Green    | 최소한의 구현으로 통과 | [reference/green-phase.md](reference/green-phase.md)       |
| 🔵 Refactor | 코드 품질 개선         | [reference/refactor-phase.md](reference/refactor-phase.md) |

## Test Priority

### Priority 1: Core 비즈니스 로직

- 핵심 도메인 로직
- 주요 계산 및 변환

### Priority 2: 사용자 상호작용

- UI 컴포넌트 동작
- 이벤트 핸들링

### Priority 3: 엣지 케이스

- 에러 처리
- 경계값 테스트

### Priority 4: 성능 최적화

- 최적화 로직
- 캐싱 동작

## Test Commands

```bash
# TDD 사이클
npm test -- --watch            # Watch 모드로 TDD 시작
npm test -- [file]             # 특정 파일 테스트
npm test -- --coverage         # 커버리지 확인

# 디버깅
npm test -- --detectOpenHandles # 열린 핸들 탐지
npm test -- --runInBand        # 순차 실행
```

## Lint Error Handling

> ⚠️ **최대 3회까지만 재시도**

- 3회 시도 후에도 해결되지 않으면 중단
- 해결되지 않은 lint 에러는 사용자에게 보고
- 무한 루프 방지: lint 수정 → 확인 → 실패 시 카운트 증가

## Completion Checklist

### 사이클별 체크

- [ ] **Red**: 테스트 작성 및 실패 확인
- [ ] **Green**: 최소 구현으로 테스트 통과
- [ ] **Refactor**: 코드 개선 (테스트는 여전히 통과)

### 기능 완료 조건

- [ ] 모든 시나리오 테스트 작성
- [ ] 코드 커버리지 80% 이상
- [ ] 리팩토링 완료
