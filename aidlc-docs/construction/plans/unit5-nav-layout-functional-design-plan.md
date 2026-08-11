# Functional Design Plan — Unit 5: ナビゲーション・レイアウト系

対象: Tabs, Dropdown/Menu, AppShell

## 実施タスク

- [ ] `aidlc-docs/construction/unit5-nav-layout/functional-design/business-logic-model.md` を作成
- [ ] `aidlc-docs/construction/unit5-nav-layout/functional-design/business-rules.md` を作成
- [ ] `aidlc-docs/construction/unit5-nav-layout/functional-design/domain-entities.md` を作成
- [ ] `aidlc-docs/construction/unit5-nav-layout/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 適用。Tabsのキーボード操作、Dropdownの開閉制御、AppShellの折り畳み状態(永続化はUnit1のservices.mdで既に方針決定済み)
- **Domain Model**: 限定的に適用。AppShellのnavItems/userMenuItems型
- **Business Rules**: 適用。キーボード操作規則、Dropdown開閉規則
- **Data Flow**: 非該当
- **Integration Points**: 非該当
- **Error Handling**: 非該当
- **Business Scenarios**: 非該当
- **Frontend Components**: 適用。全3コンポーネントの構造・props・状態

## 確認質問

### Question 1: Tabsのアクティベーションモード

矢印キーでタブ間を移動した際、即座にパネルを切り替えますか(automatic)、それともフォーカス移動のみでEnter/Spaceを押すまでパネルは切り替わりませんか(manual)?

A) automatic: 矢印キーでフォーカスが移動すると同時にパネルも切り替わる(WAI-ARIA Tabsパターンの推奨デフォルト)

B) manual: 矢印キーはフォーカス移動のみ、Enter/Spaceキーで明示的に選択した時にパネルが切り替わる

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: Dropdown/Menuの開閉トリガー

Dropdown/Menuはどのタイミングで開閉しますか?

A) クリックでトグル開閉(開いている状態でトリガーを再クリック、外側クリック、Escキーで閉じる)

B) ホバーで開き、ホバーが外れると閉じる(Tooltipと同様の方式)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: Dropdown/Menuのキーボード操作範囲

メニュー項目間のキーボード操作(矢印キーでの移動)は、WAI-ARIA Menuパターン相当のフルスペック(roving tabindex、Home/End対応等)まで実装しますか、簡易的な実装に留めますか?

A) フルスペック実装(矢印キーでの項目間移動、Home/Endで先頭/末尾へ、Escで閉じてトリガーへフォーカスを戻す)

B) 簡易実装(通常のTabキーでの移動のみ、矢印キー専用の制御は行わない)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: AppShellのユーザーメニュー項目

Application Design時点の`AppShellProps`には`user?: {name, avatarSrc?}`はありますが、クリック時に表示するメニュー項目(ログアウト等)を指定するpropsがありませんでした。どう補いますか?

A) `userMenuItems?: {label, onClick}[]`propを追加し、指定があればAvatar+Dropdownでメニューを表示、未指定ならAvatarをクリックしても何も起きない(ただの表示)

B) メニュー項目は持たず、Avatarはクリック不可の表示専用とする(ユーザーメニューの実体は利用側がchildren経由で独自に実装する)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5: AppShellの通知アイコンクリック時の挙動

`notificationCount`propはBadgeの件数表示のみですが、通知アイコン自体をクリックした時の挙動を補います。

A) `onNotificationClick?: () => void`propを追加し、指定があればクリック時に呼び出す(通知一覧パネルの表示等は利用側の責務)

B) クリックイベントは扱わない(表示専用)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 6: AppShellのウィンドウ幅変化時の挙動

NFR9(デスクトップのみのレスポンシブ)の範囲内で、ウィンドウ幅が変化した場合にSidebarを自動的に折り畳みますか?

A) 自動折り畳みは行わない。折り畳みはユーザーの明示的なトグル操作のみで変化する(デスクトップ幅の範囲内という前提のため)

B) 一定の幅(例: 1024px)を下回ったら自動的に折り畳み状態にする

X) Other (please describe after [Answer]: tag below)

[Answer]: 
