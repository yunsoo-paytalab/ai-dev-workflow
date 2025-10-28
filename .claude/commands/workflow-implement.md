# `/workflow-implement [feature-name]` Command

**When to use**: When implementing features

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

---

## Goal

Implement selected features using Test-First approach, and optionally integrate with actual APIs.

---

{{LOAD_CONTEXT: features, domains}}

---

{{TEMPLATE: sections/recommendations
  PREREQUISITES: |
    - Domain definition completed (feature list needed)
    - UI design completed (for the feature) - recommended
  POTENTIAL_ISSUES: |
    - Feature information may be unclear
    - May be difficult to implement without knowing UI component structure
    - File paths may not be defined
}}

---

## Step 1: Confirm Feature Information

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Please select the feature to implement:"
  INPUT_OPTIONS: |
    **Feature information**:
    - ID: `_________________`
    - Name: `_________________`
    - Domain: `_________________`

    **Would you like to implement this feature?**
    - [ ] Approve (proceed)
    - [ ] Modification needed (adjust scope)
  CONDITION: approved
}}

---

## Step 2: Write Tests (Test-First)

### 2-1. Check Test Environment (First time only)

**AI work**: Check if test tools are set up

- Unit test tool setup completed?
- Component test tool setup completed?
- Test helper utilities created?

---

### 2-2. Write Dummy Data Functions

**Work content**: Write dummy data functions needed for current feature

**Writing order**:

1. **Analyze API endpoints**:
   - Identify necessary APIs from UI design results
   - Define request/response schemas

2. **Create dummy data**:

   ```typescript
   // src/mocks/data/{domain}.ts
   export const dummyProducts = [
     { id: "1", name: "Dummy Product 1", price: 10000 },
     { id: "2", name: "Dummy Product 2", price: 20000 },
   ];
   ```

3. **Write dummy data functions**:

   ```typescript
   export const getDummyProducts = (params: any) => {
     let filtered = dummyProducts;
     if (params.category) {
       filtered = dummyProducts.filter((p) => p.category === params.category);
     }

     const page = params.page || 1;
     const limit = params.limit || 10;
     const paginated = filtered.slice((page - 1) * limit, page * limit);

     return Promise.resolve({
       products: paginated,
       totalCount: filtered.length,
       page,
       totalPages: Math.ceil(filtered.length / limit),
     });
   };
   ```

---

### 2-3. Test Writing Order

**AI work checklist**:

- [ ] Write business logic tests
- [ ] Write component tests
- [ ] Run all tests and confirm failure (Red Phase)

#### 1) Business Logic Tests

**Work content**: Test core logic of pure functions and utility functions

**Includes**:

- Filtering, sorting, calculation logic
- Exception handling cases
- Boundary value tests

#### 2) Component Tests

**Work content**: Test main interactions and state changes of components

**Includes**:

- Rendering tests
- User interactions (click, input)
- State change verification
- Conditional rendering

---

## Step 3: Implementation (Green Phase)

### AI Work Checklist

- [ ] Step 2 completed (tests written)
- [ ] Implement business logic (pure functions first)
- [ ] Implement component logic
- [ ] Implement page logic
- [ ] Run tests and confirm pass (Green Phase)

### Implementation Order

#### 1) Business Logic Implementation

**Work content**: Implement pure functions and utility functions

**Includes**:

- Filtering, sorting, calculation logic
- Exception handling logic
- Type safety assurance

#### 2) Component Logic Implementation

**Work content**: Add logic to components written during UI design phase

**Includes**:

- State management
- Event handlers
- Conditional rendering

#### 3) Page Logic Implementation

**Work content**: Implement overall logic of page components

**Includes**:

- Component composition
- State management
- Routing handling

**After implementation is completed**:

- [ ] Run all tests
- [ ] Confirm test pass (Green Phase)
- [ ] Confirm no type errors
- [ ] Confirm linter passes

---

## Step 4: Refactoring (Refactor Phase)

### AI Work Checklist

- [ ] Step 3 completed (implementation)
- [ ] Remove duplicate code
- [ ] Separate functions/components (single responsibility)
- [ ] Improve variable/function names
- [ ] Add comments to complex logic
- [ ] Remove unnecessary code
- [ ] Extract logic to custom hooks (if needed)
- [ ] Re-run tests and confirm pass

