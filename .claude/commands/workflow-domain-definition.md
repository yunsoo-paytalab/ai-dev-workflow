# `/workflow-domain-definition` Command

**When to use**: When defining domain and features

**Features**:
- Set domain list and boundaries
- Define page structure
- Derive feature list
- (Optional) Analyze feature dependencies

**Recommendations**:
- Perform first at project start

**Usage**:

```
/workflow-domain-definition
```

---

## Goal

Analyze requirements specification to set domain boundaries and define page-level structure.
Optionally, analyze dependencies between features to derive optimal implementation order.

---

{{LOAD_CONTEXT: project-info}}

---

## Step 1: Check Requirements Specification

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Please provide requirements specification"
  INPUT_OPTIONS: |
    - 📄 Attach requirements specification file (`docs/requirements.md`)
    - 📋 Attach existing system documentation
    - 💬 Provide direct requirements explanation in chat
  CONDITION: requirements provided (proceeding is possible)
}}

---

## Step 2: Analyze Requirements

**Work content**:

1. Analyze requirements specification
2. Extract core features
3. Identify main actors (user types)
4. Understand data flow

---

## Step 3: Identify Domain Boundaries

### Domain Boundary Decision Guide

**Basic principles**:

1. **Actor-centric**: If main actor is clear, include in that domain
2. **Simplicity first**: Don't separate if not complex
3. **Change isolation**: Consider separating frequently changing logic
4. **Cohesion**: Related features belong in the same domain

### Decision Criteria (Check in order)

For each feature:

**1. Is the main actor clear?**
- YES → Consider including in that domain
- NO → Next step

**2. Are business rules complex?**
- YES → Consider separating into separate domain
- NO → Include in main domain

**3. Does it integrate with 3 or more domains?**
- YES → Separate into different domain
- NO → Include in main domain

**4. Is it frequently changed?** (Monthly or more)
- YES → Consider separating into separate domain
- NO → Include in main domain

### Decision Examples

**Example 1 - Include in main domain**:
- Case: User notification settings
- Main actor: User ✓
- Complexity: Low (boolean flag)
- Related domains: 1
- **Conclusion**: Include in User domain

**Example 2 - Separate into different domain**:
- Case: Points/reward system
- Main actor: Unclear (User, Order, Review all involved)
- Complexity: High (accumulation/usage/expiration rules)
- Related domains: 4 or more
- Change frequency: High
- **Conclusion**: Separate as Reward domain

---

## Step 4: Define Page Structure

**Work content**:

1. Identify all necessary pages
2. Design URL paths for each page
3. Display related domain for each page
4. Define routing structure (authentication requirements, etc.)

**Notes**:

- ✅ Define only at page level
- ✅ Design only URL structure and routing
- ❌ Define detailed components within pages during UI design phase

---

## Step 5: Derive Feature List

For each feature, derive the following information:

- **Feature name**: Clear and specific
- **Primary domain** (primaryDomain): Owner of this feature
- **Related domains** (relatedDomains): Domains it integrates with
- **Complexity**: low / moderate / high
- **Description**: Brief description

**Cases requiring discussion**:

- When primary domain is unclear
- When multiple domain placement options exist
- When it's ambiguous whether to separate into different domain

In these cases, mark as `needsDiscussion: true` and suggest placement options

---

## Step 6: Identify Resources

Identify only major data resources:

- Examples: User, Product, Order, Review, Payment

**Notes**:

- ✅ List only resource names
- ❌ Define API endpoints during implementation phase

---

## Step 7: Feature Planning (Optional)

> 💡 **Optional step**: Use only in complex projects
> **Simple projects**: Can skip this section

### 7-1. Check if Feature Implementation Order is Needed

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "Would you like to analyze dependencies between features and organize the implementation order?"
  INPUT_OPTIONS: |
    - [ ] **Yes** - Proceed with dependency analysis
    - [ ] **No** - Developer decides order directly (go to Step 8)
  CONDITION: N/A
}}

**If "No" is selected**: Skip directly to Step 8
**If "Yes" is selected**: Proceed below

---

### 7-2. Generate Dependency Graph

**AI work**: Analyze dependencies between features

**Dependency types**:

