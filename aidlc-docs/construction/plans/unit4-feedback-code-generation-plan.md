# Code Generation Plan — Unit 4: フィードバック系

## ユニットコンテキスト

- **対応要件**: FR1(Modal/Toast/Alert/Tooltip), NFR6(a11y: フォーカストラップ、`inert`、`aria-live`)
- **依存ユニット**: Unit 1(Icon), Unit 2(Button、Alert/Modalのアクションボタンで使用)
- **設計根拠**: `aidlc-docs/construction/unit4-feedback/functional-design/`

## 実施ステップ

- [ ] **Step 1: 共通ユーティリティ生成**
  - `src/utils/useFocusTrap.ts`(フォーカストラップ、Modalスタック管理)
  - `src/utils/getFocusableElements.ts`
- [ ] **Step 2: Modal 生成 + 単体テスト**
  - `src/components/Modal/Modal.tsx`, `Modal.css`, `index.ts`, `Modal.test.tsx`(vitest-axe含む)
- [ ] **Step 3: Toast/ToastProvider 生成 + 単体テスト**
  - `src/components/Toast/{ToastProvider,useToast,Toast}.tsx`, `Toast.css`, `index.ts`, `Toast.test.tsx`
- [ ] **Step 4: Alert 生成 + 単体テスト**
  - `src/components/Alert/Alert.tsx`, `Alert.css`, `index.ts`, `Alert.test.tsx`
- [ ] **Step 5: Tooltip 生成 + 単体テスト**
  - `src/components/Tooltip/Tooltip.tsx`, `Tooltip.css`, `index.ts`, `Tooltip.test.tsx`
- [ ] **Step 6: バレルエクスポート更新**(`src/index.ts`)
- [ ] **Step 7: HTML版デモへの反映**(`html-demo/components/feedback-demo.html`、`html-demo/index.html`更新)
- [ ] **Step 8: サマリードキュメント作成**

## 共通ルール(継続)

- ライセンス表記、セマンティックトークン参照、`data-testid`、JSDoc

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
