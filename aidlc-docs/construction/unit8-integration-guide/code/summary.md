# Code Generation Summary — Unit 8: 組み込みガイド

## 生成した成果物

- `docs/integration-guide.md`(新規作成)

## 内容構成

1. インストール・セットアップ(`ThemeProvider`/`ToastProvider`/`ModalStackProvider`の配置)
2. コンポーネントのimportと基本的な使い方(Button, FormField+TextInput, Table, AppShellのサンプルコード。Tableは外部スライス方式のページネーション、AppShellは通知アイコン廃止の注記を含む)
3. テーマ設定(`useTheme()`の使い方、4軸の有効値一覧)
4. スタイルカスタマイズの指針(`className`優先、`style`は最終手段)
5. Node.js不要のHTML版デモの案内
6. 既知の制約・今後の課題(プロトタイプ位置づけ、レスポンシブはデスクトップのみ、Webフォントの手動配置、`examples/`は配布対象外)

## 要件トレーサビリティ

FR7(組み込みガイド)に対応する成果物を完了。本ユニットの完了により、Unit 1〜8すべての実装作業が完了した。

## 次のステージ

全ユニット完了のため、次は**Build and Test**フェーズへ進む。
