# Boss Web 디자인시스템 컴포넌트 매핑

## 개요

- **Figma 프로젝트**: 사장님페이지 Design System
- **코드베이스**: `passorderboss-web/packages/application/src/shared/components`

### 컴포넌트 import 방식

```typescript
import { Button } from "@/shared/components/button";
import { Dialog } from "@/shared/components/dialog";
// 또는 개별 import
import TextField from "@/shared/components/text-field";
```

## 컴포넌트 목록

| 인스턴스명                                                     | 컴포넌트                            | Import 경로                              | Figma URL                                                                              |
| -------------------------------------------------------------- | ----------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `Accordion`, `Accordion Button` → [Variant 참조](#accordion)   | Accordion                           | `@/shared/components/accordion`          | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1055-15041&m=dev) |
| `Badge`, `Status badge` → [Variant 참조](#badge)               | Badge                               | `@/shared/components/badge`              | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1141-2021&m=dev)  |
| -                                                              | BottomSheet                         | `@/shared/components/bottom-sheet`       | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3545-2412&m=dev)  |
| `Breadcrumb Button`, `Separator` → [Variant 참조](#breadcrumb) | Breadcrumb                          | `@/shared/components/breadcrumb`         | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=936-272&m=dev)    |
| `Button`, `Capsule Button` → [Variant 참조](#button)           | Button                              | `@/shared/components/button`             | -                                                                                      |
| `Calendar`, `Date Scroll Picker`                               | Calendar, ScrollableRangeDatePicker | `@/shared/components/calendar`           | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3578-2587&m=dev)  |
| `Dialog`                                                       | Dialog                              | `@/shared/components/dialog`             | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3023-8571&m=dev)  |
| `Divider`                                                      | Divider                             | `@/shared/components/divider`            | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3647-2590&m=dev)  |
| `Dropdown`, `Dropdown List` → [Variant 참조](#dropdown)        | Dropdown                            | `@/shared/components/dropdown`           | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1051-16&m=dev)    |
| `info bar`                                                     | InfoBox                             | `@/shared/components/info-box`           | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3095-2193&m=dev)  |
| `Pagenation`                                                   | Pagination                          | `@/shared/components/pagination`         | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3596-139&m=dev)   |
| `Reorder Controls`                                             | ReorderList                         | `@/shared/components/reorder-control`    | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1055-20265&m=dev) |
| `Checkbox base`                                                | Checkbox                            | `@/shared/components/selection-controls` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1029-427&m=dev)   |
| `Radio base`                                                   | Radio                               | `@/shared/components/selection-controls` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1029-402&m=dev)   |
| `Segmented Button`                                             | SegmentedButton                     | `@/shared/components/selection-controls` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1142-3126&m=dev)  |
| `Toggle Button`                                                | ToggleButton                        | `@/shared/components/toggle-button`      | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3118-5059&m=dev)  |
| `Toggle Switch`                                                | ToggleSwitch                        | `@/shared/components/selection-controls` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1046-36&m=dev)    |
| `tabs`, `Tab Item`                                             | Tab                                 | `@/shared/components/tab`                | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3719-2282&m=dev)  |
| `Form`, `Label`                                                | TextField                           | `@/shared/components/text-field`         | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1041-409&m=dev)   |
| `Time Picker` → [Variant 참조](#time-picker)                   | TimePicker                          | `@/shared/components/time-picker`        | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3095-6886&m=dev)  |
| `Snackbar`                                                     | Snackbar                            | `@/shared/components/snackbar`           | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3083-10992&m=dev) |
| `toast`                                                        | Toast                               | `@/shared/components/toast`              | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3083-11058&m=dev) |
| `Tooltip`                                                      | Tooltip                             | `@/shared/components/tooltip`            | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1029-513&m=dev)   |

## Variant 매핑

복잡한 variant를 가진 컴포넌트의 Figma Variant와 코드 컴포넌트 매핑입니다.

### Accordion

Compound Component 패턴으로 구성되어 있습니다.

| Figma 인스턴스명   | 코드 컴포넌트       | Figma URL                                                                              |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------- |
| `Accordion`        | `Accordion`         | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1055-20228&m=dev) |
| `Accordion Button` | `Accordion.Trigger` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3005-3790&m=dev)  |

