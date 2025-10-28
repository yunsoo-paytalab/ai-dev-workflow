# `/workflow-implement [feature-name]` Command

**When to use**: When implementing features

**Reference File**: `@feature-implementation.md`

**Features**:

- Write tests (Test-First)
- Implementation (dummy data first)
- Refactoring
- (Optional) API integration

**Recommendations**:

- Domain definition completed
- Feature UI design completed (recommended)

**Usage**:

```
/workflow-implement product-list
/workflow-implement cart
```

**AI Execution Prompt**:

```
Please perform feature implementation work:

1. Read `.cursor/rules/workflows/memory.md` to check current status
2. Read `.cursor/rules/workflows/feature-implementation.md` to check work guide
3. Check command parameters:
   - Feature name: [feature-name]

4. Check recommendations:
   - Domain definition completed (feature list needed)
   - Feature UI design completed (recommended)

   If not met, display:
```

💡 Recommendation

The following steps are not completed:

- Domain definition
- Feature UI design (recommended)

Potential issues if not completed:

- Feature information may be unclear
- It may be difficult to implement without knowing UI component structure

Would you like to continue? (y/n)

```
5. Proceed after user confirmation
6. Follow `feature-implementation.md` process to perform work:
- Step 1: Confirm feature information
- Step 2: Write tests
- Step 3: Implement (dummy data)
- Step 4: Refactor
- Step 5: Review feature
- Step 6: API integration (optional)
7. Save output to path:
- Implementation: `src/features/{domain}/`, `src/pages/`, `src/api/{domain}/`
- Dummy data: `src/mocks/data/{domain}.ts`
- Tests: `__tests__/`
8. Update `memory.md`:
- Update feature progress table
  - Implementation: ✅
  - API integration: ✅ (if integrated) or ⏳ (if not integrated)
```
