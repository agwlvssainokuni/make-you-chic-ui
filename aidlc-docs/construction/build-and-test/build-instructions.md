# Build Instructions

## Prerequisites
- **Build Tool**: Vite 5.4 (via `vite build`) + TypeScript 5.6 (via `tsc -b`)
- **Runtime**: Node.js 20.13+ (native ESM, `import.meta.env`). Verified against Node v26.5.0.
- **Dependencies**: see `package.json` — React 18, TypeScript, Vite, Vitest, Testing Library, vitest-axe, fast-check, ESLint, Prettier, stylelint (full list in `package.json`)
- **Environment Variables**: None required
- **System Requirements**: No unusual requirements; a standard developer laptop is sufficient

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
