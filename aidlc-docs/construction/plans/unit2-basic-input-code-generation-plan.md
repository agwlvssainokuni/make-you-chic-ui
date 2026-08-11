# Code Generation Plan — Unit 2: 基本入力系

## ユニットコンテキスト

- **対応要件**: FR1(該当コンポーネント)、NFR6(a11y: `useId()`によるラベル紐付け、`aria-describedby`)
- **依存ユニット**: Unit 1(基盤) — トークン・`Icon`を使用
- **後続ユニットへの提供インターフェース**: `Button`, `FormField`, `TextInput`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`/`Radio`(Unit 6のTableが`Checkbox`を、Unit 7の画面パターンが全般を利用する)
- **設計根拠**: `aidlc-docs/construction/unit2-basic-input/functional-design/`(NFR Requirements/NFR DesignはSKIP、Unit 1の決定を継承)

## 全ユニット共通ルール(Unit 1から継続)

- 生成する全コードファイルの先頭にApache License 2.0のライセンス表記コメント(`Copyright 2026 agwlvssainokuni`)を付与する
- コンポーネントのCSSはセマンティックトークンのみ参照する(NFR2、stylelintで検証)
- インタラクティブなDOM要素には`data-testid`属性を付与する(`{component}-{element-role}`命名規則)
- 公開コンポーネントのProps/戻り値にはJSDocを付与する

## 実施ステップ

- [x] **Step 1: FormField 生成(Context含む)+ 単体テスト**(共通ヘルパー`useFieldProps`を`useFieldProps.ts`として追加)
  - `src/components/FormField/FormFieldContext.ts`(Context定義)
  - `src/components/FormField/FormField.tsx`
  - `src/components/FormField/FormField.css`
  - `src/components/FormField/index.ts`
  - `src/components/FormField/FormField.test.tsx`(vitest-axe含む)

- [x] **Step 2: Button 生成 + 単体テスト**(`@testing-library/user-event`を依存関係に追加)
  - `src/components/Button/Button.tsx`, `Button.css`, `index.ts`
  - `src/components/Button/Button.test.tsx`(loading/disabled/variant/size、vitest-axe含む)

- [x] **Step 3: TextInput 生成 + 単体テスト**(共通ヘルパー`useControllableState`を`src/utils/`に追加、以降のコンポーネントで再利用)
  - `src/components/TextInput/TextInput.tsx`, `TextInput.css`, `index.ts`
  - `src/components/TextInput/TextInput.test.tsx`(Controlled/Uncontrolled、FormField連携、FormField外単体利用、vitest-axe含む)

- [x] **Step 4: Textarea 生成 + 単体テスト**
  - `src/components/Textarea/Textarea.tsx`, `Textarea.css`, `index.ts`
  - `src/components/Textarea/Textarea.test.tsx`

- [x] **Step 5: Select 生成 + 単体テスト**
  - `src/components/Select/Select.tsx`, `Select.css`, `index.ts`
  - `src/components/Select/Select.test.tsx`

- [x] **Step 6: Checkbox 生成 + 単体テスト**
  - `src/components/Checkbox/Checkbox.tsx`, `Checkbox.css`, `index.ts`
  - `src/components/Checkbox/Checkbox.test.tsx`

- [x] **Step 7: Switch 生成 + 単体テスト**
  - `src/components/Switch/Switch.tsx`, `Switch.css`, `index.ts`
  - `src/components/Switch/Switch.test.tsx`

- [x] **Step 8: RadioGroup / Radio 生成 + 単体テスト**(Checkbox/RadioのCSSは当初サイブリング結合子で設計したが、input要素をアイコン等と入れ子にする構造との不整合に気付き`:has()`ベースに修正)
  - `src/components/RadioGroup/Radio.tsx`(内部プリミティブ)
  - `src/components/RadioGroup/RadioGroup.tsx`, `RadioGroup.css`, `index.ts`
  - `src/components/RadioGroup/RadioGroup.test.tsx`

- [x] **Step 9: バレルエクスポート更新**
  - `src/index.ts`に8コンポーネントのexportを追加

- [x] **Step 10: HTML版デモへの反映**
  - `html-demo/components/basic-input-demo.html`(FormField配下にButton/TextInput/Textarea/Select/Checkbox/Switch/RadioGroupを並べたデモ、Vanilla JSでControlled相当の状態管理を再現)
  - `html-demo/index.html`のリンク一覧を更新

- [x] **Step 11: サマリードキュメント作成**
  - `aidlc-docs/construction/unit2-basic-input/code/summary.md`

## 要件トレーサビリティ

| 要件 | 対応ステップ |
|---|---|
| FR1(Button/FormField/TextInput/Textarea/Select/Checkbox/Switch/RadioGroup) | Step 1〜8 |
| FR6(HTML版デモ) | Step 10 |
| NFR2(セマンティックトークン参照) | Step 1〜8(各CSS) |
| NFR6(a11y) | Step 1〜8(各テストのvitest-axe、FormField連携) |

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
