# Business Rules — Unit 6: Table

## ソート(Question 1 = A: 単一列)

- 常に最大1列のみソート状態を持つ(`SortState | null`)
- ソート可能な列ヘッダーをクリックするたびに: 未ソート→asc→desc→未ソート、の3段階を循環する(reference踏襲)
- 別の列のヘッダーをクリックした場合、その列のasc状態から開始する(直前の列のソート状態は破棄)
- Tableコンポーネント自身はソートアルゴリズムを実行しない(Question 2の方針転換に伴い、ソート済みデータの提供も呼び出し側の責務。`onSortChange`でソート条件を通知し、呼び出し側がソート済みの`data`を再度渡す)

## ページネーション(Question 2 = B: 外部スライス方式)

- `data`propには現在ページの行のみを渡す(Table内部でのスライスは行わない)
- `totalCount`propで全件数を受け取り、`totalPages = Math.ceil(totalCount / pageSize)`を算出してページネーションUIに表示する
- ページ変更(前へ/次へ/ページ番号クリック)は`onPageChange(newPage)`を呼ぶのみで、実際のデータ取得・スライスは呼び出し側の責務(サーバーサイドページネーションを前提とした大量データ対応)

## 行選択

- `getRowId(row)`で算出したIDを`Set<string>`で管理する(Question 3 = A)
- 全選択チェックボックス: 現在ページの全行が選択されている場合のみチェック状態、一部のみ選択されている場合はindeterminate状態にする

## 列幅調整(Question 4 = A)

- `mousedown`でドラッグ開始、`mousemove`中は対象`<th>`のDOM要素の`style.width`を直接書き換える(Reactの再レンダリングを起こさない)
- `mouseup`でドラッグ終了。その時点の幅をReact stateに反映し、以降の再レンダリングでも同じ幅を維持する
- 最小幅(例: 60px)を下回らないよう制限する

## インライン編集(Question 5 = B, Question 6 = A)

- `column.editable`がtrueの列のセルをクリックすると編集モードに入る
- `column.editComponent`が指定されていればそれを使用し、未指定の場合はデフォルトのTextInputベースエディタを使用する(文字列値のみ、確定時の型変換は呼び出し側の責務)
- 編集値の初期値は`column.getValue?.(row) ?? row[column.key]`
- 編集中に他の編集可能セルをクリックした場合: 現在編集中のセルの値を確定(`onCellEdit`相当のコールバック発火)してから、新しいセルの編集を開始する(Excelライクな挙動)
- Enterキー: 現在の編集値を確定して編集モードを終了する
- Escapeキー: 編集を破棄し、編集モードを終了する(値は変更しない)
- フォーカスが編集中のセル外(Table外)に移った場合も確定として扱う(blurイベント)
