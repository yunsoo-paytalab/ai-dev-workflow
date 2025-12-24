# Domain Research 전략 가이드

## 핵심 원칙

**"프로젝트 전체 요구사항 분석, 설계는 다음 단계에서"**

- requirements.md 전체를 빠짐없이 분석
- 비즈니스 도메인 파악
- 기술 스택 및 제약사항 확인
- 설계는 하지 않음 (domain-definition-writer가 담당)

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

## 포함하지 말아야 할 내용

1. **엔티티/인터페이스 설계** - domain-definition-writer가 담당
2. **페이지/라우팅 설계** - page-structure-writer가 담당
3. **Feature/Task 분류** - feature-classifier가 담당

## 실행 프로세스

```
1. 요구사항 문서 전체 정독 → 모든 내용 기록
2. 코드베이스 효율적 탐색 → Grep/Glob 활용
3. 분석 결과 문서화 → writing-domain-docs skill 참조
4. 정확성 검증 → 추측보다 확인된 사실 기반
```

## 출력

- 파일: `.claude/docs/research/domain-research.md`
- 문서 작성: `writing-domain-docs` skill의 `domain-research.md` 참조
