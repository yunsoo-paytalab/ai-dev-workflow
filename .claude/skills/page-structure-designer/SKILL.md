---
name: page-structure-designer
description: 기능 목록을 기반으로 페이지 구조와 라우팅을 설계합니다.
allowed-tools: Read, Write
---

# 페이지 구조 설계자

## 사용 지침

기능 목록을 기반으로 페이지 구조, 라우팅, 접근 권한을 설계합니다.

## 입력

- **메모리**: `parsedData`, `featureList` (우선)
- **파일**: `requirements.md`, `docs/feature-list.md` (단독 실행 시)

## 프로세스

### 1. 페이지 식별

- 기능 기반 페이지 추출
- URL 경로 정의

### 2. 구조 설계

- 사이트맵 구조
- 라우팅 계층 구조
- 접근 권한 매트릭스 (Guest/User/Admin)

### 3. 문서 생성

[template.md](template.md) **형식만** 참조하여 `docs/page-structure.md` 생성:

- 사이트맵 다이어그램 (Mermaid)
- 라우팅 구조 (Tree 형태)
- 접근 권한 매트릭스 (Table)
- 주요 페이지 정보 (경로, 권한, 기능 ID만)

## 출력

- `docs/page-structure.md`

## 생성 범위 제한 ⚠️

**포함할 것**:
✅ 페이지 계층 구조
✅ URL 경로
✅ 접근 권한
✅ 페이지별 기능 ID 매핑

**포함하지 말 것**:
❌ UI 와이어프레임
❌ 컴포넌트 목록
❌ 상태 관리 (Recoil/Redux)
❌ API 엔드포인트
❌ 코드 예시
❌ 성능/접근성 가이드

## 가이드라인

- 직관적인 URL 구조
- 명확한 권한 체계
- 확장 가능한 라우팅
- **간결함 최우선** (템플릿 범위 초과 금지)
