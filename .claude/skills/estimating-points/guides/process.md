# 포인트 산정 프로세스

## Absolute Rules

> ⚠️ **이 규칙을 위반하면 작업은 실패한 것으로 간주됩니다.**

1. **1pt = 최소 단위** (이보다 작은 포인트는 없음)
2. **피보나치 수열만 사용**: 1, 2, 3, 5, 8, 13, 21...
   - ❌ 4pt, 6pt, 7pt 등 피보나치가 아닌 값 사용 금지
3. **13pt 이상 = 분할 검토 필요**

## Point Selection Guide

```
"3pt보다 조금 더 복잡" → 5pt (4pt는 없음)
"5pt보다 조금 더 복잡" → 8pt (6pt, 7pt는 없음)
"2pt와 3pt 사이"       → 복잡도 재평가 후 2pt 또는 3pt
```

## Execution Process

1. **Feature 목록 읽기**
   - `.claude/docs/feature-list.md` 분석
   - 전체 Feature/Task 구조 파악

2. **Feature 상세 문서 읽기**
   - `.claude/docs/feature-list/*.md` 파일들 분석
   - 각 Feature에 포함된 Task들의 상세 내용 파악

3. **Feature 포인트 산정**
   - 각 Feature의 전체 복잡도/불확실성 평가
   - 피보나치 수열 값 중 선택

4. **Task별 산정 기준 작성**
   - 각 Task의 복잡도/불확실성 요소 간략히 기재
   - 포인트는 부여하지 않음

5. **포인트 검증 (필수)**
   - 모든 Feature 포인트가 피보나치인지 확인
   - 위반 발견 시 즉시 수정

6. **feature-list.md 업데이트**
   - Feature 요약 테이블에 `포인트` 컬럼 추가
   - Task 상세 테이블에 `산정 기준` 컬럼 추가
   - "검토 필요 항목" 섹션 추가

## Output Format

### Feature 요약 테이블

| ID       | Feature명 | 우선순위 | 포인트 | 개발 공수 |
| -------- | --------- | -------- | ------ | --------- |
| AUTH-001 | 로그인    | P1       | 3      |           |

### Task 상세 테이블

| Task ID      | 설명      | 산정 기준     |
| ------------ | --------- | ------------- |
| AUTH-001-001 | 로그인 폼 | 단순 UI 구현  |
| AUTH-001-002 | 인증 API  | 외부 API 연동 |
