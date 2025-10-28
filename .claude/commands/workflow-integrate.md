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

## Recommendations

💡 **Recommended**: Proceed after the following steps are completed.

- All features implemented (or most core features completed)

Potential issues if not completed:

- Integration refactoring effectiveness may be limited
- Some features may be missing during E2E testing
- Overall quality verification may be incomplete

Would you like to continue?

---

### Step 1: Check API Integration Status (Before Starting)

**AI work**: Check API integration status from `docs/workflows/memory.md`

#### 🔔 Reconfirm API Integration Status

"Before starting integration work, I will check the API integration status."

**Current API integration status**:

- ✅ **Integration completed**: [Feature1], [Feature2], ...
- ⏳ **Keep dummy data**: [Feature3], [Feature4], ...

**APIs not yet integrated**:

- [Feature3]: Need to check API readiness status
- [Feature4]: Need to check API readiness status

**Please select one**:

- [ ] **Integrate now** (Selectively integrate only ready APIs)
- [ ] **Integrate later** (Keep dummy data, proceed with integration work)
- [ ] **Partial integration** (Integrate some, keep others as dummy)

**Selection options**:

- Features to integrate: [Feature1], [Feature2], ...
- Features not to integrate: [Feature3], [Feature4], ...

⚠️ **Proceed with integration work after selection is completed**

---

### Step 2: Analyze Duplicate Code

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
  pattern: string; // '{Duplicate pattern description}'
  locations: string[]; // ['{File path 1}', '{File path 2}']
  suggestion: string; // '{Integration suggestion}'
  impact: "high" | "medium" | "low";
}
```

---

### Step 3: Extract Common Modules

**Extraction targets**:

1. **Common utilities**

   - Path: `src/shared/utils/`
   - 📘 Examples: formatPrice, formatDate, formatPhoneNumber, etc.

2. **Common hooks**

   - Path: `src/shared/hooks/`
   - 📘 Examples: usePagination, useDebounce, useLocalStorage, etc.

3. **Common types**

   - Path: `src/shared/types/common.ts`
   - 📘 Examples: PaginationParams, ErrorResponse, ApiResponse<T>, etc.

4. **Common constants**
   - Path: `src/shared/constants/app.ts`
   - 📘 Examples: ITEMS_PER_PAGE, API_TIMEOUT, MAX_FILE_SIZE, etc.

---

### Step 4: Improve Overall Structure

**Improvement items**:

1. **Organize folder structure**

   - Unify inconsistent folder structures
   - Reorganize file locations
   - Unify naming conventions

2. **Optimize import paths**

   - Set absolute paths in tsconfig.json
   - Use aliases like `@/components`, `@/utils`

3. **Remove circular dependencies**
   - Extract to common modules
   - Separate interfaces
   - Dependency inversion

---

### Step 5: Performance Optimization (Optional)

#### 🔔 User input required

"Would you like to perform performance optimization?"

**Whether optimization is needed**:

- [ ] **Yes** - Perform performance optimization
- [ ] **No** - Defer for later improvement

**When "Yes" is selected**:

#### 🔔 Set Performance Goals

**Performance goal settings**:

- Initial loading time goal: `_________________`sec (default: 3sec)
- Page transition time goal: `_________________`sec (default: 1sec)
- Bundle size goal: `_________________`MB (default: 1MB)

**Optimization items** (Select only what's needed):

- [ ] React optimization (memo, callback, useMemo)
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] API call optimization
- [ ] Image optimization

**Optimization item details**:

1. **React Optimization**

   - Prevent unnecessary re-renders with React.memo
   - Utilize useCallback, useMemo
   - Component separation

2. **Code Splitting**

   - Separate by page with React.lazy
   - Handle loading with Suspense
   - Route-based splitting

3. **Bundle Size Optimization**

   - Remove unused code
   - Replace heavy libraries
   - Tree shaking optimization

4. **API Call Optimization**

   - React Query caching settings
   - Adjust staleTime, cacheTime
   - Prevent unnecessary refetch

5. **Image Optimization**
   - Apply lazy loading
   - Use WebP format
   - Size optimization

---

### Step 6: Improve Accessibility

**Checklist**:

- [ ] **Keyboard navigation**: Tab order, focus indicators, Enter/Space behavior, ESC close
- [ ] **Screen reader support**: Alt text, ARIA attributes, landmark roles, form labels
- [ ] **Color contrast**: Meet WCAG AA standard (4.5:1)
- [ ] **Responsive accessibility**: Touch target 44x44px or larger, maintain layout when zoomed

---

### Step 7: Supplement Integration Tests

**Test items**:

1. **Cross-domain integration tests**

   - Path: `__tests__/integration/cross-domain/`
   - 📘 Examples: Cart → Order flow, Login → My Page flow

2. **Error recovery tests**

   - 📘 Examples: Retry after API failure, network error handling, timeout handling

3. **Performance tests**
   - Initial loading time (goal: <3sec)
   - Page transition time (goal: <1sec)

---

### Step 8: Integration Review

### Review Guide (For AI)

**Basic principle**: Ask questions flexibly according to project scale and complexity

**Always ask**:

- Has integration work been completed?

**Conditional questions**:

- If there was much duplicate code: Is common module extraction appropriate?
- If performance optimization was performed: Were performance goals achieved?
- If accessibility improvements were performed: Do they meet accessibility criteria?

**Question style**:

- Prefer open-ended questions
- Specifically point out issues when found
- Provide improvement suggestions

#### 🔔 User Review

"Overall system integration and refactoring has been completed."

**Work results**:

Duplicate code removal:

- ✅ Extracted N common utilities
- ✅ Extracted N common hooks
- ✅ Integrated N common types

Structure improvements:

- ✅ Import path optimization (absolute paths)
- ✅ 0 circular dependencies
- ✅ Unified folder structure

Performance optimization (if performed):

- ✅ X% bundle size reduction
- ✅ X.Xsec initial loading (goal: <3sec)
- ✅ X.Xsec page transition (goal: <1sec)

Accessibility improvements:

- ✅ Keyboard navigation completed
- ✅ ARIA attributes added
- ✅ Color contrast improved

Tests:

- ✅ Added N integration tests
- ✅ 100% test pass rate
- ✅ X% coverage (goal: 90% or higher)

**Review is recommended**:

- Is code structure clean?
- Does performance meet targets? (if optimization performed)
- Is accessibility improved?
- Are tests stable?

**Feedback**: (Implement immediately if modification needed)

---

## Memory Update

**When integration work is completed**:

```markdown
- [x] Integration and refactoring
```

---

## Next Steps

**After integration is completed**:

- 🎉 Proceed to E2E testing: `/workflow-e2e`

---

## Output File Paths

**Integration outputs**:

- `src/shared/utils/` - Common utilities
- `src/shared/hooks/` - Common hooks
- `src/shared/types/` - Common types
- `src/shared/constants/` - Common constants

**Tests**:

- `__tests__/integration/cross-domain/` - Cross-domain integration tests

**Documentation**:

- `docs/architecture.md` - Final architecture
- `docs/performance.md` - Performance optimization results (if optimization performed)
