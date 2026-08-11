# Build Instructions

## Prerequisites

- **Build Tool**: Vite 8.2 (via `vite build`) + TypeScript 6.0 (via `tsc -b`)
- **Runtime**: Node.js 20.13+ (native ESM, `import.meta.env`). Verified against Node v26.5.0.
- **Dependencies**: see `package.json` — React 19, TypeScript, Vite, Vitest, Testing Library, vitest-axe, fast-check, oxlint, ESLint, Prettier, stylelint (full list in `package.json`)
- **Environment Variables**: None required
- **System Requirements**: No unusual requirements; a standard developer laptop is sufficient

## Dependency Version Notes (as of the 2026-08-11 dependency refresh)

All dependencies were bumped to their latest available versions (`npx npm-check-updates -u`, then a clean `rm -rf node_modules package-lock.json && npm install`), with two deliberate exceptions where "latest" is not yet usable together:

- **TypeScript pinned to `^6.0.3`, not the newer `7.x` line**: `@typescript-eslint` (both `parser` and `eslint-plugin`, at their latest `8.67.0`) declares a peer range of `typescript: '>=4.8.4 <6.1.0'` and fails to install against TypeScript 7. `6.0.3` is the newest version both packages actually support.
- **ESLint pinned to `^9.39.5`, not the newer `10.x` line**: `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` (their latest available versions) both cap their peer range at ESLint 9 (`^3 || ... || ^9` / `^9.7`). ESLint 9 also made flat config (`eslint.config.js`) the default, replacing the legacy `.eslintrc.cjs` — the config was migrated accordingly (see `eslint.config.js`, built with `@eslint/eslintrc`'s `FlatCompat` to keep reusing the existing plugin preset list).

**Security note**: `npm-check-updates` initially proposed `eslint-config-prettier@^10.1.8`. This package had a real supply-chain compromise on 2026-07-18 (a maintainer account was used to publish malicious versions `8.10.1`, `9.1.1`, `10.1.6`, `10.1.7` within minutes of each other); the maintainers published clean versions (`8.10.2`, `9.1.2`, `10.1.8`) within hours the same day. `10.1.8` is confirmed clean and is pinned as an **exact** version (no `^`) rather than a range, specifically so a future `npm install` can never silently resolve to one of the compromised patch versions below it. `npm audit` reports 0 vulnerabilities against the installed tree.

Two other pre-existing issues surfaced only once actually testing against the new toolchain (not install-time failures):

- `tsconfig.json`'s `baseUrl`/`paths` (`@/*` alias) were removed: TypeScript 6 deprecates `baseUrl` (removal planned for 7.0), and the alias was never actually used anywhere in the source, so this is a straight deletion rather than a migration.
- `eslint-plugin-react-hooks` jumped from `4.6.2` to `7.1.1` (three major versions), which added the new `react-hooks/refs` rule (part of the React Compiler-aligned rule set). This caught one genuine issue — `src/utils/useControllableState.ts` was reading/writing a ref directly in the render body for a dev-only mismatch warning, restructured into a `useEffect` — and two false positives on the `cloneElement(child, { ref: (node) => { ... } })` pattern used by `Dropdown.tsx`/`Tooltip.tsx` (the callback only ever runs at commit time, not render time; the rule cannot statically verify that through `cloneElement`), suppressed with a scoped `eslint-disable-next-line react-hooks/refs` and an explanatory comment at each site.

**Build output filename changed**: Vite 8's library-mode CSS output is now named after the library (`dist/web-design-system-sample.css`) rather than the previous generic `dist/style.css`. `docs/integration-guide.md`'s import example was updated to match.

**Prettier reformatted the whole tree**: the version bump (`3.3.3` → `3.9.6`) changed some formatting heuristics (e.g. long ternary line-wrapping) enough that `npm run format:check` failed across ~110 files project-wide on the new version. All changes were purely cosmetic (verified via `git diff` on a sample before applying broadly); `npm run format` was run once to bring the whole tree back to a clean `format:check` state. Note that Prettier's CSS formatting does not preserve blank lines between adjacent one-line rules the way `stylelint-config-standard`'s `rule-empty-line-before` requires — if `npm run format` and `stylelint --fix` are both run, run `stylelint --fix` last so its formatting wins on `.css` files.

## Linting Toolchain (as of the 2026-08-11 oxlint migration)

`npm run lint` runs `oxlint . && eslint .` — a hybrid setup, not a full replacement:

- **oxlint** (`.oxlintrc.json`) handles almost everything: core JS correctness, and explicit rule-by-rule equivalents of `@typescript-eslint/recommended`, `eslint-plugin-react/recommended`, and `eslint-plugin-jsx-a11y/recommended`. Rules are listed individually rather than via broad category flags, so the config doesn't silently pick up unrelated rules on an oxlint upgrade. One default-category rule (`jsx_a11y/prefer-tag-over-role`) is explicitly turned off — see the comment in `.oxlintrc.json` for why (it would suggest replacing the custom `Modal`/`Toast` implementations with native `<dialog>`/`<output>`, which are semantically/behaviorally different from what's actually built and already axe-tested).
- **ESLint** (`eslint.config.js`) is scoped to `eslint-plugin-react-hooks` only. Verified rule-by-rule against oxlint's rule catalog (see `git log` for the investigation): oxlint reimplements only 2 of `react-hooks/recommended`'s 16 rules (`rules-of-hooks`, `exhaustive-deps`); the other 14 — including `refs`, which caught a genuine bug in this project (see the Dependency Version Notes above) — have no oxlint equivalent yet. Rather than split the 16 rules across both tools (fragile if oxlint's coverage changes), ESLint keeps the full `react-hooks/recommended` set.
- Suppression comments must use the tool that owns the rule: `// oxlint-disable-next-line <rule>` for anything in `.oxlintrc.json` (e.g. `jsx_a11y/no-autofocus`), `// eslint-disable-next-line <rule>` for `react-hooks/*` rules. Mixing them up produces an ESLint "rule definition not found" error, since ESLint validates every `eslint-disable` comment it encounters even for rules it no longer has loaded.
- oxlint is dramatically faster in practice on this codebase: ~0.4s vs. ~1.8s for the (now much smaller) ESLint pass.

## Build Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

No environment configuration is required. One Node.js runtime quirk needed a workaround — see Troubleshooting below and `package.json`'s `test`/`test:watch` scripts.

### 3. Build All Units

This is a single npm package (not a multi-service project), so there is one build command for the whole library:

```bash
npm run build
```

This runs `tsc -b` (project-wide type-check, no emit for the library itself beyond declaration files) followed by `vite build` (bundles `src/index.ts` to `dist/`).

### 4. Verify Build Success

- **Expected Output**: `tsc -b` prints nothing on success (0 errors); `vite build` prints a chunk size summary and `✓ built in <time>`.
- **Build Artifacts**:
  - `dist/web-design-system-sample.es.js` (ESM bundle)
  - `dist/web-design-system-sample.umd.js` (UMD bundle)
  - `dist/style.css` (bundled component CSS)
- **Common Warnings**: Vite prints `"../fonts/noto-sans-jp-*.woff2 referenced ... didn't resolve at build time, it will remain unchanged"` for each font file referenced in `src/theme/fonts.css`. This is expected: font files are not bundled into the package by design — see the "manual font hosting" limitation in `docs/integration-guide.md`. It is not a build failure.

## Troubleshooting

### `npx vitest run` fails with `TypeError: Cannot read properties of undefined (reading 'clear')` on `window.localStorage`

- **Cause**: Node.js 20.13+ defines a native global `localStorage` property (Web Storage API), but it is `undefined` unless the process is started with `--localstorage-file`. Vitest's jsdom environment adapter only proxies jsdom's own (working) `window.localStorage` onto the global scope when the global doesn't already define that key — since Node's own broken global wins the check, jsdom's `localStorage` never gets attached, and every `window.localStorage` access in tests resolves to Node's non-functional native property instead of jsdom's.
- **Solution**: Run tests with `NODE_OPTIONS=--no-experimental-webstorage` so Node's native `localStorage` global is not defined, letting Vitest correctly fall through to jsdom's implementation. This is already wired into the `test`/`test:watch` npm scripts in `package.json` — no action needed when running via `npm test`. Only relevant if invoking `vitest` directly without going through the npm script.

### Build fails with dependency errors

- **Cause**: `node_modules` out of sync with `package-lock.json` (e.g. after pulling changes that touch dependencies).
- **Solution**: Re-run `npm install`; if still broken, `rm -rf node_modules && npm install`.

### Build fails with compilation errors

- **Cause**: A type error was introduced, or a `.d.ts` augmentation (e.g. `src/types/vitest-axe-matchers.d.ts`) was moved/renamed such that TypeScript's module resolution no longer picks it up correctly.
- **Solution**: Run `npx tsc --noEmit -p tsconfig.json` directly for the full diagnostic list. If the error concerns a module named the same as an npm package (e.g. a project file shadowing `vitest-axe`), check for `baseUrl`-relative same-named files — see the explanatory comment at the top of `src/types/vitest-axe-matchers.d.ts` for the exact failure mode encountered during this project's own Build and Test stage.
