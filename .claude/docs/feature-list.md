# Feature List

프로젝트의 기능 목록 및 Task 현황입니다.

## Feature 목록

| Feature ID | 기능명      | 카테고리 | Tasks | 상태        | 상세 문서                                      |
| ---------- | ----------- | -------- | ----- | ----------- | ---------------------------------------------- |
| AUTH-001   | 사용자 인증 | Core     | 7     | in-progress | [상세](./feature-list/AUTH-001-사용자-인증.md) |
| DASH-001   | 대시보드    | Feature  | 5     | pending     | [상세](./feature-list/DASH-001-대시보드.md)    |
| ORDER-001  | 주문 관리   | Feature  | 6     | pending     | [상세](./feature-list/ORDER-001-주문-관리.md)  |

## 전체 Task 목록

| Task ID       | Task명                   | Feature   | 우선순위 | 의존성                     | 상태        |
| ------------- | ------------------------ | --------- | -------- | -------------------------- | ----------- |
| AUTH-001-001  | Users 테이블 스키마 설계 | AUTH-001  | high     | -                          | done        |
| AUTH-001-002  | JWT 유틸리티 구현        | AUTH-001  | high     | AUTH-001-001               | done        |
| AUTH-001-003  | 로그인 API 엔드포인트    | AUTH-001  | high     | AUTH-001-002               | in-progress |
| AUTH-001-004  | 회원가입 API 엔드포인트  | AUTH-001  | high     | AUTH-001-002               | pending     |
| AUTH-001-005  | 인증 미들웨어            | AUTH-001  | high     | AUTH-001-003               | pending     |
| AUTH-001-006  | 로그인 폼 컴포넌트       | AUTH-001  | medium   | AUTH-001-003               | pending     |
| AUTH-001-007  | AuthContext 구현         | AUTH-001  | medium   | AUTH-001-005               | pending     |
| DASH-001-001  | 대시보드 레이아웃        | DASH-001  | medium   | AUTH-001-005               | pending     |
| DASH-001-002  | 통계 카드 컴포넌트       | DASH-001  | medium   | DASH-001-001               | pending     |
| DASH-001-003  | 차트 컴포넌트            | DASH-001  | low      | DASH-001-001               | pending     |
| DASH-001-004  | 최근 활동 목록           | DASH-001  | low      | DASH-001-001               | pending     |
| DASH-001-005  | 대시보드 API 연동        | DASH-001  | medium   | DASH-001-002, DASH-001-003 | pending     |
| ORDER-001-001 | Orders 테이블 스키마     | ORDER-001 | high     | AUTH-001-001               | pending     |
| ORDER-001-002 | 주문 생성 API            | ORDER-001 | high     | ORDER-001-001              | pending     |
| ORDER-001-003 | 주문 목록 API            | ORDER-001 | medium   | ORDER-001-001              | pending     |
| ORDER-001-004 | 주문 상세 API            | ORDER-001 | medium   | ORDER-001-001              | pending     |
| ORDER-001-005 | 주문 목록 페이지         | ORDER-001 | medium   | ORDER-001-003              | pending     |
| ORDER-001-006 | 주문 상세 페이지         | ORDER-001 | medium   | ORDER-001-004              | pending     |

## 의존성 그래프

```
AUTH-001 (사용자 인증)
├── AUTH-001-001 Users 테이블
│   └── AUTH-001-002 JWT 유틸리티
│       ├── AUTH-001-003 로그인 API ⬅️ 현재 작업
│       │   ├── AUTH-001-005 인증 미들웨어
│       │   │   └── AUTH-001-007 AuthContext
│       │   └── AUTH-001-006 로그인 폼
│       └── AUTH-001-004 회원가입 API

DASH-001 (대시보드) - AUTH-001-005 완료 후 시작
├── DASH-001-001 레이아웃
│   ├── DASH-001-002 통계 카드
│   ├── DASH-001-003 차트
│   └── DASH-001-004 최근 활동
└── DASH-001-005 API 연동

ORDER-001 (주문 관리) - AUTH-001-001 완료 후 시작
├── ORDER-001-001 스키마
│   ├── ORDER-001-002 생성 API
│   ├── ORDER-001-003 목록 API
│   │   └── ORDER-001-005 목록 페이지
│   └── ORDER-001-004 상세 API
│       └── ORDER-001-006 상세 페이지
```
