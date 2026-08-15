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

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string
  direction: SortDirection
}

/**
 * 3-stage sort toggle: none -> asc -> desc -> none (business-rules.md).
 * Table does not sort the data itself (Question 2 = B); this only computes
 * the next sort *state* to report via onSortChange.
 */
export function nextSortState(current: SortState | null, clickedKey: string): SortState | null {
  if (current === null || current.key !== clickedKey) {
    return { key: clickedKey, direction: 'asc' }
  }
  if (current.direction === 'asc') {
    return { key: clickedKey, direction: 'desc' }
  }
  return null
}

/** Total pages for external (server-side) pagination (Question 2 = B). */
export function computeTotalPages(totalCount: number, pageSize: number): number {
  if (pageSize <= 0) return 1
  return Math.max(1, Math.ceil(totalCount / pageSize))
}

/** Toggles a single row's membership in the selection set, returning a new Set. */
export function toggleRowSelection(selected: ReadonlySet<string>, rowId: string): Set<string> {
  const next = new Set(selected)
  if (next.has(rowId)) {
    next.delete(rowId)
  } else {
    next.add(rowId)
  }
  return next
}

/**
 * Toggles selection for all rows on the current page: selects all if any
 * are currently unselected, otherwise deselects all of them. Rows outside
 * `pageRowIds` are left untouched.
 */
export function toggleAllSelection(
  selected: ReadonlySet<string>,
  pageRowIds: readonly string[],
): Set<string> {
  const allSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selected.has(id))
  const next = new Set(selected)
  for (const id of pageRowIds) {
    if (allSelected) {
      next.delete(id)
    } else {
      next.add(id)
    }
  }
  return next
}
