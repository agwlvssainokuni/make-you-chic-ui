# Code Generation Plan — Unit 6: Table

## ユニットコンテキスト

- **対応要件**: FR1(Table), NFR9(レスポンシブ), Property-Based Testing拡張(Partial: PBT-02/03/07/08/09)
- **依存ユニット**: Unit 1(Icon), Unit 2(Checkbox, TextInput, useControllableState, Button)
- **設計根拠**: `aidlc-docs/construction/unit6-table/functional-design/`

## 実施ステップ

- [x] **Step 1: 純粋関数ロジックの生成 + PBTを含む単体テスト**
  - `src/components/Table/tableLogic.ts`(`nextSortState`, `computeTotalPages`, `toggleRowSelection`, `toggleAllSelection`)
  - `src/components/Table/tableLogic.test.ts`(`fast-check`によるPBT: PBT-03不変性検証を含む)
- [x] **Step 2: Table本体の生成**(`CellEditor.tsx`の既定エディタを含む)
  - `src/components/Table/Table.tsx`, `Table.css`, `index.ts`
- [x] **Step 3: Tableの単体テスト**
  - `src/components/Table/Table.test.tsx`(ソート/ページネーション/行選択/列幅調整/インライン編集/カスタムeditComponent、vitest-axe含む)
- [x] **Step 4: バレルエクスポート更新**(`src/index.ts`)
- [x] **Step 5: HTML版デモへの反映**(`html-demo/components/table-demo.html`、`html-demo/index.html`更新)
- [x] **Step 6: サマリードキュメント作成**

## 共通ルール(継続)

- ライセンス表記、セマンティックトークン参照、`data-testid`、JSDoc

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
