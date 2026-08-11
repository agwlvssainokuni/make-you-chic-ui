# Code Generation Summary — Unit 4: フィードバック系

## 生成したアプリケーションコード

### 共通ユーティリティ(新規)
- `src/utils/getFocusableElements.ts`
- `src/utils/useFocusTrap.ts`

### コンポーネント
- `src/components/Modal/`(Modal, `ModalStackContext`(スタック管理・inert制御), CSS, index, テスト)
- `src/components/Toast/`(ToastProvider, useToast, CSS, index, テスト)
- `src/components/Alert/`(Alert, CSS, index, テスト)
- `src/components/Tooltip/`(Tooltip, CSS, index, テスト)

### デザイントークンの追加
- `--color-warning`(Toast/Alertのwarning variant用)
- `--color-tooltip-bg` / `--color-tooltip-text`(Tooltipの反転配色用)
- React版(`src/theme/semantic.css`)・HTML版(`html-demo/assets/semantic.css`)の両方に追加し同期
- `.stylelintrc.json`の禁止パターンにorange/purpleプリミティブを追加(既存の抜け漏れを修正)

### バレルエクスポート
- `src/index.ts` に9つのエクスポート(Modal, ModalStackProvider, ToastProvider, useToast, 型4種, Alert, Tooltip)を追加

## 生成したHTML版デモ(FR6)

- `html-demo/components/feedback-demo.html`(Modal/Toast/Alert/TooltipをVanilla JSで実装)
- `html-demo/index.html` のリンク一覧を更新

## 実装時の設計修正

- Toast.cssのスタック順を当初`column-reverse`としたが、コンテナが画面上端に固定配置されるため「新しいものが上」という要件を満たすには通常の`column`方向が正しいことに気付き修正
- Toast/Tooltipで当初プリミティブトークン(`--orange-500`, `--gray-900`)を直接参照していたが、NFR2(セマンティックトークンのみ参照)に反するため`--color-warning`, `--color-tooltip-bg`, `--color-tooltip-text`をセマンティックトークンとして追加し置き換え

## ライセンス表記

生成した全コードファイルの先頭にApache License 2.0のライセンスコメント(`Copyright 2026 agwlvssainokuni`)を付与済み。

## 要件トレーサビリティ

FR1(Modal/Toast/Alert/Tooltip)、FR6(HTML版デモ)、NFR2、NFR6(フォーカストラップ、`inert`、`aria-live`)に対応する実装を完了。
