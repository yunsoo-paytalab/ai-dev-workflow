# Platform Web 디자인시스템 컴포넌트 매핑

## 개요

- **Figma 프로젝트**: Paytalab Design System
- **코드베이스**: `passorder-web/packages/ui`

### 컴포넌트 import 방식

```typescript
import { Button } from "@common/ui";
```

## 컴포넌트 목록

| 인스턴스명                                                 | 컴포넌트         | Import 경로                            | Figma URL                                                                               |
| ---------------------------------------------------------- | ---------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| `Accordion`                                                | Accordion        | `@ui/components/accordion`             | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20535-1895&m=dev)  |
| `Appbar`                                                   | Appbar           | `@ui/components/appbar`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=5192-808&m=dev)    |
| `Avartar`                                                  | Avatar           | `@ui/components/avatar`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19732-5568&m=dev)  |
| `Badge`                                                    | Badge            | `@ui/components/badge/normal`          | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19778-21972&m=dev) |
| `TextBadge`, `Menu badge` → [Variant 참조](#textbadge)     | TextBadge        | `@ui/components/badge/text-badge`      | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19778-21972&m=dev) |
| `FillButton`, `OutlineButton`, `GhostButton`, `IconButton` | Button           | `@ui/components/button`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20363-11046&m=dev) |
| `chip`, `CapsuleChip`, `RectangleChip`                     | Chip             | `@ui/components/chip`                  | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=5241-1865&m=dev)   |
| `Dialog` → [Variant 참조](#dialog)                         | Dialog           | `@ui/components/dialog`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19728-6301&m=dev)  |
| `Divider`                                                  | Divider          | `@ui/components/divider`               | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=1613-5175&m=dev)   |
| `filter`, `FilterButton`, `필터`                           | Filter           | `@ui/components/filter`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=10591-57502&m=dev) |
| -                                                          | Image            | `@ui/components/image`                 | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19732-5568&m=dev)  |
| -                                                          | Indicator        | `@ui/components/indicator`             | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=5241-1865&m=dev)   |
| `InformationBox`                                           | InfoBox          | `@ui/components/info-box`              | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19778-1872)        |
| `Landing Scaffold`                                         | LandingScaffold  | `@ui/components/landing-scaffold`      | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=21537-459&m=dev)   |
| `List` → [Variant 참조](#list)                             | List             | `@ui/components/list`                  | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=21768-5911&m=dev)  |
| `Marker`, `Marker Set`, `MakerIcon`                        | Marker           | `@ui/components/marker`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19826-6736&m=dev)  |
| -                                                          | MultiInputField  | `@ui/components/multi-input-field`     | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=1-6641&m=dev)      |
| `Snackbar`                                                 | Snackbar         | `@ui/components/notification/snackbar` | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19729-16861&m=dev) |
| `toast`                                                    | Toast            | `@ui/components/notification/toast`    | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19729-16927&m=dev) |
| `Number Picker`, `NumberPickerItem`                        | NumberPicker     | `@ui/components/number-picker`         | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=3433-5863&m=dev)   |
| -                                                          | Placeholder      | `@ui/components/placeholder`           | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=34-6053&m=dev)     |
| `Progress Bar`                                             | ProgressBar      | `@ui/components/progress-bar`          | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19841-2586&m=dev)  |
| `App Landing Popup`                                        | QrDialog         | `@ui/components/qr-dialog`             | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=22049-12392&m=dev) |
| `Handle`                                                   | ReorderControls  | `@ui/components/reorder-controls`      | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19819-66297&m=dev) |
| `Search Box`                                               | SearchBox        | `@ui/components/search-box`            | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=19726-6045&m=dev)  |
| `Checkbox Base` → [Variant 참조](#selectioncontrol)        | SelectionControl | `@ui/components/selection-control`     | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20735-11134&m=dev) |
| `Slider`                                                   | Slider           | `@ui/components/slider`                | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20738-7308&m=dev)  |
| `Tabs`, `Tab Item`                                         | Tabs             | `@ui/components/tabs`                  | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=7421-7431&m=dev)   |
| `TextArea`                                                 | TextArea         | `@ui/components/text-area`             | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=1-6641&m=dev)      |
| `InputField`                                               | TextField        | `@ui/components/text-field`            | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=1-6641&m=dev)      |
| `Time Picker`, `Time Picker Item`                          | TimePicker       | `@ui/components/time-picker`           | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20061-3931&m=dev)  |
| `Toggle Button`                                            | ToggleButton     | `@ui/components/toggle-button`         | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20112-1534&m=dev)  |
| `Tooltip`                                                  | Tooltip          | `@ui/components/tooltip`               | [Figma](https://www.figma.com/design/SeC3olrbhdTtceR29U3L5z/?node-id=20735-10680&m=dev) |

## Variant 매핑

복잡한 variant를 가진 컴포넌트의 Figma Variant와 코드 컴포넌트 매핑입니다.

### Dialog

| Figma Variant (Type)       | Preset 컴포넌트           | Import 경로                     |
| -------------------------- | ------------------------- | ------------------------------- |
| `Type=Default`             | `Dialog` (기본)           | `@ui/components/dialog`         |
| `Type=two-button`          | `TwoButtonDialog`         | `@ui/components/dialog/presets` |
| `Type=alert`               | `AlertDialog`             | `@ui/components/dialog/presets` |
| `Type=vertical two-button` | `VerticalTwoButtonDialog` | `@ui/components/dialog/presets` |
| `Popup`                    | `PopupDialog`             | `@ui/components/dialog/presets` |

### TextBadge

| Figma Variant | 코드 Props                   | 설명                       |
| ------------- | ---------------------------- | -------------------------- |
| `TextBadge`   | `<TextBadge>`                | 기본 텍스트 배지           |
| `Menu badge`  | `<TextBadge leftIcon={...}>` | 좌측 아이콘 포함 메뉴 배지 |

### List

리스트 아이템 컴포넌트입니다. Compound Component 패턴으로 구성되어 있습니다.

- **인스턴스명**: `List`
- **Variant 속성**: Figma Properties 패널에서 확인

**Figma Properties 패널 속성:**

| Property           | 값                   | 코드 매핑                                   |
| ------------------ | -------------------- | ------------------------------------------- |
| `Left Area`        | `True`               | `<List.Left>` 사용                          |
| `Left Area Type`   | `Selection Controls` | `<List.Left>` + Checkbox/Radio              |
|                    | `Image`              | `<List.Left>` + `<Image>` (썸네일)          |
|                    | `Icon`               | `<List.Left>` + Icon 컴포넌트               |
| `Right Area`       | `True`               | `<List.Right>` 사용                         |
| `Right Area Type`  | `Icon Button`        | `<List.Right>` + `<IconButton>`             |
|                    | `Fill Button`        | `<List.Right>` + `<FillButton>`             |
|                    | `Ghost Button`       | `<List.Right>` + `<GhostButton>`            |
|                    | `Selection Controls` | `<List.Right>` + Checkbox/Radio/Switch      |
|                    | `Badge`              | `<List.Right>` + `<Badge>`                  |
|                    | `Text`               | `<List.Right>` + 텍스트                     |
| `Line`             | `One`                | `<List.Title>` 만 사용                      |
|                    | `Two`                | `<List.Title>` + `<List.Description>`       |
|                    | `Three`              | `<List.Title>` + `<List.Description>` (3줄) |
| `Description Icon` | `True`               | Description에 아이콘 포함                   |

**Title/Description Props:**

| Props               | 값                                 |
| ------------------- | ---------------------------------- |
| `TitleSize`         | `h3`, `b1`, `b2`                   |
| `TitleWeight`       | `bold`, `extrabold`                |
| `DescriptionSize`   | `b2`, `b3`, `c1`                   |
| `DescriptionWeight` | `regular`, `bold`                  |
| `DescriptionColor`  | `gray-600`, `gray-700`, `gray-800` |

### SelectionControl

선택 컨트롤 컴포넌트입니다. Figma의 Type 속성에 따라 다른 컴포넌트를 사용합니다.

| Figma Variant (Type) | 코드 컴포넌트 | Import 경로                        |
| -------------------- | ------------- | ---------------------------------- |
| `Type=Checkbox`      | `Checkbox`    | `@ui/components/selection-control` |
| `Type=Radio`         | `Radio`       | `@ui/components/selection-control` |
| `Type=Check circle`  | `CheckCircle` | `@ui/components/selection-control` |
| `Type=Switch`        | `Toggle`      | `@ui/components/selection-control` |

**공통 Props:**

| Props     | 값                         |
| --------- | -------------------------- |
| `checked` | `true`, `false`            |
| `size`    | `sm`, `md`                 |
| `color`   | `primary`, `gray`, `white` |
| `state`   | `default`, `disabled`      |
