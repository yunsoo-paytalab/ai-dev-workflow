---
name: domain-processor
description: 요구사항을 분석하여 도메인을 설계하고 관련 문서를 생성합니다. 요구사항 파싱, 도메인 아키텍처 설계, 문서 작성을 통합 처리합니다.
allowed-tools: Read, Write
---

# 도메인 프로세서

## 사용 지침

요구사항 파일을 입력받아 도메인 분석 및 문서 생성을 한 번에 처리합니다.

## 입력

- **requirements.md** (또는 사용자 지정 요구사항 파일)

## 프로세스

### 1. 요구사항 분석

requirements.md 읽고 다음 정보 추출:

- 프로젝트 개요 및 목표
- 기능 요구사항 (Functional Requirements)
- 비기능 요구사항 (Non-functional Requirements)
- 사용자 유형 (User Types)
- 제약사항 (Constraints)
- 핵심 기능 목록

### 2. 도메인 설계

**도메인 식별:**

- 비즈니스 영역별 도메인 식별
- 도메인 타입 분류: core (핵심) / supporting (지원) / generic (일반)
- 각 도메인의 책임 및 경계 정의

**기능 목록 생성:**

- 기능별 고유 ID 할당 (F001, F002, ...)
- 소속 도메인 매핑
- 복잡도 평가 (Low / Medium / High)
- 기능 간 의존성 식별

**페이지 구조 설계:**

- URL 경로 및 페이지명 정의
- 접근 레벨 설정 (public / guest / user / admin)
- 각 페이지에 필요한 기능 매핑

### 3. 문서 생성

[templates](templates) 폴더의 템플릿 구조를 참조하여 문서 생성:

- domain-definition.md
- page-structure.md
- feature-list.md

## 출력

생성되는 파일:

- `docs/domain-definition.md`
- `docs/page-structure.md`
- `docs/feature-list.md`

## 가이드라인

- **명확한 경계**: 도메인 간 책임이 명확히 구분되도록
- **적절한 응집도**: 과도한 분리보다는 논리적 응집성 유지
- **확장 가능성**: 향후 기능 추가를 고려한 구조
- **실용성 우선**: 프로젝트 규모에 맞는 적절한 복잡도

## 예시

입력 (requirements.md):

```
쇼핑몰 시스템 구축
- 상품 목록 조회
- 장바구니 관리
- 주문 처리
- 사용자 인증
```

출력:

- 도메인: Product (core), Cart (core), Order (core), Auth (supporting)
- 기능: F001-상품목록, F002-장바구니추가, F003-주문생성, F004-로그인
- 페이지: /, /products, /cart, /checkout, /login
