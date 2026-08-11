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
import { describe, it, expect, afterEach, vi } from 'vitest'
import { safeLocalStorageGet, safeLocalStorageSet, THEME_STORAGE_KEYS } from './storage'

describe('safeLocalStorageGet / safeLocalStorageSet', () => {
  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('writes and reads back a value under normal conditions', () => {
    safeLocalStorageSet(THEME_STORAGE_KEYS.theme, 'dark')
    expect(safeLocalStorageGet(THEME_STORAGE_KEYS.theme)).toBe('dark')
  })

  it('returns null when the key has never been set', () => {
    expect(safeLocalStorageGet('nonexistent-key')).toBeNull()
  })

  it('returns null instead of throwing when localStorage.getItem throws', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked')
    })
    expect(() => safeLocalStorageGet(THEME_STORAGE_KEYS.theme)).not.toThrow()
    expect(safeLocalStorageGet(THEME_STORAGE_KEYS.theme)).toBeNull()
  })

  it('does not throw when localStorage.setItem throws (e.g. quota exceeded)', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    expect(() => safeLocalStorageSet(THEME_STORAGE_KEYS.theme, 'dark')).not.toThrow()
  })
})
