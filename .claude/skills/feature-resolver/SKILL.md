---
name: feature-resolver
description: Feature ID와 이름을 여러 워크플로우의 문서 경로로 해석합니다. Feature 문서(research, plan, spec) 검색, Feature 참조 해석, Feature 명세 탐색 시 사용하세요. Feature ID 패턴(AUTH-001), 직접 파일 참조(@file), Feature 이름 검색, 특수 키워드를 지원합니다.
allowed-tools: Read, Grep, Glob
model: haiku
version: 3.2.1
---

# Feature Resolver

Feature ID 또는 Feature 이름으로 관련 문서를 찾고 로드합니다.

## Parameters

```typescript
{
  argument: string,           // 사용자 입력 ($ARGUMENTS)
  searchPaths: string[],      // 검색할 폴더 경로들
  requiredFiles?: string[],   // 필수 파일 타입 (예: ['research', 'plan'])
  allowFallback?: boolean,    // 매칭 실패 시 일반 텍스트로 처리 허용
  specialKeywords?: string[], // 특수 키워드 (예: ['common'])
  enableGroupSearch?: boolean // Group 검색 활성화
}
```

## 탐색 순서

1. **특수 키워드** → `{ type: 'keyword' }`
2. **Group 검색** (enableGroupSearch=true) → `{ type: 'group', features: [...] }`
3. **직접 파일 참조** (`@` 접두사) → `{ type: 'direct' }`
4. **Feature ID 패턴** (`AUTH-001`) → `{ type: 'feature-id' }`
5. **Feature 이름 매칭** → `{ type: 'feature-name' }`
6. **Fallback** → `{ type: 'fallback' }` 또는 에러

## Output Format

```typescript
{
  type: 'keyword' | 'group' | 'direct' | 'feature-id' | 'feature-name' | 'fallback' | 'error',
  featureId?: string,
  files: [{ type: string, path: string, exists: boolean }],
  // Group: groupName, features[], priority, prerequisite
  error?: string,
  suggestions?: string[]
}
```

## Reference

- 상세 탐색 로직: [guides/search-logic.md](guides/search-logic.md)
- 예시, 에러 처리: [reference.md](reference.md)
