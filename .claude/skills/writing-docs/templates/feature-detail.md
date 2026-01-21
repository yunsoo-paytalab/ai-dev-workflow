---
name: writing-docs-feature-detail-template
description: Feature Detail 문서 작성을 위한 구조 템플릿
version: 3.2.1
---

# Feature Detail 문서 구조 템플릿

```markdown
# {Feature ID}: {기능명}

## 기본 정보

- **카테고리**: [카테고리명]
- **상태**: 설계 중 | 개발 중 | 완료 | 보류
- **관련 페이지**: [페이지 경로]
- **권한**: [접근 가능한 사용자 역할]

## 개요

[기능에 대한 2-3줄 간략한 설명]

## 주요 요구사항

> `domain-definition.md`의 해당 컨텍스트 비즈니스 규칙을 Feature 관점에서 상세히 작성

### 기능 요구사항

- [기능 요구사항 1: 상세 설명]
- [기능 요구사항 2: 상세 설명]

### 비즈니스 규칙

- [비즈니스 규칙 1: 상세 설명 및 예외 케이스]
- [비즈니스 규칙 2: 상세 설명 및 예외 케이스]

### 제약사항 (해당시)

- [제약사항 1]
- [제약사항 2]

## 데이터 연동

**API 엔드포인트**:

- `GET /api/...` - [설명]
- `POST /api/...` - [설명]

**상태 관리**:

- 로컬: [로컬 상태 항목]
- 전역: [전역 상태 항목] (해당시)

## 관련 도메인 인터페이스

> `domain-definition.md`의 엔티티 정의를 참조하여 코드 블럭으로 작성

**주요 엔티티**:

```typescript
interface EntityName {
  id: string;
  // 필드들...
}
```

**DTO/Request** (해당시):

```typescript
interface CreateRequest {
  // 필드들...
}
```

## 관련 유저 시나리오

> `user-scenarios.md`에서 해당 Feature와 연결된 시나리오를 매핑

| 시나리오 ID | 시나리오명   | 관련 단계   | 역할                  |
| ----------- | ------------ | ----------- | --------------------- |
| US-001      | [시나리오명] | [단계 번호] | 주요 흐름 / 대안 흐름 |
| US-002      | [시나리오명] | [단계 번호] | 주요 흐름 / 대안 흐름 |

## Tasks

| Task ID          | Task명   | 설명         | 우선순위        | 의존성           |
| ---------------- | -------- | ------------ | --------------- | ---------------- |
| {Feature ID}-001 | [Task명] | [한 줄 설명] | high/medium/low | -                |
| {Feature ID}-002 | [Task명] | [한 줄 설명] | high/medium/low | {Feature ID}-001 |

### {Feature ID}-001: [Task명]

**구현 요소**:

- API: `fetchExample`, `updateExample`
- 훅/유틸: `useAuth`, `formatDate`
- 엔티티: `Example`, `ExampleDetail`

**조건 분기**: [케이스1], [케이스2], [케이스3]

**상태 복잡도** (해당시):

- 공유 범위: [N]개 컴포넌트
- 상태 의존성: [상태A] ↔ [상태B] 동기화
- 전역 상태: Context/Store 설계 필요 여부

**핵심 비즈니스 로직** (복잡한 계산/검증이 있는 경우만):

```typescript
// 함수 시그니처만 (구현 X)
type CalculateTotal = (items: Item[], discounts: Discount[]) => TotalResult;
```

---

## 의존성

**선행 Feature**: [Feature ID 및 이름, 또는 "없음"]
**후속 Feature**: [Feature ID 및 이름, 또는 "없음"]
```
