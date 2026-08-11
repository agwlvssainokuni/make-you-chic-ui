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
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  role: string;
}

const rows: Row[] = [
  { id: '1', name: '山田 太郎', role: '管理者' },
  { id: '2', name: '鈴木 花子', role: '一般ユーザー' },
];

const columns: TableColumn<Row>[] = [
  { key: 'name', header: '名前', sortable: true },
  { key: 'role', header: '役割' },
];

function baseProps() {
  return {
    columns,
    data: rows,
    totalCount: rows.length,
    getRowId: (row: Row) => row.id,
    page: 1,
    pageSize: 10,
    onPageChange: vi.fn(),
    'aria-label': 'ユーザー一覧',
  };
}

describe('Table', () => {
  it('renders a row per data item and a cell per column', () => {
    render(<Table {...baseProps()} />);
    expect(screen.getByTestId('table-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('table-cell-1-name')).toHaveTextContent('山田 太郎');
    expect(screen.getByTestId('table-cell-2-role')).toHaveTextContent('一般ユーザー');
  });

  it('calls onSortChange with the next sort state when a sortable header is clicked', async () => {
    const onSortChange = vi.fn();
    render(<Table {...baseProps()} onSortChange={onSortChange} />);
    await userEvent.click(screen.getByTestId('table-sort-name'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('advances from asc to desc when the same header is clicked again', async () => {
    const onSortChange = vi.fn();
    render(
      <Table {...baseProps()} sortState={{ key: 'name', direction: 'asc' }} onSortChange={onSortChange} />,
    );
    await userEvent.click(screen.getByTestId('table-sort-name'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  });

  it('sets aria-sort on the active sorted column header', () => {
    render(<Table {...baseProps()} sortState={{ key: 'name', direction: 'asc' }} />);
    expect(screen.getByTestId('table-header-name')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('renders row and select-all checkboxes only when selection props are provided', () => {
    const { rerender } = render(<Table {...baseProps()} />);
    expect(screen.queryByTestId('table-select-all')).not.toBeInTheDocument();

    rerender(
      <Table {...baseProps()} selectedRowIds={new Set()} onSelectionChange={vi.fn()} />,
    );
    expect(screen.getByTestId('table-select-all')).toBeInTheDocument();
    expect(screen.getByTestId('table-select-1')).toBeInTheDocument();
  });

  it('toggles a single row selection on checkbox click', async () => {
    const onSelectionChange = vi.fn();
    render(<Table {...baseProps()} selectedRowIds={new Set()} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByTestId('table-select-1'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1']));
  });

  it('selects all page rows when the select-all checkbox is clicked with none selected', async () => {
    const onSelectionChange = vi.fn();
    render(<Table {...baseProps()} selectedRowIds={new Set()} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByTestId('table-select-all'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1', '2']));
  });

  it('shows page status text and disables prev/next at the boundaries', () => {
    render(<Table {...baseProps()} page={1} pageSize={10} totalCount={2} />);
    expect(screen.getByText('1 / 1ページ(全2件)')).toBeInTheDocument();
    expect(screen.getByTestId('table-prev-page')).toBeDisabled();
    expect(screen.getByTestId('table-next-page')).toBeDisabled();
  });

  it('calls onPageChange with page + 1 / page - 1', async () => {
    const onPageChange = vi.fn();
    render(<Table {...baseProps()} page={2} totalCount={50} pageSize={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByTestId('table-next-page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByTestId('table-prev-page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('enters edit mode with the default text editor on click, and commits on Enter', async () => {
    const onCellEdit = vi.fn();
    const editableColumns: TableColumn<Row>[] = [{ key: 'name', header: '名前', editable: true }];
    render(<Table {...baseProps()} columns={editableColumns} onCellEdit={onCellEdit} />);

    await userEvent.click(screen.getByTestId('table-cell-1-name'));
    const editor = screen.getByTestId('table-cell-editor');
    expect(editor).toHaveValue('山田 太郎');

    await userEvent.clear(editor);
    await userEvent.type(editor, '山田 次郎{Enter}');
    expect(onCellEdit).toHaveBeenCalledWith('1', 'name', '山田 次郎');
  });

  it('cancels the edit without committing on Escape', async () => {
    const onCellEdit = vi.fn();
    const editableColumns: TableColumn<Row>[] = [{ key: 'name', header: '名前', editable: true }];
    render(<Table {...baseProps()} columns={editableColumns} onCellEdit={onCellEdit} />);

    await userEvent.click(screen.getByTestId('table-cell-1-name'));
    await userEvent.type(screen.getByTestId('table-cell-editor'), 'x{Escape}');
    expect(onCellEdit).not.toHaveBeenCalled();
    expect(screen.queryByTestId('table-cell-editor')).not.toBeInTheDocument();
  });

  it('uses a custom editComponent when provided', async () => {
    const onCellEdit = vi.fn();
    function CustomEditor({ onCommit }: { value: unknown; onCommit: (v: unknown) => void; onCancel: () => void }) {
      return (
        <button data-testid="custom-editor" onClick={() => onCommit('カスタム値')}>
          commit
        </button>
      );
    }
    const editableColumns: TableColumn<Row>[] = [
      { key: 'role', header: '役割', editable: true, editComponent: CustomEditor },
    ];
    render(<Table {...baseProps()} columns={editableColumns} onCellEdit={onCellEdit} />);

    await userEvent.click(screen.getByTestId('table-cell-1-role'));
    await userEvent.click(screen.getByTestId('custom-editor'));
    expect(onCellEdit).toHaveBeenCalledWith('1', 'role', 'カスタム値');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Table {...baseProps()} selectedRowIds={new Set()} onSelectionChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
