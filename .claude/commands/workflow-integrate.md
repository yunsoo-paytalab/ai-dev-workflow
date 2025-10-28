# `/workflow-integrate` Command

**When to use**: During system integration work

**Features**:
- Remove duplicate code
- Extract common modules
- Improve overall structure
- (Optional) Performance optimization
- Improve accessibility

**Recommendations**:
- All features implemented (or most core features completed)

**Usage**:

```
/workflow-integrate
```

---

## Goal

Remove duplicates between features and improve overall code structure.

---

{{LOAD_CONTEXT: progress, features}}

---

{{TEMPLATE: sections/recommendations
  PREREQUISITES: |
    - All features implemented (or most core features completed)
  POTENTIAL_ISSUES: |
    - Integration refactoring effectiveness may be limited
    - Some features may be missing during E2E testing
    - Overall quality verification may be incomplete
}}

---

## Step 1: Check API Integration Status

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Before starting integration work, let's check API integration status. Please select:"
  INPUT_OPTIONS: |
    **Current API integration status**:
    - ✅ Integration completed: [List]
    - ⏳ Keep dummy data: [List]

    **Please select one**:
    - [ ] **Integrate now** (Integrate ready APIs)
    - [ ] **Integrate later** (Keep dummy, proceed with integration)
    - [ ] **Partial integration** (Integrate some, keep others)
  CONDITION: selection completed
}}

---

## Step 2: Analyze Duplicate Code

**AI work**:

1. Scan entire codebase
2. Identify duplicate patterns

**Duplicate targets**:
- Similar utility functions
- Repeated logic
- Duplicate type definitions
- Similar components
- Duplicate API call patterns

**Output format**:

```typescript
interface Duplication {
  type: "utility" | "component" | "type" | "hook" | "constant";
  pattern: string;
  locations: string[];
  suggestion: string;
  impact: "high" | "medium" | "low";
}
```

---

## Step 3: Extract Common Modules

**Extraction targets**:

1. **Common utilities**: `src/shared/utils/`
2. **Common hooks**: `src/shared/hooks/`
3. **Common types**: `src/shared/types/common.ts`
4. **Common constants**: `src/shared/constants/app.ts`

---

## Step 4: Improve Overall Structure

**Improvement items**:

1. Organize folder structure
2. Optimize import paths (aliases)
3. Remove circular dependencies
4. Unify error handling

---

## Step 5: Performance Optimization (Optional)

> 💡 **Optional step**: Only if performance goals are defined

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Would you like to proceed with performance optimization?"
  INPUT_OPTIONS: |
    - [ ] **Yes** - Proceed with optimization
    - [ ] **No** - Skip to next step
  CONDITION: N/A
}}

**Optimization items**:

- Code splitting & lazy loading
- Image optimization
- Bundle size reduction
- Caching strategies
- Rendering performance

---

## Step 6: Improve Accessibility

**Basic accessibility**:

- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast (WCAG AA)
- [ ] Focus management
- [ ] Error messages

---

## Step 7: Integration Review

{{TEMPLATE: sections/review-guide
  REVIEW_PRINCIPLE: Ask questions flexibly according to project scale and complexity
  ALWAYS_ASK: |
    - Has integration work been completed?
  CONDITIONAL_QUESTIONS: |
    - If much duplicate code existed: Is common module extraction appropriate?
    - If performance optimization performed: Are metrics satisfactory?
    - Accessibility: Is WCAG AA standard met?
}}

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: System integration has been completed.
  REVIEW_CONTENT: |
    **Refactoring results**:
    - Duplicate code removed: N instances
    - Common modules extracted: N modules
    - Files affected: N files

    **Quality improvements**:
    - Type errors: 0
    - Linter warnings: 0
    - Test pass rate: 100%

    **Performance** (if optimized):
    - Bundle size: Before N KB → After M KB
    - Initial load: Before N sec → After M sec
  REVIEW_CHECKLIST: |
    - Is duplicate code sufficiently removed?
    - Are common modules well-structured?
    - Is overall code quality improved?
    - (If optimized) Are performance goals met?
    - Are accessibility requirements met?
}}

---

{{TEMPLATE: sections/memory-update
  TASK_NAME: integration work
  MEMORY_CHECKBOX: |
    Update `memory/progress.md`:
    - [x] Integration and Refactoring
}}

---

## Next Steps

**After integration completed**:

- Recommended: `/workflow-e2e` (E2E testing)

---

{{TEMPLATE: snippets/output-paths
  FILE_PATHS: |
    **Common modules**:
    - `src/shared/utils/` - Common utilities
    - `src/shared/hooks/` - Common hooks
    - `src/shared/types/` - Common types
    - `src/shared/constants/` - Common constants

    **Documentation**:
    - `docs/integration-report.md` - Integration results
    - `docs/performance-report.md` - Performance optimization results (if performed)
}}
