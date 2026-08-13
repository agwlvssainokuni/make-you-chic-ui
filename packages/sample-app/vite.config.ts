/**
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
 * The `make-you-chic-ui` alias below points at the sibling package's source
 * (not its `dist/`) so `npm run dev` / `npm run build` here never require a
 * prior library build. This mirrors the same alias in vitest.config.ts and
 * the `paths` entry in tsconfig.json (type-checking needs its own mapping
 * since it doesn't go through Vite's resolver).
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'make-you-chic-ui': path.resolve(import.meta.dirname, '../make-you-chic-ui/src/index.ts'),
    },
  },
})
