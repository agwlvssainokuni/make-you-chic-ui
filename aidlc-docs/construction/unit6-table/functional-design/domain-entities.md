# Domain Entities — Unit 6: Table

```ts
type SortDirection = 'asc' | 'desc' | null

interface SortState {
  key: string
  direction: SortDirection
}

interface CellEditComponentProps<V> {
  value: V
  onCommit: (value: V) => void
  onCancel: () => void
}
type CellEditComponent<V = unknown> = React.ComponentType<CellEditComponentProps<V>>

interface TableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  width?: number
  render?: (row: T) => React.ReactNode
  /** Question 5 = B: enables inline edit for this column. */
  editable?: boolean
  /**
   * Optional custom edit UI. When editable=true and this is omitted, a
   * default TextInput-based editor is used (string value only).
   */
  editComponent?: CellEditComponent
  /** Extracts the editable value from a row for this column (defaults to reading `row[key]`). */
  getValue?: (row: T) => unknown
}
```
