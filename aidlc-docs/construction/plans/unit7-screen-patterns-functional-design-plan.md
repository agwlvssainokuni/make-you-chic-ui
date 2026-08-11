# Functional Design Plan — Unit 7: 画面パターン

対象: List View, Detail View, 編集Modal, 削除確認(FR2)。React実装は`examples/`(パッケージ非公開、Unit 5決定)、HTML版は`html-demo/patterns/`。

## 実施タスク

- [ ] `aidlc-docs/construction/unit7-screen-patterns/functional-design/business-logic-model.md` を作成
- [ ] `aidlc-docs/construction/unit7-screen-patterns/functional-design/business-rules.md` を作成
- [ ] `aidlc-docs/construction/unit7-screen-patterns/functional-design/domain-entities.md` を作成
- [ ] `aidlc-docs/construction/unit7-screen-patterns/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 限定的に適用。フィルタ・一括操作・削除確認のロジック(いずれもUnit1〜6のコンポーネント合成が中心で、新規ロジックは薄い)
- **Domain Model**: 適用。サンプルドメイン(ユーザー管理)のエンティティ定義
- **Business Rules**: 適用。削除確認の使い分け規則
- **Data Flow**: 適用。サンプルデータの所有・更新方法
- **Integration Points**: 非該当(実APIとの連携は行わない)
- **Error Handling**: 非該当
- **Business Scenarios**: 限定的に適用。新規作成/編集Modalの出し分け
- **Frontend Components**: 適用。4画面パターンの構成

## 確認質問

### Question 1: サンプルドメイン

reference/CLAUDE.mdのDetail View記述(アバター+名前+役割、アクセス権限タブ)に基づき、4画面パターン共通のサンプルドメインを「ユーザー管理」(id, name, email, role等)としてよいですか?

A) はい。ユーザー管理(id, name, email, role)をサンプルドメインとする

B) 別のドメインにしたい(Answerに記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: サンプルデータの所有方法

`examples/`はパッケージに含まれない参考実装のため、実APIとの通信は行わない前提で進めてよいですか?

A) はい。コンポーネント内にモックデータ配列を静的に保持し、編集・削除はコンポーネントのローカルstateのみを変更する(永続化なし、リロードで元に戻る)

B) 簡易的なモックAPI層(遅延を模したPromiseベースの関数等)を用意する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: List Viewのフィルタバー・一括操作バーの対象

reference/CLAUDE.mdの「フィルタバー + 一括操作バー(行選択時のみ表示)」について、具体的な対象を確認します。

A) フィルタ: 名前/メールアドレスの部分一致テキスト検索 + 役割のSelect絞り込み。一括操作: 選択行の一括削除のみ

B) より広い範囲(Answerに記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: 削除確認の使い分け

reference/CLAUDE.mdの「軽い操作は簡易確認Modal、重要度の高い削除は対象名の確認テキスト入力式Modal」を、4画面パターンにどう割り当てますか?

A) List Viewの行削除・一括削除は簡易確認Modal、Detail Viewの「危険操作」タブでのユーザー削除は対象名確認テキスト入力式Modal(reference記述への直接対応)

B) 別の割り当てにしたい(Answerに記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
