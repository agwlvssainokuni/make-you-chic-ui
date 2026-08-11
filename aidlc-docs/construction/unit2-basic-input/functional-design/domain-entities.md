# Domain Entities — Unit 2: 基本入力系

## FormFieldContext

```ts
interface FormFieldContextValue {
  /** 入力要素に紐付けるid(useId()で生成) */
  fieldId: string
  /** エラーメッセージ表示用要素のid(aria-describedbyの参照先)。error未指定時はundefined */
  errorId: string | undefined
  /** 補助テキスト表示用要素のid(aria-describedbyの参照先)。helperText未指定時はundefined */
  helperTextId: string | undefined
  /** エラー状態の有無(input要素のaria-invalid制御用) */
  hasError: boolean
}
```

## Controlled/Uncontrolled 共通の型パターン

```ts
// 値を持つ全コンポーネントで共通の型シグネチャパターン(Application Design Question 2 = B)
interface ControllableProps<T> {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}
```

具体的な`T`は各コンポーネントで異なる(TextInput: `string`, Checkbox/Switch: `boolean`, RadioGroup/Select: `string`)。
