---
name: feature-resolver-reference
description: Feature Resolver 스킬 동작 예시 및 참고 자료
version: 3.2.1
---

# Feature Resolver Reference

SKILL 동작에 대한 상세 예시와 참고 자료입니다.

## Examples

### Group 검색

**Input:**

```typescript
{
  argument: "인증",
  searchPaths: [".claude/docs/feature-list"],
  enableGroupSearch: true,
  allowFallback: true
}
```

**Output:**

```typescript
{
  type: "group",
  groupName: "인증",
  groupNumber: 2,
  features: ["AUTH-001", "AUTH-002"],
  priority: "High",
  prerequisite: "Group 1 완료",
  files: []
}
```

### Feature ID 검색

**Input:**

```typescript
{
  argument: "AUTH-001",
  searchPaths: [".claude/docs/research", ".claude/docs/plan"],
  allowFallback: true
}
```

**Output:**

```typescript
{
  type: "feature-id",
  featureId: "AUTH-001",
  files: [
    { type: "research", path: ".claude/docs/research/AUTH-001-research.md", exists: true },
    { type: "plan", path: ".claude/docs/plan/AUTH-001-plan.md", exists: true }
  ]
}
```

### 필수 파일 검증 (에러 케이스)

**Input:**

```typescript
{
  argument: "AUTH-001",
  searchPaths: [".claude/docs/research", ".claude/docs/plan"],
  requiredFiles: ["research", "plan"],
  allowFallback: false
}
```

**Output (plan 누락 시):**

```typescript
{
  type: "error",
  featureId: "AUTH-001",
  files: [
    { type: "research", path: ".claude/docs/research/AUTH-001-research.md", exists: true },
    { type: "plan", path: ".claude/docs/plan/AUTH-001-plan.md", exists: false }
  ],
  error: "필수 파일이 없습니다: plan",
  suggestions: ["/workflow-feature-spec AUTH-001"]
}
```

---

## Error Handling

| 에러 유형        | error 메시지                          | suggestions                    |
| ---------------- | ------------------------------------- | ------------------------------ |
| 파일 시스템 에러 | `파일을 읽을 수 없습니다: ${path}`    | `파일 경로를 확인하세요`       |
| 필수 파일 누락   | `필수 파일이 없습니다: ${types}`      | `/workflow-feature-spec ${id}` |
| 매칭 실패        | `매칭되는 Feature를 찾을 수 없습니다` | Feature ID 형식 확인 안내      |

---

## Implementation Reference

### Feature ID 정규식

```regex
Feature ID 패턴: ^[A-Z]+(-[A-Z]+)*-\d+$
파일명에서 추출: ([A-Z]+(?:-[A-Z]+)*-\d+)
첫 줄에서 추출: # Feature (?:Spec|Research|Plan): ([A-Z]+(?:-[A-Z]+)*-\d+)
```

### 부분 매칭 우선순위

1. 완전 일치 (exact match)
2. 시작 일치 (starts with)
3. 포함 일치 (contains)

---

## Workflow Integration

각 워크플로우에서 사용하는 파라미터 설정:

| 워크플로우            | searchPaths    | requiredFiles  | allowFallback | enableGroupSearch |
| --------------------- | -------------- | -------------- | ------------- | ----------------- |
| workflow-ui           | research, plan | -              | true          | false             |
| workflow-feature-spec | feature-list   | -              | true          | **true**          |
| workflow-implement    | research, plan | research, plan | false         | false             |
| workflow-update       | feature-list   | -              | false         | false             |
