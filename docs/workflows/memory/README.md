# Modular Memory System

This directory contains modular memory files for tracking project progress.

## Files

- **project-info.md**: Project name, tech stack, folder structure
- **domains.md**: Domain list and descriptions
- **pages.md**: Page structure and routing
- **progress.md**: Overall progress checklist
- **features.md**: Feature-level progress tracking
- **decisions.md**: Key decisions made during development

## Usage by Commands

Different commands load only the memory modules they need:

| Command | Loads |
|---------|-------|
| `/workflow-domain-definition` | project-info, domains, pages |
| `/workflow-ui` | domains, progress |
| `/workflow-common-ui` | domains, progress |
| `/workflow-implement` | features, domains |
| `/workflow-integrate` | progress, features |
| `/workflow-e2e` | progress, features |
| `/workflow status` | All modules |
| `/workflow update` | All modules |

## Updating Memory

Each command automatically updates relevant memory modules when tasks are completed.

The parent `memory.md` file is a read-only consolidated view that can be auto-generated from these modules.
