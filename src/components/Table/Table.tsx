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
import './Table.css';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { DefaultCellEditor, type CellEditComponentProps } from './CellEditor';
import { nextSortState, computeTotalPages, toggleRowSelection, toggleAllSelection } from './tableLogic';
import type { SortState } from './tableLogic';

export type { SortState, SortDirection } from './tableLogic';

const MIN_COLUMN_WIDTH_PX = 60;

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: number;
  render?: (row: T) => ReactNode;
  /** Enables inline edit for this column (Functional Design Question 5). */
  editable?: boolean;
  /** Custom edit UI; defaults to a text-only editor when omitted. */
  editComponent?: React.ComponentType<CellEditComponentProps<unknown>>;
  /** Extracts the editable value from a row; defaults to `row[key]`. */
  getValue?: (row: T) => unknown;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  /** Current page's rows only (Functional Design Question 2 = B). */
  data: T[];
  totalCount: number;
  getRowId: (row: T) => string;
  sortState?: SortState | null;
  onSortChange?: (state: SortState | null) => void;
  selectedRowIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCellEdit?: (rowId: string, columnKey: string, value: unknown) => void;
  'aria-label'?: string;
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
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null);
  const thRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const dragState = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const totalPages = computeTotalPages(totalCount, pageSize);
  const rowIds = data.map(getRowId);
  const allOnPageSelected = selectedRowIds !== undefined && rowIds.length > 0 && rowIds.every((id) => selectedRowIds.has(id));
  const someOnPageSelected = selectedRowIds !== undefined && rowIds.some((id) => selectedRowIds.has(id));

  function handleSortClick(columnKey: string): void {
    onSortChange?.(nextSortState(sortState, columnKey));
  }

  function handleToggleAll(): void {
    if (!selectedRowIds || !onSelectionChange) return;
    onSelectionChange(toggleAllSelection(selectedRowIds, rowIds));
  }

  function handleToggleRow(rowId: string): void {
    if (!selectedRowIds || !onSelectionChange) return;
    onSelectionChange(toggleRowSelection(selectedRowIds, rowId));
  }

  function handleResizeStart(key: string, event: React.MouseEvent): void {
    const th = thRefs.current[key];
    if (!th) return;
    dragState.current = { key, startX: event.clientX, startWidth: th.getBoundingClientRect().width };
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      const drag = dragState.current;
      if (!drag) return;
      const th = thRefs.current[drag.key];
      if (!th) return;
      const nextWidth = Math.max(MIN_COLUMN_WIDTH_PX, drag.startWidth + (event.clientX - drag.startX));
      th.style.width = `${nextWidth}px`;
    }

    function handleMouseUp(): void {
      const drag = dragState.current;
      if (!drag) return;
      const th = thRefs.current[drag.key];
      if (th) {
        const finalWidth = Math.max(MIN_COLUMN_WIDTH_PX, parseFloat(th.style.width) || drag.startWidth);
        setColumnWidths((prev) => ({ ...prev, [drag.key]: finalWidth }));
      }
      dragState.current = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Excel-like editing (business-rules.md): switching to a new editable
  // cell relies on the outgoing editor committing itself via blur before
  // this click handler runs (true for DefaultCellEditor). A custom
  // editComponent that does not commit on blur will simply be unmounted
  // without its pending value being saved — documented as a known
  // simplification rather than adding an imperative "commit now" ref API.
  function startEdit(rowId: string, columnKey: string): void {
    setEditingCell({ rowId, columnKey });
  }

  function commitEdit(rowId: string, columnKey: string, value: unknown): void {
    onCellEdit?.(rowId, columnKey, value);
    setEditingCell(null);
  }

  function cancelEdit(): void {
    setEditingCell(null);
  }

  return (
    <div className="wds-table-wrapper" data-testid="table">
      <table className="wds-table" aria-label={ariaLabel}>
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
                    if (el) el.indeterminate = !allOnPageSelected && someOnPageSelected;
                  }}
                />
              </th>
            )}
            {columns.map((column) => {
              const width = columnWidths[column.key] ?? column.width;
              const ariaSort =
                sortState?.key === column.key
                  ? sortState.direction === 'asc'
                    ? 'ascending'
                    : sortState.direction === 'desc'
                      ? 'descending'
                      : 'none'
                  : undefined;
              return (
                <th
                  key={column.key}
                  ref={(el) => {
                    thRefs.current[column.key] = el;
                  }}
                  style={width ? { width } : undefined}
                  aria-sort={column.sortable ? (ariaSort ?? 'none') : undefined}
                  data-testid={`table-header-${column.key}`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="wds-table-th-sortable"
                      onClick={() => handleSortClick(column.key)}
                      data-testid={`table-sort-${column.key}`}
                    >
                      {column.header}
                      {sortState?.key === column.key && sortState.direction && (
                        <Icon name="chevron-down" size={14} />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                  <span
                    className="wds-table-resize-handle"
                    role="presentation"
                    onMouseDown={(e) => handleResizeStart(column.key, e)}
                    data-testid={`table-resize-${column.key}`}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr key={rowId} className="wds-table-row" data-testid={`table-row-${rowId}`}>
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
                  const isEditing = editingCell?.rowId === rowId && editingCell.columnKey === column.key;
                  const rawValue = column.getValue
                    ? column.getValue(row)
                    : (row as Record<string, unknown>)[column.key];
                  const EditComponent = column.editComponent ?? DefaultCellEditor;

                  return (
                    <td
                      key={column.key}
                      className={column.editable ? 'wds-table-cell-editable' : undefined}
                      onClick={column.editable && !isEditing ? () => startEdit(rowId, column.key) : undefined}
                      data-testid={`table-cell-${rowId}-${column.key}`}
                    >
                      {isEditing ? (
                        <EditComponent
                          value={rawValue}
                          onCommit={(value) => commitEdit(rowId, column.key, value)}
                          onCancel={cancelEdit}
                        />
                      ) : column.render ? (
                        column.render(row)
                      ) : (
                        String(rawValue ?? '')
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="wds-table-pagination">
        <span className="wds-table-pagination-status">
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
  );
}
