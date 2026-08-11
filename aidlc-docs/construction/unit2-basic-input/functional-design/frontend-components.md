# Frontend Components — Unit 2: 基本入力系

## Button

- **Props**: `variant`(primary/secondary/danger/ghost, デフォルトprimary), `size`(sm/md/lg, デフォルトmd), `loading`(デフォルトfalse), `disabled`, `className`, `style`, 標準`<button>`属性(`onClick`, `type`等)
- **状態**: 内部stateなし(Presentational)
- **レンダリング**: `loading`時はスピナー(`Icon`は使わず、CSSアニメーションのスピナー要素を使用。回転動作はIconレジストリの静的アイコンでは表現しづらいため)+ `disabled`属性 + `aria-busy`
- **ref**: `forwardRef<HTMLButtonElement>`

## FormField

- **Props**: `label`, `error?`, `helperText?`, `required?`, `children`
- **状態**: `useId()`で`fieldId`を生成(内部state不要)
- **レンダリング構造**: `<label>` + `children`(Input系コンポーネント) + (helperTextまたはerrorのテキスト、`role="alert"`はerror時のみ)
- **Context提供**: `FormFieldContext.Provider`で`{fieldId, errorId, helperTextId, hasError}`を公開
- **ユーザー操作フロー**: ラベルクリックで入力欄にフォーカスが移る(`<label htmlFor={fieldId}>`)

## TextInput

- **Props**: `ControllableProps<string>` + `placeholder`, `disabled`, `className`, `style`, 標準`<input>`属性
- **状態**: Uncontrolledモード時のみ内部state
- **FormField連携**: `useContext(FormFieldContext)`があれば`id`/`aria-describedby`/`aria-invalid`を自動設定
- **ref**: `forwardRef<HTMLInputElement>`

## Textarea

- **Props**: TextInputと同様 + `rows`(デフォルト3)
- **状態・連携**: TextInputに準ずる
- **スタイル**: `resize: vertical`(business-rules.md参照)
- **ref**: `forwardRef<HTMLTextAreaElement>`

## Select

- **Props**: `options: {label, value}[]`, `ControllableProps<string>`, `disabled`, `className`, `style`
- **状態・連携**: TextInputに準ずる
- **レンダリング**: ネイティブ`<select>` + `<option>`群(business-rules.md参照)。カスタム矢印アイコン(`chevron-down`)を`<select>`の上に絶対配置し、ネイティブの矢印は`appearance: none`で非表示にする
- **ref**: `forwardRef<HTMLSelectElement>`

## Checkbox

- **Props**: `ControllableProps<boolean>`(`checked`/`defaultChecked`という名前を使う。ネイティブinputとの一貫性のため`value`ではなく`checked`)、`disabled`, `label?`(単体でラベル文言を持たせたい場合、FormFieldを介さない軽量な使い方)
- **状態・連携**: TextInputに準ずる(ただし対象propは`checked`)
- **レンダリング**: ネイティブ`<input type="checkbox">` + カスタムチェックマーク(`check`アイコンを`::after`相当でCSS表示、または`checked`時のみ`Icon`を重ねる)
- **ref**: `forwardRef<HTMLInputElement>`

## Switch

- **Props**: Checkboxと同様の`ControllableProps<boolean>`(`checked`/`defaultChecked`)
- **状態・連携**: Checkboxに準ずる
- **レンダリング**: ネイティブ`<input type="checkbox" role="switch">` + トラック/つまみのCSS表現
- **ref**: `forwardRef<HTMLInputElement>`

## RadioGroup / Radio

- **RadioGroup Props**: `name`, `options: {label, value}[]`, `ControllableProps<string>`(Application Design Question 1 = B: props駆動)
- **RadioGroup 状態**: TextInputに準ずる(選択中の`value`を管理し、`Radio`群へ`checked`/`onChange`を配布)
- **RadioGroup レンダリング**: `options`をmapして内部で`Radio`を複数描画。`role="radiogroup"`、FormField連携時は`aria-describedby`をgroup要素に設定
- **Radio(内部実装用プリミティブ)Props**: `checked`, `onChange`, `disabled`, `label`, `name`, `value`
- **キーボード操作**: ネイティブ`<input type="radio">`をグループ化(同一`name`)することで、矢印キーによるグループ内移動はブラウザ標準の挙動に従う(独自実装不要)
- **ref**: RadioGroupは`forwardRef`非対応(グループ全体を指すDOM要素が無いため)。Radioは`forwardRef<HTMLInputElement>`
