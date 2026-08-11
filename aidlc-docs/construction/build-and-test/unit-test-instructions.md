# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests

```bash
npm test
```

This runs `vitest run` (single pass, CI mode) across every `*.test.ts`/`*.test.tsx` file in the project — this includes every component under `src/components/**`, the theme engine (`src/theme/ThemeProvider.test.tsx`), pure-logic property-based tests (`src/components/Table/tableLogic.test.ts`), and the composed screen-pattern examples under `examples/**` (see `integration-test-instructions.md`; Vitest does not distinguish "unit" vs "integration" test files by location — they all run in this one command).

For interactive re-runs during development, use `npm run test:watch` instead.

### 2. Review Test Results

- **Expected**: 196 tests pass across 28 test files, 0 failures
- **Test Coverage**: No coverage threshold is enforced (no `--coverage` flag configured); coverage tooling was not part of the approved NFR scope for this project
- **Test Report Location**: Console output only (no coverage/report file is written by the current `test` script)

Each component's test file covers, at minimum: core rendering/behavior, keyboard interaction where applicable, and an axe accessibility scan (`vitest-axe`'s `toHaveNoViolations()`). `src/components/Table/tableLogic.test.ts` additionally uses `fast-check` for property-based tests of the pure sort/pagination/selection logic (per PBT-02/03/07/08/09, the subset of Property-Based Testing rules enforced per `aidlc-state.md`'s Extension Configuration).

### 3. Fix Failing Tests

If tests fail:

1. Review the failing test's output in the console — Vitest prints the assertion diff and a stack trace pointing at the exact `it(...)` block
2. Reproduce in isolation with `npx vitest run <path-to-file>` to iterate faster
3. Identify whether the failure is a real component defect, a test-authoring mistake (e.g. an assumption about DOM order that doesn't match the implementation), or a test-environment/tooling issue (see `build-instructions.md`'s Troubleshooting section for the `window.localStorage` case encountered here)
4. Fix the root cause — for environment/tooling issues, prefer fixing the environment (e.g. `vitest.setup.ts`, `NODE_OPTIONS`) over rewriting tests to work around a symptom
5. Rerun `npm test` until all pass

## Notable Fixes Applied During This Stage

Running the full suite for the first time (post Unit 8) surfaced 23 failing tests across 7 files. All were diagnosed and fixed; the fixes are relevant background for anyone touching these areas again:

- **Missing DOM cleanup between tests**: `vitest.setup.ts` now explicitly registers `afterEach(() => cleanup())` from `@testing-library/react`, rather than relying on its automatic-cleanup detection. This was masked by the `localStorage` issue below (a throwing local `afterEach` in `AppShell.test.tsx` was preventing the global cleanup hook from running), which produced misleading symptoms (`getMultipleElementsFoundError`, duplicate `landmark-no-duplicate-banner`/`landmark-no-duplicate-main` axe violations).
- **`window.localStorage` undefined under Node 20.13+**: see `build-instructions.md` Troubleshooting. Fixed via `NODE_OPTIONS=--no-experimental-webstorage` in the `test`/`test:watch` npm scripts.
- **`axe()` timing out under fake timers**: `Toast.test.tsx` and `Tooltip.test.tsx` use `vi.useFakeTimers()` for their delay/auto-dismiss logic, but `vitest-axe`'s `axe()` relies on real async timing internally and never resolves while fake timers are active. Fixed by calling `vi.useRealTimers()` immediately before the `axe()` call in each file's accessibility test.
- **axe "region" rule false positive on portaled fragments**: `Dropdown.test.tsx` and `Tooltip.test.tsx` scan `document.body` (since their content portals outside the RTL-returned container), which trips axe's `region` rule ("all page content must be in a landmark") — a whole-page completeness check that doesn't apply when testing an isolated component fragment with no surrounding page structure. Fixed by passing `{ rules: { region: { enabled: false } } }` to `axe()` in those two tests.
- **Modal initial-focus test asserted the wrong element**: `Modal.tsx` always renders a header close button before the body content, so it is legitimately first in DOM order and correctly receives initial focus by default — the test's expectation that a body child would receive focus was incorrect, not the component. The test was corrected to assert focus on `modal-close-button`, and a second test was added to verify the `initialFocusRef` override path (which is how a caller opts into focusing a different element).
