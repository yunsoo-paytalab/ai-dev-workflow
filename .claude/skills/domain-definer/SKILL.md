---
name: domain-definer
description: 도메인 경계를 정의하고 아키텍처를 설계합니다.
allowed-tools: Read, Write
---

# 도메인 정의자

## 사용 지침

요구사항을 분석하여 도메인 경계를 정의하고 도메인 정의서를 생성합니다.

## 입력

- **메모리**: `parsedData` (우선)
- **파일**: `requirements.md` (단독 실행 시)

## 프로세스

### 1. 도메인 식별

- 비즈니스 영역별 도메인 식별
- 도메인 타입 분류: **Core** / **Supporting** / **Generic**

### 2. 도메인 경계 정의

- 각 도메인의 책임과 역할
- 도메인 간 관계 정의
- 주요 엔티티 식별 및 매핑

### 3. 문서 생성

[template.md](template.md) 참조하여 `docs/domain-definition.md` 생성:

- 도메인 컨텍스트
- 도메인 경계 (Core/Supporting/Generic)
- 주요 엔티티
- 도메인 관계 다이어그램 (Mermaid)

## 출력

- `docs/domain-definition.md`

## 생성 범위 제한 ⚠️

**포함할 것**:
✅ 도메인 타입 분류 (Core/Supporting/Generic)
✅ 도메인 책임과 역할
✅ 도메인 간 관계
✅ 주요 엔티티 및 속성
✅ 도메인 다이어그램 (Mermaid)

**포함하지 말 것**:
❌ 기술 스택 선택
❌ DB 스키마 설계
❌ API 설계
❌ 구현 패턴 (Repository, Service 등)
❌ 코드 예시
❌ 프레임워크 구체적 설정

## 가이드라인

- 명확한 도메인 경계 설정
- 적절한 응집도 유지
- 확장 가능한 구조
- 프로젝트 규모에 맞는 복잡도
- **간결함 최우선** (템플릿 범위 초과 금지)
