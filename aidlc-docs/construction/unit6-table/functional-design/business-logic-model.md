# Business Logic Model — Unit 6: Table

## ソートのトグル計算(PBT対象: 純粋関数)

```ts
function nextSortState(current: SortState | null, clickedKey: string): SortState | null {
  if (current === null || current.key !== clickedKey) return { key: clickedKey, direction: 'asc' };
  if (current.direction === 'asc') return { key: clickedKey, direction: 'desc' };
  return null; // desc → 未ソート
}
```

このロジックはヘッダークリック時に呼ばれ、結果を`onSortChange`で通知する。Tableは実データのソートを行わない(business-rules.md参照)。

## ページネーションの表示計算(PBT対象: 純粋関数)

```ts
function computeTotalPages(totalCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalCount / pageSize));
}
```

## 行選択のトグル計算(PBT対象: 純粋関数)

```ts
function toggleRowSelection(selected: Set<string>, rowId: string): Set<string> {
  const next = new Set(selected);
  if (next.has(rowId)) next.delete(rowId);
  else next.add(rowId);
  return next;
}

function toggleAllSelection(selected: Set<string>, pageRowIds: string[]): Set<string> {
  const allSelected = pageRowIds.every((id) => selected.has(id));
  const next = new Set(selected);
  if (allSelected) {
    pageRowIds.forEach((id) => next.delete(id));
  } else {
    pageRowIds.forEach((id) => next.add(id));
  }
  return next;
}
```

## 列幅調整のドラッグロジック

```
1. リサイズハンドル(<th>右端)でmousedown → ドラッグ開始位置(clientX)と現在の列幅を記録
2. document全体でmousemoveを監視 → 移動量を計算し、対象<th>のDOM要素に直接style.widthを設定(最小幅でクランプ)
3. document全体でmouseupを監視 → 最終的な幅をReact stateに反映、リスナーを解除
```

## インライン編集の状態遷移

```
1. 編集可能セルクリック → editingCell = {rowId, columnKey}をセット、初期値をセット
2. 編集中に他の編集可能セルクリック、Enter、blur → commitEdit()を呼び、editingCellをクリア
   - commitEdit(): onCellEdit(rowId, columnKey, currentValue)を呼び出す
3. 編集中にEscape → editingCellをクリアするのみ(onCellEditは呼ばない)
```
