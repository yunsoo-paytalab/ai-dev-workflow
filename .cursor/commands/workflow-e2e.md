# `/workflow-e2e` 커맨드

**사용 시점**: E2E 테스트 작업 시

**참조 파일**: `@system-integration.md` (Part B)

**기능**:

- E2E 테스트 플로우 제안
- E2E 테스트 작성 및 실행
- 최종 품질 검증
- 프로덕션 배포 준비

**권장 사항**:

- 시스템 통합 완료

**사용법**:

```
/workflow-e2e
```

**AI 실행 프롬프트**:

```
E2E 테스트 작업을 수행해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 상태를 확인해주세요
2. `.cursor/rules/workflows/system-integration.md` 파일을 읽어 작업 가이드를 확인해주세요
3. 권장 사항 확인:
   - 시스템 통합 완료

   미충족 시 다음을 표시:
```

💡 권장 사항

다음 단계가 완료되지 않았습니다:

- 시스템 통합

미완료 시 발생 가능한 문제:

- E2E 테스트 결과가 불안정할 수 있습니다
- 통합 이슈가 발견될 수 있습니다

계속 진행하시겠습니까? (y/n)

```

4. 사용자 확인 후 작업 진행
5. `system-integration.md` Part B의 프로세스를 따라 작업 수행:
- Step 1: E2E 테스트 플로우 제안
- Step 2: E2E 테스트 작성
- Step 3: E2E 테스트 실행
- Step 4: 실패 테스트 처리
- Step 5: 최종 품질 검증
- Step 6: 최종 승인
6. 결과물을 경로에 저장:
- E2E 테스트: `e2e/`
- 문서: `docs/deployment.md`
7. `memory.md` 업데이트:
- 체크박스 체크: `[x] E2E 테스트`
```
