# Backoffice Common UI 디자인시스템 컴포넌트 매핑

## 개요

-   **Figma 프로젝트**: Admin - CRM - Design System
-   **코드베이스**: `backoffice-central/packages/common-ui`

### 컴포넌트 import 방식

```typescript
import { Button, Dialog, Dropdown } from '@common/ui';
```

## 컴포넌트 목록

| 인스턴스명                                                                        | 컴포넌트                                | Import 경로                                                 | Figma URL                                                                              |
| --------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
|                                                                                   | MenuAccordion                           | `@backoffice/common-ui` → `accordion/menu-accordion`        | -                                                                                      |
| `Status Tag`                                                                      | StatusBadge                             | `@backoffice/common-ui` → `badges/status-badge`             | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8189-23231&m=dev) |
| `Text Badge`                                                                      | TextBadge                               | `@backoffice/common-ui` → `badges/text-badge`               | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8262-3535&m=dev)  |
| `CTA Buttons`, `Icon Button`                                                      | Button                                  | `@backoffice/common-ui` → `button`                          | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=41-6397&m=dev)    |
| `Button Group Base`                                                               | ButtonGroup                             | `@backoffice/common-ui` → `button-group`                    | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=42-5848&m=dev)    |
| `Calendar`                                                                        | Calendar                                | `@backoffice/common-ui` → `calendar`                        | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8801-12555&m=dev) |
|                                                                                   | RangeDatePicker                         | `@backoffice/common-ui` → `calendar`                        | -                                                                                      |
|                                                                                   | SingleDatePicker                        | `@backoffice/common-ui` → `calendar`                        | -                                                                                      |
| `Controls`, `Indicator`                                                           | Carousel                                | `@backoffice/common-ui` → `carousel`                        | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=3348-11305&m=dev) |
| `Dialog` → [Variant 참조](#dialog)                                                | Dialog                                  | `@backoffice/common-ui` → `dialog`                          | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=848-7388&m=dev)   |
| `Select Box`, `List Item`                                                         | Dropdown                                | `@backoffice/common-ui` → `dropdowns/dropdown`              | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=38-5844&m=dev)    |
| `Multi-Select Box`                                                                | MultiSelectDropdown                     | `@backoffice/common-ui` → `dropdowns/multi-select-dropdown` | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=1066-10397&m=dev) |
| `DropdownTimePicker`                                                              | DropdownTimePicker                      | `@backoffice/common-ui` → `dropdown-time-picker`            | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8400-6743&m=dev)  |
| `FileListItem`                                                                    | FileList                                | `@backoffice/common-ui` → `file-list`                       | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8200-848&m=dev)   |
| `Infobox`                                                                         | InfoBox                                 | `@backoffice/common-ui` → `info-box`                        | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=2917-10455&m=dev) |
| `InputField`                                                                      | InputField                              | `@backoffice/common-ui` → `input-field`                     | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=535-6515&m=dev)   |
| `InputTimePicker`                                                                 | InputTimePicker                         | `@backoffice/common-ui` → `input-time-picker`               | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8449-1150&m=dev)  |
| `NavigationalControls`, `PageNumbers`                                             | Pagination                              | `@backoffice/common-ui` → `pagination`                      | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=931-10626&m=dev)  |
| `InputRangeTimePicker`                                                            | RangeTimePicker                         | `@backoffice/common-ui` → `range-time-picker`               | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=2397-9717&m=dev)  |
| `SearchBox`, `SearchBoxItem`                                                      | SearchFilter                            | `@backoffice/common-ui` → `search-filter`                   | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=641-8544&m=dev)   |
| `Checkbox` → [Variant 참조](#selection-controls)                                  | Checkbox, RadioGroup, RadioItem, Toggle | `@backoffice/common-ui` → `selection-controls/*`            | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=142-5177&m=dev)   |
| `SidepanelHeader`, `ItemHeader`, `Divider`, `SidepanelTitle`, `FormFieldReadonly` | SidePage                                | `@backoffice/common-ui` → `side-panel`                      | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=3050-12751&m=dev) |
| `Tabs`, `TabButtonBase`                                                           | Tab                                     | `@backoffice/common-ui` → `tab`                             | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=3-2908&m=dev)     |
| `Table`                                                                           | Table                                   | `@backoffice/common-ui` → `table`                           | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=1616-8931&m=dev)  |
| `Textarea`                                                                        | TextArea                                | `@backoffice/common-ui` → `text-area`                       | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=535-7343&m=dev)   |
| `Toast`, `Snackbar`                                                               | Toast (MessageProvider)                 | `@backoffice/common-ui` → `toast`                           | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=848-6294&m=dev)   |
| `Tooltip`                                                                         | Tooltip                                 | `@backoffice/common-ui` → `tooltip`                         | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=202-6426&m=dev)   |
| `Uploader`                                                                        | Uploader                                | `@backoffice/common-ui` → `uploader`                        | [Figma](https://www.figma.com/design/IVzkuMKqiDBtoz7uLYRBdd/?node-id=8195-664&m=dev)   |

## Variant 매핑

복잡한 variant를 가진 컴포넌트의 Figma Variant와 코드 컴포넌트 매핑입니다.

### Dialog

Preset 컴포넌트로 구성되어 있습니다.

| Figma Variant (Type) | 코드 컴포넌트     | Import 경로                                |
| -------------------- | ----------------- | ------------------------------------------ |
| `Type=Basic`         | `DialogBasic`     | `@backoffice/common-ui` → `dialog/presets` |
| `Type=Two-Button`    | `DialogTwoButton` | `@backoffice/common-ui` → `dialog/presets` |
| `Type=Input`         | `Dialog` (커스텀) | `@backoffice/common-ui` → `dialog`         |

### Selection Controls

Figma에서는 `Checkbox` 컴포넌트 하나로 Type 속성을 통해 여러 선택 컨트롤을 표현합니다.

| Figma Variant (Type) | 코드 컴포넌트             | Import 경로                                             |
| -------------------- | ------------------------- | ------------------------------------------------------- |
| `Type=Checkbox`      | `Checkbox`                | `@backoffice/common-ui` → `selection-controls/checkbox` |
| `Type=Radio`         | `RadioGroup`, `RadioItem` | `@backoffice/common-ui` → `selection-controls/radio`    |
| `Type=Switch`        | `Toggle`                  | `@backoffice/common-ui` → `selection-controls/toggle`   |
