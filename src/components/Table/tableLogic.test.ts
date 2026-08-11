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
  nextSortState,
  computeTotalPages,
  toggleRowSelection,
  toggleAllSelection,
} from './tableLogic';

describe('nextSortState', () => {
  it('example: none -> asc -> desc -> none for the same key', () => {
    let state = nextSortState(null, 'name');
    expect(state).toEqual({ key: 'name', direction: 'asc' });
    state = nextSortState(state, 'name');
    expect(state).toEqual({ key: 'name', direction: 'desc' });
    state = nextSortState(state, 'name');
    expect(state).toBeNull();
  });

  it('example: clicking a different column resets to asc for the new key', () => {
    const state = nextSortState({ key: 'name', direction: 'desc' }, 'email');
    expect(state).toEqual({ key: 'email', direction: 'asc' });
  });

  // PBT-03 (Invariant): a full 3-click cycle on the same key always returns
  // to null, regardless of the key.
  it('property: three consecutive clicks on the same key always cycle back to null', () => {
    fc.assert(
      fc.property(fc.string(), (key) => {
        const s1 = nextSortState(null, key);
        const s2 = nextSortState(s1, key);
        const s3 = nextSortState(s2, key);
        expect(s3).toBeNull();
      }),
    );
  });

  // PBT-03: clicking any different key always yields { key, direction: 'asc' }.
  it('property: clicking a different key from any current state always yields asc', () => {
    fc.assert(
      fc.property(
        fc.option(fc.record({ key: fc.string(), direction: fc.constantFrom<SortDirectionForTest>('asc', 'desc', null) }), {
          nil: null,
        }),
        fc.string(),
        (current, clickedKey) => {
          fc.pre(current === null || current.key !== clickedKey);
          expect(nextSortState(current, clickedKey)).toEqual({ key: clickedKey, direction: 'asc' });
        },
      ),
    );
  });
});

type SortDirectionForTest = 'asc' | 'desc' | null;

describe('computeTotalPages', () => {
  it('example: 25 items at 10 per page is 3 pages', () => {
    expect(computeTotalPages(25, 10)).toBe(3);
  });

  it('example: 0 items is still 1 page', () => {
    expect(computeTotalPages(0, 10)).toBe(1);
  });

  // PBT-03 (Invariant): result is always >= 1, and totalCount never exceeds
  // totalPages * pageSize (the pages fully cover the count).
  it('property: totalPages is always at least 1 and always covers totalCount', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),
        fc.integer({ min: 1, max: 1000 }),
        (totalCount, pageSize) => {
          const totalPages = computeTotalPages(totalCount, pageSize);
          expect(totalPages).toBeGreaterThanOrEqual(1);
          expect(totalPages * pageSize).toBeGreaterThanOrEqual(totalCount);
        },
      ),
    );
  });
});

describe('toggleRowSelection', () => {
  it('example: toggling an unselected id selects it', () => {
    expect(toggleRowSelection(new Set(), 'row-1')).toEqual(new Set(['row-1']));
  });

  it('example: toggling a selected id deselects it', () => {
    expect(toggleRowSelection(new Set(['row-1']), 'row-1')).toEqual(new Set());
  });

  // PBT-03 (Invariant): toggling the same id twice returns to the original set.
  it('property: toggling the same id twice is a no-op', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.string(), (ids, targetId) => {
        const original = new Set(ids);
        const twice = toggleRowSelection(toggleRowSelection(original, targetId), targetId);
        expect(twice).toEqual(original);
      }),
    );
  });

  // PBT-03: the result always differs from the input by exactly one element.
  it('property: the resulting set size always differs from the input by exactly 1', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.string(), (ids, targetId) => {
        const original = new Set(ids);
        const result = toggleRowSelection(original, targetId);
        expect(Math.abs(result.size - original.size)).toBe(1);
      }),
    );
  });
});

describe('toggleAllSelection', () => {
  it('example: selects all page rows when none are selected', () => {
    const result = toggleAllSelection(new Set(), ['a', 'b', 'c']);
    expect(result).toEqual(new Set(['a', 'b', 'c']));
  });

  it('example: deselects all page rows when all are already selected', () => {
    const result = toggleAllSelection(new Set(['a', 'b', 'c']), ['a', 'b', 'c']);
    expect(result).toEqual(new Set());
  });

  it('example: is a no-op when pageRowIds is empty', () => {
    const original = new Set(['x']);
    expect(toggleAllSelection(original, [])).toEqual(original);
  });

  // PBT-03 (Invariant): after the call, the page's rows are either all
  // present in the result or all absent from it (never a mix), and rows
  // outside the page are left untouched.
  it('property: page rows end up either all selected or all deselected, and other rows are untouched', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.uniqueArray(fc.string()), (selectedIds, pageRowIds) => {
        const original = new Set(selectedIds);
        const result = toggleAllSelection(original, pageRowIds);

        if (pageRowIds.length > 0) {
          const allIn = pageRowIds.every((id) => result.has(id));
          const noneIn = pageRowIds.every((id) => !result.has(id));
          expect(allIn || noneIn).toBe(true);
        }

        for (const id of original) {
          if (!pageRowIds.includes(id)) {
            expect(result.has(id)).toBe(true);
          }
        }
        for (const id of result) {
          if (!pageRowIds.includes(id)) {
            expect(original.has(id)).toBe(true);
          }
        }
      }),
    );
  });
});
