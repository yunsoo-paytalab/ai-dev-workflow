# `/workflow-ui [component-name] [--type=common|feature]` Command

**When to use**: When developing UI components

**Features**: Analyze Figma design and generate skeleton code for **one component** at a time

**Component Types**:
- `--type=common` (or no feature name): Common reusable components (Dialog, Toast, Header, etc.)
- `--type=feature` (or with feature name): Feature-specific components (ProductCard, CartPage, etc.)

**Recommendations**:
- Domain definition completed
- For feature components: Common UI completed first (recommended)

**Usage**:

```bash
# Common components
/workflow-ui Dialog --type=common
/workflow-ui Toast --type=common

# Feature components
/workflow-ui ProductCard --type=feature
/workflow-ui product-list              # Same as --type=feature

# Auto-detect based on context
/workflow-ui Dialog                    # Detects as common
```

> 💡 **Developing multiple components**: Repeat the command for each component.

---

## Goal

Analyze Figma design and generate component skeleton code.

---

{{LOAD_CONTEXT: domains, progress}}

---

## Step 1: Collect Component Information

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Please provide information about the component to develop."
  INPUT_OPTIONS: |
    **Required Information**:
    - Component name: `_________________`
    - Component type: [ ] Common  [ ] Feature
    - Figma URL: `_________________`

    **Optional Information**:
    - Purpose/role: `_________________`
    - Notes: `_________________`
  CONDITION: component information is received
}}

---

## Step 2: Analyze Figma

**Analysis Items**:

- (If needed) Overall layout structure
- Detailed UI elements (buttons, inputs, cards, etc.)
- Identify variants, states, sizes
- Layout patterns (Grid/Flex, responsive)
- Interactions (click, open/close, etc.)

---

## Step 3: Generate Skeleton Code

**What to Include**:

- ✅ JSX structure (based on Figma design): Split into sub-components if needed
- ✅ Minimal data variables (for display)
- ✅ Basic CSS class names
- ✅ Semantic HTML structure
- ✅ ARIA attributes (accessibility)

**What NOT to Include**:

- ❌ Props interface (define when developer needs it)
- ❌ Event handlers (generate when developer requests)
- ❌ State management logic (generate when developer requests)
- ❌ Business logic (generate when developer requests)

### Skeleton Code Examples

**Common Component (Dialog)**:

```typescript
// src/shared/components/Dialog.tsx

export default function Dialog() {
  const dialogTitle = "Confirm";
  const dialogContent = "Are you sure?";

  return (
    <div role="dialog" aria-modal="true" className="dialog-overlay">
      <div className="dialog-container">
        <h2 className="dialog-title">{dialogTitle}</h2>
        <p>{dialogContent}</p>
        <button>OK</button>
      </div>
    </div>
  );
}
```

**Feature Component (ProductCard)**:

```typescript
// src/features/product/components/ProductCard.tsx

export default function ProductCard() {
  const productName = "Sample Product";
  const productPrice = 10000;

  return (
    <div className="product-card">
      <h3>{productName}</h3>
      <p>{productPrice.toLocaleString()}원</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

**Guidance for Developer**:

"Skeleton code generated. Additional work you can request:"

- Define Props interface
- Add event handlers
- Add state management logic
- Add business logic
- Adjust styles

**How to Request**:
- "Add Dialog open/close functionality"
- "Add click event to cart button"
- "Convert ProductCard to use props"

---

## Step 4: Review Component

{{TEMPLATE: sections/review-guide
  REVIEW_PRINCIPLE: Ask questions flexibly according to component complexity
  ALWAYS_ASK: |
    - Does the generated component match requirements?
  CONDITIONAL_QUESTIONS: |
    - If different from Figma: Is this intentional?
    - If accessibility important: Are ARIA attributes appropriate?
    - If common component: Is reusability considered?
    - If complex component: Should it be separated?
}}

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: **[Component Name]** component has been created.
  REVIEW_CONTENT: |
    **Component Information**:
    - Name: `[Component Name]`
    - File path: `[File Path]`
    - Type: [Common/Feature]
  REVIEW_CHECKLIST: |
    - Does UI match Figma?
    - Is component structure appropriate?
    - Has accessibility been considered?
    - (Common) Is reusability sufficient?
    - (Feature) Integration with common components working?
}}

---

## Step 5: Check Additional Component Development

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Is there an additional component to develop?"
  INPUT_OPTIONS: |
    - [ ] **Yes** → Run `/workflow-ui [component-name]` again
    - [ ] **No** → Update Memory and proceed to next step
  CONDITION: approved
}}

---

{{TEMPLATE: sections/memory-update
  TASK_NAME: UI component development
  MEMORY_CHECKBOX: |
    Update `memory/progress.md`:
    - [x] **Feature UI - [component-name]** (for feature components)
    - [x] **Common UI** (mark as completed when all common components done)
}}

---

## Next Steps

**After component development**:

- Additional components: Run `/workflow-ui [name]` again
- All components done: `/workflow-implement [feature-name]`

---

{{TEMPLATE: snippets/output-paths
  FILE_PATHS: |
    **Common components**:
    - `src/shared/components/[ComponentName].tsx`

    **Feature components**:
    - `src/features/{domain}/components/[ComponentName].tsx`
}}
