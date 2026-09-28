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
import { describe, it, expect } from 'vitest'
import { contrastRatio, mixSrgb } from './contrast'

// Token values duplicated from tokens.css / semantic.css as of the WCAG AA
// contrast audit (candidates 1-3). CSS is the source of truth — if these
// values change there, update them here too, and re-check that the AA
// assertions below still hold.
const WHITE = '#ffffff'
const GRAY_900 = '#111827'
const SURFACE_LIGHT = '#ffffff'
const SURFACE_DARK = '#1f2937' // --gray-800
const COLOR_BG_LIGHT = '#fafafa'
const COLOR_BG_DARK = '#0b0f19' // --gray-950
const DANGER_SUBTLE_LIGHT = '#fef2f2'

const RED_500 = '#dc2626'
const RED_600 = '#b91c1c'
const RED_400 = '#f87171'
const GREEN_600 = '#16a34a'

const BRANDS = {
  blue: { 500: '#2563eb', 700: '#1e40af', 400: '#60a5fa' },
  purple: { 500: '#9333ea', 700: '#6b21a8', 400: '#c084fc' },
  green: { 500: '#16a34a', 700: '#166534', 400: '#4ade80' },
  orange: { 500: '#ea580c', 700: '#9a3412', 400: '#fb923c' },
} as const

const AA_TEXT = 4.5

describe('candidate 1: --color-primary-text on --color-primary (Button/Badge primary)', () => {
  it.each([
    ['blue', BRANDS.blue[500], WHITE],
    ['purple', BRANDS.purple[500], WHITE],
    ['green', BRANDS.green[500], GRAY_900],
    ['orange', BRANDS.orange[500], GRAY_900],
  ])('%s meets AA', (_brand, background, text) => {
    expect(contrastRatio(background, text)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('candidate 2: --color-primary-subtle-text on --color-primary-subtle (Avatar initials)', () => {
  it.each(Object.entries(BRANDS))('%s / light meets AA', (_brand, shades) => {
    const background = mixSrgb(shades[500], 12, SURFACE_LIGHT)
    expect(contrastRatio(background, shades[700])).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it.each(Object.entries(BRANDS))('%s / dark meets AA', (_brand, shades) => {
    const background = mixSrgb(shades[500], 12, SURFACE_DARK)
    expect(contrastRatio(background, shades[400])).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('candidate 2 (related): --color-danger-subtle-text on --color-danger-subtle (Alert danger)', () => {
  it('light meets AA', () => {
    expect(contrastRatio(DANGER_SUBTLE_LIGHT, RED_600)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('dark meets AA', () => {
    const background = mixSrgb(RED_500, 20, SURFACE_DARK)
    expect(contrastRatio(background, RED_400)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('candidate 3: --color-danger-text on --color-bg (FormField error text / required mark)', () => {
  it('light meets AA', () => {
    expect(contrastRatio(COLOR_BG_LIGHT, RED_500)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('dark meets AA', () => {
    expect(contrastRatio(COLOR_BG_DARK, RED_400)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('additional finding: --color-success-text on --color-success (Badge success)', () => {
  it('meets AA (not brand/theme dependent)', () => {
    expect(contrastRatio(GREEN_600, GRAY_900)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})
