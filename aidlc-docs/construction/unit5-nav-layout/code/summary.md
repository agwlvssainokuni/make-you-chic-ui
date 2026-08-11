# Code Generation Summary — Unit 5: ナビゲーション・レイアウト系

## 生成したアプリケーションコード

### 共通ユーティリティ(新規・リファクタリング)
- `src/utils/computeFloatingPosition.ts`(Unit 4のTooltip位置計算ロジックを切り出し、Dropdownと共用)
- `src/components/Tooltip/Tooltip.tsx`を上記ユーティリティ使用に更新(既存の挙動は変更なし)

### コンポーネント
- `src/components/Tabs/`(Tabs, CSS, index, テスト)
- `src/components/Dropdown/`(Dropdown, CSS, index, テスト)
- `src/components/AppShell/`(AppShell, AppShellContext, Sidebar(内部), Topbar(内部), CSS, index, テスト)

### デザイントークンの追加
- `--color-sidebar-text`(Sidebarのリンク文字色。プリミティブ直接参照から修正)
- React版・HTML版semantic.cssの両方に反映

### バレルエクスポート
- `src/index.ts` にTabs, Dropdown, AppShell, useAppShellを追加

## Application Design成果物への変更(Unit 5 Functional Designの決定を反映)

- `AppShellProps`から`notificationCount`を削除(通知アイコン機能を廃止)
- `AppShellProps`に`userMenuItems`を追加

## 生成したHTML版デモ(FR6)

- `html-demo/components/nav-layout-demo.html`
- `html-demo/index.html` のリンク一覧を更新

## ライセンス表記

生成した全コードファイルの先頭にApache License 2.0のライセンスコメント(`Copyright 2026 agwlvssainokuni`)を付与済み。

## 要件トレーサビリティ

FR1(Tabs/Dropdown/AppShell)、FR6(HTML版デモ)、NFR2、NFR9(デスクトップ幅追従)に対応する実装を完了。
