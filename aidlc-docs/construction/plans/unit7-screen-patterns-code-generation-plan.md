# Code Generation Plan — Unit 7: 画面パターン

## ユニットコンテキスト

- **対応要件**: FR2(画面パターン)
- **依存ユニット**: Unit 1〜6(全コンポーネント)
- **設計根拠**: `aidlc-docs/construction/unit7-screen-patterns/functional-design/`
- **配置方針**: React実装は`examples/`(パッケージのバレルエクスポートには含めない、Unit 5の位置づけ決定を継続)、HTML版は`html-demo/patterns/`

## 実施ステップ

- [ ] **Step 1: サンプルデータ生成**
  - `examples/data/sampleUsers.ts`(`SampleUser`型、モックデータ配列)
- [ ] **Step 2: EditUserModal 生成 + 単体テスト**
  - `examples/EditUserModal/EditUserModal.tsx`, `EditUserModal.test.tsx`
- [ ] **Step 3: DeleteConfirmModal 生成 + 単体テスト**
  - `examples/DeleteConfirmModal/DeleteConfirmModal.tsx`, `DeleteConfirmModal.test.tsx`
- [ ] **Step 4: ListView 生成 + 単体テスト**
  - `examples/ListView/ListView.tsx`, `ListView.test.tsx`(EditUserModal/DeleteConfirmModalを利用)
- [ ] **Step 5: DetailView 生成 + 単体テスト**
  - `examples/DetailView/DetailView.tsx`, `DetailView.test.tsx`(DeleteConfirmModalを利用)
- [ ] **Step 6: HTML版デモへの反映**
  - `html-demo/patterns/list-view.html`, `html-demo/patterns/detail-view.html`(`reference/integrated-app-demo.html`をベースにUnit 1〜6のトークン・命名規則へ合わせて拡張)
  - `html-demo/index.html`のリンク一覧を更新
- [ ] **Step 7: サマリードキュメント作成**

## 共通ルール(継続)

- ライセンス表記、セマンティックトークン参照、`data-testid`、JSDoc
- examples/配下はパッケージのバレルエクスポート(`src/index.ts`)には追加しない

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
