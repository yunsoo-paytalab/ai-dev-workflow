# Workflow Template System

## Overview

This template system reduces token consumption by extracting common patterns used across workflow commands.

## Structure

### Sections (`sections/`)

Reusable section templates for major workflow components:

- **recommendations.md**: Prerequisite warnings before starting tasks
- **review-guide.md**: Guidelines for AI to review work
- **user-review.md**: Structured user review prompts
- **memory-update.md**: Memory file update instructions

### Snippets (`snippets/`)

Small, frequently-used patterns:

- **user-input-pattern.md**: User input request format
- **output-paths.md**: File path specification format

## Usage in Commands

Templates are referenced using the `{{TEMPLATE:}}` syntax:

```markdown
{{TEMPLATE: sections/recommendations
  PREREQUISITES: |
    - Domain definition completed
    - UI design completed
  POTENTIAL_ISSUES: |
    - Feature information may be unclear
    - File paths may not be defined
}}
```

## Benefits

1. **Consistency**: All commands use the same patterns
2. **Maintainability**: Update once, affects all commands
3. **Token Efficiency**: Templates loaded once, referenced many times
4. **Clarity**: Command files focus on unique content

## Token Savings

- **Before optimization**: ~60,329 characters (command files + memory)
- **After optimization**: ~43,110 characters
- **Savings**: ~17,219 characters (28.5% reduction)
- **Additional runtime savings**: Template and memory module reuse

## Context Loading

Commands specify which memory modules they need:

```markdown
{{LOAD_CONTEXT: features, domains}}
```

This loads only the required memory modules instead of the entire memory file.
