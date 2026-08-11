# Frontend Components — Unit 7: 画面パターン(examples/、パッケージ非公開)

## ListView(`examples/ListView/ListView.tsx`)

- 構成: フィルタバー(TextInput + Select)+ 一括操作バー(選択時のみ)+ `Table`(name/email/role列、role列は`render`でBadge表示、name列は`sortable`)+ 行アクション(編集・削除ボタン)
- 使用コンポーネント: AppShell(Contentスロット内に配置する想定)、TextInput, Select, Table, Button, Checkbox(Table内蔵)、Modal(編集・削除確認)

## DetailView(`examples/DetailView/DetailView.tsx`)

- 構成: ヘッダー(Avatar+名前+役割)+ `Tabs`(基本情報/アクセス権限/危険操作)
- 基本情報タブ: Description Listパターン(`.description-list`系CSS、FR2)
- アクセス権限タブ: `Table`(表示専用、ソート・編集なし)
- 危険操作タブ: `Card`で囲んだ危険操作ブロック + `TextInput`(確認テキスト)+ `Button`(variant="danger", disabled制御)
- 使用コンポーネント: Avatar, Tabs, Card, TextInput, Button, Table

## EditUserModal(`examples/EditUserModal/EditUserModal.tsx`)

- Props: `mode: 'create' | 'edit'`, `user?: SampleUser`, `open`, `onClose`, `onSave: (values) => void`
- 構成: `Modal` + `FormField`(名前/メールアドレス/役割)+ 保存/キャンセルButton
- 使用コンポーネント: Modal, FormField, TextInput, Select, Button

## DeleteConfirmModal(`examples/DeleteConfirmModal/DeleteConfirmModal.tsx`)

- Props: `variant: 'simple' | 'typed-confirmation'`, `targetName?`(typed-confirmation時に必須), `open`, `onClose`, `onConfirm`
- `simple`: 「削除しますか?」+ 削除/キャンセルボタン
- `typed-confirmation`: 対象名入力欄 + 一致時のみ有効化される削除ボタン
- 使用コンポーネント: Modal, TextInput(typed-confirmation時のみ), Button

## HTML版デモとの対応

`html-demo/patterns/`配下に、上記4パターンに対応するVanilla JS実装を配置する(`reference/integrated-app-demo.html`の既存実装をベースに、Unit 1〜6で確定したトークン・命名規則に合わせて拡張)。