### Refactoring Checklist

- [ ] Remove duplicate code
- [ ] Separate functions/components (single responsibility)
- [ ] Improve variable/function names
- [ ] Add comments to complex logic
- [ ] Remove unnecessary code
- [ ] Extract logic to custom hooks (if needed)

**Refactoring scope**:

- ✅ Only within current feature
- ❌ Don't touch other features
- ❌ Avoid excessive abstraction

**After refactoring is completed**:

- [ ] Re-run tests → Still pass
- [ ] Confirm code readability improved

---

## Step 5: Feature Review

{{TEMPLATE: sections/review-guide
  REVIEW_PRINCIPLE: Ask questions flexibly according to feature complexity and work step
  ALWAYS_ASK: |
    - Does implementation result match requirements?
  CONDITIONAL_QUESTIONS: |
    - UI-related work: Design match
    - Complex logic: Test coverage
    - Performance critical: Performance metrics
}}

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: Feature **[Feature Name]** implementation is completed.
  REVIEW_CONTENT: |
    **Implementation result**:

    Tests:
    - ✅ Written: N tests
    - ✅ Passed: N/N
    - ✅ Coverage: X%

    Implementation files:
    - Business logic: `src/features/{domain}/utils/` (N files)
    - API services: `src/api/{domain}/` (N files)
    - Components: `src/pages/`, `src/features/{domain}/components/` (N files)

    Dummy data:
    - ✅ Dummy data: `src/mocks/data/{domain}.ts`
    - ✅ Tests passed: Dummy data integration working
  REVIEW_CHECKLIST: |
    - Does the feature work as per requirements?
    - Is UI implemented according to design?
    - Is dummy data working properly?
    - Are tests sufficient?
    - Is code quality satisfactory?
}}

---

## Step 6: API Integration (Optional)

> 💡 **Optional step**: Proceed only if API is ready

### 6-1. Check API Readiness Status

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Would you like to proceed with API integration for current feature **[Feature Name]**?"
  INPUT_OPTIONS: |
    **Please select API readiness status:**
    - [ ] **Real API ready** (proceed with integration)
    - [ ] **API not ready yet** (keep dummy data)
    - [ ] **Partially ready** (integrate only ready APIs)
    - [ ] **Integrate later** (during system integration phase)
  CONDITION: N/A
}}

**If "API not ready yet" or "Integrate later" is selected**:
- Proceed to Step 7 (next feature)
- Keep dummy data

**If "Real API ready" or "Partially ready" is selected**:
- Proceed with API integration work

---

## Step 7: Memory Update and Next Feature

{{TEMPLATE: sections/memory-update
  TASK_NAME: implementation - [Feature Name]
  MEMORY_CHECKBOX: |
    Update `memory/features.md`:
    - Mark feature [Feature Name] as completed
    Update `memory/progress.md`:
    - [x] Implementation - [Feature Name]
}}

**Next steps**:

- Next feature implementation: Repeat from Step 1
- Or system integration: `/workflow-integrate`

---

## Dummy Data Usage Guide

### Dummy Data Usage Scenarios

**Development phase**:

- When API is not ready yet
- When frontend development needs to proceed first
- When data is needed for UI/UX testing

**Testing phase**:

- When consistent data is needed in E2E tests
- When various scenario tests are needed

### Dummy Data Setup Method

```typescript
// .env.development
VITE_USE_DUMMY_DATA = true;
VITE_DUMMY_DATA_SIZE = 100;
VITE_DUMMY_DATA_DELAY = 300; // ms
```

---

{{TEMPLATE: snippets/output-paths
  FILE_PATHS: |
    **Implementation files**:
    - `src/features/{domain}/utils/` - Business logic
    - `src/api/{domain}/` - API services
    - `src/features/{domain}/hooks/` - React Query hooks
    - `src/features/{domain}/components/` - Components
    - `src/pages/` - Pages

    **Dummy data**:
    - `src/mocks/data/{domain}.ts` - Dummy data and functions

    **Test files**:
    - `__tests__/unit/{domain}/` - Business logic tests
    - `__tests__/unit/api/` - API service tests
    - `__tests__/components/{domain}/` - Component tests
    - `__tests__/integration/` - Integration tests

    **API guide** (Created during first integration):
    - `docs/api-guidelines.md` - API patterns and rules
}}
