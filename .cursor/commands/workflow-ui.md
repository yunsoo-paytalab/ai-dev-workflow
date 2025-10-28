# `/workflow-ui [feature-name]` Command

**When to use**: When developing feature components

**Reference File**: `@ui-design.md`

**Feature**: Analyze Figma design and generate skeleton code for one feature component

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

**AI Execution Prompt**:

```
Please perform feature component development work:

1. Read `.cursor/rules/workflows/memory.md` to check current status
2. Read `.cursor/rules/workflows/ui-design.md` to check work guide
3. Check command parameters:
   - Parameter exists: **Feature component** (Type 2) - [feature-name]

4. Check recommendations:

   **For feature component development**:
   - Domain definition completed
   - Common UI design completed (reuse common components)

   If not met, display:
```

💡 Recommendation

The following steps are not completed:

- Domain definition
- Common UI design

Potential issues if not completed:

- Component file paths may not be defined
- May not be able to reuse common components

Would you like to continue? (y/n)

```
5. Proceed after user confirmation
6. Follow `ui-design.md` process to develop **only one component**:
   - Step 1: Collect component information (name, Figma URL)
   - Step 2: Analyze Figma
   - Step 3: Generate skeleton code
   - Step 4: Review component
   - Step 5: Check if additional component development is needed
7. Save output to path:
   - Feature: `src/features/{domain}/components/[ComponentName].tsx`
8. Update `memory.md`:
   - Record developed component
```
