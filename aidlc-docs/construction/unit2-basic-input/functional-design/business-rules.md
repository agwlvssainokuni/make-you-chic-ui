# Business Rules — Unit 2: 基本入力系

## Controlled/Uncontrolled 併用禁止規則

- `value`と`defaultValue`を同時に指定した場合、`value`を優先(Controlledとして扱う)しつつ、開発時に`console.warn`で警告する
- コンポーネントのライフサイクル中に`value`の有無(Controlled⇔Uncontrolled)を切り替えることは非推奨とし、開発時に警告する(Reactの一般的なベストプラクティスに準拠)

## Select(Question 2 = A: ネイティブ`<select>`)

- ネイティブ`<select>`要素をベースとし、`<option>`は`options: {label, value}[]`propsから生成する
- 見た目のカスタマイズはCSSで可能な範囲(矢印アイコンの差し替え、枠線等)に留め、ドロップダウンリスト自体の表示はブラウザ標準に委ねる
- 将来Unit 5でDropdown/Menuが実装された後、より高度なカスタムSelectが必要になった場合は別コンポーネント(例: `ComboBox`)として追加する。既存のSelectはネイティブ実装のまま維持する(破壊的変更を避ける)

## Buttonのloading/disabled

- `loading`と`disabled`はどちらか一方がtrueであれば、実際のDOM上の`disabled`属性はtrueになる
- `loading=true`かつ`disabled=false`の場合でも、`disabled` propの見た目上の値としては`false`のまま扱う(呼び出し元が`disabled` propを見て判定ロジックを組む場合の一貫性のため。実際のクリック不可制御はDOM属性側で行う)

## Textareaのリサイズ(Question 5 = A)

- `resize: vertical`をデフォルトとし、横方向のリサイズは許可しない(レイアウト崩れ防止)
- `rows`propで初期の行数を指定可能とする(デフォルト: 3)
