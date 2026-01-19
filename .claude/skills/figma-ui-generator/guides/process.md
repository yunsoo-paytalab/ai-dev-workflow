# Figma UI 생성 프로세스

## 1. 디자인 정보 수집

**`get_design_context` 실행:**

```
get_design_context(nodeId) → 코드 + data-name + data-node-id
```

**토큰 초과 시 (파일 저장됨):**

```bash
# 코드 추출
jq -r '.[0].text' "파일경로"

# 인스턴스명 추출
jq -r '.[0].text' "파일경로" | grep -oE 'type [A-Z][a-zA-Z0-9]*Props' | sed 's/type \(.*\)Props/\1/' | sort -u

# data-name 추출
jq -r '.[0].text' "파일경로" | grep -o 'data-name="[^"]*"' | sort -u
```

**인스턴스명 확인 필요 시 (선택적):**

```
get_metadata(nodeId) → 인스턴스명 확인
```

> ⚠️ `get_metadata`는 큰 노드에서 실패할 수 있음

## 2. 정보 추출 & 매핑

**매핑 문서 로드:**

```
Read(".claude/docs/design-system-mapping/{프로젝트}.md")
```

**data-name 분류:**

| 패턴             | 의미                | 예시                      |
| ---------------- | ------------------- | ------------------------- |
| `key=value` 있음 | Variant 정보        | `State=Active, Size=Sm`   |
| `key=value` 없음 | 인스턴스명/레이어명 | `Menu badge`, `Accordion` |

**매핑 검색:**

1. 추출된 인스턴스명/data-name으로 매핑 문서 검색
2. 매핑된 컴포넌트의 실제 코드(Props/Variant) 확인
3. Figma variant → 코드 props 대응 파악

**검색 정규화:** 공백 제거 후 비교

- `Checkbox Base` → `CheckboxBase`
- `Information Box` → `InformationBox`

## 3. 코드 생성

**`get_design_context` 코드 기반으로 UI 구현:**

1. **레이아웃 구조 유지**: Figma 생성 코드의 레이아웃/구조 참고
2. **디자인시스템 컴포넌트로 교체**: Figma 임시 컴포넌트 → 프로젝트에 구현된 컴포넌트
3. **스타일 변환**: Tailwind className → 프로젝트 스타일 시스템
4. **이미지 경로 변환**: `figma:asset/*` → 실제 이미지 경로

## 도구별 특성

| 도구                 | 용도                | 특성                      |
| -------------------- | ------------------- | ------------------------- |
| `get_design_context` | 코드 + variant 정보 | 메인 도구, 파일 저장 지원 |
| `get_metadata`       | 인스턴스명 확인     | 큰 노드에서 실패 가능     |

> ⚠️ `get_screenshot`은 사용하지 않음 - `get_design_context`의 코드와 data-name으로 충분
