---
name: requirements-parser
description: 요구사항 파일을 읽고 구조화된 데이터로 변환합니다.
allowed-tools: Read
---

# 요구사항 파서

## 사용 지침

requirements.md를 읽고 JSON 형태로 파싱하여 메모리 변수로 반환합니다.

## 입력

- `requirements.md` (기본값)
- 또는 사용자 지정 파일 경로

## 프로세스

### 1. 요구사항 파일 읽기

### 2. 정보 추출

- 프로젝트명, 개요, 목표
- 기능 요구사항
- 비기능 요구사항 (성능, 보안, 확장성, 접근성)
- 사용자 유형 및 권한
- 제약사항 (기술, 비즈니스, 일정)

### 3. JSON 구조화

```json
{
  "projectName": "...",
  "overview": "...",
  "goals": ["..."],
  "functionalRequirements": ["..."],
  "nonFunctionalRequirements": {
    "performance": ["..."],
    "security": ["..."],
    "scalability": ["..."],
    "accessibility": ["..."]
  },
  "userTypes": [{ "name": "...", "permissions": ["..."] }],
  "constraints": {
    "technical": ["..."],
    "business": ["..."],
    "timeline": ["..."]
  }
}
```

## 출력

- **메모리 변수**: `parsedData`
- **콘솔**: 파싱 결과 요약

**중요**: 파일로 저장하지 않음
