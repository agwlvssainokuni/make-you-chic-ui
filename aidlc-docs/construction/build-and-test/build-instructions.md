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
- **ESLint was originally pinned to `^9.39.5`, not the `10.x` line**: at the time, `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` (then still direct dependencies) capped their peer range at ESLint 9 (`^3 || ... || ^9` / `^9.7`). ESLint 9 also made flat config (`eslint.config.js`) the default, replacing the legacy `.eslintrc.cjs` — the config was migrated accordingly. After the 2026-08-11 oxlint migration removed both of those packages (see "Linting Toolchain" above), the remaining ESLint dependencies (`@typescript-eslint/parser`, `eslint-plugin-react-hooks`) turned out to already support ESLint 10, so a follow-up dependency refresh bumped it to `^10.8.1`. `eslint.config.js` was simplified in the same move (no longer needs `@eslint/eslintrc`'s `FlatCompat`, since it's now just a plain flat-config array registering `eslint-plugin-react-hooks` directly).
- **TypeScript stays pinned to `^6.0.3`**: `@typescript-eslint/parser` (still a dependency, for TSX parsing) requires `typescript: '>=4.8.4 <6.1.0'`, and `6.0.3` remains the latest version in that range as of this writing.

**Security note**: `npm-check-updates` initially proposed `eslint-config-prettier@^10.1.8`. This package had a real supply-chain compromise on 2026-07-18 (a maintainer account was used to publish malicious versions `8.10.1`, `9.1.1`, `10.1.6`, `10.1.7` within minutes of each other); the maintainers published clean versions (`8.10.2`, `9.1.2`, `10.1.8`) within hours the same day. `10.1.8` is confirmed clean and is pinned as an **exact** version (no `^`) rather than a range, specifically so a future `npm install` can never silently resolve to one of the compromised patch versions below it. `npm audit` reports 0 vulnerabilities against the installed tree.

Two other pre-existing issues surfaced only once actually testing against the new toolchain (not install-time failures):

- `tsconfig.json`'s `baseUrl`/`paths` (`@/*` alias) were removed: TypeScript 6 deprecates `baseUrl` (removal planned for 7.0), and the alias was never actually used anywhere in the source, so this is a straight deletion rather than a migration.
- `eslint-plugin-react-hooks` jumped from `4.6.2` to `7.1.1` (three major versions), which added the new `react-hooks/refs` rule (part of the React Compiler-aligned rule set). This caught one genuine issue — `src/utils/useControllableState.ts` was reading/writing a ref directly in the render body for a dev-only mismatch warning, restructured into a `useEffect` — and two false positives on the `cloneElement(child, { ref: (node) => { ... } })` pattern used by `Dropdown.tsx`/`Tooltip.tsx` (the callback only ever runs at commit time, not render time; the rule cannot statically verify that through `cloneElement`), suppressed with a scoped `eslint-disable-next-line react-hooks/refs` and an explanatory comment at each site.

**Build output filename changed**: Vite 8's library-mode CSS output is now named after the library (`dist/web-design-system-sample.css`) rather than the previous generic `dist/style.css`. `docs/integration-guide.md`'s import example was updated to match. (Superseded 2026-08-12 — see "Build output filenames simplified to index.\*" below.)

**Type declarations added (2026-08-12)**: `vite build` (library mode) does not emit `.d.ts` files on its own, and `tsconfig.json` sets `noEmit: true`, so `dist/` previously shipped zero type information — a review finding once someone actually tried consuming the built package from TypeScript. Fixed by adding `vite-plugin-dts` (`^5.0.3`, built on `unplugin-dts`) to `vite.config.ts`'s `plugins`, scoped to `include: ['src']` with `src/**/*.test.{ts,tsx}` and the ambient `src/types/vitest-axe-matchers.d.ts` excluded (the latter is test-only global augmentation, not part of the public API). `package.json` gained `types`/`main`/`module`/`exports` fields pointing at the `dist/` outputs. The plugin's `bundleTypes` option (single-file `.d.ts` bundling) was deliberately left off — it requires an additional `@microsoft/api-extractor` dependency, and this repository is explicitly a prototype/reference, not something published to npm (see `requirements.md`), so the per-module `.d.ts` tree that `vite-plugin-dts` emits by default is sufficient.

**Build output filenames simplified to `index.*` (2026-08-12)**: previously each format's output file repeated the package name (`web-design-system-sample.es.js` / `.umd.js` / `.css`), a naming style suited to CDN/UMD-global-oriented distribution. Since this package has a single entry point (`src/index.ts`), is never published to npm/a CDN, and consumers resolve it purely through `package.json`'s `exports` field, the package-name-prefixed filenames were unnecessary repetition. Also, the `require` condition in `exports` was pointing at the UMD build rather than a real CommonJS build, which is non-standard. Changed `vite.config.ts`'s `build.lib` to: drop the `umd` format (no CDN/`<script>`-tag use case exists for this repo) and the now-unneeded `name` option (only required for `umd`/`iife`), keep `formats: ['es', 'cjs']`, and set `fileName`/`cssFileName` so outputs are `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.css`, alongside `dist/index.d.ts`. `package.json`'s `main`/`module`/`exports` and `docs/integration-guide.md`'s CSS import example were updated to match.

**`files` field added after an `npm pack` dry run surfaced a packaging bug (2026-08-12)**: `package.json` had neither a `files` field nor an `.npmignore`, so `npm pack`/`npm publish` fell back to respecting `.gitignore` — which excludes `dist/` (it's a build artifact, correctly gitignored for version control purposes, but that's the exact directory the package needs to ship). The result: a real `npm pack` produced a 5.1MB, 280-file tarball containing `src/`, `examples/`, `sample-app/`, `aidlc-docs/`, `.idea/`, `CLAUDE.md`, and every config file — but **not** `dist/`, meaning the packed tarball had no working code at all despite being mostly source. Fixed by adding `"files": ["dist"]` to `package.json` (npm always includes `package.json`/`LICENSE` regardless of `files`). Re-verified with a real `npm pack` + fresh consumer project (`npm install <tarball>`, then `import`-ing components, `tsc --noEmit`, `vite build`, and a `vite` dev server smoke test via `curl`): tarball dropped to 42.5kB/72 files (`dist/` + `LICENSE` + `package.json` only), and the consumer app resolved, type-checked, and rendered `Button`/`ThemeProvider` correctly through both `web-design-system` and the `web-design-system/style.css` export subpath.

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

This runs `tsc -b` (project-wide type-check, no emit) followed by `vite build`, which bundles `src/index.ts` to `dist/` and (via the `vite-plugin-dts` plugin configured in `vite.config.ts`) emits `.d.ts` declaration files mirroring the `src/` module structure.

### 4. Verify Build Success

- **Expected Output**: `tsc -b` prints nothing on success (0 errors); `vite build` prints two `[unplugin:dts] Declaration files built in <time>ms` lines (once per format target) plus a chunk size summary and `✓ built in <time>`.
- **Build Artifacts**:
  - `dist/index.js` (ESM bundle)
  - `dist/index.cjs` (CommonJS bundle)
  - `dist/index.css` (bundled component CSS)
  - `dist/index.d.ts` + per-module `.d.ts` files under `dist/components/`, `dist/theme/`, `dist/utils/` — `package.json`'s `types` field points at `dist/index.d.ts` (added 2026-08-12; previously the build produced no type declarations at all, so consumers got no editor/type-check support — see Dependency Version Notes below)
- Font files are no longer referenced from any file the library build processes (FR8: fonts are a consumer-side `@fontsource/*` import, not bundled by this package), so no font-related warnings are expected during `npm run build`.

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
