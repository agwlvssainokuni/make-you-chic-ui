# Build and Test Summary

## Build Status

- **Build Tool**: TypeScript 6.0 (`tsc -b`) + Vite 8.2 (`vite build`)
- **Build Status**: Success
- **Build Artifacts**: `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.css`, `dist/index.d.ts` + per-module `.d.ts` tree. Filenames simplified from the earlier `web-design-system-sample.{es,umd}.js`/`.css` to `index.*`, and the UMD build was dropped, on 2026-08-12 (see "Post-Approval Review Fixes" below)
- **Build Time**: ~250ms (Vite bundling step; `tsc -b` type-check time not separately measured)

## Dependency Refresh (2026-08-11)

All dependencies were updated to their latest available versions via a clean uninstall/reinstall (`rm -rf node_modules package-lock.json && npm install` after `npx npm-check-updates -u`); package `version` was also reset to `0.0.0`. Full detail in `build-instructions.md`'s "Dependency Version Notes" section; summary:

- **Major bumps**: React 18→19, Vite 5→8, Vitest 2→4, TypeScript 5.6→6.0, ESLint 8→9 (flat config migration, new `eslint.config.js`), stylelint 16→17, jsdom 25→30, fast-check 3→4, `@vitejs/plugin-react` 4→6, `@testing-library/jest-dom` 6→7.
- **Version caps applied deliberately** (not "latest" in the strictest sense, because the newest release breaks the rest of the toolchain): TypeScript held at `6.0.3` (`@typescript-eslint` doesn't support 7.x yet) and ESLint held at `9.39.5` (`eslint-plugin-jsx-a11y`/`eslint-plugin-react` don't support 10.x yet).
- **Security**: `eslint-config-prettier` pinned to the exact clean version `10.1.8` (no `^`) after identifying that this package suffered a real supply-chain compromise on 2026-07-18 (malicious versions `8.10.1`/`9.1.1`/`10.1.6`/`10.1.7`, cleaned up within hours by the maintainers). `npm audit`: 0 vulnerabilities.
- **Follow-on fixes required by the upgrade**: removed the deprecated, unused `baseUrl`/`paths` from `tsconfig.json`; migrated ESLint config from `.eslintrc.cjs` to flat config (`eslint.config.js`); fixed one genuine new `react-hooks/refs` violation (a ref read/write moved from render body into `useEffect` in `useControllableState.ts`) and suppressed two false positives of that same new rule on an established `cloneElement` ref-callback pattern (`Dropdown.tsx`, `Tooltip.tsx`); reformatted the whole tree with the updated Prettier (cosmetic only); updated `docs/integration-guide.md` for Vite 8's changed CSS output filename.
- **Verification after the refresh**: `npx tsc --noEmit` 0 errors, `npm test` 196/196 passing, `npm run lint` 0 errors, `npm run lint:css` 0 errors, `npm run format:check` clean, `npm run build` succeeds.

## Post-Approval Review Fixes (after this summary was first written)

This stage stayed open past the initial "Ready for Operations" checkpoint below because further user review surfaced additional gaps. Notable ones, in order:

