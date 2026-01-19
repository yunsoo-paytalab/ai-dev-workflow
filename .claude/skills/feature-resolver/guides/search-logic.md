# Feature Resolver 탐색 로직

## 1. 특수 키워드 확인

```
IF argument IN specialKeywords THEN
  RETURN { type: 'keyword', keyword: argument }
```

## 2. Group 검색 (enableGroupSearch가 true인 경우)

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

## 3. 직접 파일 참조 (`@` 접두사)

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

## 4. Feature ID 패턴 감지

**Feature ID 패턴**: `^[A-Z]+(-[A-Z]+)*-\d+$`

예: `AUTH-001`, `USER-MGMT-002`, `DASHBOARD-123`

```
IF argument MATCHES Feature ID Pattern THEN
  featureId = argument

  # searchPaths에서 파일 검색
  FOR EACH searchPath IN searchPaths DO
    FOR EACH fileType IN ['research', 'plan', 'spec'] DO
      filePath = `${searchPath}/${featureId}-${fileType}.md`
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
          error: `필수 파일이 없습니다: ${required}`,
          suggestions: [`/workflow-feature-spec ${featureId}`]
        }

  RETURN {
    type: 'feature-id',
    featureId: featureId,
    files: files.filter(f => f.exists)
  }
```

## 5. Feature 이름 매칭

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

## 6. Fallback 처리

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
    error: `매칭되는 Feature를 찾을 수 없습니다: ${argument}`,
    suggestions: [`/workflow-feature-spec ${argument}`]
  }
```
