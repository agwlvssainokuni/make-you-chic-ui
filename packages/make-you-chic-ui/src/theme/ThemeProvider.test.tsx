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
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'
import { THEME_STORAGE_KEYS } from './storage'

function Probe() {
  const { theme, brand, setTheme, setBrand } = useTheme()
  return (
    <div>
      <span data-testid="theme-probe-theme">{theme}</span>
      <span data-testid="theme-probe-brand">{brand}</span>
      <button data-testid="theme-probe-set-dark" onClick={() => setTheme('dark')}>
        dark
      </button>
      <button data-testid="theme-probe-set-green" onClick={() => setBrand('green')}>
        green
      </button>
    </div>
  )
}

describe('ThemeProvider / useTheme', () => {
  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-brand')
    document.documentElement.removeAttribute('data-font-family')
    document.documentElement.removeAttribute('data-font-size')
    vi.restoreAllMocks()
  })

  it('initializes with defaults and reflects them on <html>', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme-probe-theme')).toHaveTextContent('light')
    expect(screen.getByTestId('theme-probe-brand')).toHaveTextContent('blue')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull() // light omitted
    expect(document.documentElement.getAttribute('data-brand')).toBe('blue')
  })

  it('updates state, <html> attributes, and localStorage when a setter is called', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    act(() => {
      screen.getByTestId('theme-probe-set-dark').click()
    })

    expect(screen.getByTestId('theme-probe-theme')).toHaveTextContent('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEYS.theme)).toBe('dark')
  })

  it('falls back to a persisted valid value on initial load', () => {
    window.localStorage.setItem(THEME_STORAGE_KEYS.brand, 'purple')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme-probe-brand')).toHaveTextContent('purple')
  })

  it('ignores a corrupt persisted value and falls back to the default', () => {
    window.localStorage.setItem(THEME_STORAGE_KEYS.brand, 'not-a-real-brand')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme-probe-brand')).toHaveTextContent('blue')
  })

  it('syncs state when another tab changes localStorage (storage event)', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    act(() => {
      window.localStorage.setItem(THEME_STORAGE_KEYS.brand, 'orange')
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: THEME_STORAGE_KEYS.brand,
          newValue: 'orange',
          storageArea: window.localStorage,
        }),
      )
    })

    expect(screen.getByTestId('theme-probe-brand')).toHaveTextContent('orange')
  })

  it('does not throw and keeps working when localStorage.setItem fails', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(() => {
      act(() => {
        screen.getByTestId('theme-probe-set-green').click()
      })
    }).not.toThrow()
    expect(screen.getByTestId('theme-probe-brand')).toHaveTextContent('green')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('useTheme outside of ThemeProvider', () => {
  it('returns fallback defaults instead of throwing', () => {
    function Standalone() {
      const { theme } = useTheme()
      return <span data-testid="standalone-theme">{theme}</span>
    }
    expect(() => render(<Standalone />)).not.toThrow()
    expect(screen.getByTestId('standalone-theme')).toHaveTextContent('light')
  })
})
