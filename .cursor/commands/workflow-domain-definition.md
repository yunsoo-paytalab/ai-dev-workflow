# `/workflow-domain-definition` 커맨드

**사용 시점**: 도메인 및 기능 정의 작업 시

**참조 파일**: `@domain-definition.md`

**기능**:

- 도메인 목록 및 경계 설정
- 페이지 구조 정의
- 기능 목록 도출
- (선택) 기능 의존성 분석

**권장 사항**:

- 프로젝트 시작 시 가장 먼저 수행

**사용법**:

```
/workflow-domain-definition
```

**AI 실행 프롬프트**:

```
도메인 정의 작업을 수행해주세요:

1. `.cursor/rules/workflows/memory.md` 파일을 읽어 현재 상태를 확인해주세요
2. `.cursor/rules/workflows/domain-definition.md` 파일을 읽어 작업 가이드를 확인해주세요
3. 권장 사항 확인:
   - 요구사항 명세서 확인

   미충족 시 다음을 표시:
```

💡 권장 사항

요구사항 명세서가 제공되지 않았습니다.

미완료 시 발생 가능한 문제:

- 도메인 정의가 불완전할 수 있습니다
- 기능 목록이 누락될 수 있습니다

요구사항 명세서를 제공하시겠습니까? (y/n)
또는 계속 진행하시겠습니까? (continue)

```

4. 사용자 확인 후 작업 진행
5. `domain-definition.md`의 프로세스를 따라 작업 수행
6. 결과물을 경로에 저장:
- `docs/domain-definition.md`
- `docs/page-structure.md`
- `docs/feature-list.md`
- (선택) `docs/implementation-order.md`
7. `memory.md` 업데이트:
- 도메인 목록 추가
- 페이지 구조 추가
- 기능 진행상황 표 초기화
- 체크박스 체크: `[x] 도메인 정의`
```
