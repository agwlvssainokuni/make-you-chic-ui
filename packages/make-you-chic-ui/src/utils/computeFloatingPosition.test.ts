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
import { computeFloatingPosition } from './computeFloatingPosition'

function rect(partial: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...partial,
  } as DOMRect
}

function setViewport(width: number, height: number): void {
  vi.stubGlobal('innerWidth', width)
  vi.stubGlobal('innerHeight', height)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('computeFloatingPosition', () => {
  it('places at the requested placement when it fits within the viewport', () => {
    setViewport(1024, 768)
    const trigger = rect({ top: 100, left: 100, right: 180, bottom: 130, width: 80, height: 30 })
    const floating = rect({ width: 160, height: 80 })
    expect(computeFloatingPosition(trigger, floating, 'bottom-start')).toEqual({
      top: 138,
      left: 100,
    })
  })

  it('flips to the opposite side when the initial placement would overflow the bottom edge', () => {
    setViewport(1024, 200)
    const trigger = rect({ top: 150, left: 100, right: 180, bottom: 180, width: 80, height: 30 })
    const floating = rect({ width: 160, height: 80 })
    // 'bottom' would start at 188 and overflow (viewport height 200); 'top' fits.
    const result = computeFloatingPosition(trigger, floating, 'bottom')
    expect(result.top).toBe(150 - 80 - 8)
  })

  it('clamps left into the viewport when a wide menu near the right edge still overflows after the flip', () => {
    setViewport(375, 800)
    // Trigger near the right edge; menu far wider than the remaining space.
    const trigger = rect({ top: 50, left: 300, right: 360, bottom: 80, width: 60, height: 30 })
    const floating = rect({ width: 320, height: 150 })
    const result = computeFloatingPosition(trigger, floating, 'bottom-end')
    // bottom-end: left = trigger.right - floating.width = 360 - 320 = 40 (already >= margin,
    // but left + width = 360 > viewport 375 - margin 8, so it must still clamp).
    expect(result.left).toBeGreaterThanOrEqual(8)
    expect(result.left + 320).toBeLessThanOrEqual(375 - 8)
  })

  it('clamps left into the viewport when the computed position would go negative', () => {
    setViewport(375, 800)
    const trigger = rect({ top: 50, left: 10, right: 70, bottom: 80, width: 60, height: 30 })
    const floating = rect({ width: 320, height: 150 })
    // bottom-start: left = trigger.left = 10, left + width = 330, fits within 375 - 8.
    // Use bottom-end instead to force a negative left: left = 70 - 320 = -250.
    const result = computeFloatingPosition(trigger, floating, 'bottom-end')
    expect(result.left).toBe(8)
  })

  it('pins to the top margin when the menu is taller than the viewport (best effort, cannot satisfy both margins)', () => {
    setViewport(1024, 100)
    const trigger = rect({ top: 40, left: 100, right: 180, bottom: 60, width: 80, height: 20 })
    const floating = rect({ width: 160, height: 90 })
    const result = computeFloatingPosition(trigger, floating, 'bottom')
    expect(result.top).toBe(8)
  })

  it('clamps top into the viewport when the menu fits but the flipped position would overflow', () => {
    setViewport(1024, 100)
    const trigger = rect({ top: 40, left: 100, right: 180, bottom: 60, width: 80, height: 20 })
    const floating = rect({ width: 160, height: 70 })
    const result = computeFloatingPosition(trigger, floating, 'bottom')
    expect(result.top).toBeGreaterThanOrEqual(8)
    expect(result.top + 70).toBeLessThanOrEqual(100 - 8)
  })

  it('leaves a well-fitting position for top/left/right placements unchanged', () => {
    setViewport(1024, 768)
    const trigger = rect({ top: 300, left: 300, right: 380, bottom: 330, width: 80, height: 30 })
    const floating = rect({ width: 100, height: 50 })
    expect(computeFloatingPosition(trigger, floating, 'top')).toEqual({
      top: 300 - 50 - 8,
      left: 300 + 40 - 50,
    })
    expect(computeFloatingPosition(trigger, floating, 'left')).toEqual({
      top: 300 + 15 - 25,
      left: 300 - 100 - 8,
    })
    expect(computeFloatingPosition(trigger, floating, 'right')).toEqual({
      top: 300 + 15 - 25,
      left: 380 + 8,
    })
  })
})
