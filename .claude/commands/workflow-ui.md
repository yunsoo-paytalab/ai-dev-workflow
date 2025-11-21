# /workflow-ui [scope]

Figma 디자인을 기반으로 UI 컴포넌트를 생성합니다.

## 사용법

```bash
/workflow-ui common          # 공통 컴포넌트 확장
/workflow-ui [기능명]        # 기능별 UI 생성 (예: product-list, cart)
```

## 전제 조건

✅ **디자인 시스템이 이미 구축되어 있음**

- 기본 컴포넌트 라이브러리 존재
- 디자인 토큰 정의됨
- 테마 시스템 구축됨

## 실행 프로세스

1. **상태 확인** → **Agent: memory-manager**
2. **디자인 시스템 분석** → 기존 구조 파악
3. **Figma 연동** → Figma 디자인 코드 생성 (MCP 도구 활용)
4. **코드 생성** → 디자인 시스템 기반 컴포넌트 생성
5. **진행 상황 저장** → **Agent: memory-manager**

## 사용자 입력 필요

🔔 **필수 정보**:

- Scope 선택 (`common` 또는 기능명)
- Figma URL 또는 Node ID

## 결과물

- **common**: `src/components/ui/` - 확장된 공통 컴포넌트
- **기능별**: `src/features/[기능명]/components/` - 기능 컴포넌트
