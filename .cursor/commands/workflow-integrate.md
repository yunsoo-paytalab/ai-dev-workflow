# `/workflow-integrate` 커맨드

**사용 시점**: 시스템 통합 작업 시

**참조 파일**: `@system-integration.md` (Part A)

**기능**:

- 중복 코드 제거
- 공통 모듈 추출
- 전체 구조 개선
- (선택) 성능 최적화
- 접근성 개선

**권장 사항**:

- 모든 기능 구현 완료 (또는 대부분의 핵심 기능 완료)

**사용법**:

```
/workflow-integrate
```

**AI 실행 프롬프트**:

```
시스템 통합 작업을 수행해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 상태를 확인해주세요
2. `.cursor/rules/workflows/system-integration.md` 파일을 읽어 작업 가이드를 확인해주세요
3. 권장 사항 확인:
   - 모든 기능 구현 완료 (또는 대부분의 핵심 기능 완료)

   미충족 시 다음을 표시:
```

💡 권장 사항

다음 단계가 완료되지 않았습니다:

- 기능 구현 (일부 미완료)

미완료 시 발생 가능한 문제:

- 통합 리팩토링의 효과가 제한적일 수 있습니다
- 일부 중복 코드를 놓칠 수 있습니다

계속 진행하시겠습니까? (y/n)

```

4. 사용자 확인 후 작업 진행
5. `system-integration.md` Part A의 프로세스를 따라 작업 수행:
- Step 1: API 연동 상태 확인
- Step 2: 중복 코드 분석
- Step 3: 공통 모듈 추출
- Step 4: 전체 구조 개선
- Step 5: 성능 최적화 (선택)
- Step 6: 접근성 개선
- Step 7: 통합 테스트 보완
- Step 8: 통합 검수
6. 결과물을 경로에 저장:
- 공통 모듈: `src/shared/utils/`, `src/shared/hooks/`, `src/shared/types/`
- 통합 테스트: `__tests__/integration/cross-domain/`
7. `memory.md` 업데이트:
- 체크박스 체크: `[x] 통합 및 리팩토링`
```
