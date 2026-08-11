# Functional Design Plan — Unit 2: 基本入力系

対象: Button, FormField, TextInput, Textarea, Select, Checkbox, Radio/RadioGroup, Switch

## 実施タスク

- [x] `aidlc-docs/construction/unit2-basic-input/functional-design/business-logic-model.md` を作成
- [x] `aidlc-docs/construction/unit2-basic-input/functional-design/business-rules.md` を作成
- [x] `aidlc-docs/construction/unit2-basic-input/functional-design/domain-entities.md` を作成
- [x] `aidlc-docs/construction/unit2-basic-input/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 適用。FormFieldのContext連携ロジック、Controlled/Uncontrolled両対応の実装方式
- **Domain Model**: 限定的に適用。フォーム入力値やエラー状態の型定義
- **Business Rules**: 適用。Controlled/Uncontrolled判定規則、FormField未使用時のフォールバック規則
- **Data Flow**: 適用。FormField→Input系コンポーネントへのid/エラー伝播フロー
- **Integration Points**: 非該当。外部API連携なし(react-hook-form等のフォームライブラリとの連携はrefを介した一般的な統合のみで、本ユニット側で特別な統合コードは持たない)
- **Error Handling**: 適用。エラー表示のタイミング・責務分界(バリデーションロジック自体は利用側の責務か)
- **Business Scenarios**: 限定的に適用。FormField外でInput系コンポーネント単体を使うケース
- **Frontend Components**: 適用。全8コンポーネントの構造・props・状態

## 確認質問

### Question 1: FormField外でのInput系コンポーネント単体利用

TextInput等をFormFieldで包まずに単体で使用した場合(Context値が存在しない場合)、どう振る舞いますか?

A) 単体でも問題なく動作する。Context値がない場合は`useId()`を自前で呼び、`id`/`aria-describedby`なしで通常のinputとして機能する

B) 単体使用は非推奨とし、開発時にconsole.warnを出す(が、動作自体はする)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2: Selectの実装方式

Selectコンポーネントは、ネイティブ`<select>`要素をベースにしますか、それともカスタムドロップダウン(独自スタイリングのリスト)にしますか?

A) ネイティブ`<select>`要素をベースにする(ブラウザ標準のa11y・モバイル操作性を活用。スタイリングの自由度は制限される)

B) カスタムドロップダウン(Unit 5で作るDropdown/Menuの仕組みを流用)。ただしUnit 5は未実装のため、Unit 2時点では前方参照になる

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3: Buttonのloading状態の見た目

`loading`propが`true`の場合、Buttonはどう表示されますか?

A) スピナーアイコンをテキストの前に表示し、ボタン自体も`disabled`にする(多重クリック防止)

B) 見た目は変えず`aria-busy="true"`のみ設定し、スタイリング(スピナー表示等)は利用側CSSに委ねる

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: バリデーションロジックの責務分界

FormField/Input系コンポーネント自体が入力値のバリデーション(必須チェック、フォーマットチェック等)を行いますか、それとも`error` propを通じて外部から与えられたエラー状態を表示するだけですか?

A) 表示のみ。バリデーションロジックは一切持たず、`error`propの有無・内容をそのまま表示する(react-hook-form等の外部フォームライブラリとの併用を前提とし、責務を分離する)

B) 簡易バリデーション(必須項目の空チェック程度)は内蔵する

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5: Textareaのリサイズ

Textareaはユーザーによる手動リサイズ(ブラウザ標準のドラッグハンドル)を許可しますか?

A) 許可する(`resize: vertical`、縦方向のみ)

B) 許可しない(`resize: none`、固定サイズ)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
