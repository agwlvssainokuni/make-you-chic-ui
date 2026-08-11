# Frontend Components — Unit 5: ナビゲーション・レイアウト系

## Tabs

- **Props**: `items: TabItem[]`, `activeIndex?`, `defaultActiveIndex?`(デフォルト0), `onChange?`
- **状態**: `useControllableState`(Unit 2で作成した共通フックを再利用)で現在のインデックスを管理
- **レンダリング**: `role="tablist"` + `role="tab"`(各タブ、roving tabindex) + `role="tabpanel"`(アクティブなもののみDOM上に存在させる。非表示パネルは描画しない方針とし、`display:none`によるDOM保持は行わない)
- **ref**: 不要

## Dropdown/Menu(コンポーネント名`Dropdown`)

- **Props**: `trigger: React.ReactElement`, `items: MenuItem[]`, `placement?`(bottom-start/bottom-end, デフォルトbottom-start)
- **状態**: `open: boolean`、フォーカス中の項目インデックス
- **実装方式**: `trigger`に`cloneElement`でクリックハンドラを注入(Tooltipと同様の手法)。メニュー本体は`createPortal`でbody直下に配置し、Tooltipの位置計算ロジック(衝突検出含む)を再利用する
- **a11y**: `role="menu"` + 各項目`role="menuitem"`、トリガーに`aria-haspopup="true"` `aria-expanded`
- **ref**: 不要

## AppShell

- **Props**: `navItems: AppShellNavItem[]`, `user?: {name, avatarSrc?}`, `userMenuItems?: AppShellUserMenuItem[]`, `children`(Contentスロット)
- **状態**: 折り畳み状態(内部Context、business-logic-model.md参照)
- **レンダリング構造**:
  - `Sidebar`(内部実装、公開コンポーネントではない): `navItems`をmapしてナビゲーションリンクを描画。折り畳み時はIconのみ表示
  - `Topbar`(内部実装): 折り畳みトグルボタン(`menu`アイコン)+ ユーザーメニュー(Avatar、`userMenuItems`があればDropdown経由)
  - `Content`: `children`をそのまま描画するメインエリア
- **公開Context**: `useAppShell()` → `{ collapsed, toggleCollapsed, setCollapsed }`
- **ref**: 不要
