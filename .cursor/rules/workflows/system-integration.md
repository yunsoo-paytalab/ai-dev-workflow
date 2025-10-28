# System Integration and E2E Testing

> 💡 Note: Phase 3 (Integration and Final Verification) of traditional 3-Phase process

> ⚠️ **Read these files first before reading this file**:
>
> 1. `@main-workflow.md` - Understand overall process
> 2. `@memory.md` - Check current progress

## Goal and Scope

**Goal**: Integrate completed features and ensure overall system quality.

**Structure**:

- `/workflow integrate` - Integration and refactoring
- `/workflow e2e` - E2E testing and final verification

---

## Recommendations

💡 **Recommended**: Proceed after the following steps are completed.

- All features implemented (or most core features completed)
- Feature unit/integration tests passing

Potential issues if not completed:

- Integration refactoring effectiveness may be limited
- Some features may be missing during E2E testing
- Overall quality verification may be incomplete

Would you like to continue?

---

## Part A: Integration and Refactoring

**Command**: `/workflow integrate`

**Goal**: Remove duplicates between features and improve overall code structure.

---

### Step 1: Check API Integration Status (Before Starting)

**AI work**: Check API integration status from `@memory.md`

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

## Part B: E2E Testing and Final Verification

**Command**: `/workflow e2e`

**Goal**: Verify entire user flows with E2E tests and prepare for production deployment.

---

### Step 1: Propose E2E Test Flows

**AI work**: Analyze requirements specification and implemented features to propose E2E test user flows

**Output format**:

```typescript
interface E2EFlow {
  id: string; // 'E2E-XXX'
  name: string; // '{Flow name}'
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  steps: string[]; // ['{Step 1}', '{Step 2}', ...]
  estimatedTime: string; // '{Estimated time}'
  relatedFeatures: string[]; // ['{Feature ID 1}', '{Feature ID 2}', ...]
  alternativeScenarios?: string[]; // ['{Alternative scenario 1}', '{Alternative scenario 2}']
}
```

#### 🔔 User Review

"I plan to write the following E2E test flows:"

**Display proposed flow list** (by priority)

"Which flows would you like to test?"

For each flow:

- [ ] Write (recommend critical first)
- [ ] Modify (adjust steps)
- [ ] Exclude (unnecessary)

**Selection options**:

- Include alternative scenarios
- Include error scenarios

⚠️ **Write only approved flows**

---

### Step 2: Write E2E Tests

Write E2E tests for approved flows:

**Test structure**:

```typescript
// e2e/{flow-name}.spec.ts

test.describe("{Flow name}", () => {
  test("{Test case name}", async ({ page }) => {
    // {Step-by-step flow description}
  });

  test("{Error scenario name}", async ({ page }) => {
    // {Error scenario verification}
  });
});
```

**Includes**:

- Verify page transitions at each step
- User interactions (click, input)
- Verify results (URL, text, state)
- Error scenarios
- Screenshot/video capture (on failure)

---

### Step 3: Run E2E Tests

**Test execution**:

1. Run all E2E tests
2. Check screenshots/videos on failure
3. Analyze error logs
4. Document reproduction steps

---

### Step 4: Handle Failed Tests

#### 🔔 User Confirmation

"E2E test results:"

- ✅ Passed: N tests
- ❌ Failed: N tests

**Failed tests**:

- E2E-XXX: {Test name}
  - Failed step: {Step name}
  - Error: {Error type}
  - Screenshot: [Attach]

"Please select one of the following:"

- [ ] Fix feature and rerun
- [ ] Test code modification needed
- [ ] Environment issue (rerun)

---

### Step 5: Final Quality Verification

#### ✅ Feature Completeness

- [ ] All requirement features implemented
- [ ] All feature tests passing
- [ ] E2E tests passing

#### ✅ Code Quality

- [ ] 0 type errors
- [ ] 0 linter warnings
- [ ] 90% or higher test coverage
- [ ] Minimized duplicate code

#### ✅ Performance (if optimization performed)

- [ ] Initial loading < 3sec
- [ ] Page transition < 1sec
- [ ] Achieved bundle size goal

#### ✅ Accessibility

- [ ] Keyboard navigation possible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA

#### ✅ Security

- [ ] Authentication/authorization verified
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Sensitive information protected

#### ✅ Documentation

- [ ] README updated
- [ ] API documentation written
- [ ] Deployment guide written

---

### Step 6: Final Approval

### Review Guide (For AI)

**Basic principle**: Evaluate overall project completion

**Always ask**:

- Is the project ready for production deployment?

**Conditional questions**:

- If there were E2E test failures: Have all issues been resolved?
- If performance optimization was performed: Are final performance metrics satisfactory?
- Documentation: Is deployment guide sufficient?

**Question style**:

- Evaluate overall project completion
- Suggest improvable areas
- Check final deployment checklist

#### 🔔 Final Approval

"The project is ready for production deployment."

**Final status**:

- ✅ Features: N (100%)
- ✅ Test pass rate: 100%
- ✅ E2E passed: N/N
- ✅ Coverage: X% (goal: 90% or higher)
- ✅ Performance goal: Achieved (if optimization performed)
- ✅ Accessibility: WCAG AA
- ✅ Documentation: Completed

**Deployment preparation**:

- Environment variable setup guide
- Build scripts
- CI/CD pipeline
- Monitoring setup

**Final confirmation**:

- [ ] Approve (ready to deploy)
- [ ] Additional work needed

**Upon approval**: 🎉 Project completed!

---

## Memory Update

**When integration work is completed**:

```markdown
- [x] Integration and refactoring (@system-integration.md)
```

**When E2E testing is completed**:

```markdown
- [x] E2E testing (@system-integration.md)
```

---

## Next Steps

**After all are completed**:

- 🎉 Production deployment
- Collect user feedback
- Continuous improvement

---

## Output File Paths

**Integration outputs**:

- `src/shared/utils/` - Common utilities
- `src/shared/hooks/` - Common hooks
- `src/shared/types/` - Common types
- `src/shared/constants/` - Common constants

**Tests**:

- `__tests__/integration/cross-domain/` - Cross-domain integration tests
- `e2e/` - E2E tests

**Documentation**:

- `docs/architecture.md` - Final architecture
- `docs/deployment.md` - Deployment guide
- `docs/performance.md` - Performance optimization results (if optimization performed)
