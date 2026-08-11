# Functional Design Plan — Unit 1: 基盤(デザイントークン・テーマエンジン・Icon)

## 実施タスク

- [x] `aidlc-docs/construction/unit1-foundation/functional-design/business-logic-model.md` を作成(テーマ状態管理のロジック)
- [x] `aidlc-docs/construction/unit1-foundation/functional-design/business-rules.md` を作成(テーマ軸の有効値・フォールバック規則等)
- [x] `aidlc-docs/construction/unit1-foundation/functional-design/domain-entities.md` を作成(該当があれば。本ユニットは業務ドメインエンティティを持たないため、テーマ状態の型定義で代用する可能性が高い)
- [x] `aidlc-docs/construction/unit1-foundation/functional-design/frontend-components.md` を作成(ThemeProvider/useTheme/Iconのコンポーネント構造・props・状態)

## カテゴリ別の適用判定

- **Business Logic Modeling**: 適用。テーマ4軸の状態管理(初期化・永続化・切り替え)ロジックが対象
- **Domain Model**: 限定的に適用。業務エンティティ(Order/User等)は存在しないため、テーマ状態の型構造(`ThemeState`等)を定義する程度にとどめる
- **Business Rules**: 適用。各テーマ軸の有効値、フォールバック規則(未設定時のデフォルト)
- **Data Flow**: 適用。`localStorage`⇄state⇄`<html>`属性の反映フロー
- **Integration Points**: 非該当。外部システム・API連携なし
- **Error Handling**: 限定的に適用。Iconの不正な`name`指定時の挙動
- **Business Scenarios**: 非該当。業務シナリオ・エッジケースというより技術的な状態遷移のみ
- **Frontend Components**: 適用。ThemeProvider/useTheme/Iconのprops・状態・レンダリング構造

## 確認質問

### Question 1: テーマ変更のマルチタブ同期

同一ブラウザで複数タブを開いている場合、あるタブでテーマを変更したら他のタブにも即座に反映しますか?(`storage`イベントリスナーで同期する)

A) 同期する。`window`の`storage`イベントを監視し、他タブでの変更を即座に反映する

B) 同期しない。各タブは自身の初期読み込み時の値を保持し、次回リロード時のみ最新値を反映する(実装がシンプル)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2: Iconのレンダリング方式

同梱するSVGアイコンセットは、内部的にどう実装しますか?

A) SVGスプライト方式: 1つの`<svg><symbol id="icon-user">...</symbol></svg>`スプライトをアプリ起動時に読み込み、`<use href="#icon-user">`で参照する

B) 個別コンポーネント方式: アイコンごとに`IconUser.tsx`のような個別のReactコンポーネント(またはSVGパスのオブジェクトマップ)を用意し、`Icon`が`name`propに応じて内部で出し分ける

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3: 未定義のIcon名を指定した場合の挙動

`<Icon name="unknown-icon" />`のように、同梱アイコンセットに存在しない名前を指定した場合、どう振る舞いますか?

A) 開発時に`console.warn`を出力し、何も描画しない(本番ビルドでは警告なし)

B) 例外(Error)をthrowする。誤用を早期に検出できるが、実行時クラッシュのリスクがある

C) プレースホルダー(不明アイコンを示す代替SVG)を描画する

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: テーマのリセット操作

`useTheme()`に、個別の`set*`メソッドに加えて「システムデフォルトに戻す」ような一括リセット関数(`resetTheme()`)は必要ですか?

A) 必要。`resetTheme()`を用意し、`localStorage`をクリアして`prefers-color-scheme`等のシステムデフォルトに戻す

B) 不要。個別の`set*`メソッドのみで十分(利用側で個別に元の値を再設定すればよい)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
