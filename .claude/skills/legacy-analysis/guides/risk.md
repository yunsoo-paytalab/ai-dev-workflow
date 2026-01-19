# No-Reference Zones & restricted-zones.json 작성 가이드

## No-Reference Zones 분류

### 🚫 Anti-Pattern

- God Object: 모든 것을 담은 거대 클래스
- Spaghetti Code: 구조 없는 코드
- Copy-Paste 코드: 무분별한 복사

### ⛔ Deprecated

- @deprecated 태그가 있는 코드
- 폐기 예정 API 사용
- 레거시 호환 코드

### 🔧 Hack

- TODO, FIXME 주석이 있는 임시 코드
- 하드코딩된 값
- 임시 우회 로직

### 🐛 Known Bug

- 알려진 버그가 있는 코드
- 수정 예정인 로직

## No-Reference Zones 문서 구조

```markdown
# No-Reference Zones (참고 금지 영역)

## 개요

이 문서의 파일들은 **절대 참고하지 마세요**.
새로운 코드 작성 시 올바른 패턴을 따르세요.

## 🚫 Anti-Pattern

| 파일                     | 문제 유형  | 대안                    |
| ------------------------ | ---------- | ----------------------- |
| `src/legacy/GodClass.ts` | God Object | 단일 책임 클래스로 분리 |

## ⛔ Deprecated

| 파일                     | 폐기 예정          | 대안                |
| ------------------------ | ------------------ | ------------------- |
| `src/utils/oldHelper.js` | v2.0에서 삭제 예정 | `newHelper.ts` 사용 |

## 🔧 Hack

| 파일                     | 위치 | 설명           |
| ------------------------ | ---- | -------------- |
| `src/temp/workaround.ts` | 전체 | 임시 우회 로직 |

## 🐛 Known Bug

| 파일                 | 버그        | 상태      |
| -------------------- | ----------- | --------- |
| `src/calc/broken.ts` | 소수점 오류 | 수정 예정 |
```

## restricted-zones.json 구조

```json
{
  "version": "3.2.1",
  "lastUpdated": "2024-01-16T10:00:00Z",
  "danger_zones": {
    "critical": [
      {
        "path": "src/services/payment.ts",
        "reason": "결제 핵심 로직, 커버리지 0%, 복잡도 25",
        "requires_approval": true,
        "approval_level": "explicit",
        "required_actions": [
          "영향 범위 분석",
          "테스트 케이스 3개 이상",
          "명시적 승인"
        ]
      }
    ],
    "high": [
      {
        "path": "src/auth/session.ts",
        "reason": "인증 로직, 커버리지 25%",
        "requires_approval": true,
        "approval_level": "plan_required"
      }
    ],
    "medium": [
      {
        "path": "src/utils/format.ts",
        "reason": "높은 변경 빈도",
        "requires_approval": false,
        "warning": "테스트 보강 권장"
      }
    ]
  },
  "no_reference_zones": {
    "anti_pattern": [
      {
        "path": "src/legacy/GodClass.ts",
        "type": "god_object",
        "alternative": "단일 책임 클래스로 분리"
      }
    ],
    "deprecated": [
      {
        "path": "src/utils/oldHelper.js",
        "deprecation_version": "2.0",
        "alternative": "src/utils/newHelper.ts"
      }
    ],
    "hack": [
      {
        "path": "src/temp/workaround.ts",
        "description": "임시 우회 로직"
      }
    ],
    "known_bug": [
      {
        "path": "src/calc/broken.ts",
        "bug_description": "소수점 계산 오류",
        "status": "fix_scheduled"
      }
    ]
  }
}
```
