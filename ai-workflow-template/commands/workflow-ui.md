# `/workflow-ui [feature-name]` Command

**When to use**: When developing feature components

**Features**: Analyze Figma design and generate skeleton code for **one feature component** at a time

**Recommendations**:

- Domain definition completed
- Common UI completed before feature implementation

**Usage**:

```
/workflow-ui product-list    # ProductList component
/workflow-ui product-list    # ProductCard component - run separately
/workflow-ui cart            # CartPage component
```

> 💡 **Developing multiple components**: Repeat the command for each component.

---

## Goal

Analyze Figma design and generate component skeleton code for **feature components** (Type 2).

---

## Recommendations

💡 **Recommended**: Proceed after the following steps are completed.

**For feature component development**:

- Domain definition completed
- Common UI design completed (reuse common components)

Potential issues if not completed:

- Component file paths may not be defined
- May not be able to reuse common components
- Design system information may be insufficient

Would you like to continue?

---

## Development Process

### Step 1: Collect Component Information

#### 🔔 User Input Required

**Question**: "Please provide information about the component to develop."

**Required Information**:

- Component name: `_________________`
- Figma URL: `_________________`

**Optional Information**:

- Purpose/role: `_________________`
- Notes: `_________________`

⚠️ **Do not proceed to next step until component information is received**

---

### Step 2: Analyze Figma

**Analysis Items**:

- (If needed) Overall layout structure
- Detailed UI elements (buttons, inputs, cards, etc.)
- Identify variants, states, sizes
- Layout patterns (Grid/Flex, responsive)
- Interactions (click, open/close, etc.)

---

### Step 3: Generate Skeleton Code

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

#### Skeleton Code Example

**ProductCard Component**:

```typescript
// src/features/product/components/ProductCard.tsx

export default function ProductCard() {
  // Define only minimal values needed for data display as variables
  const productName = "Sample Product";
  const productPrice = 10000;
  const productImage = "/images/product.jpg";
  const isInStock = true;

  return (
    <div className="product-card">
      <img src={productImage} alt={productName} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        <p className="product-price">{productPrice.toLocaleString()}원</p>
        {isInStock ? (
          <button className="add-to-cart-btn">장바구니 추가</button>
        ) : (
          <span className="out-of-stock">품절</span>
        )}
      </div>
    </div>
  );
}
```

**Guidance for Developer's Additional Work**:

"Skeleton code has been generated. Please proceed with the following tasks if needed:"

- [ ] Define Props interface (if needed)
- [ ] Add event handlers (if needed)
- [ ] Add state management logic (if needed)
- [ ] Add business logic (if needed)
- [ ] Adjust styles in detail (if needed)

**How to Request UX Logic Addition**:

"If UX logic is needed, please request as follows:"

- "Add Dialog open/close functionality"
- "Add cart button click event"
- "Modify ProductCard to be controlled via props"

---

### Step 4: Review Component

#### Review Guide (For AI)

**Basic Principle**: Ask questions flexibly according to component complexity

**Always Ask**:

- Does the generated component match the requirements?

**Conditional Questions**:

- If different from Figma: Is this an intentional change?
- If accessibility is important: Are ARIA attributes appropriate?
- If common component: Has reusability been considered?
- If complex component: Is separation needed?

**Question Style**:

- Prefer open-ended questions (avoid Yes/No)
- Specifically point out issues when found
- Provide improvement suggestions

#### 🔔 User Review

"**[Component Name]** component has been created."

**Component Information**:

- Name: `[Component Name]`
- File path: `[File Path]`
- Type: Feature

**Review is recommended**:

- Does UI match Figma?
- Is component structure appropriate?
- Has accessibility been considered?
- (For feature components) Is integration with common components working?

**Feedback**: (Implement immediately if modification is needed)

---

### Step 5: Check if Additional Component Development is Needed

#### 🔔 User Confirmation

"Is there an additional component to develop?"

- [ ] **Yes** → Run `/workflow-ui [feature-name]` again
- [ ] **No** → Update Memory and proceed to next step

---

## Memory Update

**When work is completed**: Update progress to `memory.md`

---

## Next Steps

**After component development is completed**:

- If there are additional components: Run `/workflow-ui [feature-name]` again
- When all components are completed: `/workflow-implement [feature-name]` (Feature Implementation)

---

## Output File Paths

- `src/features/{domain}/components/[ComponentName].tsx` - Feature component file
