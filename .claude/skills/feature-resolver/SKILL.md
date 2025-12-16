---
name: feature-resolver
description: Feature ID와 이름을 여러 워크플로우의 문서 경로로 해석합니다. Feature 문서(research, plan, spec) 검색, Feature 참조 해석, Feature 명세 탐색 시 사용하세요. Feature ID 패턴(AUTH-001), 직접 파일 참조(@file), Feature 이름 검색, 특수 키워드를 지원합니다.
allowed-tools: Read, Grep, Glob
---

# Feature Resolver

Feature ID 또는 Feature 이름으로 관련 문서를 찾고 로드하는 재사용 가능한 SKILL입니다.

## 목적

여러 워크플로우(workflow-ui, workflow-feature-spec, workflow-implement, workflow-update)에서 공통적으로 사용되는 "Feature 문서 탐색 로직"을 중앙화하여:

- 중복 제거
- 일관성 유지
- 유지보수 용이성 향상

## Parameters

```typescript
{
  argument: string,           // 사용자 입력 ($ARGUMENTS)
  searchPaths: string[],      // 검색할 폴더 경로들
  requiredFiles?: string[],   // 필수 파일 타입 (예: ['research', 'plan'])
  allowFallback?: boolean,    // 매칭 실패 시 일반 텍스트로 처리 허용 (기본: false)
  specialKeywords?: string[]  // 특수 키워드 (예: ['common'])
}
```

## Instructions

### 탐색 로직

Feature 문서를 다음 순서로 탐색합니다:

#### 1. 특수 키워드 확인

```
IF argument IN specialKeywords THEN
  RETURN { type: 'keyword', keyword: argument }
```

#### 2. 직접 파일 참조 (`@` 접두사)

```
IF argument STARTS WITH '@' THEN
  filePath = argument.substring(1)
  featureId = extractFeatureIdFromPath(filePath)

  RETURN {
    type: 'direct',
    featureId: featureId,
    files: [{ path: filePath, type: 'direct' }]
  }
```

#### 3. Feature ID 패턴 감지

**Feature ID 패턴**: `^[A-Z]+(-[A-Z]+)\*-\\d+$`

예: `AUTH-001`, `USER-MGMT-002`, `DASHBOARD-123`

```
IF argument MATCHES Feature ID Pattern THEN
  featureId = argument

  # searchPaths에서 파일 검색
  FOR EACH searchPath IN searchPaths DO
    FOR EACH fileType IN ['research', 'plan', 'spec'] DO
      filePath = `\${searchPath}/\${featureId}-\${fileType}.md`
      IF file EXISTS THEN
        files.push({ path: filePath, type: fileType, exists: true })
      ELSE
        files.push({ path: filePath, type: fileType, exists: false })

  # requiredFiles 검증
  IF requiredFiles IS NOT EMPTY THEN
    FOR EACH required IN requiredFiles DO
      IF NOT files.find(f => f.type == required && f.exists) THEN
        RETURN {
          type: 'error',
          featureId: featureId,
          files: files,
          error: `필수 파일이 없습니다: \${required}`,
          suggestions: [`/workflow-feature-spec \${featureId}`]
        }

  RETURN {
    type: 'feature-id',
    featureId: featureId,
    files: files.filter(f => f.exists)
  }
```

#### 4. Feature 이름 매칭

```
# searchPaths의 모든 파일을 읽어 첫 줄에서 Feature ID와 이름 추출
matchedFiles = []

FOR EACH searchPath IN searchPaths DO
  FOR EACH file IN searchPath DO
    firstLine = readFirstLine(file)
    # 예: "# Feature Spec: AUTH-001 로그인 기능"

    IF firstLine CONTAINS argument OR
       firstLine CONTAINS (argument의 부분 문자열) THEN
      featureId = extractFeatureIdFromFirstLine(firstLine)
      featureName = extractFeatureNameFromFirstLine(firstLine)

      matchedFiles.push({
        featureId: featureId,
        featureName: featureName,
        file: file
      })

IF matchedFiles IS NOT EMPTY THEN
  # 가장 일치도가 높은 것 선택
  bestMatch = matchedFiles[0]

  # 해당 Feature ID로 다시 검색 (모든 관련 파일 수집)
  RETURN resolveByFeatureId(bestMatch.featureId)
```

#### 5. Fallback 처리

```
IF allowFallback == true THEN
  RETURN {
    type: 'fallback',
    argument: argument,
    files: []
  }
ELSE
  RETURN {
    type: 'error',
    error: `매칭되는 Feature를 찾을 수 없습니다: \${argument}`,
    suggestions: [`/workflow-feature-spec \${argument}`]
  }
```

## Output Format

```typescript
{
  type: 'keyword' | 'direct' | 'feature-id' | 'feature-name' | 'fallback' | 'error',
  featureId?: string,           // Feature ID (추출된 경우)
  featureName?: string,         // Feature 이름 (추출된 경우)
  keyword?: string,             // 특수 키워드 (type='keyword'인 경우)
  argument?: string,            // 원본 입력 (type='fallback'인 경우)
  files: [
    {
      type: string,             // 'research', 'plan', 'spec', 'direct'
      path: string,             // 파일 경로
      exists: boolean           // 파일 존재 여부
    }
  ],
  error?: string,               // 에러 메시지 (type='error'인 경우)
  suggestions?: string[]        // 권장 명령어 (type='error'인 경우)
}
```

## Examples

### 예시 1: 특수 키워드 (workflow-ui)

**Input:**

