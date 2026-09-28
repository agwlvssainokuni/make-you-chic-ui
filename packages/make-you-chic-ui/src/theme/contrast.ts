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

/** Internal-only WCAG contrast helpers, used by contrast.test.ts to guard
 * the token values audited for AA text contrast (4.5:1). Not part of the
 * public API. */

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

function channelLuminance(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance of a #rrggbb color. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
}

/** WCAG contrast ratio between two #rrggbb colors (1:1 to 21:1). */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA)
  const lB = relativeLuminance(hexB)
  const lighter = Math.max(lA, lB)
  const darker = Math.min(lA, lB)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Mirrors CSS `color-mix(in srgb, hexA <percent>%, hexB)`: a plain
 * per-channel weighted average of the raw (gamma-encoded) sRGB components,
 * not a linear-light blend. */
export function mixSrgb(hexA: string, percent: number, hexB: string): string {
  const [aR, aG, aB] = hexToRgb(hexA)
  const [bR, bG, bB] = hexToRgb(hexB)
  const ratio = percent / 100
  const mix = (a: number, b: number) => Math.round(a * ratio + b * (1 - ratio))
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(mix(aR, bR))}${toHex(mix(aG, bG))}${toHex(mix(aB, bB))}`
}
