# `/workflow-implement [기능명]` 커맨드

**사용 시점**: 기능 구현 작업 시

**참조 파일**: `@feature-implementation.md`

**기능**:

- 테스트 작성 (Test-First)
- 구현 (더미 데이터 우선)
- 리팩토링
- (선택) API 연동

**권장 사항**:

- 도메인 정의 완료
- 해당 기능 UI 설계 완료 (권장)

**사용법**:

```
/workflow-implement 상품목록
/workflow-implement 장바구니
```

**AI 실행 프롬프트**:

```
기능 구현 작업을 수행해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 상태를 확인해주세요
2. `.cursor/rules/workflows/feature-implementation.md` 파일을 읽어 작업 가이드를 확인해주세요
3. 커맨드 파라미터 확인:
   - 기능명: [기능명]

4. 권장 사항 확인:
   - 도메인 정의 완료 (기능 목록 필요)
   - 해당 기능 UI 설계 완료 (권장)

   미충족 시 다음을 표시:
```

💡 권장 사항

다음 단계가 완료되지 않았습니다:

- 도메인 정의
- 기능 UI 설계 (권장)

미완료 시 발생 가능한 문제:

- 기능 정보가 불명확할 수 있습니다
- UI 컴포넌트 구조를 알 수 없어 구현이 어려울 수 있습니다

계속 진행하시겠습니까? (y/n)

```

5. 사용자 확인 후 작업 진행
6. `feature-implementation.md`의 프로세스를 따라 작업 수행:
- Step 1: 기능 정보 확인
- Step 2: 테스트 작성
- Step 3: 구현 (더미 데이터)
- Step 4: 리팩토링
- Step 5: 기능 검수
- Step 6: API 연동 (선택)
7. 결과물을 경로에 저장:
- 구현: `src/features/{domain}/`, `src/pages/`, `src/api/{domain}/`
- 더미 데이터: `src/mocks/data/{domain}.ts`
- 테스트: `__tests__/`
8. `memory.md` 업데이트:
- 기능 진행상황 표 업데이트
  - 구현: ✅
  - API 연동: ✅ (연동 시) 또는 ⏳ (미연동 시)
```
