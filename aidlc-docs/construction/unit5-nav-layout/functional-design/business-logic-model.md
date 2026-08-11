# Business Logic Model — Unit 5: ナビゲーション・レイアウト系

## Tabsのキーボード操作・状態遷移

```
1. activeIndex(Controlled/Uncontrolled)で現在選択中のタブを管理
2. タブ要素上で矢印キー押下 → 次/前のインデックスを計算(端では循環しない。Home/Endは循環と別扱い)
   → setValue(newIndex)を呼び、対応するタブに.focus()する(business-rules.mdのroving tabindex規則)
3. Home/Endキー → 最初/最後のインデックスに移動・フォーカス
```

## Dropdown/Menuの開閉・キーボード操作

```
1. トリガークリック → open状態をtrueにし、次のレンダリングで最初のメニュー項目にフォーカス
2. 開いている間、documentレベルでclickイベントを監視 → メニュー外クリックでclose
3. 開いている間、keydownイベントを監視:
   - ArrowDown/ArrowUp: フォーカス中の項目インデックスを算出し、次/前の項目に.focus()(循環)
   - Home/End: 先頭/末尾の項目に.focus()
   - Escape: close()してトリガー要素に.focus()を戻す
   - Enter/Space: フォーカス中の項目のonClickを実行してclose()
4. 項目クリック: 対応するonClickを実行してclose()
```

## AppShellのユーザーメニュー合成

```
1. userMenuItemsが指定されている場合:
   <Dropdown trigger={<Avatar .../>} items={userMenuItems} placement="bottom-end" />
   をTopbar内に配置する(Dropdown/Menuの実装をそのまま再利用)
2. userMenuItemsが未指定の場合:
   <Avatar .../>のみを表示(クリックハンドラなし)
```

## AppShellの折り畳み状態

```
(Unit 1のservices.mdで既に方針決定済みのため、詳細はそちらを参照)
1. マウント時、localStorageから折り畳み状態を復元(キー例: "design-system-appshell-collapsed")
2. toggleCollapsed/setCollapsed呼び出し時、state更新 + localStorage書き込み
3. useAppShell()経由でTopbar・Content等の子から状態を参照可能にする(内部Context)
```
