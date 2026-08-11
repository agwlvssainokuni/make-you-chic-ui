# Code Generation Summary — Unit 6: Table

## 生成したアプリケーションコード

### 純粋関数ロジック(PBT対象)
- `src/components/Table/tableLogic.ts`(`nextSortState`, `computeTotalPages`, `toggleRowSelection`, `toggleAllSelection`)
- `src/components/Table/tableLogic.test.ts`(`fast-check`によるPBT。PBT-03不変性: ソート3段階循環、ページ数の下限・カバレッジ、選択トグルの対合性、全選択トグルの一貫性)

### コンポーネント
- `src/components/Table/CellEditor.tsx`(`DefaultCellEditor`、既定のテキストインライン編集)
- `src/components/Table/Table.tsx`, `Table.css`, `index.ts`
- `src/components/Table/Table.test.tsx`(ソート/ページネーション/行選択/インライン編集(既定・カスタム双方)、vitest-axe含む)

### バレルエクスポート
- `src/index.ts` にTable, DefaultCellEditor, 関連型・純粋関数を追加

## 実装時の設計判断

- Excel風の「別セルクリックで編集確定」は、既定エディタ(`DefaultCellEditor`)の`onBlur`タイミングに依拠する実装とした。カスタム`editComponent`がblur時にコミットしない場合は編集内容が失われる制約があることをコード内コメントで明記(命令的な「今すぐコミット」APIまでは今回のスコープでは実装しない判断)

## 生成したHTML版デモ(FR6)

- `html-demo/components/table-demo.html`(ソート・ページネーション・インライン編集のVanilla JS移植)
- `html-demo/index.html` のリンク一覧を更新

## ライセンス表記

生成した全コードファイルの先頭にApache License 2.0のライセンスコメント(`Copyright 2026 agwlvssainokuni`)を付与済み。

## 要件トレーサビリティ

FR1(Table)、FR6(HTML版デモ)、NFR2、NFR9、Property-Based Testing拡張(Partial: PBT-02/03/07/08/09)に対応する実装を完了。
