# Memory File

> 📌 **Purpose of this file**:
>
> - Tracks the current progress of the project
> - Read this file first before all tasks to understand the state
> - Update this file when tasks are completed to record progress

## Domain List

**(Update during domain definition phase)**

| Domain Name | Description | Main Resources |
| ----------- | ----------- | -------------- |
| -           | -           | -              |

**Examples**:
| Domain Name | Description | Main Resources |
| ----------- | --------------------- | -------------- |
| User | User management | User |
| Product | Product management | Product |
| Cart | Shopping cart | Cart, Item |

---

## Page Structure

**(Update during domain definition phase)**

| URL Path | Page Name | Related Domains | Auth Required |
| -------- | --------- | --------------- | ------------- |
| -        | -         | -               | -             |

**Examples**:
| URL Path | Page Name | Related Domain | Auth Required |
| -------- | ----------- | --------------- | ------------- |
| / | Home | Product | X |
| /login | Login | User | X |
| /cart | Cart | Cart, Product | O |

---

## Overall Progress Checklist

- Dynamically add to this section based on the examples below (remove examples when adding content)

## Overall Progress Checklist (Example)

### Initial Design

- [ ] **Domain Definition** (`@domain-definition.md`)
  - Domain list and boundaries
  - Page structure
  - Feature list
  - (Optional) Feature dependency analysis

### UI Design

- [ ] **Common UI** (`@ui-design.md`)

### Feature Tasks

**(Repeat the following pattern for each feature)**

- [ ] **Feature UI - [feature-name]** (`@ui-design.md`)
- [ ] **Feature Implementation - [feature-name]** (`@feature-implementation.md`)

### System Integration

- [ ] **Integration and Refactoring** (`@system-integration.md`)

  - Remove duplicate code
  - Extract common modules
  - Performance optimization (optional)
  - Improve accessibility

- [ ] **E2E Testing** (`@system-integration.md`)
  - Write E2E flows
  - Final quality verification

---

## Feature Progress

**(Start updating during domain definition phase)**

| Feature ID | Feature Name | Domain | Status | UI Design | Implementation | API Integration | Notes |
| ---------- | ------------ | ------ | ------ | --------- | -------------- | --------------- | ----- |
| -          | -            | -      | -      | -         | -              | -               | -     |

**Status Description**:

- ✅ Completed: Step completed
- 🔄 In Progress: Currently working
- ⏳ Pending: Not started
- - : Not applicable

**Examples**:
| Feature ID | Feature Name | Domain | Status | UI Design | Implementation | API Integration | Notes |
| ---------- | -------------------- | -------- | ---------- | --------- | -------------- | --------------- | ----------- |
| F001 | Product List | Product | ✅ Complete | ✅ | ✅ | ✅ | |
| F002 | Cart Management | Cart | 🔄 In Progress | ✅ | 🔄 | ⏳ | Implementing |
| F003 | User Login | User | ⏳ Pending | ⏳ | ⏳ | - | |

## 💡 Recommended Order (Reference)

> 💡 **For reference**: You don't need to follow this order. Proceed in any desired order.

1. **Domain Definition** - Understand overall structure
2. **Common UI** - Reusable components first
3. **Repeat for each feature**:
   - Feature UI design
   - Feature implementation (+ optional API integration)
4. **System Integration** - Remove duplicates and improve quality
5. **E2E Testing** - Final verification

---

## 🤖 Memory Update Rules (For AI)

> 📌 **AI should only update this Memory file at the following times.**

### Update Timing

- **Initial setup completion**: Project info, tech stack, folder structure
- **Domain definition completion**: Domain list, page structure, initialize feature progress table
- **Each task completion**: Check corresponding checkbox (`[ ]` → `[x]`)
- **Feature progress**: Update feature progress table
- **User request**: `/workflow update` command

### Update Content

- **Checklist**: Check completed items
- **Feature progress table**: Status, UI design, implementation, API integration, notes

### Precautions When Updating

1. **Check checkboxes accurately**: Follow `[ ]` → `[x]` format
2. **Maintain table format**: Feature progress must be managed as a table
3. **Write concisely**: Keep each item to 1-2 lines
4. **Do not remove unnecessary sections**: Keep them in unentered state

---

## 💡 3-Phase Process (Reference)

> 💡 **For reference**: This is the traditional 3-Phase process. You don't need to follow this order.

**Phase 1 (Initial Design)**:

- Domain definition (`@domain-definition.md`)
- Common UI design (`@ui-design.md`)

**Phase 2 (Feature Development)**:

- Feature UI design (`@ui-design.md`)
- Feature implementation (`@feature-implementation.md`)

**Phase 3 (Integration)**:

- Integration and refactoring (`@system-integration.md`)
- E2E testing (`@system-integration.md`)
