# Business Rules — Unit 4: フィードバック系

## Modal

- **初期フォーカス(Question 1 = B)**: `initialFocusRef`が指定され、かつその要素がフォーカス可能であればそこへ。指定がなければModal内で最初に見つかったフォーカス可能要素(`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`)へ
- **フォーカストラップ**: Tab/Shift+TabでModal内のフォーカス可能要素のみを循環させる(最後の要素でTabを押すと最初へ、最初の要素でShift+Tabを押すと最後へ)
- **背景無効化**: 開いているModalの背景となる要素すべてに`inert`属性を付与する(要件定義書FR1準拠)
- **多重表示(Question 2 = A)**: 複数Modalを開いた場合、開いた順にz-indexを加算するスタックとして管理する。フォーカストラップは常に最上位(最後に開いた)Modalに適用する。最上位Modalを閉じると、その下のModalにフォーカストラップが戻る
- **クローズ規則**: Escキー、背景クリック、明示的な閉じるボタンのいずれでも閉じられる。閉じたら、そのModalを開いた際にフォーカスがあった要素に返す

## Toast(Question 3 = B, Question 4 = A)

- **デフォルト表示時間**: 4000ms。`duration`propで上書き可能
- **表示位置**: 画面右上(`position: fixed; top; right;`)
- **スタック順**: 新しいToastは既存のToastの上(画面端に近い側)に追加される
- **ホバー時の挙動**: マウスホバー中は自動消滅タイマーを一時停止し、ホバーが外れたら残り時間から再開する
- **`aria-live="polite"`**: Toastコンテナ全体に設定し、新規追加時にスクリーンリーダーへ通知する

## Alert/Banner

- variant(info/success/warning/danger)ごとに固定の配色・アイコンを使用する(業務ロジックとしての判定は無し、propsで直接指定)
- 自動消滅は行わない(Toastとの違い、常時表示コンポーネントのため)

## Tooltip(Question 5 = B, Question 6 = A)

- **表示トリガー**: `mouseenter`/`focus`で表示タイマー(300ms)を開始。タイマー完了前に`mouseleave`/`blur`が発生したらタイマーをキャンセルする
- **非表示トリガー**: `mouseleave`/`blur`/Escapeキーで即座に非表示(非表示にはディレイを設けない)
- **位置計算**: `placement`propに応じた基本オフセットを計算した上で、Tooltip要素が画面端(viewport)をはみ出す場合は反対側のplacementに自動的に切り替える(例: `placement="right"`だが画面右端に近い場合は`left`に切り替え)
