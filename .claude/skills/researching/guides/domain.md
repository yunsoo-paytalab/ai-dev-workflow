# Domain Research 전략 가이드

## 핵심 원칙

**"프로젝트 전체 요구사항 분석, 설계는 다음 단계에서"**

- requirements.md 전체를 빠짐없이 분석
- 비즈니스 도메인 파악
- 기술 스택 및 제약사항 확인
- 설계는 하지 않음 (domain-docs-writer가 담당)

## 주요 작업

### 1. 요구사항 문서 분석

⚠️ **requirements.md는 전체를 빠짐없이 읽어야 함**

- requirements.md 파일 **전체 읽기** (부분 발췌 금지)
- 모든 기능 요구사항을 **하나씩 나열**
- 누락 없이 출력 문서에 기록

### 2. 코드베이스 탐색

- 요구사항에서 추출한 키워드 기반 검색
- 불필요한 영역 스킵: `node_modules`, `dist`, `build`, `.git`, `coverage` 등
- 관련 기술 스택 및 의존성 파악
- 기존 패턴과 컨벤션 확인

### 3. 관련 파일 위치 파악

- Grep으로 키워드 검색 → 관련 파일 식별
- 요구사항과 관련된 파일과 모듈 추적
- 해당 영역의 데이터 흐름 파악

### 4. 기존 인터페이스 추출 (신규 설계 X)

> ⚠️ **기존 코드 분석만** - 새로운 인터페이스 설계는 domain-docs-writer가 담당

**추출 대상:**

- `interface`, `type` 선언 (TypeScript)
- API Request/Response 타입
- 엔티티/모델 정의
- Enum, 상수 타입

**검색 전략:**

```bash
# 인터페이스/타입 정의 검색
Grep: "^(export )?(interface|type) " --include="*.ts,*.tsx"

# API 관련 타입 검색
Grep: "(Request|Response|Params|Payload)" --include="*.ts"

# 엔티티/모델 검색
Grep: "(Entity|Model|Schema)" --include="*.ts"
```

**추출 시 포함할 정보:**

| 항목      | 내용                                           |
| --------- | ---------------------------------------------- |
| 파일 경로 | 인터페이스가 정의된 파일                       |
| 이름      | 인터페이스/타입 이름                           |
| 용도      | 요구사항의 어떤 기능과 관련되는지              |
| 코드      | 인터페이스 정의 코드 (필드 및 타입 포함)       |

**주의사항:**

- 요구사항과 **관련 있는** 인터페이스만 추출
- 내부 유틸리티 타입, 라이브러리 타입은 제외
- 추출만 하고, 수정/확장 제안은 하지 않음

## 포함하지 말아야 할 내용

1. **신규 엔티티/인터페이스 설계** - domain-docs-writer가 담당
2. **기존 인터페이스 수정/확장 제안** - domain-docs-writer가 담당
3. **페이지/라우팅 설계** - domain-docs-writer가 담당
4. **Feature/Task 분류** - domain-docs-writer가 담당

## 실행 프로세스

```
1. 요구사항 문서 전체 정독 → 모든 내용 기록
2. 코드베이스 효율적 탐색 → Grep/Glob 활용
3. 분석 결과 문서화 → templates/domain-research.md 참조
4. 정확성 검증 → 추측보다 확인된 사실 기반
```

## 출력

- 파일: `.claude/docs/research/domain-research.md`
- 문서 템플릿: `researching` skill의 `templates/domain-research.md` 참조
