# `/workflow-e2e` Command

**When to use**: During E2E testing work

**Reference File**: `@system-integration.md` (Part B)

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

**AI Execution Prompt**:

```
Please perform E2E testing work:

1. Read `.cursor/rules/workflows/memory.md` to check current status
2. Read `.cursor/rules/workflows/system-integration.md` to check work guide
3. Check recommendations:
   - System integration completed

   If not met, display:
```

💡 Recommendation

The following steps are not completed:

- System integration

Potential issues if not completed:

- E2E test results may be unstable
- Integration issues may be found

Would you like to continue? (y/n)

```
4. Proceed after user confirmation
5. Follow `system-integration.md` Part B process to perform work:
- Step 1: Propose E2E test flows
- Step 2: Write E2E tests
- Step 3: Run E2E tests
- Step 4: Handle failed tests
- Step 5: Final quality verification
- Step 6: Final approval
6. Save output to path:
- E2E tests: `e2e/`
- Documentation: `docs/deployment.md`
7. Update `memory.md`:
- Check checkbox: `[x] E2E testing`
```
