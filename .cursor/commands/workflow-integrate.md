# `/workflow-integrate` Command

**When to use**: During system integration work

**Reference File**: `@system-integration.md` (Part A)

**Features**:

- Remove duplicate code
- Extract common modules
- Improve overall structure
- (Optional) Performance optimization
- Improve accessibility

**Recommendations**:

- All features implemented (or most core features completed)

**Usage**:

```
/workflow-integrate
```

**AI Execution Prompt**:

```
Please perform system integration work:

1. Read `.cursor/rules/workflows/memory.md` to check current status
2. Read `.cursor/rules/workflows/system-integration.md` to check work guide
3. Check recommendations:
   - All features implemented (or most core features completed)

   If not met, display:
```

💡 Recommendation

The following steps are not completed:

- Feature implementation (some incomplete)

Potential issues if not completed:

- Integration refactoring effectiveness may be limited
- May miss some duplicate code

Would you like to continue? (y/n)

```
4. Proceed after user confirmation
5. Follow `system-integration.md` Part A process to perform work:
- Step 1: Check API integration status
- Step 2: Analyze duplicate code
- Step 3: Extract common modules
- Step 4: Improve overall structure
- Step 5: Optimize performance (optional)
- Step 6: Improve accessibility
- Step 7: Supplement integration tests
- Step 8: Review integration
6. Save output to path:
- Common modules: `src/shared/utils/`, `src/shared/hooks/`, `src/shared/types/`
- Integration tests: `__tests__/integration/cross-domain/`
7. Update `memory.md`:
- Check checkbox: `[x] Integration and refactoring`
```
