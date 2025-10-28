# `/workflow-common-ui` Command

**When to use**: When developing common components

**Reference File**: `@ui-design.md`

**Feature**: Analyze Figma design and generate skeleton code for one common component

**Recommendations**:

- Domain definition completed

**Usage**:

```
/workflow-common-ui    # Dialog component
/workflow-common-ui    # Toast component - run separately
/workflow-common-ui    # Header component - run separately
```

> 💡 **Developing multiple components**: Repeat the command for each component.

**AI Execution Prompt**:

```
Please perform common component development work:

1. Read `docs/workflows/memory.md` to check current status
2. Read `docs/workflows/ui-design.md` to check work guide
3. Check command parameters:
   - No parameters: **Common component** (Type 1)

4. Check recommendations:
   - Domain definition completed (folder structure info)

   If not met, display:
```

💡 Recommendation

The following steps are not completed:

- Domain definition

Potential issues if not completed:

- Component file paths may not be defined

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
   - Common: `src/shared/components/[ComponentName].tsx`
8. Update `memory.md`:
   - Record developed component
```
