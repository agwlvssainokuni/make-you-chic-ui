# Application Design Plan — Web UI デザインシステム

## 実施タスク

- [ ] `aidlc-docs/inception/application-design/components.md` を作成(コンポーネント一覧・責務・インターフェース概要)
- [ ] `aidlc-docs/inception/application-design/component-methods.md` を作成(メソッド/フック シグネチャ、詳細ビジネスルールはFunctional Designで後述)
- [ ] `aidlc-docs/inception/application-design/services.md` を作成(Context/Provider等のサービス層定義とオーケストレーション)
- [ ] `aidlc-docs/inception/application-design/component-dependency.md` を作成(依存関係マトリクス・通信パターン)
- [ ] `aidlc-docs/inception/application-design/application-design.md` を作成(上記4つを統合したドキュメント)
- [ ] 設計の完全性・整合性を検証

## 設計方針確認質問

以下は今回のコンポーネント設計を進める上で、事前に方針を決めておきたい事項です。
各質問の `[Answer]:` タグの後ろに選択肢の記号で回答してください。当てはまらない場合は最後の「Other」を選び、内容を記述してください。

### Question 1: コンポーネントのAPIパターン(複合コンポーネント)

Tabs、Dropdown/Menu、RadioGroup、AppShell(Sidebarのナビ項目)のような「複数の子要素を持つ」コンポーネントのAPI設計方針はどちらにしますか?

A) 複合コンポーネントパターン(例: `<Tabs><Tabs.List><Tabs.Tab/></Tabs.List><Tabs.Panel/></Tabs>`)。柔軟だが利用側の記述量が増える

B) フラットなprops駆動パターン(例: `<Tabs items={[{label, content}]} />`)。記述はシンプルだがカスタマイズ性は下がる

C) 基本はB(props駆動)とし、Tabs/Dropdownなど利用側でのカスタムレンダリングが必要になりやすいものだけAも併用する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: Controlled / Uncontrolled

TextInput・Select・Checkbox・Radio・Switch・Tabs等の状態を持つコンポーネントは、Controlled(value+onChange必須)・Uncontrolled(defaultValue、内部state)のどちらを基本としますか?

A) Controlledのみ提供(value+onChangeを必須propとする、シンプルで予測可能)

B) 両対応(value指定時はControlled、未指定時はdefaultValueでUncontrolled、Reactのネイティブinputと同じ挙動)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: Iconコンポーネントのアイコン供給方法

Iconコンポーネントは、具体的にどのようにアイコンを供給しますか?

A) ライブラリ内にSVGアイコンセットを同梱し、`<Icon name="user" />`のように名前で参照する

B) `<Icon>`は共通のサイズ・色・aria属性を適用するラッパーのみ提供し、実際のSVGは利用側が`children`として渡す

C) 既存のアイコンライブラリ(react-iconsやlucide-react等)に依存し、`<Icon>`はその薄いラッパーとする

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: テーマ機能のサービス層設計

`data-theme`/`data-brand`/`data-font-family`/`data-font-size`のテーマ4軸(状態管理・`localStorage`永続化・切り替えAPI)は、デザインシステム側で `ThemeProvider` + `useTheme()` フックのようなサービスとして提供しますか、それとも `<html>` 属性の設定は利用側アプリケーションの責務とし、デザインシステムはCSS側の対応(セマンティックトークン)のみ提供しますか?

A) `ThemeProvider`/`useTheme()`をデザインシステム側で提供する(状態管理・永続化・切り替えAPIを内包)

B) デザインシステムはCSS(セマンティックトークン)のみ提供し、`<html>`属性の切り替え・永続化ロジックは利用側の責務とする(組み込みガイドに実装例を記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5: AppShellの状態アクセス

AppShellのSidebar折り畳み状態を、Topbarや他の子コンポーネントから制御・参照する必要はありますか?(例: Topbarにハンバーガーボタンを置いて折り畳みを操作する等)

A) 必要。`AppShell`内部でContextを持ち、`useAppShell()`のようなフックで子コンポーネントから状態参照・操作を可能にする

B) 不要。折り畳みトグルはAppShell内部(Sidebar自身)で完結させ、外部からの制御APIは用意しない

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 6: FormFieldとInput系コンポーネントの連携方式

FormField(ラベル・エラーメッセージ表示の枠)とTextInput/Textarea/Select/Checkbox/Radio/Switch(入力本体)の連携(`id`/`aria-describedby`等の自動紐付け)は、どちらの方式にしますか?

A) Context方式: `<FormField>`がContextでid/エラー状態を提供し、内側のInput系コンポーネントが自動的にそれを参照する(利用側の記述が少ない)

B) Props方式: `<FormField>`と`<TextInput>`は独立しており、利用側が`id`/`aria-describedby`を明示的に一致させて渡す(参照実装の`useId()`方針に近い、依存が疎)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 7: スタイル上書きポリシー

各コンポーネントは、利用側からの`className`/`style`によるスタイル上書きを許容しますか?

A) 許容する。`className`/`style`propsを全コンポーネントで受け付け、利用側でのカスタマイズを可能にする

B) 許容しない。デザインシステムとしての一貫性を優先し、variant/size等の定義済みpropsのみでスタイルを制御する(独自CSSでの上書きは非推奨)

C) 限定的に許容。レイアウト調整に関わるprops(`className`のみ)は許容し、内部要素のスタイル(`style`)は許容しない

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 8: ref転送の対象範囲

`forwardRef`対応は、reference/CLAUDE.mdで明記されているFormField系(TextInput/Select/Checkbox等)以外に、どこまで広げますか?

A) FormField系のみ(reference/CLAUDE.mdの記載通り)

B) DOM要素をルートに持つ全コンポーネント(Button, Card, Avatar等も含む)に広げ、一貫性を持たせる

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 9: パッケージのエクスポート構成

React版コンポーネントのimport方法はどうしますか?

A) 単一のバレルエクスポート(`import { Button, TextInput } from 'design-system'`のように1箇所からまとめて import)

B) サブパスエクスポート(`import { Button } from 'design-system/Button'`のようにコンポーネント単位でimportし、Tree Shakingやビルドサイズを意識する)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