```typescript
{
  argument: "common",
  searchPaths: [".claude/docs/research", ".claude/docs/plan"],
  specialKeywords: ["common"],
  allowFallback: true
}
```

**Output:**

```typescript
{
  type: "keyword",
  keyword: "common",
  files: []
}
```

### 예시 2: Feature ID (workflow-feature-spec)

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

### 예시 3: 필수 파일 검증 (workflow-implement)

**Input:**

```typescript
{
  argument: "AUTH-001",
  searchPaths: [".claude/docs/research", ".claude/docs/plan"],
  requiredFiles: ["research", "plan"],
  allowFallback: false
}
```

**Case A - 모두 존재:**

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

**Case B - plan 누락:**

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

### 예시 4: Feature 이름으로 검색

**Input:**

```typescript
{
  argument: "로그인 기능",
  searchPaths: [".claude/docs/plan"],
  allowFallback: false
}
```

**Output:**

```typescript
{
  type: "feature-name",
  featureId: "AUTH-001",
  featureName: "로그인 기능",
  files: [
    { type: "plan", path: ".claude/docs/plan/AUTH-001-plan.md", exists: true }
  ]
}
```

### 예시 5: 직접 파일 참조

**Input:**

```typescript
{
  argument: "@.claude/docs/plan/AUTH-001-plan.md",
  searchPaths: [".claude/docs/plan"],
  allowFallback: false
}
```

**Output:**

```typescript
{
  type: "direct",
  featureId: "AUTH-001",
  files: [
    { type: "direct", path: ".claude/docs/plan/AUTH-001-plan.md", exists: true }
  ]
}
```

## Implementation Reference

### Feature ID 추출 정규식

```regex
Feature ID 패턴: ^[A-Z]+(-[A-Z]+)*-\d+$
파일명에서 추출: ([A-Z]+(?:-[A-Z]+)*-\d+)
첫 줄에서 추출: # Feature (?:Spec|Research|Plan): ([A-Z]+(?:-[A-Z]+)*-\d+)
```

### 부분 매칭 우선순위

1. **완전 일치** (exact match)
2. **시작 일치** (starts with)
3. **포함 일치** (contains)

### 파일 읽기 최적화

- 첫 줄만 필요한 경우 전체 파일 읽지 않기
- 병렬 파일 읽기로 성능 향상

## Error Handling

### 1. 파일 시스템 에러

```typescript
{
  type: "error",
  error: "파일을 읽을 수 없습니다: \${filePath}",
  suggestions: ["파일 경로를 확인하세요"]
}
```

### 2. 필수 파일 누락

```typescript
{
  type: "error",
  error: "필수 파일이 없습니다: \${missingFileTypes.join(', ')}",
  suggestions: ["/workflow-feature-spec \${featureId}"]
}
```

### 3. 매칭 실패

```typescript
// allowFallback == false인 경우
{
  type: "error",
  error: "매칭되는 Feature를 찾을 수 없습니다: \${argument}",
  suggestions: [
    "/workflow-feature-spec \${argument}",
    "Feature ID 형식을 확인하세요 (예: AUTH-001)"
  ]
}
```

## Workflow Integration

### workflow-ui.md

````markdown
> 💡 **Feature Resolver SKILL 사용**
>
> ```
> 파라미터:
>
> - searchPaths: [".claude/docs/research", ".claude/docs/plan"]
> - specialKeywords: ["common"]
> - allowFallback: true
> ```

결과에 따른 처리:

- type: 'keyword' → 공통 컴포넌트 모드
- type: 'direct' | 'feature-id' | 'feature-name' → 해당 research/plan 기반 UI 구현
- type: 'fallback' → 일반 텍스트로 UI 구현
````

### workflow-feature-spec.md

````markdown
> 💡 **Feature Resolver SKILL 사용**
>
> ```
> 파라미터:
>
> - searchPaths: [".claude/docs/research", ".claude/docs/plan"]
> - allowFallback: true
> ```

결과에 따른 처리:

- research + plan 모두 존재 → 기존 문서 업데이트 모드
- research만 존재 → Phase 3부터 시작 (plan 생성)
- plan만 존재 → 경고 + 사용자 확인
- 둘 다 없음 → 새 Feature 생성
- type: 'fallback' → 새 Feature 생성
````

### workflow-implement.md

````markdown
> 💡 **Feature Resolver SKILL 사용**
>
> ```
> 파라미터:
>
> - searchPaths: [".claude/docs/research", ".claude/docs/plan"]
> - requiredFiles: ["research", "plan"]
> - allowFallback: false
> ```

결과에 따른 처리:

- type: 'feature-id' && 모든 파일 존재 → 구현 진행
- type: 'error' → 에러 메시지 표시 및 워크플로우 중단
````

### workflow-update.md

````markdown
> 💡 **Feature Resolver SKILL 사용**
>
> ```
> 파라미터:
>
> - searchPaths: [".claude/docs/feature-list"]
> - allowFallback: false
> ```

결과에 따른 처리:

- type: 'feature-id' → Feature ID 확인 → 변경 내용 입력 요청
- type: 'feature-name' → 매칭된 Feature 정보 표시 → 변경 내용 입력 요청
- type: 'direct' → 파일에서 Feature ID 추출 → 변경 내용 입력 요청
- type: 'error' → 에러 메시지 표시 → 워크플로우 중단
````

## Version History

- **v1.0.0** (2025-12-16): 초기 버전 생성
  - workflow-ui, workflow-feature-spec, workflow-implement, workflow-update 지원
  - 5단계 탐색 로직 구현 (keyword → direct → feature-id → feature-name → fallback)
  - 6가지 출력 타입 지원