- Direct dependency: Feature A explicitly uses Feature B
- Data dependency: Result of Feature A is input to Feature B
- UI dependency: Component A includes Component B

**Examples**:

- F001 (Product list) → F002 (Add to cart)
- F002 (Add to cart) → F005 (Place order)
- F003 (Login) → F004 (My page)

---

### 7-3. Topological Sort

Sort in dependency order:

1. Features with no dependencies first
2. In order of resolved dependencies
3. Group features that can be parallelized

**Example result**:

- Group 1 (can be parallelized): F001, F003
- Group 2 (after F001 completed): F002, F006
- Group 3 (after F003 completed): F004
- Group 4 (after F002 completed): F005

---

### 7-4. Detect and Resolve Circular Dependencies

**When circular dependencies are found**:

{{TEMPLATE: snippets/user-input-pattern
  QUESTION: "⚠️ Circular dependency detected: F002 → F005 → F002. Which option would you choose?"
  INPUT_OPTIONS: |
    1. **Extract common module** (Recommended): Extract common logic
    2. **Merge features**: Merge into one large feature
    3. **Remove dependency**: Remove/modify some features
    4. **Redesign needed**: Domain boundaries need to be reset
  CONDITION: option selected
}}

**After user selection**:

- Reorganize feature list
- Regenerate dependency graph
- Re-run topological sort
- Record decision in Memory file

---

### 7-5. Propose and Approve Implementation Order

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: I plan to implement features in the following order:
  REVIEW_CONTENT: |
    **Implementation order**:
    - Group 1 (can be parallelized): F001, F003
    - Group 2 (after F001 completed): F002, F006
    - Group 3 (after F003 completed): F004
    - ...
  REVIEW_CHECKLIST: |
    - Are dependencies correctly understood?
    - Is the order logical?
    - Are parallelizable features correctly grouped?
}}

---

## Step 8: Overall Review

{{TEMPLATE: sections/review-guide
  REVIEW_PRINCIPLE: Ask questions flexibly according to project complexity
  ALWAYS_ASK: |
    - Does the domain structure match requirements?
    - Is the feature list complete?
  CONDITIONAL_QUESTIONS: |
    - Many domains (5 or more): Are domain boundaries clear?
    - Many pages (10 or more): Is routing structure intuitive?
    - If feature planning was performed: Is dependency analysis appropriate?
    - If tech stack was suggested: Is the choice reasonable?
}}

{{TEMPLATE: sections/user-review
  COMPLETION_MESSAGE: Domain definition and feature planning have been completed.
  REVIEW_CONTENT: |
    **Domain list**:
    - [Domain1]: [Description]
    - ...

    **Page list**:
    - [URL]: [Page name] - [Related domain]
    - ...

    **Feature list**:
    - [Feature1]: [Primary domain] - [Complexity]
    - ...

    **Feature implementation order** (if planned):
    - Group 1: [Features]
    - ...

    **Tech stack** (if suggested):
    - State management: [Libraries]
    - Routing: [Library]
    - ...
  REVIEW_CHECKLIST: |
    - Is domain structure appropriate?
    - Is page list complete?
    - Is feature list complete?
    - (If planned) Is implementation order appropriate?
}}

---

{{TEMPLATE: sections/memory-update
  TASK_NAME: Step 8
  MEMORY_CHECKBOX: |
    Update `memory/domains.md` with domain list
    Update `memory/pages.md` with page structure
    Update `memory/features.md` with feature list
    Update `memory/progress.md`:
    - [x] Domain definition
}}

---

## Next Steps

**After domain definition is completed**:

- Recommended: `/workflow-ui [name] --type=common` (Common UI design)
- Or: `/workflow-ui [name] --type=feature` (Feature UI design)
- Or: `/workflow-implement [feature-name]` (Feature implementation)

---

{{TEMPLATE: snippets/output-paths
  FILE_PATHS: |
    - `docs/domain-definition.md` - Domain definition and structure
    - `docs/page-structure.md` - Page and routing structure
    - `docs/feature-list.md` - Feature list and domain placement
    - `docs/tech-stack.md` - Tech stack proposal (if suggested)
    - `docs/implementation-order.md` - Feature implementation order (if planned)
}}
