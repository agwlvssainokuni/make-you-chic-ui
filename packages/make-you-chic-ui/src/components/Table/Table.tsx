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
import './Table.css'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { DefaultCellEditor, type CellEditComponentProps } from './CellEditor'
import {
  nextSortState,
  computeTotalPages,
  toggleRowSelection,
  toggleAllSelection,
} from './tableLogic'
import type { SortState } from './tableLogic'

export type { SortState, SortDirection } from './tableLogic'

const MIN_COLUMN_WIDTH_PX = 60

export interface TableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  width?: number
  render?: (row: T) => ReactNode
  /** Enables inline edit for this column (Functional Design Question 5). */
  editable?: boolean
  /** Custom edit UI; defaults to a text-only editor when omitted. */
  editComponent?: React.ComponentType<CellEditComponentProps<unknown>>
  /** Extracts the editable value from a row; defaults to `row[key]`. */
  getValue?: (row: T) => unknown
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  /** Current page's rows only (Functional Design Question 2 = B). */
  data: T[]
  totalCount: number
  getRowId: (row: T) => string
  sortState?: SortState | null
  onSortChange?: (state: SortState | null) => void
  selectedRowIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onCellEdit?: (rowId: string, columnKey: string, value: unknown) => void
  'aria-label'?: string
}

/**
 * Data grid with single-column sort, externally-paginated data, row
 * selection, drag-to-resize columns, and inline cell editing. See:
 * aidlc-docs/construction/unit6-table/functional-design/.
 */
