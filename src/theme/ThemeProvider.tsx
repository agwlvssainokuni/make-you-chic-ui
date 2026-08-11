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
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeState, ThemeMode, ThemeBrand, ThemeFontFamily, ThemeFontSize } from './types';
import { THEME_STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from './storage';
import { resolveInitialThemeValue } from './validation';

export interface ThemeContextValue extends ThemeState {
  setTheme: (value: ThemeMode) => void;
  setBrand: (value: ThemeBrand) => void;
  setFontFamily: (value: ThemeFontFamily) => void;
  setFontSize: (value: ThemeFontSize) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefersDarkColorScheme(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readInitialState(): ThemeState {
  const prefersDark = prefersDarkColorScheme();
  return {
    theme: resolveInitialThemeValue(
      'theme',
      safeLocalStorageGet(THEME_STORAGE_KEYS.theme),
      prefersDark,
    ),
    brand: resolveInitialThemeValue(
      'brand',
      safeLocalStorageGet(THEME_STORAGE_KEYS.brand),
      prefersDark,
    ),
    fontFamily: resolveInitialThemeValue(
      'fontFamily',
      safeLocalStorageGet(THEME_STORAGE_KEYS.fontFamily),
      prefersDark,
    ),
    fontSize: resolveInitialThemeValue(
      'fontSize',
      safeLocalStorageGet(THEME_STORAGE_KEYS.fontSize),
      prefersDark,
    ),
  };
}

function applyAttribute(name: string, value: string, omitWhen?: string): void {
  const html = document.documentElement;
  if (omitWhen !== undefined && value === omitWhen) {
    html.removeAttribute(name);
  } else {
    html.setAttribute(name, value);
  }
}

/** Reflects the full ThemeState onto <html> data-* attributes (FR3). */
function applyThemeToDocument(state: ThemeState): void {
  // data-theme is omitted entirely for 'light' so CSS can treat light as the
  // attribute-less default (see semantic.css).
  applyAttribute('data-theme', state.theme, 'light');
  applyAttribute('data-brand', state.brand);
  applyAttribute('data-font-family', state.fontFamily);
  applyAttribute('data-font-size', state.fontSize);
}

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Owns the theme4-axis state (theme/brand/fontFamily/fontSize), persists it
 * to localStorage, reflects it onto <html> data-* attributes, and keeps
 * multiple tabs in sync via the `storage` event. See:
 * aidlc-docs/construction/unit1-foundation/functional-design/business-logic-model.md
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const [state, setState] = useState<ThemeState>(readInitialState);

  // Reflect the current state onto <html> whenever it changes (including
  // the very first render).
  useEffect(() => {
    applyThemeToDocument(state);
  }, [state]);

  // Multi-tab sync: another tab changing localStorage updates this tab's
  // state without writing back to localStorage (avoids feedback loops).
  useEffect(() => {
    function handleStorage(event: StorageEvent): void {
      if (event.storageArea !== window.localStorage) return;

      for (const [axis, key] of Object.entries(THEME_STORAGE_KEYS) as [
        keyof ThemeState,
        string,
      ][]) {
        if (event.key !== key) continue;
        const prefersDark = prefersDarkColorScheme();
        const nextValue = resolveInitialThemeValue(axis, event.newValue, prefersDark);
        setState((prev) => ({ ...prev, [axis]: nextValue }));
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = useCallback((value: ThemeMode) => {
    setState((prev) => ({ ...prev, theme: value }));
    safeLocalStorageSet(THEME_STORAGE_KEYS.theme, value);
  }, []);

  const setBrand = useCallback((value: ThemeBrand) => {
    setState((prev) => ({ ...prev, brand: value }));
    safeLocalStorageSet(THEME_STORAGE_KEYS.brand, value);
  }, []);

  const setFontFamily = useCallback((value: ThemeFontFamily) => {
    setState((prev) => ({ ...prev, fontFamily: value }));
    safeLocalStorageSet(THEME_STORAGE_KEYS.fontFamily, value);
  }, []);

  const setFontSize = useCallback((value: ThemeFontSize) => {
    setState((prev) => ({ ...prev, fontSize: value }));
    safeLocalStorageSet(THEME_STORAGE_KEYS.fontSize, value);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...state, setTheme, setBrand, setFontFamily, setFontSize }),
    [state, setTheme, setBrand, setFontFamily, setFontSize],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
