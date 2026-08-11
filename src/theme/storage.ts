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
 */
import type { ThemeAxis } from './types'

/**
 * localStorage key per theme axis. Kept as separate keys (rather than one
 * combined JSON blob) so that `storage` events can be resolved to a single
 * axis without re-parsing/diffing a combined payload (see NFR Design:
 * multi-tab sync, business-rules.md).
 */
export const THEME_STORAGE_KEYS: Record<ThemeAxis, string> = {
  theme: 'design-system-theme',
  brand: 'design-system-brand',
  fontFamily: 'design-system-font-family',
  fontSize: 'design-system-font-size',
}

/**
 * Reads a value from localStorage, swallowing any exception thrown by
 * restricted environments (private browsing, disabled storage, quota
 * errors). Returns null on any failure so callers can fall back to a
 * default value.
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Writes a value to localStorage, swallowing any exception. Persistence is
 * best-effort only; callers must not assume the write succeeded.
 */
export function safeLocalStorageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Persistence failed; the in-memory state update already happened in
    // the caller, so the app keeps working for this session.
  }
}
