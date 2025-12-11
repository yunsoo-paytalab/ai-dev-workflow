# /workflow-ui $ARGUMENTS

Figma 디자인을 기반으로 UI 컴포넌트를 생성합니다.

## 사용법

```bash
/workflow-ui common                        # 공통 컴포넌트 확장
/workflow-ui @.claude/docs/specs/auth.md   # 파일 직접 참조
/workflow-ui AUTH-001                      # Feature ID로 UI 생성
/workflow-ui 로그인 기능                    # Feature 이름으로 UI 생성
```

## 인자 처리

`$ARGUMENTS`는 다음 형태로 입력될 수 있습니다:

| 입력 형태    | 예시                           | 설명                       |
| ------------ | ------------------------------ | -------------------------- |
| 예약어       | `common`                       | 공통 컴포넌트 확장 모드    |
| 파일 참조    | `@.claude/docs/specs/auth.md`  | 파일 직접 참조             |
| Feature ID   | `AUTH-001`                     | Feature ID로 문서 검색     |
| Feature 이름 | `로그인 기능`                  | Feature 이름으로 문서 검색 |

### 참조 문서 탐색

**기본 참조 경로**: `.claude/docs/specs/`

**파일 형식**: 각 파일의 첫 줄은 `# Feature Spec: Feature ID Feature 이름` 형식

**탐색 로직**:

1. `$ARGUMENTS`가 `common`이면 → 공통 컴포넌트 모드로 진행
2. `$ARGUMENTS`가 `@`로 시작하면 → 해당 파일을 직접 참조 문서로 사용
3. 그 외의 경우, `.claude/docs/specs/` 폴더 내 모든 파일의 첫 줄을 읽음
4. `$ARGUMENTS`와 매칭:
   - Feature ID 일치 (예: `AUTH-001`)
   - Feature 이름 일치 또는 포함 (예: `로그인 기능`)
   - 부분 텍스트 매칭 (예: `로그인` → `로그인 기능` 매칭)
5. **매칭 결과에 따른 분기**:
   - ✅ 매칭 성공 → 해당 spec 문서를 기반으로 UI 구현 진행
   - ❌ 매칭 실패 → `$ARGUMENTS`를 일반 텍스트로 처리하여 UI 구현 진행

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