export function Table<T>({
  columns,
  data,
  totalCount,
  getRowId,
  sortState = null,
  onSortChange,
  selectedRowIds,
  onSelectionChange,
  page,
  pageSize,
  onPageChange,
  onCellEdit,
  'aria-label': ariaLabel,
}: TableProps<T>): React.JSX.Element {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null)
  const thRefs = useRef<Record<string, HTMLTableCellElement | null>>({})
  const tableRef = useRef<HTMLTableElement | null>(null)
  const dragState = useRef<{
    key: string
    startX: number
    startWidth: number
    startTableWidth: number
  } | null>(null)

  const totalPages = computeTotalPages(totalCount, pageSize)
  const rowIds = data.map(getRowId)
  const allOnPageSelected =
    selectedRowIds !== undefined &&
    rowIds.length > 0 &&
    rowIds.every((id) => selectedRowIds.has(id))
  const someOnPageSelected =
    selectedRowIds !== undefined && rowIds.some((id) => selectedRowIds.has(id))

  // Once a resize has pinned every column's width (see handleResizeStart),
  // the table gets a definite total width equal to their sum instead of
  // "auto". A table with width: auto is sized shrink-to-fit, which is
  // always clamped to the wrapper's width - so growing one column would
  // just compress the others back down to fit, never actually growing
  // past the wrapper to trigger its horizontal scroll.
  const hasPinnedColumnWidths = Object.keys(columnWidths).length > 0
  const pinnedTableWidth = hasPinnedColumnWidths
    ? (selectedRowIds && onSelectionChange ? 40 : 0) +
      columns.reduce((sum, column) => sum + (columnWidths[column.key] ?? column.width ?? 0), 0)
    : undefined

  function handleSortClick(columnKey: string): void {
    onSortChange?.(nextSortState(sortState, columnKey))
  }

  function handleToggleAll(): void {
    if (!selectedRowIds || !onSelectionChange) return
    onSelectionChange(toggleAllSelection(selectedRowIds, rowIds))
  }

  function handleToggleRow(rowId: string): void {
    if (!selectedRowIds || !onSelectionChange) return
    onSelectionChange(toggleRowSelection(selectedRowIds, rowId))
  }

  function handleResizeStart(key: string, event: React.MouseEvent): void {
    const th = thRefs.current[key]
    if (!th) return
    // Pin every column's current width before this one starts growing -
    // applied straight to the DOM here, not only via React state. A
    // mousemove firing before React's next render flushes would otherwise
    // hit a table that's still table-layout: auto with only the dragged
    // column pinned; the browser then "helpfully" redistributes the
    // still-unpinned siblings (including ones to the left of the dragged
    // column), and that shifted width gets locked in as their pinned
    // value once state finally lands. Mutating synchronously here, before
    // this handler returns, closes that window entirely.
    const pinned: Record<string, number> = { ...columnWidths }
    for (const column of columns) {
      if (pinned[column.key] === undefined) {
        const el = thRefs.current[column.key]
        if (el) pinned[column.key] = el.getBoundingClientRect().width
      }
    }
    for (const column of columns) {
      const el = thRefs.current[column.key]
      const columnWidth = pinned[column.key]
      if (el && columnWidth !== undefined) {
        el.style.width = `${columnWidth}px`
      }
    }
    if (tableRef.current) {
      tableRef.current.classList.add('mycui-table--pinned')
      tableRef.current.style.tableLayout = 'fixed'
      const totalWidth =
        (selectedRowIds && onSelectionChange ? 40 : 0) +
        columns.reduce((sum, column) => sum + (pinned[column.key] ?? column.width ?? 0), 0)
      tableRef.current.style.width = `${totalWidth}px`
    }
    setColumnWidths(pinned)
    dragState.current = {
      key,
      startX: event.clientX,
      startWidth: th.getBoundingClientRect().width,
      startTableWidth: tableRef.current?.getBoundingClientRect().width ?? 0,
    }
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      const drag = dragState.current
      if (!drag) return
      const th = thRefs.current[drag.key]
      if (!th) return
      const nextWidth = Math.max(
        MIN_COLUMN_WIDTH_PX,
        drag.startWidth + (event.clientX - drag.startX),
      )
      th.style.width = `${nextWidth}px`
      // Grows the table itself by the same delta, in lockstep with the
      // dragged column, so the live drag doesn't visibly overshoot then
      // snap back once mouseup commits columnWidths and pinnedTableWidth
      // catches up.
      if (tableRef.current) {
        tableRef.current.style.width = `${drag.startTableWidth + (nextWidth - drag.startWidth)}px`
      }
    }

    function handleMouseUp(): void {
      const drag = dragState.current
      if (!drag) return
      const th = thRefs.current[drag.key]
      if (th) {
        const finalWidth = Math.max(
          MIN_COLUMN_WIDTH_PX,
          parseFloat(th.style.width) || drag.startWidth,
        )
        setColumnWidths((prev) => ({ ...prev, [drag.key]: finalWidth }))
      }
      dragState.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Excel-like editing (business-rules.md): switching to a new editable
  // cell relies on the outgoing editor committing itself via blur before
  // this click handler runs (true for DefaultCellEditor). A custom
  // editComponent that does not commit on blur will simply be unmounted
  // without its pending value being saved — documented as a known
  // simplification rather than adding an imperative "commit now" ref API.
  function startEdit(rowId: string, columnKey: string): void {
    setEditingCell({ rowId, columnKey })
  }

  function commitEdit(rowId: string, columnKey: string, value: unknown): void {
    onCellEdit?.(rowId, columnKey, value)
    setEditingCell(null)
  }

  function cancelEdit(): void {
    setEditingCell(null)
  }

  return (
    <div className="mycui-table-wrapper" data-testid="table">
      <table
        ref={tableRef}
        className={hasPinnedColumnWidths ? 'mycui-table mycui-table--pinned' : 'mycui-table'}
        aria-label={ariaLabel}
        // Auto layout sizes the initial, never-resized table by content
        // (so columns start proportioned sensibly). Once handleResizeStart
        // has pinned every column to its current pixel width, switching to
        // fixed layout + a definite width (the pinned sum) makes those
        // widths authoritative - resizing one no longer leaves others as
        // "flexible" for the browser to shrink, and the table can grow
        // past the wrapper (which scrolls) instead of compressing them.
        style={
          hasPinnedColumnWidths ? { tableLayout: 'fixed', width: pinnedTableWidth } : undefined
        }
      >
        <thead>
          <tr>
            {selectedRowIds && onSelectionChange && (
              <th style={{ width: 40 }}>
                <Checkbox
                  checked={allOnPageSelected}
                  onChange={handleToggleAll}
                  aria-label="全ての行を選択"
                  data-testid="table-select-all"
                  ref={(el) => {
                    if (el) el.indeterminate = !allOnPageSelected && someOnPageSelected
                  }}
                />
              </th>
            )}
            {columns.map((column) => {
              const width = columnWidths[column.key] ?? column.width
              const ariaSort =
                sortState?.key === column.key
                  ? sortState.direction === 'asc'
                    ? 'ascending'
                    : sortState.direction === 'desc'
                      ? 'descending'
                      : 'none'
                  : undefined
              return (
                <th
                  key={column.key}
                  ref={(el) => {
                    thRefs.current[column.key] = el
                  }}
                  style={width !== undefined ? { width } : undefined}
                  aria-sort={column.sortable ? (ariaSort ?? 'none') : undefined}
                  data-testid={`table-header-${column.key}`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="mycui-table-th-sortable"
                      onClick={() => handleSortClick(column.key)}
                      data-testid={`table-sort-${column.key}`}
                    >
                      {column.header}
                      <Icon
                        name={
                          sortState?.key === column.key && sortState.direction === 'asc'
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={14}
                        className={
                          sortState?.key === column.key && sortState.direction
                            ? undefined
                            : 'mycui-table-sort-icon-inactive'
                        }
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                  <span
                    className="mycui-table-resize-handle"
                    role="presentation"
                    onMouseDown={(e) => handleResizeStart(column.key, e)}
                    data-testid={`table-resize-${column.key}`}
                  />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = getRowId(row)
            return (
              <tr key={rowId} className="mycui-table-row" data-testid={`table-row-${rowId}`}>
                {selectedRowIds && onSelectionChange && (
                  <td>
                    <Checkbox
                      checked={selectedRowIds.has(rowId)}
                      onChange={() => handleToggleRow(rowId)}
                      aria-label="この行を選択"
                      data-testid={`table-select-${rowId}`}
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const isEditing =
                    editingCell?.rowId === rowId && editingCell.columnKey === column.key
                  const rawValue = column.getValue
                    ? column.getValue(row)
                    : (row as Record<string, unknown>)[column.key]
                  const EditComponent = column.editComponent ?? DefaultCellEditor

                  const cellClassName = [
                    column.editable ? 'mycui-table-cell-editable' : null,
                    isEditing ? 'mycui-table-cell-editing' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <td
                      key={column.key}
                      className={cellClassName || undefined}
                      onClick={
                        column.editable && !isEditing
                          ? () => startEdit(rowId, column.key)
                          : undefined
                      }
                      data-testid={`table-cell-${rowId}-${column.key}`}
                    >
                      {isEditing ? (
                        <div className="mycui-table-cell-editor">
                          <EditComponent
                            value={rawValue}
                            onCommit={(value) => commitEdit(rowId, column.key, value)}
                            onCancel={cancelEdit}
                          />
                        </div>
                      ) : column.render ? (
                        column.render(row)
                      ) : (
                        String(rawValue ?? '')
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mycui-table-pagination">
        <span className="mycui-table-pagination-status">
          {totalCount === 0 ? '0件' : `${page} / ${totalPages}ページ(全${totalCount}件)`}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          data-testid="table-prev-page"
        >
          前へ
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          data-testid="table-next-page"
        >
          次へ
        </Button>
      </div>
    </div>
  )
}
