# Code Generation Plan — Unit 8: 組み込みガイド

## ユニットコンテキスト

- **対応要件**: FR7(組み込みガイド)
- **依存ユニット**: Unit 1〜7(完成した全コンポーネント・画面パターン)
- **設計根拠**: `aidlc-docs/inception/application-design/`, `aidlc-docs/construction/unit1-foundation〜unit7-screen-patterns/`(全ユニットの決定事項を集約)
- **備考**: HTML版デモ成果物を持たない唯一のユニット(`unit-of-work.md`記載)

## 実施ステップ

- [ ] **Step 1: インストール・セットアップ手順**
  - `docs/integration-guide.md`(新規作成)冒頭: パッケージのインストール方法、`ThemeProvider`/`ToastProvider`/`ModalStackProvider`の設定方法
- [ ] **Step 2: コンポーネントのimport・基本的な使い方**
  - バレルエクスポート(`src/index.ts`)からのimport例、代表的なコンポーネント(Button, FormField, Table, AppShell)の最小サンプルコード
- [ ] **Step 3: テーマ設定方法**
  - `useTheme()`の使い方、`data-theme`/`data-brand`/`data-font-family`/`data-font-size`のカスタマイズ方法
- [ ] **Step 4: スタイルカスタマイズの指針**
  - `className`によるレイアウト調整の推奨、`style`propの位置づけ(トークンベースの一貫性を優先する旨の注意書き。Application Design留意事項の反映)
- [ ] **Step 5: Node.js不要のHTML版デモの案内**
  - `html-demo/`の位置づけと開き方の案内
- [ ] **Step 6: 既知の制約・今後の課題の案内**
  - 本リポジトリがプロトタイプ位置づけであること、レスポンシブがデスクトップのみであること等、requirements.mdのリスク欄・NFRを踏まえた既知の制約を明記
- [ ] **Step 7: サマリードキュメント作成**
  - `aidlc-docs/construction/unit8-integration-guide/code/summary.md`

## 共通ルール(継続)

- ライセンス表記(Markdownのためコメント形式は不要、代わりにガイド冒頭にライセンス言及を含める)

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
