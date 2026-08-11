# Business Rules — Unit 5: ナビゲーション・レイアウト系

## Tabs(Question 1 = A: automatic)

- 矢印キー(←→)でタブ間のフォーカスを移動すると同時に、対応するパネルへ即座に切り替える
- Home/Endキーで最初/最後のタブへ移動する
- フォーカスがあるタブのみ`tabindex="0"`、他は`tabindex="-1"`(roving tabindex)

## Dropdown/Menu(Question 2 = A, Question 3 = A)

- トリガークリックで開閉トグル。開いている状態で: 外側クリック、Escキー、項目選択のいずれかで閉じる
- 開いた瞬間、最初のメニュー項目にフォーカスを移動する
- ↑↓キーで項目間を移動(末尾から↓で先頭へ循環、先頭から↑で末尾へ循環)
- Home/Endキーで先頭/末尾の項目へ
- Escキーで閉じてトリガー要素にフォーカスを戻す

## AppShell

- **ユーザーメニュー(Question 4 = A)**: `userMenuItems`が指定されていれば、Avatarをトリガーとする`Dropdown`を内部合成する。未指定であればAvatarはクリックハンドラを持たない表示専用要素とする
- **通知アイコン(Question 5 = X: 廃止)**: 実装しない。Topbarはユーザーメニューのみを右側に配置する
- **ウィンドウ幅変化時の挙動(Question 6 = A)**: リサイズイベントに対する自動折り畳みロジックは実装しない。折り畳み状態はユーザーの明示的なトグル操作(`useAppShell().toggleCollapsed()`)によってのみ変化する