**Accordion Button Variants:**

| Figma Variant (Type) | 코드 Props                    | 설명                      |
| -------------------- | ----------------------------- | ------------------------- |
| `Type=Text`          | `buttonType="text"`           | 텍스트 버튼 (펼치기/접기) |
| `Type=Background`    | `buttonType="backgroundIcon"` | 배경 있는 아이콘 버튼     |
| `Type=icon`          | `buttonType="icon"`           | 아이콘만 있는 버튼        |

### Badge

텍스트 배지와 상태 배지 두 가지 유형이 있습니다.

| Figma 인스턴스명 | 코드 컴포넌트 | Figma URL                                                                             |
| ---------------- | ------------- | ------------------------------------------------------------------------------------- |
| `Badge`          | `Badge`       | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1113-3042&m=dev) |
| `Status badge`   | `Badge`       | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1113-3043&m=dev) |

**변환 규칙:** Figma Variant 값을 소문자로 변환

**예외 케이스:**

| Figma Variant    | 코드 Props              | 비고           |
| ---------------- | ----------------------- | -------------- |
| `State=Warnning` | `variant="warning"`     | 오타 수정 (n→) |
| `State=Disable`  | `variant="disabled"`    | d 추가         |
| `Type=Default`   | `statusVariant="solid"` | 값 변경        |

### Button

| Figma 인스턴스명 | 코드 컴포넌트 | Figma URL                                                                             |
| ---------------- | ------------- | ------------------------------------------------------------------------------------- |
| `Button`         | `Button`      | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1-6485&m=dev)    |
| `Capsule Button` | `Button`      | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3648-2909&m=dev) |

**변환 규칙:** `{Type}-{Style}` 조합을 소문자로 변환 → `variant`

예시: `Type=Filled, Style=Navy` → `variant="filled-navy"`

**Size 매핑:**

| Figma Variant | 코드 Props  |
| ------------- | ----------- |
| `Size=Lg`     | `size="lg"` |
| `Size=Md`     | `size="md"` |

### Breadcrumb

Compound Component 패턴으로 구성되어 있습니다.

| Figma 인스턴스명    | 코드 컴포넌트     | Figma URL                                                                            |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `Breadcrumb Button` | `Breadcrumb.Item` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3023-771&m=dev) |
| `Separator`         | (자동 렌더링)     | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3023-790&m=dev) |

**Breadcrumb Button Variants:**

| Figma Variant (Type) | 코드 Props              | 설명                    |
| -------------------- | ----------------------- | ----------------------- |
| `Type=Home`          | `type="home"`           | 홈 버튼                 |
| `Type=Previous path` | `type="previous-path"`  | 이전 경로 버튼          |
| `Type=Depth`         | `type="depth"`          | 현재 깊이 (마지막 항목) |
| `Type=summarized`    | `Breadcrumb.Summarized` | 경로 요약 버튼 (...)    |

### Dropdown

Compound Component 패턴으로 구성되어 있습니다.

| Figma 인스턴스명 | 코드 컴포넌트      | Figma URL                                                                             |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------- |
| `Dropdown`       | `Dropdown.Trigger` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1051-2831&m=dev) |
| `Dropdown List`  | `Dropdown.Item`    | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=1051-2867&m=dev) |

### Time Picker

| Figma 인스턴스명   | 코드 컴포넌트                                      | Figma URL                                                                             |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `Time=Hour`        | `TimePicker` (시간만)                              | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3095-6887&m=dev) |
| `Time=Hour+Minute` | `TimePicker24HourMinute`, `TimePicker12HourMinute` | [Figma](https://www.figma.com/design/1BVHMS8PT5on1L3ou16UzB/?node-id=3095-6919&m=dev) |

**Preset 컴포넌트:**

| 코드 컴포넌트            | Import 경로                               | 설명             |
| ------------------------ | ----------------------------------------- | ---------------- |
| `TimePicker24HourMinute` | `@/shared/components/time-picker/presets` | 24시간제 시간+분 |
| `TimePicker12HourMinute` | `@/shared/components/time-picker/presets` | 12시간제 시간+분 |
