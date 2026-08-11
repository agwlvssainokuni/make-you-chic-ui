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
import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeProvider'
import { THEME_DEFAULTS } from './validation'

const noop = (): void => {
  if (import.meta.env?.DEV) {
    console.warn(
      '[web-design-system-sample] useTheme() setter called outside of <ThemeProvider>. This call was ignored.',
    )
  }
}

/** Fallback value returned when useTheme() is called outside <ThemeProvider> (fail-soft). */
const fallbackValue: ThemeContextValue = {
  ...THEME_DEFAULTS,
  setTheme: noop,
  setBrand: noop,
  setFontFamily: noop,
  setFontSize: noop,
}

/**
 * Returns the current theme state and setters. Safe to call outside of
 * `<ThemeProvider>`: in that case it logs a dev-only warning and returns a
 * no-op fallback rather than throwing (see NFR Requirements: fail-soft).
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx === null) {
    if (import.meta.env?.DEV) {
      console.warn(
        '[web-design-system-sample] useTheme() was called outside of <ThemeProvider>. Returning default (non-reactive) values.',
      )
    }
    return fallbackValue
  }
  return ctx
}
