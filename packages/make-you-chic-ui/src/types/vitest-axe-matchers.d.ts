/*
 * Copyright 2026 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * vitest-axe@0.1.0 ships its matcher types using the legacy `Vi` global
 * namespace augmentation, which Vitest 2.x no longer picks up (Vitest 2.x
 * uses `declare module 'vitest'`, see @testing-library/jest-dom/vitest for
 * comparison). This file re-declares the same augmentation using the
 * current mechanism so `toHaveNoViolations()` type-checks; the runtime
 * matcher registration in vitest.setup.ts is unaffected.
 *
 * NOTE: this file must NOT be named `vitest-axe.d.ts` at the project root —
 * with `baseUrl: "."` set, TypeScript's bundler module resolution matches
 * bare specifiers against baseUrl-relative files before falling back to
 * node_modules, so a root-level `vitest-axe.d.ts` would shadow the real
 * `vitest-axe` package and break `import { axe } from 'vitest-axe'`
 * everywhere in the project. Keeping it under src/types/ with a distinct
 * filename avoids the collision.
 */
import 'vitest'
import type { AxeMatchers } from 'vitest-axe'

// These interfaces are intentionally empty: declaration merging (not a type
// alias) is required to augment vitest's own `Assertion`/
// `AsymmetricMatchersContaining` interfaces, and the `T` parameter must be
// kept to match the type parameter list of the interface being merged into.
/* oxlint-disable typescript/no-empty-object-type, no-unused-vars */
declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
/* oxlint-enable typescript/no-empty-object-type, no-unused-vars */
