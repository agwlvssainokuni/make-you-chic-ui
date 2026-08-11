# Application Design — 統合ドキュメント

`aidlc-docs/inception/requirements/requirements.md`(FR1〜FR3)を実現するための高レベル設計。詳細は以下の個別ドキュメントを参照。

- [components.md](components.md) — コンポーネント一覧・責務・インターフェース概要
- [component-methods.md](component-methods.md) — メソッド/フックのシグネチャ
- [services.md](services.md) — サービス層(Provider/Context)定義
- [component-dependency.md](component-dependency.md) — 依存関係マトリクス・通信パターン・データフロー図

## 設計方針の決定事項(`aidlc-docs/inception/plans/application-design-plan.md`より)

| # | 決定事項 | 選択 |
|---|---|---|
| 1 | 複合コンポーネントAPIパターン | フラットなprops駆動(`items`配列等)を基本とする |
| 2 | Controlled/Uncontrolled | 両対応(value指定時Controlled、未指定時defaultValueでUncontrolled) |
| 3 | Iconのアイコン供給方法 | ライブラリ内にSVGアイコンセットを同梱、`name`で参照(外部ライブラリ非依存) |
| 4 | テーマのサービス層 | `ThemeProvider`/`useTheme()`をデザインシステム側で提供 |
| 5 | AppShellの状態アクセス | 内部Context + `useAppShell()`で子コンポーネントから参照・操作可能 |
| 6 | FormFieldとInput系の連携 | Context方式(id/aria-describedbyを自動紐付け) |
| 7 | スタイル上書きポリシー | `className`/`style`両方を全コンポーネントで許容 |
| 8 | ref転送の対象範囲 | DOM要素をルートに持つ全コンポーネントに`forwardRef`を適用 |
| 9 | パッケージエクスポート構成 | 単一のバレルエクスポート |

## コンポーネント構成サマリー

- **サービス層**: ThemeProvider/useTheme, ToastProvider/useToast
- **基本入力系**: Button, FormField, TextInput, Textarea, Select, Checkbox, Radio, RadioGroup, Switch
- **データ表示系**: Table, Avatar, Badge, Card, Icon
- **フィードバック系**: Modal, Toast, Alert/Banner, Tooltip
- **ナビゲーション・レイアウト系**: Tabs, Dropdown/Menu, AppShell

計19コンポーネント/フック(サービス層2、基本入力系9、データ表示系5、フィードバック系4、ナビゲーション・レイアウト系3 — Radioは内部実装用のためRadioGroupと合わせて1系統とカウント)。

## 留意事項

- **Question 7(スタイル上書き全許容)のトレードオフ**: `style` propsまで許容することで、デザインシステムとしてのトークンベースの一貫性が利用側の実装次第で崩れうる。組み込みガイド(FR7)にて「`style`は最終手段とし、まずvariant/size等の定義済みpropsを使うこと」を推奨事項として明記する
- **Icon(Question 3=A)の実装スコープ**: 汎用的な網羅的アイコンセットは作らず、他コンポーネントが実際に必要とする最小限のアイコン(メニュー、シェブロン、close、check、bell等)から着手する(過剰実装の回避)
- **RadioGroup/Radioの扱い**: Question 1=B(props駆動)を採用しつつ、Radio単体もプリミティブとして公開する。これはRadioGroupの内部実装であると同時に、FormField配下で単一のRadioを使いたいごく特殊なケースにも対応するため
- 本ドキュメントの範囲は「高レベルなコンポーネント識別・API方針」までであり、詳細なビジネスルール(バリデーション条件、エッジケースの挙動等)はConstruction phaseのFunctional Design(ユニット単位)で定義する
