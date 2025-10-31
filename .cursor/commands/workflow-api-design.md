# `/workflow-api-design` 커맨드

**사용 시점**: API 설계 주입 작업 시

**참조 파일**: `@api-design.md`

**기능**:

- 외부 완성 API 설계 문서 주입
- API 설계 검증
- 요청/응답 스키마 생성
- API 문서화 (OpenAPI/Swagger)

**권장 사항**:

- 설계 문서 검증 완료 (API 문서 필요)
- 데이터베이스 스키마 주입 완료 (엔티티 정보 필요)
- 외부에서 완성된 API 설계 문서 준비

**사용법**:

```
/workflow-api-design
```

**AI 실행 프롬프트**:

```
API 엔드포인트 설계 작업을 수행해주세요:

1. `${AGENT_CONFIG_DIR}/rules/workflows/memory.md` 파일을 읽어 현재 상태를 확인해주세요
2. `${AGENT_CONFIG_DIR}/rules/workflows/api-design.md` 파일을 읽어 작업 가이드를 확인해주세요
3. 권장 사항 확인:
   - 설계 문서 검증 완료 (API 문서 필요)
   - 데이터베이스 스키마 설계 완료 (엔티티 정보 필요)

   미충족 시 다음을 표시:
```

💡 권장 사항

다음 단계가 완료되지 않았습니다:

- 설계 문서 검증
- 데이터베이스 스키마 주입

미완료 시 발생 가능한 문제:

- API 엔드포인트 정보가 불명확할 수 있습니다
- 요청/응답 스키마가 데이터베이스와 불일치할 수 있습니다

계속 진행하시겠습니까? (y/n)

```

4. 사용자 확인 후 작업 진행
5. `api-design.md`의 프로세스를 따라 작업 수행:
   - Step 1: API 설계 문서 확인 (사용자 제공)
   - Step 2: 프레임워크 확인
   - Step 3: API 설계 검증
   - Step 4: 요청/응답 스키마 생성
   - Step 5: API 문서화 (OpenAPI/Swagger)
   - Step 6: 프로젝트 적용 및 검수
6. 결과물을 경로에 저장:
   - Spring Boot: `src/main/java/[package]/dto/`
   - FastAPI: `app/schemas/`
   - Flask: `app/schemas.py`
   - 문서: `docs/api-design.md`, `docs/openapi.yaml`
7. `memory.md` 업데이트:
   - 체크박스 체크: `[x] API 설계 주입`
```
