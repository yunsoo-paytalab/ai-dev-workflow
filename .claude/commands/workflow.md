# AI Development Workflow Command Guide

## Overview

**Flexible Workflow System**:
- Tasks can be performed in any desired order
- Shows warnings if dependencies are not met
- Continues after user confirmation

**Workflow Structure**:
- `memory/` - Modular progress tracking (in `docs/workflows/memory/`)
- Command files in `.claude/commands/` - Each contains full workflow details

---

## Main Commands

### `/workflow start`

**When to use**: At project start

{{LOAD_CONTEXT: progress, project-info}}

**Execution**:

1. Read memory modules to understand current progress
2. Check if basic project information has been entered
3. If not: Suggest starting with `/workflow-domain-definition`
4. If completed: Guide current state and recommended next steps

**Recommended work order** (for reference):
1. Domain definition → 2. Common UI → 3. Feature UI → 4. Feature implementation → 5. System integration → 6. E2E testing

---

### `/workflow status`

**When to use**: Anytime

{{LOAD_CONTEXT: *}}

**Display**:

**Project Information**:
- Project name, path, tech stack

**Progress Status**:
- ✅ Completed tasks
- 🔄 In progress
- ⏳ Pending

**Feature Progress**:
- Feature status display

**Recommended Next Steps**

---

### `/workflow update`

**When to use**: When manual memory file update is needed

{{LOAD_CONTEXT: *}}

**Execution**:

1. Read current memory modules
2. Analyze project state:
   - Check completed tasks
   - Identify in-progress tasks
   - Check file system
3. Update memory modules
4. Report updated content

---

### `/workflow help`

**When to use**: Anytime

Display all available commands and usage:

**Main Commands**:
- `/workflow start` - Start project
- `/workflow status` - Check current status
- `/workflow update` - Manual memory update
- `/workflow help` - Help

**Task Commands**:
- `/workflow-domain-definition` - Domain definition
- `/workflow-ui [name] [--type=common|feature]` - UI development
- `/workflow-implement [feature-name]` - Feature implementation
- `/workflow-integrate` - Integration and refactoring
- `/workflow-e2e` - E2E testing

**Special Commands**:
- `/workflow reset` - Reset project

---

## Special Commands

### `/workflow reset`

**When to use**: When resetting project

**Execution**:

1. Read `docs/workflows/memory-template.md` file
2. Reset all memory modules to template state
3. Display: "Project has been reset. Please start with `/workflow start` command."

---

## Memory System

### Modular Memory Files

Located in `docs/workflows/memory/`:

- **project-info.md**: Project name, tech stack, folder structure
- **domains.md**: Domain list and descriptions
- **pages.md**: Page structure and routing
- **progress.md**: Overall progress checklist
- **features.md**: Feature-level progress tracking
- **decisions.md**: Key decisions

### Context Loading

Commands automatically load only required memory modules:

| Command | Loads |
|---------|-------|
| `/workflow-domain-definition` | project-info, domains, pages |
| `/workflow-ui` | domains, progress |
| `/workflow-implement` | features, domains |
| `/workflow-integrate` | progress, features |
| `/workflow-e2e` | progress, features |
| `/workflow status` | All modules |
| `/workflow update` | All modules |

---

## Dependency System

### Warning Format

```
💡 Recommendation

The following steps are not completed:
- [Recommended step name]

Potential issues if not completed:
- [Specific issue 1]
- [Specific issue 2]

Would you like to continue? (y/n)
```

### Dependencies

- **Common UI**: Domain definition completed
- **Feature UI**: Domain definition + Common UI (recommended)
- **Feature Implementation**: Domain definition (required), Feature UI (recommended)
- **System Integration**: All/most features implemented
- **E2E Testing**: System integration completed

---

## Automatic Tasks

On command execution:

1. **Load Context**: Read required memory modules
2. **Check Dependencies**: Display warnings if prerequisites not met
3. **Execute Work**: Follow workflow steps
4. **Save Output**: To specified paths
5. **Update Memory**: Update relevant memory modules

---

## Usage Examples

### Start Project
```
/workflow start
```

### Check Status
```
/workflow status
```

### Domain Definition
```
/workflow-domain-definition
```

### UI Development
```
/workflow-ui Dialog --type=common
/workflow-ui ProductCard --type=feature
```

### Feature Implementation
```
/workflow-implement product-list
/workflow-implement cart
```

### System Integration
```
/workflow-integrate
```

### E2E Testing
```
/workflow-e2e
```

---

## Recommended Work Order (Reference Only)

> 💡 You don't need to follow this order.

1. **Domain Definition** (`/workflow-domain-definition`)
2. **Common UI** (`/workflow-ui [name] --type=common`)
3. **Repeat for each feature**:
   - Feature UI (`/workflow-ui [name] --type=feature`)
   - Feature Implementation (`/workflow-implement [feature-name]`)
4. **System Integration** (`/workflow-integrate`)
5. **E2E Testing** (`/workflow-e2e`)

---

## Template System

Commands use reusable templates from `.claude/templates/`:

**Sections**:
- `recommendations.md` - Prerequisite warnings
- `review-guide.md` - AI review guidelines
- `user-review.md` - User review prompts
- `memory-update.md` - Memory update instructions

**Snippets**:
- `user-input-pattern.md` - User input prompts
- `output-paths.md` - File path specifications

---

## File Structure

```
.claude/
├── templates/
│   ├── sections/          # Reusable section templates
│   └── snippets/          # Small pattern templates
└── commands/
    ├── workflow.md        # Main commands
    ├── workflow-domain-definition.md
    ├── workflow-ui.md     # Unified UI command
    ├── workflow-implement.md
    ├── workflow-integrate.md
    └── workflow-e2e.md

docs/workflows/
├── memory/                # Modular memory files
│   ├── project-info.md
│   ├── domains.md
│   ├── pages.md
│   ├── progress.md
│   ├── features.md
│   └── decisions.md
└── memory.md             # Consolidated view (read-only)
```

---

## Core Principles

1. **Test-First Development**: Test → Implement → Refactor
2. **Dummy Data First**: API integration is optional
3. **Step-by-Step Review**: User approval at each stage
4. **Flexible Workflow**: Work in any order
5. **Modular Memory**: Load only what's needed
6. **Type Safety**: Full TypeScript type safety
