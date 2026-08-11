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
 * Standalone build config for sample-app/ (Unit 9, FR9) — deliberately
 * separate from vite.config.ts, which builds the publishable library in
 * `build.lib` mode. `npm run dev` uses vite.config.ts and works as-is once
 * index.html exists at the project root (build.lib only affects `vite
 * build`, not the dev server); this config is only for producing a static,
 * deployable build of the sample app itself via `npm run sample-app:build`.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-sample-app',
  },
})
