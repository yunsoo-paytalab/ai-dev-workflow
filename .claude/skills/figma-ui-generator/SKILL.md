---
name: figma-ui-generator
description: 기존 디자인 시스템 컴포넌트를 사용하여 Figma 디자인에서 UI 코드를 생성합니다. Figma MCP와 통합하여 디자인을 가져오고 프로젝트의 컴포넌트 라이브러리에 매핑합니다.
allowed-tools: mcp__figma_dev_mode_mcp_server__get_design_context, mcp__figma_dev_mode_mcp_server__get_variable_defs, mcp__figma_dev_mode_mcp_server__get_screenshot, Write, Read
---

# Figma UI 생성기

## 사전 요구사항

✅ **기존 디자인 시스템 필수**

- 컴포넌트 라이브러리 (Button, Input, Card 등)
- 디자인 토큰 (색상, 타이포그래피, 간격)
- 테마 시스템

## 사용 지침

기존 디자인 시스템 컴포넌트에 매핑하여 Figma 디자인에서 UI 코드를 생성합니다.

## 프로세스

1. **Figma 정보 수집**

   - 사용자에게 Figma URL 또는 Node ID 요청
   - 대안: Figma Desktop에서 현재 선택된 요소 사용

2. **디자인 컨텍스트 가져오기**

   ```javascript
   const result = await mcp__figma_dev_mode_mcp_server__get_design_context({
     nodeId: extractedNodeId,
     clientFrameworks: detectedFramework,
     clientLanguages: detectedLanguage,
   });
   ```

3. **기존 컴포넌트에 매핑**

   - Figma 요소 분석
   - 기존 디자인 시스템 컴포넌트와 매칭
   - 확장이 필요한 갭 식별

4. **코드 생성**
   - 기존 컴포넌트 사용 (90% 목표)
   - props/variants로 확장 (8%)
   - 스타일 확장 생성 (1.5%)
   - 새 컴포넌트는 최후의 수단으로만 생성 (0.5%)

## 매핑 전략

우선순위 순서:

1. 컴포넌트 직접 재사용
2. variant/props 추가
3. 스타일 래퍼
4. 새 컴포넌트 (가능한 한 피하기)

## 출력 예시

```tsx
// 기존 컴포넌트 재사용
import { Button, Card, Stack } from "@/components/ui";

export const FeatureSection = () => (
  <Stack spacing={4}>
    <Card>
      <Button variant="primary">시작하기</Button>
    </Card>
  </Stack>
);
```

## 에러 처리

Figma 연결 실패 시:

- Figma Desktop이 실행 중인지 확인
- 파일이 열려 있는지 확인
- Node ID가 올바른지 확인
