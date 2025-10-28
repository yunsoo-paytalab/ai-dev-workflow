# AI Development Workflow Command Guide

## Overview

**Flexible Workflow System**:

- Tasks can be performed in any desired order
- Shows warnings if dependencies are not met
- Continues after user confirmation

**7 Workflow Files**:

- `memory.md` - Progress tracking
- `domain-definition.md` - Domain and feature definition
- `ui-design.md` - UI design (common + features)
- `feature-implementation.md` - Feature implementation and API integration
- `system-integration.md` - Integration and E2E testing

---

## Main Commands

### `/workflow start`

**When to use**: At project start

**Features**:

- Read `memory.md` to understand current state
- Check requirements specification
- Guide first task

**Usage**:

```
/workflow start
```

**AI Execution Prompt**:

```
Please perform the following steps:

1. Read `.cursor/rules/workflows/memory.md` to understand the current progress
2. Check if basic project information has been entered
3. If not entered: "Basic information is required to start the project. Would you like to start with `/workflow-domain-definition` command?"
4. If completed: Guide current state and recommended next steps

Recommended work order (for reference):
1. Domain definition (`/workflow-domain-definition`)
2. Common UI design (`/workflow-common-ui`)
3. Feature UI design (`/workflow-ui [feature-name]`)
4. Feature implementation (`/workflow-implement [feature-name]`)
5. System integration (`/workflow-integrate`)
6. E2E testing (`/workflow-e2e`)
```

---

### `/workflow status`

**When to use**: Anytime

**Features**:

- Display overall progress
- List completed/incomplete tasks
- Guide next recommended steps

**Usage**:

```
/workflow status
```

**AI Execution Prompt**:

```
Please display the following information:

1. Read `.cursor/rules/workflows/memory.md` to understand the overall progress
2. Display the following information:

**Project Information**:
- Project name: [value]
- Path: [value]
- Tech stack: [value]

**Progress Status**:
- ✅ Completed tasks: [list]
- 🔄 In progress: [list]
- ⏳ Pending: [list]

**Feature Progress**:
- [Feature status display]

**Recommended Next Steps**:
- [Next step guidance]
```

---

### `/workflow update`

**When to use**: When manual memory file update is needed

**Features**:

- Analyze current progress
- Update `memory.md` file
- Check completed tasks

**Usage**:

```
/workflow update
```

**AI Execution Prompt**:

```
Please update the current state to memory file:

1. Read `.cursor/rules/workflows/memory.md` to understand the current progress
2. Analyze the current state of the project:
   - Check completed tasks
   - Identify currently in-progress tasks
   - Check file system
3. Update `memory.md` file:
   - Update checklist
   - Update feature progress table
4. Report the updated content to the user
```

---

### `/workflow help`

**When to use**: Anytime

**Features**:

- Display all available commands
- Explain usage of each command

**Usage**:

```
/workflow help
```

**AI Execution Prompt**:

```
Please display all available commands:

**Main Commands**:
- /workflow start - Start project
- /workflow status - Check current status
- /workflow update - Manual memory update
- /workflow help - Help

**Task Commands**:
- /workflow-domain-definition - Domain definition
- /workflow-common-ui - Common UI design
- /workflow-ui [feature-name] - Feature UI design
- /workflow-implement [feature-name] - Feature implementation
- /workflow-integrate - Integration and refactoring
- /workflow-e2e - E2E testing

**Special Commands**:
- /workflow reset - Reset project

Display detailed description for each command.
```

---

## Task Commands

### `/workflow-domain-definition` - Domain Definition

📄 Detailed docs: `@domain-definition-cmd.md`

### `/workflow-common-ui` - Common UI Design

📄 Detailed docs: `@common-ui-cmd.md`

### `/workflow-ui [feature-name]` - Feature UI Design

📄 Detailed docs: `@ui-cmd.md`

### `/workflow-implement [feature-name]` - Feature Implementation

📄 Detailed docs: `@implement-cmd.md`

### `/workflow-integrate` - Integration and Refactoring

📄 Detailed docs: `@integrate-cmd.md`

### `/workflow-e2e` - E2E Testing

📄 Detailed docs: `@e2e-cmd.md`

---

## Special Commands

### `/workflow reset`

**When to use**: When resetting project

**Features**:

- Reset `memory.md`
- Reset all progress
- Start from scratch

