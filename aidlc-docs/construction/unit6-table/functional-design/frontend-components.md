# Frontend Components — Unit 6: Table

## Table

- **Props**:
  - `columns: TableColumn<T>[]`
  - `data: T[]`(現在ページの行のみ、Question 2 = B)
  - `totalCount: number`
  - `getRowId: (row: T) => string`(Question 3 = A)
  - `sortState?: SortState | null`, `onSortChange?: (state: SortState | null) => void`
  - `selectedRowIds?: Set<string>`, `onSelectionChange?: (ids: Set<string>) => void`
  - `page: number`, `pageSize: number`, `onPageChange: (page: number) => void`
  - `onCellEdit?: (rowId: string, columnKey: string, value: unknown) => void`
- **状態**: 列幅(`Record<string, number>`、ドラッグ終了時のみ更新)、`editingCell`(`{rowId, columnKey} | null`)
- **レンダリング構造**: `<table>` + `<thead>`(ソート可能ヘッダー、リサイズハンドル、全選択チェックボックス)+ `<tbody>`(行選択チェックボックス、セル、インライン編集時は`editComponent`または既定のTextInput)+ ページネーションUI(前へ/次へボタン、ページ番号、`computeTotalPages`の結果を使用)
- **依存コンポーネント**: `Checkbox`(行選択・全選択)、`Icon`(ソート矢印)、`TextInput`(既定のインライン編集エディタ)、`Button`(ページネーションの前へ/次へ)
- **a11y**: `<table>`に`role`は付与不要(ネイティブセマンティクスで十分)。ソート可能な`<th>`には`aria-sort`(ascending/descending/none)を設定。編集可能セルには`aria-label`等で編集可能である旨を補足しない(視覚的な手がかりのみで十分と判断。将来的な改善余地として記録)
- **ref**: 不要
