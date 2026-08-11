# Business Logic Model — Unit 2: 基本入力系

## FormField ⇔ Input系コンポーネント連携ロジック(Question 1 = A)

```
1. FormFieldは自身のuseId()でfieldIdを生成し、error/helperTextの有無からerrorId/helperTextIdを算出する
2. FormFieldContext.Providerでこれらをchildrenに公開する
3. TextInput等のInput系コンポーネントはuseContext(FormFieldContext)を参照する
   a. Context値が存在する場合(FormField配下): fieldId/errorId/helperTextId/hasErrorを使い、
      id/aria-describedby/aria-invalidを自動設定する
   b. Context値が存在しない場合(FormField外で単体利用): 自前でuseId()を呼び、
      aria-describedby/aria-invalidなしの通常のinputとして機能する(fail-soft、Icon/useThemeと同じ設計方針)
```

## Controlled/Uncontrolled 判定ロジック(Application Design Question 2 = B)

```
各コンポーネントは以下の判定で動作モードを決める(Reactのネイティブinputと同じ挙動):
1. valueプロパティが指定されている(undefinedでない) → Controlledモード
   - 表示値は常にvalue propに従う
   - onChangeは呼ぶが、内部stateは持たない(呼び出し元がvalueを更新する責務を持つ)
2. valueプロパティが指定されていない → Uncontrolledモード
   - 内部stateをdefaultValueで初期化し、以降は内部stateで管理する
   - onChangeは内部state更新と合わせて呼ばれる
3. 開発時、valueとdefaultValueが同時に指定された場合はconsole.warnで警告する
   (Reactの標準的なControlled/Uncontrolled切り替えの誤用パターンを検出)
```

## Buttonのloading状態ロジック(Question 3 = A)

```
loading=true の場合:
1. ボタンにdisabled属性を付与する(loadingとdisabled propのいずれかがtrueならdisabled)
2. aria-busy="true"を設定する
3. テキストの前にスピナーアイコンを表示する(アイコンはaria-hidden、テキストのみがアクセシブルネームを構成)
4. クリックハンドラはdisabled状態のため発火しない(ブラウザのネイティブ挙動)
```

## バリデーション責務(Question 4 = A)

```
FormField/Input系コンポーネントはバリデーションロジックを一切持たない。
- errorプロパティに文字列が渡されればエラー表示(赤枠・エラーメッセージ)を行う
- errorプロパティがundefined/空文字であればエラー表示なし
- 「いつ」「何を」検証するかは完全に利用側(またはreact-hook-form等の外部ライブラリ)の責務
```