**Usage**:

```
/workflow reset
```

**AI Execution Prompt**:

```
Please reset the project:

1. Read `.cursor/rules/workflows/memory-template.md` file
2. Overwrite `.cursor/rules/workflows/memory.md` file with the template
3. Display message: "Project has been reset. Please start with `/workflow start` command."
```

---

## Usage Examples

### Start Project

```
/workflow start
```

### Check Current Status

```
/workflow status
```

### Domain Definition

```
/workflow-domain-definition
```

### Common Component Development

```
/workflow-common-ui    # Dialog component
/workflow-common-ui    # Toast component
/workflow-common-ui    # Header component
```

### Feature Component Development

```
/workflow-ui product-list    # ProductList component
/workflow-ui product-list    # ProductCard component
/workflow-ui cart            # CartPage component
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

### Memory Update

```
/workflow update
```

### Help

```
/workflow help
```

---

## Dependency Warning System

### Warning Display Format

```
💡 Recommendation

The following steps are not completed:
- [Recommended step name]

Potential issues if not completed:
- [Specific issue 1]
- [Specific issue 2]

Would you like to continue? (y/n)
```

### Dependency Check Items

**Common UI Design**:

- Domain definition completed (folder structure info)

**Feature UI Design**:

- Domain definition completed
- Common UI design completed (reuse common components)

**Feature Implementation**:

- Domain definition completed (feature list needed)
- Feature UI design completed (recommended)

**System Integration**:

- All (or most core) features implemented

**E2E Testing**:

- System integration completed

---

## Automatic Tasks on Command Execution

### 1. Read Memory.md

```
Read .cursor/rules/workflows/memory.md file to understand:
- Basic project information
- Tech stack
- Domain list
- Page structure
- Progress checklist
- Feature progress
- Key decisions
```

### 2. Check Recommendations

```
Check recommendations before starting work:
- Check if required previous steps are completed
- Display warning message if not completed
- Wait for user confirmation
```

### 3. Reference Workflow Files

```
Reference workflow files for the task:
- domain-definition.md
- ui-design.md
- feature-implementation.md
- system-integration.md
```

### 4. Execute Work

```
Follow the workflow file process to perform work:
- Check step-by-step checklist
- Request user input when needed
- Execute AI tasks
- Proceed with user review
```

### 5. Save Output

```
Save output to specified path:
- Reference "Output File Path" section of each workflow file
```

### 6. Update Memory.md

```
Update memory.md:
- Check completed task checkboxes
- Update feature progress table
```

---

## Recommended Work Order (For Reference)

> 💡 **For reference**: You don't need to follow this order.

1. **Domain Definition** (`/workflow-domain-definition`)
2. **Common UI** (`/workflow-common-ui`)
3. **Repeat for each feature**:
   - Feature UI (`/workflow-ui [feature-name]`)
   - Feature Implementation (`/workflow-implement [feature-name]`)
4. **System Integration** (`/workflow-integrate`)
5. **E2E Testing** (`/workflow-e2e`)

---

## File Structure

### Command Files

**Main File**:

- `.cursor/commands/workflow.md` - Main commands and complete guide
  - `/workflow start` - Start project
  - `/workflow status` - Check current status
  - `/workflow update` - Manual memory update
  - `/workflow help` - Help
  - `/workflow reset` - Reset project

**Task Command Files**:

- `.cursor/commands/workflow-domain-definition.md` - `/workflow-domain-definition`
- `.cursor/commands/workflow-common-ui.md` - `/workflow-common-ui`
- `.cursor/commands/workflow-ui.md` - `/workflow-ui [feature-name]`
- `.cursor/commands/workflow-implement.md` - `/workflow-implement [feature-name]`
- `.cursor/commands/workflow-integrate.md` - `/workflow-integrate`
- `.cursor/commands/workflow-e2e.md` - `/workflow-e2e`

### Workflow Guide Files

- `.cursor/rules/workflows/memory.md` - Progress tracking
- `.cursor/rules/workflows/memory-template.md` - Memory template
- `.cursor/rules/workflows/domain-definition.md` - Domain definition workflow
- `.cursor/rules/workflows/ui-design.md` - UI design workflow
- `.cursor/rules/workflows/feature-implementation.md` - Feature implementation workflow
- `.cursor/rules/workflows/system-integration.md` - Integration and E2E testing workflow
