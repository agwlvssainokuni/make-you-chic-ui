# Functional Design Plan — Unit 6: Table

## 実施タスク

- [ ] `aidlc-docs/construction/unit6-table/functional-design/business-logic-model.md` を作成
- [ ] `aidlc-docs/construction/unit6-table/functional-design/business-rules.md` を作成
- [ ] `aidlc-docs/construction/unit6-table/functional-design/domain-entities.md` を作成
- [ ] `aidlc-docs/construction/unit6-table/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 適用。ソート・ページネーション・行選択・列幅調整・インライン編集の全ロジック
- **Domain Model**: 適用。`TableColumn`, `SortState`等の型
- **Business Rules**: 適用。ソート3段階トグル規則、行ID抽出規則、編集確定/キャンセル規則
- **Data Flow**: 適用。ページネーションのデータ所有(Table内部かControlled外部か)
- **Integration Points**: 非該当
- **Error Handling**: 非該当
- **Business Scenarios**: 限定的に適用。編集中に他セルをクリックした場合の挙動
- **Frontend Components**: 適用。Tableのprops・状態構造

## 確認質問

### Question 1: ソートの対象範囲

複数列にまたがるソート(第1キー・第2キー)に対応しますか?

A) 単一列のみ(reference/table-advanced-demo.htmlの参考実装と同様、常に1列のみソート可能)

B) 複数列対応(Shift+クリックで第2ソートキーを追加できる等)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: ページネーションのデータ所有

`data` propとページネーションの関係を確認します。

A) `data`propには全件データを渡し、Tableが内部で現在ページ分をスライスして表示する(`page`/`pageSize`から表示範囲を算出。合計件数は`data.length`から自動算出)

B) `data`propには現在ページ分のデータのみを渡し(利用側がサーバーサイドページネーション等で事前にスライス済み)、Tableは表示のみを担当する。この場合、総件数を`totalCount`propで別途受け取る必要がある

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: 行の一意なID抽出方法

行選択(`Set`管理)や編集対象特定のために、各行データから一意なIDをどう取得しますか?

A) `getRowId: (row: T) => string`propを必須とし、利用側がID抽出方法を指定する(データ型を問わず柔軟に対応できる)

B) 各行オブジェクトが`id`プロパティを持つことを前提とする(`T extends { id: string }`という型制約を課す)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: 列幅調整の実装方式

reference/CLAUDE.mdに「列幅調整(DOM直接操作、stateはドラッグ終了時のみ更新)」という既定方針がありますが、この方針で実装してよいか確認します。

A) はい。ドラッグ中は`ref`経由で直接DOM(`style.width`)を書き換え、Reactの再レンダリングを発生させない。ドラッグ終了時(`mouseup`)にのみReact stateへ反映する(パフォーマンス重視、reference踏襲)

B) いいえ、ドラッグ中も都度Reactのstateを更新する(実装がシンプルだが、大量行データの場合パフォーマンス懸念)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5: インライン編集の対象列・入力方式

「セルクリックによるインライン編集」について、どの列が編集可能か、どんな入力コントロールを使うかを確認します。

A) `TableColumn`に`editable?: boolean`を追加し、trueの列のみ編集可能。編集時は常にUnit 2の`TextInput`(単一行テキスト)を使用する(データ型に関わらずテキストとして編集し、確定時に呼び出し元でパースする)

B) 列ごとに編集用コンポーネントを指定できるようにする(`editComponent?: React.ComponentType`等)、より柔軟だが実装コストが高い

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 6: インライン編集の開始トリガーと競合時の挙動

編集モードはどう開始し、編集中に別のセルをクリックした場合どうなりますか?

A) 編集可能セルのシングルクリックで即座に編集モードへ。編集中に別セルをクリックした場合、現在の編集内容を確定してから新しいセルの編集を開始する(Excelライクな挙動)

B) 編集可能セルのシングルクリックで編集モードへ。編集中に別セルをクリックした場合、現在の編集はキャンセルされる

X) Other (please describe after [Answer]: tag below)

[Answer]: 
