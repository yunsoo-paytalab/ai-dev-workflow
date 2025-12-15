# /workflow-task-point

Feature/Task에 포인트를 산정하고 `feature-list.md`를 업데이트합니다.

## 선행 조건

- `workflow-domain-definition` 완료
- `.claude/docs/feature-list.md` 존재
- `.claude/docs/feature-list/*.md` 세부 파일 존재

## 실행 프로세스

### Phase 1: Feature 분석

**Agent: task-point-estimator**

1. Feature 목록 (`.claude/docs/feature-list.md`) 분석
2. Feature 세부 문서 (`.claude/docs/feature-list/*.md`) 분석
3. 각 Task의 복잡도/불확실성 파악

### Phase 2: 포인트 산정

**Agent: task-point-estimator**

1. Task별 포인트 산정
   - 복잡도 + 불확실성 기반
   - 피보나치 수열 적용 (1, 2, 3, 5, 8, 13...)
   - 1pt = 쉽고 간단한 작업
2. Feature 총점 계산 (Task 포인트 합계)

### Phase 3: 문서 업데이트

**Agent: task-point-estimator**

1. `.claude/docs/feature-list.md` 업데이트
   - Feature 요약 테이블에 포인트 컬럼 추가
   - Task 상세 테이블에 포인트 컬럼 추가
2. 검토 필요 항목 표시 (8pt 이상 Task)

### Phase 4: Review & Confirm (검수 & 컨펌)

**사용자 검토**

- 산정된 포인트 검토 및 조정
- 8pt 이상 Task의 분할 필요 여부 확인
- 검토 완료 후 "개발 공수" 필드 직접 입력

### 참고: 메모리 자동 업데이트

> 워크플로우 진행 상황은 **자동으로 기록**됩니다.
> - 워크플로우 완료 상태 → progress.json (자동)
> - 체크리스트 업데이트 → memory.md (자동)
> - 대화 기록 → sessions/*.md (자동)

## 사용자 결정 포인트

🔔 **Phase 4 확인 사항**:

- Task 포인트가 작업 난이도를 적절히 반영하는가?
- 8pt 이상 Task는 분할이 필요한가?

## 결과물

- `.claude/docs/feature-list.md` (포인트 컬럼 업데이트)
