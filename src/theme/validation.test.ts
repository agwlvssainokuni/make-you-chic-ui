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
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  isValidThemeValue,
  resolveInitialThemeValue,
  THEME_VALID_VALUES,
  THEME_DEFAULTS,
} from './validation';
import type { ThemeAxis } from './types';

const axes = Object.keys(THEME_VALID_VALUES) as ThemeAxis[];
const axisArb = fc.constantFrom(...axes);

describe('isValidThemeValue', () => {
  it('example: accepts documented valid values', () => {
    expect(isValidThemeValue('theme', 'dark')).toBe(true);
    expect(isValidThemeValue('brand', 'purple')).toBe(true);
  });

  it('example: rejects an unknown value', () => {
    expect(isValidThemeValue('theme', 'blue')).toBe(false);
  });

  // PBT-03 (Invariant Properties): every value drawn from the documented
  // valid-value list for an axis must be accepted, for all axes.
  it('property: every documented valid value is accepted for its axis', () => {
    fc.assert(
      fc.property(
        axisArb.chain((axis) => fc.constantFrom(...THEME_VALID_VALUES[axis]).map((value) => ({ axis, value }))),
        ({ axis, value }) => {
          expect(isValidThemeValue(axis, value)).toBe(true);
        },
      ),
    );
  });

  // PBT-03: any string that is not in the axis's valid-value list must be
  // rejected, for all axes and a wide range of generated strings.
  it('property: any string outside the valid-value list is rejected', () => {
    fc.assert(
      fc.property(
        axisArb,
        fc.string(),
        (axis, candidate) => {
          fc.pre(!(THEME_VALID_VALUES[axis] as readonly string[]).includes(candidate));
          expect(isValidThemeValue(axis, candidate)).toBe(false);
        },
      ),
    );
  });

  it('property: non-string values are always rejected', () => {
    fc.assert(
      fc.property(axisArb, fc.oneof(fc.integer(), fc.boolean(), fc.constant(null), fc.constant(undefined)), (axis, value) => {
        expect(isValidThemeValue(axis, value)).toBe(false);
      }),
    );
  });
});

describe('resolveInitialThemeValue', () => {
  it('returns the persisted value when it is valid', () => {
    expect(resolveInitialThemeValue('brand', 'green', false)).toBe('green');
  });

  it('falls back to prefers-color-scheme for the theme axis when nothing is persisted', () => {
    expect(resolveInitialThemeValue('theme', null, true)).toBe('dark');
    expect(resolveInitialThemeValue('theme', null, false)).toBe('light');
  });

  it('falls back to the axis default for non-theme axes when nothing is persisted', () => {
    expect(resolveInitialThemeValue('brand', null, false)).toBe(THEME_DEFAULTS.brand);
    expect(resolveInitialThemeValue('fontFamily', null, false)).toBe(THEME_DEFAULTS.fontFamily);
    expect(resolveInitialThemeValue('fontSize', null, false)).toBe(THEME_DEFAULTS.fontSize);
  });

  // PBT-03: an invalid persisted value must never be returned as-is; the
  // result must always be a documented valid value for the axis.
  it('property: the resolved value is always a documented valid value for the axis, regardless of corrupt input', () => {
    fc.assert(
      fc.property(axisArb, fc.option(fc.string(), { nil: null }), fc.boolean(), (axis, persisted, prefersDark) => {
        const result = resolveInitialThemeValue(axis, persisted, prefersDark);
        expect((THEME_VALID_VALUES[axis] as readonly string[]).includes(result)).toBe(true);
      }),
    );
  });
});
