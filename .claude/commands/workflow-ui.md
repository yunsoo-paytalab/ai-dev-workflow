# /workflow-ui $ARGUMENTS

Figma 디자인을 기반으로 UI 컴포넌트를 생성합니다.

## 사용법

```bash
/workflow-ui common                              # 공통 컴포넌트 확장
/workflow-ui @.claude/docs/plan/AUTH-001-plan.md # 파일 직접 참조
/workflow-ui AUTH-001                            # Feature ID로 UI 생성
/workflow-ui 로그인 기능                          # Feature 이름으로 UI 생성
```

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                                     | 설명                       |
| ------------ | ---------------------------------------- | -------------------------- |
| 예약어       | `common`                                 | 공통 컴포넌트 확장 모드    |
| 파일 참조    | `@.claude/docs/plan/AUTH-001-plan.md`    | 파일 직접 참조             |
| Feature ID   | `AUTH-001`                               | Feature ID로 문서 검색     |
| Feature 이름 | `로그인 기능`                            | Feature 이름으로 문서 검색 |

### 참조 문서 탐색

> 💡 **Feature Resolver SKILL 사용**
>
> 상세 로직: `@.claude/skills/feature-resolver/SKILL.md` 참조
>
> ```
> 파라미터:
> - argument: $ARGUMENTS
> - searchPaths: [".claude/docs/research", ".claude/docs/plan"]
> - specialKeywords: ["common"]
> - allowFallback: true
> ```

**결과에 따른 처리:**

| 결과 타입          | 처리 방법                                                 |
| ------------------ | --------------------------------------------------------- |
| `keyword` (common) | 공통 컴포넌트 모드로 진행                                 |
| `direct`           | 직접 참조된 파일로 UI 구현                                |
| `feature-id`       | 해당 Feature의 research/plan 문서 로드 → UI 구현          |
| `feature-name`     | 매칭된 Feature의 research/plan 문서 로드 → UI 구현        |
| `fallback`         | `$ARGUMENTS`를 일반 텍스트로 처리하여 UI 구현             |
| `error`            | (발생하지 않음, allowFallback=true)                       |

> ℹ️ **참고**: UI 구현은 workflow-feature-spec의 결과물(research, plan)을 기반으로 합니다.

## 전제 조건

✅ **디자인 시스템이 이미 구축되어 있음**

- 기본 컴포넌트 라이브러리 존재
- 디자인 토큰 정의됨
- 테마 시스템 구축됨

## 실행 프로세스

### Phase 1: 디자인 시스템 분석

기존 구조를 파악합니다:

- 컴포넌트 라이브러리 구조 (`src/components/ui/`)
- 디자인 토큰 체계 (색상, 타이포그래피, 간격)
- 테마 시스템

### Phase 2: Figma UI 생성

> 💡 **Figma UI Generator SKILL 사용**
>
> 상세 로직: `@.claude/skills/figma-ui-generator/SKILL.md` 참조
>
> Figma MCP와 통합하여 디자인을 가져오고 기존 컴포넌트에 매핑합니다.

**처리 과정:**

1. **Figma 정보 수집**
   - 사용자에게 Figma URL 또는 Node ID 요청
   - 대안: Figma Desktop에서 현재 선택된 요소 사용

2. **디자인 컨텍스트 가져오기**
   - Figma MCP를 통해 디자인 정보 수집
   - 컴포넌트 구조 및 스타일 분석

3. **기존 컴포넌트에 매핑**
   - Figma 요소 분석
   - 기존 디자인 시스템 컴포넌트와 매칭
   - 확장이 필요한 갭 식별

4. **코드 생성**
   - 기존 컴포넌트 재사용 (90% 목표)
   - props/variants로 확장 (8%)
   - 스타일 확장 생성 (1.5%)
   - 새 컴포넌트는 최후의 수단 (0.5%)

### Phase 3: 코드 생성 및 검토

디자인 시스템 기반 컴포넌트를 생성하고 검토합니다:

- 생성된 코드 리뷰
- 기존 컴포넌트와의 일관성 확인
- 테스트 코드 생성 (필요시)

## 사용자 입력 필요

🔔 **필수 정보**:

- Scope 선택 (`common` 또는 기능명)
- Figma URL 또는 Node ID

## 결과물

- **common**: `src/components/ui/` - 확장된 공통 컴포넌트
- **기능별**: `src/features/[기능명]/components/` - 기능 컴포넌트
