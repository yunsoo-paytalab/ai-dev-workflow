---
name: feature-resolver
description: Feature ID와 이름을 여러 워크플로우의 문서 경로로 해석합니다. Feature 문서(research, plan, spec) 검색, Feature 참조 해석, Feature 명세 탐색 시 사용하세요. Feature ID 패턴(AUTH-001), 직접 파일 참조(@file), Feature 이름 검색, 특수 키워드를 지원합니다.
allowed-tools: Read, Grep, Glob
version: 3.2.0
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
  specialKeywords?: string[], // 특수 키워드 (예: ['common'])
  enableGroupSearch?: boolean // Group 검색 활성화 (기본: false)
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

#### 1.5. Group 검색 (enableGroupSearch가 true인 경우)

```
IF enableGroupSearch == true THEN
  featureListPath = ".claude/docs/feature-list.md"

  IF file EXISTS featureListPath THEN
    content = readFile(featureListPath)

    # "구현 순서 가이드" 섹션에서 Group 테이블 파싱
    # 테이블 형식: | Group | 우선순위 | Features | 선행 조건 |

    FOR EACH row IN groupTable DO
      groupName = extractGroupName(row.Group)  # "1. 기반 구축" → "기반 구축"

      IF argument == groupName OR
         argument == row.Group OR
         groupName CONTAINS argument THEN

        features = parseFeatureIds(row.Features)  # "AUTH-001, AUTH-002" → ["AUTH-001", "AUTH-002"]

        RETURN {
          type: 'group',
          groupName: groupName,
          groupNumber: extractGroupNumber(row.Group),
          features: features,
          priority: row.우선순위,
          prerequisite: row.선행조건
        }
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
  type: 'keyword' | 'group' | 'direct' | 'feature-id' | 'feature-name' | 'fallback' | 'error',
  featureId?: string,           // Feature ID (추출된 경우)
  featureName?: string,         // Feature 이름 (추출된 경우)
  keyword?: string,             // 특수 키워드 (type='keyword'인 경우)
  argument?: string,            // 원본 입력 (type='fallback'인 경우)
  // Group 관련 필드 (type='group'인 경우)
  groupName?: string,           // Group 이름 (예: "인증")
  groupNumber?: number,         // Group 번호 (예: 2)
  features?: string[],          // Group에 속한 Feature ID 목록
  priority?: string,            // Group 우선순위
  prerequisite?: string,        // 선행 조건
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

## Reference

상세 예시, 에러 처리, 워크플로우 통합 정보는 [reference.md](reference.md) 참조
