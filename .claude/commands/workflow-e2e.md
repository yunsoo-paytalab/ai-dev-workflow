# `/workflow-e2e` Command

**When to use**: During E2E testing work

**Features**:
- Propose E2E test flows
- Write and run E2E tests
- Final quality verification
- Production deployment preparation

**Recommendations**:
- System integration completed

**Usage**:

```
/workflow-e2e
```

---

## Goal

Verify entire user flows with E2E tests and prepare for production deployment.

---

{{LOAD_CONTEXT: progress, features}}

---

{{TEMPLATE: sections/recommendations
  PREREQUISITES: |
    - System integration completed
  POTENTIAL_ISSUES: |
    - E2E test results may be unstable
    - Integration issues may be found
    - Overall quality verification may be incomplete
}}

---

## Step 1: Propose E2E Test Flows

**AI work**: Analyze requirements specification and implemented features to propose E2E test user flows

**Output format**:

```typescript
interface E2EFlow {
  id: string; // 'E2E-XXX'
  name: string;
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  steps: string[];
  estimatedTime: string;
  relatedFeatures: string[];
  alternativeScenarios?: string[];
}
```

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: I plan to write the following E2E test flows:
  REVIEW_CONTENT: |
    **Display proposed flow list** (by priority)

    For each flow:
    - [ ] Write (recommend critical first)
    - [ ] Modify (adjust steps)
    - [ ] Exclude (unnecessary)

    **Selection options**:
    - Include alternative scenarios
    - Include error scenarios
  REVIEW_CHECKLIST: |
    - Are critical user flows covered?
    - Are flow priorities appropriate?
    - Are steps clear and testable?
}}

⚠️ **Write only approved flows**

---

## Step 2: Write E2E Tests

Write E2E tests for approved flows:

**Test structure**:

```typescript
// e2e/{flow-name}.spec.ts

test.describe("{Flow name}", () => {
  test("{Test case name}", async ({ page }) => {
    // Step-by-step flow description
  });

  test("{Error scenario name}", async ({ page }) => {
    // Error scenario verification
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

## Step 3: Run E2E Tests

**Test execution**:

1. Run all E2E tests
2. Check screenshots/videos on failure
3. Analyze error logs
4. Document reproduction steps

---

## Step 4: Handle Failed Tests

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: E2E test results:
  REVIEW_CONTENT: |
    - ✅ Passed: N tests
    - ❌ Failed: N tests

    **Failed tests**:
    - E2E-XXX: {Test name}
      - Failed step: {Step name}
      - Error: {Error type}
      - Screenshot: [Attach]
  REVIEW_CHECKLIST: |
    Please select one of the following:
    - [ ] Fix feature and rerun
    - [ ] Test code modification needed
    - [ ] Environment issue (rerun)
}}

---

## Step 5: Final Quality Verification

### ✅ Feature Completeness

- [ ] All requirement features implemented
- [ ] All feature tests passing
- [ ] E2E tests passing

### ✅ Code Quality

- [ ] 0 type errors
- [ ] 0 linter warnings
- [ ] 90% or higher test coverage
- [ ] Minimized duplicate code

### ✅ Performance (if optimization performed)

- [ ] Initial loading < 3sec
- [ ] Page transition < 1sec
- [ ] Achieved bundle size goal

### ✅ Accessibility

- [ ] Keyboard navigation possible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA

### ✅ Security

- [ ] Authentication/authorization verified
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Sensitive information protected

### ✅ Documentation

- [ ] README updated
- [ ] API documentation written
- [ ] Deployment guide written

---

## Step 6: Final Approval

{{TEMPLATE: sections/review-guide
  REVIEW_PRINCIPLE: Evaluate overall project completion
  ALWAYS_ASK: |
    - Is the project ready for production deployment?
  CONDITIONAL_QUESTIONS: |
    - If there were E2E test failures: Have all issues been resolved?
    - If performance optimization was performed: Are final performance metrics satisfactory?
    - Documentation: Is deployment guide sufficient?
}}

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: The project is ready for production deployment.
  REVIEW_CONTENT: |
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
  REVIEW_CHECKLIST: |
    - [ ] Approve (ready to deploy)
    - [ ] Additional work needed
}}

**Upon approval**: 🎉 Project completed!

---

{{TEMPLATE: sections/memory-update
  TASK_NAME: E2E testing
  MEMORY_CHECKBOX: |
    Update `memory/progress.md`:
    - [x] E2E testing
}}

---

## Next Steps

**After all are completed**:

- 🎉 Production deployment
- Collect user feedback
- Continuous improvement

---

{{TEMPLATE: snippets/output-paths
  FILE_PATHS: |
    **E2E tests**:
    - `e2e/` - E2E tests

    **Documentation**:
    - `docs/deployment.md` - Deployment guide
}}
