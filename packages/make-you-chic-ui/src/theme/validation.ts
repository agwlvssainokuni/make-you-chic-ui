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
 */
import type { ThemeAxis, ThemeState } from './types'

/** Valid values per theme axis (requirements: business-rules.md). */
export const THEME_VALID_VALUES: { [K in ThemeAxis]: ReadonlyArray<ThemeState[K]> } = {
  theme: ['light', 'dark'],
  brand: ['blue', 'green', 'purple', 'orange'],
  fontFamily: ['sans', 'serif'],
  fontSize: ['sm', 'md', 'lg'],
}

/** Default value per axis when no persisted value exists (business-rules.md). */
export const THEME_DEFAULTS: ThemeState = {
  theme: 'light',
  brand: 'blue',
  fontFamily: 'sans',
  fontSize: 'md',
}

/**
 * Validates that `value` is one of the allowed values for `axis`.
 * Shared by both write-time (setters) and read-time (initial load from
 * localStorage) validation, per NFR Design decision.
 */
export function isValidThemeValue<K extends ThemeAxis>(
  axis: K,
  value: unknown,
): value is ThemeState[K] {
  const allowed: ReadonlyArray<unknown> = THEME_VALID_VALUES[axis]
  return typeof value === 'string' && allowed.includes(value)
}

/**
 * Resolves the initial value for a given axis: persisted value if present
 * and valid, otherwise the axis default. The `theme` axis additionally
 * falls back to `prefers-color-scheme` before the hardcoded default.
 */
export function resolveInitialThemeValue<K extends ThemeAxis>(
  axis: K,
  persisted: string | null,
  prefersDark: boolean,
): ThemeState[K] {
  if (isValidThemeValue(axis, persisted)) {
    return persisted
  }
  if (axis === 'theme') {
    return (prefersDark ? 'dark' : 'light') as ThemeState[K]
  }
  return THEME_DEFAULTS[axis]
}
