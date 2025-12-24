# Loading Restricted Zones Skill

제한 영역(Danger Zones + No-Reference Zones)을 로드하고 적용하는 가이드입니다.

## 적용 시점

- 워크플로우 시작 시 Phase 0로 실행
- 코드 수정/분석 작업 전

## 제한 영역 파일

**경로**: `.claude/docs/legacy-analysis/restricted-zones.json`

파일이 없으면 Phase 0 건너뜀 (신규 프로젝트)

## Danger Zones (위험도별 컨펌)

| 등급        | 표시 | 수정 조건               |
| ----------- | ---- | ----------------------- |
| Critical    | 🔴   | 반드시 명시적 승인 필요 |
| High Risk   | 🟠   | 변경 계획 + 승인 필요   |
| Medium Risk | 🟡   | 주의 안내 필요          |
| Safe        | 🟢   | 자유롭게 수정 가능      |

## No-Reference Zones (참고 금지)

| 유형         | 표시 | 설명                        |
| ------------ | ---- | --------------------------- |
| Anti-Pattern | 🚫   | 잘못된 패턴, 참고하면 안 됨 |
| Deprecated   | ⛔   | 더 이상 사용하지 않는 코드  |
| Hack         | 🔧   | 임시 해결책, 따라하면 안 됨 |
| Known Bug    | 🐛   | 알려진 버그가 있는 코드     |

**중요**: No-Reference Zones의 코드는 읽거나 참고하지 않음

## 로드 프로세스

```
1. restricted-zones.json 존재 확인
2. 있으면 → Danger Zones + No-Reference Zones 메모리에 로드
3. 없으면 → Phase 0 건너뜀
4. 이후 작업에서 해당 영역 접근 시 규칙 적용
```

## 출력 형식 (로드 성공 시)

```
📋 제한 영역 로드 완료
- Danger Zones: N개 영역
- No-Reference Zones: N개 영역
```