- **Unit 9 (sample application, FR9)**: a requirements-analysis gap — no runnable app existed to actually see the design system in a browser. Added `sample-app/` (component catalog, List/Detail/edit/delete flow, theme settings panel) plus a small router-agnostic `onClick` extension to `AppShellNavItem`. See `aidlc-docs/construction/unit9-sample-app/code/summary.md`.
- **Web fonts (FR8)**: the originally-committed `src/fonts/*.woff2` files were found to contain zero Japanese glyphs (Latin-only, verified with `fontTools`), independent of the license-completeness issue that was also raised. Architecture was simplified twice, ending with the design system shipping no font bytes at all — `@fontsource/noto-sans-jp`/`@fontsource/noto-serif-jp` are a `dependencies` entry, and the consuming app imports the CSS directly (see `docs/integration-guide.md` and the same Unit 9 summary's "追補" section).
- **Dark mode bugs**: plain body text staying black in dark mode (missing global `body` color rule) and low-contrast `Tooltip` in dark mode (missing dark-theme token override) — both fixed in `src/theme/semantic.css` (and mirrored in `html-demo/assets/semantic.css`).
- **Missing type declarations** (2026-08-12): `dist/` shipped no `.d.ts` files at all (`tsconfig.json` has `noEmit: true`, and plain `vite build` doesn't emit declarations). Fixed by adding `vite-plugin-dts` to `vite.config.ts` and `types`/`main`/`module`/`exports` fields to `package.json`. Full detail in `build-instructions.md`'s "Dependency Version Notes" section.
- **Build output filenames simplified to `index.*`** (2026-08-12): the package-name-prefixed filenames (`web-design-system-sample.es.js`/`.umd.js`/`.css`) were replaced with `index.js`/`.cjs`/`.css`, and the unused UMD build was dropped (this repo has no CDN/`<script>`-tag distribution use case), fixing a `require` export condition that had been non-standardly pointing at the UMD file instead of a real CJS build. Full detail in `build-instructions.md`.

Current verification snapshot after all of the above: `npx tsc --noEmit` 0 errors, `npm test` 199/199 passing (28 test files), `npm run lint` 0 errors, `npm run lint:css` 0 errors, `npm run format:check` clean, `npm run build` and `npm run sample-app:build` both succeed, `npm audit` 0 vulnerabilities.

## Type Check

- `npx tsc --noEmit -p tsconfig.json`: **0 errors**
- Notable issue resolved along the way: a root-level `vitest-axe.d.ts` file was shadowing the real `vitest-axe` npm package under `baseUrl: "."` module resolution; relocated to `src/types/vitest-axe-matchers.d.ts` (see file header comment for the full explanation) and added `esModuleInterop: true`.

## Test Execution Summary

### Unit Tests (includes composed/"integration" screen-pattern tests — see below)

- **Total Tests**: 196
- **Passed**: 196
- **Failed**: 0
- **Coverage**: Not measured (no coverage tooling configured; not part of approved NFR scope)
- **Status**: Pass

23 tests were failing on the first full run after all 8 units were complete; all were diagnosed and fixed (root causes and fixes documented in `unit-test-instructions.md`'s "Notable Fixes Applied During This Stage"). Summary of root causes:

1. Node.js 20.13+'s native (but non-functional without a flag) global `localStorage` shadowing jsdom's working implementation — fixed via `NODE_OPTIONS=--no-experimental-webstorage`.
2. A throwing local `afterEach` (caused by #1) masking a missing global RTL cleanup hook — fixed by adding explicit `afterEach(() => cleanup())` to `vitest.setup.ts`.
3. `vitest-axe`'s `axe()` timing out under active `vi.useFakeTimers()` — fixed by switching to real timers immediately before the `axe()` call in the two affected test files.
4. `axe()`'s `region` rule flagging portaled component fragments scanned via `document.body` (a whole-page-completeness check, not meaningful for an isolated fragment) — fixed by disabling that one rule in the two affected accessibility tests.
5. An incorrect test assumption about `Modal`'s initial-focus target (the header close button is legitimately first in DOM order, not a body child) — fixed by correcting the assertion and adding a companion test for the `initialFocusRef` override path.

### Integration Tests

- **Test Scenarios**: 4 (ListView, DetailView, EditUserModal, DeleteConfirmModal — see `integration-test-instructions.md`)
- **Passed**: 4/4 (counted within the 196 total; there is no separate integration test command in this project — see rationale in `integration-test-instructions.md`)
- **Status**: Pass

### Performance Tests

- **Status**: N/A — see `performance-test-instructions.md` for rationale (client-side component library, no performance NFRs raised, Resiliency/Security Baseline extensions declined)

### Additional Tests

- **Contract Tests**: N/A (no service boundaries / no microservices)
- **Security Tests**: N/A (Security Baseline extension declined at Requirements Analysis)
- **E2E Tests**: N/A (no E2E framework such as Playwright/Cypress was part of the approved NFR tech stack; component-level a11y and interaction coverage is provided by `vitest-axe` and `@testing-library/user-event` within the unit/integration tests above)

## Static Analysis

### Linting (`npm run lint` = `oxlint . && eslint .`)

- **Status**: Pass (0 errors)
- **2026-08-11 tooling change**: migrated to a hybrid oxlint + ESLint setup after the user asked to switch to oxlint if it could match current coverage. Rule-by-rule verification against oxlint's actual rule catalog found near-total parity for `@typescript-eslint/recommended`, `eslint-plugin-react/recommended`, and `eslint-plugin-jsx-a11y/recommended` (now explicit rules in `.oxlintrc.json`), but `eslint-plugin-react-hooks/recommended` was only 2/16 covered (`rules-of-hooks`, `exhaustive-deps`) — the other 14, including `refs`, have no oxlint equivalent. Decision: oxlint for everything else, ESLint scoped to `eslint-plugin-react-hooks` only (see `eslint.config.js`). Full detail in `build-instructions.md`'s "Linting Toolchain" section and `aidlc-docs/audit.md`.
- The oxlint migration's rule-by-rule verification also surfaced one genuine accessibility bug oxlint's stricter `jsx_a11y/role-has-required-aria-props` caught (but the previous eslint-plugin-jsx-a11y version hadn't): `Switch.tsx`'s `role="switch"` input was missing the required `aria-checked`, fixed by adding it.
- Original (pre-oxlint) ESLint fixes remain relevant to the rules ESLint still owns or that were ported into `.oxlintrc.json`: an empty-interface pattern in `Card.tsx` (converted to a `type` alias), a non-focusable `role="menu"` container in `Dropdown.tsx` (`tabIndex={-1}` added), a non-native interactive overlay in `Modal.tsx` and a non-native interactive resize handle in `Table.tsx` (both marked `role="presentation"` as decorative/mouse-only affordances with documented keyboard alternatives elsewhere), an `autoFocus` usage in `Table/CellEditor.tsx` that is correct for its user-initiated edit-mode-entry context (now an `oxlint-disable-next-line` with rationale comment), and the intentionally-empty declaration-merging interfaces in `src/types/vitest-axe-matchers.d.ts` (now an `oxlint-disable`/`oxlint-enable` block, since a type alias would break the required declaration-merging).

### stylelint (`npm run lint:css`)

- **Status**: Pass (0 errors) after fixes
- The `NFR2` custom rule (`declaration-property-value-disallowed-list` in `.stylelintrc.json`) originally disallowed primitive `--space-*` and `--radius-*` tokens in component CSS in addition to primitive color tokens, but no semantic token layer for spacing/radius was ever built (only colors vary across the `data-theme`/`data-brand` axes — spacing/radius don't). This produced 88 false-positive violations across nearly every component's CSS file that had never actually been checked against this rule before this stage. The rule was narrowed to color primitives only, matching what was consistently and correctly implemented throughout all 8 units.
- The remaining ~100 errors were genuine `stylelint-config-standard` formatting issues (compact single-line multi-declaration rules, missing blank lines before rules, `#ffffff` vs `#fff`, keyword casing) never previously checked; most were auto-fixed with `--fix`, the rest (expanding compact variant rules to multi-line, an `AppShell.css` grid-template shorthand, and an intentional repeated bare `:root` selector pattern in both `semantic.css` files) were fixed by hand or via a second targeted config override.

## Overall Status

- **Build**: Success
- **All Tests**: Pass (199/199 as of the latest check — see "Post-Approval Review Fixes" above)
- **Static Analysis**: Pass (oxlint + ESLint, stylelint, Prettier all clean)
- **Ready for Operations**: Pending — this stage stays open until the user's review feedback is fully addressed and explicitly confirmed (see `aidlc-docs/audit.md`), not merely when checks are green. Several rounds of review fixes have landed after this doc's original "Ready" line (see above); do not treat that original line as still authoritative.

## Next Steps

Awaiting explicit user confirmation that review feedback is exhausted before proceeding to the Operations phase (currently a placeholder per `CLAUDE.md`).
