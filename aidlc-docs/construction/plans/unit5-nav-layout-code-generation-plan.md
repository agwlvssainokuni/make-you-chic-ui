# Code Generation Plan — Unit 5: ナビゲーション・レイアウト系

## ユニットコンテキスト

- **対応要件**: FR1(Tabs/Dropdown/AppShell), NFR9(レスポンシブ: デスクトップ幅追従)
- **依存ユニット**: Unit 1(Icon), Unit 2(Button/useControllableState), Unit 3(Avatar, Badge), Unit 4(Tooltipの位置計算ロジックを再利用)
- **設計根拠**: `aidlc-docs/construction/unit5-nav-layout/functional-design/`

## 実施ステップ

- [x] **Step 1: 位置計算ユーティリティの共通化**(`src/utils/computeFloatingPosition.ts`、Tooltip.tsxをリファクタリング)
  - Unit 4で`Tooltip.tsx`に実装した位置計算ロジックを`src/utils/computeFloatingPosition.ts`に切り出し、Tooltip/Dropdownの両方から再利用する(既存Tooltipの挙動を変えないようリファクタリング)
- [x] **Step 2: Tabs 生成 + 単体テスト**
  - `src/components/Tabs/Tabs.tsx`, `Tabs.css`, `index.ts`, `Tabs.test.tsx`(vitest-axe含む)
- [x] **Step 3: Dropdown 生成 + 単体テスト**
  - `src/components/Dropdown/Dropdown.tsx`, `Dropdown.css`, `index.ts`, `Dropdown.test.tsx`
- [x] **Step 4: AppShell 生成 + 単体テスト**(`--color-sidebar-text`セマンティックトークンを追加)
  - `src/components/AppShell/{AppShellContext,Sidebar,Topbar,AppShell}.tsx`, `AppShell.css`, `index.ts`, `AppShell.test.tsx`
- [x] **Step 5: バレルエクスポート更新**(`src/index.ts`)
- [x] **Step 6: HTML版デモへの反映**(`html-demo/components/nav-layout-demo.html`、`html-demo/index.html`更新)
- [x] **Step 7: サマリードキュメント作成**

## 共通ルール(継続)

- ライセンス表記、セマンティックトークン参照、`data-testid`、JSDoc

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
