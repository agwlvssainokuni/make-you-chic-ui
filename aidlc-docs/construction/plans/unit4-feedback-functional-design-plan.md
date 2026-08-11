# Functional Design Plan — Unit 4: フィードバック系

対象: Modal, Toast(+ToastProvider), Alert/Banner, Tooltip

## 実施タスク

- [ ] `aidlc-docs/construction/unit4-feedback/functional-design/business-logic-model.md` を作成
- [ ] `aidlc-docs/construction/unit4-feedback/functional-design/business-rules.md` を作成
- [ ] `aidlc-docs/construction/unit4-feedback/functional-design/domain-entities.md` を作成
- [ ] `aidlc-docs/construction/unit4-feedback/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 適用。Modalのフォーカストラップ、Toastのキュー管理、Tooltipの表示位置計算
- **Domain Model**: 限定的に適用。Toastのキューアイテム型
- **Business Rules**: 適用。フォーカス制御規則、自動消滅時間、位置計算規則
- **Data Flow**: 限定的に適用。ToastProviderのキュー追加/削除フロー
- **Integration Points**: 非該当
- **Error Handling**: 非該当
- **Business Scenarios**: 限定的に適用。Modal多重表示のケース
- **Frontend Components**: 適用。全4コンポーネントの構造・props・状態

## 確認質問

### Question 1: Modalの初期フォーカス対象

Modalが開いた時、フォーカスはどこに移動しますか?

A) Modal内の最初のフォーカス可能要素(input、button等)に自動的に移動する

B) `initialFocusRef`propで指定された要素があればそこへ、なければ最初のフォーカス可能要素へ移動する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: Modalの多重表示(スタッキング)対応

複数のModalを同時に開く(例: 詳細Modalの上に削除確認Modalを重ねる)ケースに対応しますか?

A) 対応する。開いているModalをスタックで管理し、各Modalが独立してフォーカストラップを持つ(z-indexは開いた順に加算)

B) 対応しない。常に1つのModalのみが開ける前提とする(2つ目を開こうとした場合の挙動は未定義)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: Toastの自動消滅時間・表示位置

Toastのデフォルト表示時間と画面上の表示位置を確認します。

A) デフォルト4秒で自動消滅、画面右下に表示

B) デフォルト4秒で自動消滅、画面右上に表示

C) 自動消滅させず、ユーザーが閉じるまで表示し続ける

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: Toastのスタック順・ホバー時の挙動

複数のToastが同時に表示されている場合の積み上げ順と、マウスホバー時の挙動を確認します。

A) 新しいToastが上(画面端に近い側)に追加され、ホバー中は自動消滅タイマーを一時停止する

B) 新しいToastが下に追加され、ホバー中の一時停止は行わない(シンプルな実装)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5: Tooltipの位置計算方式

Tooltipの表示位置は、外部ライブラリ(Floating UI等)を使わずに実現しますか?

A) 自前のシンプルな位置計算(`placement`propに応じた固定オフセット)のみとし、画面端でのはみ出し防止(衝突検出)は行わない(プロトタイプ段階として許容)

B) 自前実装で簡易的な衝突検出(画面端に近い場合は反対側に自動的に表示位置を切り替える)まで対応する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 6: Tooltipの表示・非表示トリガー

Tooltipはどのタイミングで表示・非表示を切り替えますか?

A) `mouseenter`/`focus`で表示、`mouseleave`/`blur`/Escapeキーで非表示。表示には短いディレイ(例: 300ms)を設け、素早いマウス移動でのチラつきを防ぐ

B) ディレイなしで即座に表示・非表示を切り替える(実装をシンプルにする)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
