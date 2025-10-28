# `/workflow-domain-definition` Command

**When to use**: When defining domain and features

**Reference File**: `@domain-definition.md`

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

**AI Execution Prompt**:

```
Please perform domain definition work:

1. Read `.cursor/rules/workflows/memory.md` to check current status
2. Read `.cursor/rules/workflows/domain-definition.md` to check work guide
3. Check recommendations:
   - Check requirements specification

   If not met, display:
```

💡 Recommendation

Requirements specification has not been provided.

Potential issues if not completed:

- Domain definition may be incomplete
- Feature list may be missing

Would you provide the requirements specification? (y/n)
Or would you like to continue? (continue)

```
4. Proceed after user confirmation
5. Follow `domain-definition.md` process to perform work
6. Save output to path:
- `docs/domain-definition.md`
- `docs/page-structure.md`
- `docs/feature-list.md`
- (Optional) `docs/implementation-order.md`
7. Update `memory.md`:
- Add domain list
- Add page structure
- Initialize feature progress table
- Check checkbox: `[x] Domain definition`
```
