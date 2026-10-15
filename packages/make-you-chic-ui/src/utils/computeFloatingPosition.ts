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

/**
 * Shared by Tooltip (Unit 4) and Dropdown (Unit 5): anchors a floating
 * element (viewport-fixed) relative to a trigger element, with a one-step
 * collision flip when the computed box would overflow the viewport
 * (Unit 4 Functional Design Question 5 = B).
 */
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end'

const OPPOSITE: Record<FloatingPlacement, FloatingPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  'bottom-start': 'top-start' as FloatingPlacement, // internal flip target only, never a public prop value
  'bottom-end': 'top-end' as FloatingPlacement,
}

const OFFSET_PX = 8

function computeForPlacement(
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  placement: string,
): { top: number; left: number } {
  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - floatingRect.height - OFFSET_PX,
        left: triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2,
      }
    case 'bottom':
      return {
        top: triggerRect.bottom + OFFSET_PX,
        left: triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2,
      }
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2,
        left: triggerRect.left - floatingRect.width - OFFSET_PX,
      }
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2,
        left: triggerRect.right + OFFSET_PX,
      }
    case 'bottom-start':
      return { top: triggerRect.bottom + OFFSET_PX, left: triggerRect.left }
    case 'bottom-end':
      return { top: triggerRect.bottom + OFFSET_PX, left: triggerRect.right - floatingRect.width }
    case 'top-start':
      return { top: triggerRect.top - floatingRect.height - OFFSET_PX, left: triggerRect.left }
    case 'top-end':
      return {
        top: triggerRect.top - floatingRect.height - OFFSET_PX,
        left: triggerRect.right - floatingRect.width,
      }
    default:
      return { top: triggerRect.bottom + OFFSET_PX, left: triggerRect.left }
  }
}

function overflowsViewport(top: number, left: number, rect: DOMRect): boolean {
  return (
    top < 0 ||
    left < 0 ||
    top + rect.height > window.innerHeight ||
    left + rect.width > window.innerWidth
  )
}

const VIEWPORT_MARGIN_PX = 8

/** Clamps `value` so that `value` and `value + size` both stay within `[margin, viewport - margin]`. */
function clampAxis(value: number, size: number, viewport: number): number {
  const max = Math.max(VIEWPORT_MARGIN_PX, viewport - size - VIEWPORT_MARGIN_PX)
  return Math.min(Math.max(value, VIEWPORT_MARGIN_PX), max)
}

/**
 * Computes viewport-fixed { top, left } for a floating element anchored to
 * `triggerRect`, flipping once to the opposite side if the initial
 * placement would overflow the viewport, then clamping the result into the
 * viewport (minus a small margin) in case the flip alone isn't enough —
 * e.g. a wide menu near a screen edge (WCAG follow-up: Dropdown menu
 * overflow).
 */
export function computeFloatingPosition(
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  placement: FloatingPlacement,
): { top: number; left: number } {
  const initial = computeForPlacement(triggerRect, floatingRect, placement)
  const resolved = overflowsViewport(initial.top, initial.left, floatingRect)
    ? computeForPlacement(triggerRect, floatingRect, OPPOSITE[placement])
    : initial
  return {
    top: clampAxis(resolved.top, floatingRect.height, window.innerHeight),
    left: clampAxis(resolved.left, floatingRect.width, window.innerWidth),
  }
}
