# Functional Design Plan — Unit 3: 静的表示系

対象: Avatar, Badge, Card

## 実施タスク

- [x] `aidlc-docs/construction/unit3-static-display/functional-design/business-logic-model.md` を作成
- [x] `aidlc-docs/construction/unit3-static-display/functional-design/business-rules.md` を作成
- [x] `aidlc-docs/construction/unit3-static-display/functional-design/domain-entities.md` を作成(該当薄ければ簡潔に)
- [x] `aidlc-docs/construction/unit3-static-display/functional-design/frontend-components.md` を作成

## カテゴリ別の適用判定

- **Business Logic Modeling**: 限定的に適用。Avatarのイニシャル生成ロジック、Badgeの件数丸めロジック
- **Domain Model**: 非該当。業務エンティティなし
- **Business Rules**: 適用。イニシャル生成規則、件数丸め規則
- **Data Flow**: 非該当
- **Integration Points**: 非該当
- **Error Handling**: 適用。Avatar画像読み込み失敗時のフォールバック
- **Business Scenarios**: 非該当
- **Frontend Components**: 適用。Avatar/Badge/Cardのprops・状態

## 確認質問

### Question 1: Avatarのイニシャル生成規則

`name`からフォールバック表示するイニシャルは、どのように生成しますか?

A) 空白区切りで最初の2単語の頭文字を大文字で表示する(例: "山田 太郎" → "山太"、"Taro Yamada" → "TY")

B) 名前の最初の1文字のみを表示する(例: "山田 太郎" → "山"、"Taro Yamada" → "T")

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2: Avatar画像読み込み失敗時の挙動

`src`を指定したが画像の読み込みに失敗した場合、どう振る舞いますか?

A) `onError`イベントでイニシャル表示に自動フォールバックする

B) フォールバックせず、ブラウザ標準の壊れた画像アイコンのまま表示する

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3: Badgeの件数丸め規則

`count`が大きい数値の場合の表示規則を確認します。

A) 99を超える場合は"99+"と表示する(上限は固定)

B) 上限を`maxCount`propで指定可能にする(デフォルト99)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4: Cardの構造

Cardは`children`をそのまま描画するだけのシンプルなコンテナですか、それともHeader/Body/Footerのようなサブ構造を持ちますか?

A) シンプルなコンテナ(`children`+`padding`調整程度のprops)。内部レイアウトは利用側に委ねる

B) `Card.Header`/`Card.Body`/`Card.Footer`のようなサブコンポーネント構造を持つ

X) Other (please describe after [Answer]: tag below)

[Answer]: A
