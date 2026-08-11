# Frontend Components — Unit 1: 基盤

## ThemeProvider

- **コンポーネント階層**: アプリケーションルート直下、単独で配置(子を`children`としてそのまま描画するだけの薄いProvider)
- **内部状態**: `ThemeState`(domain-entities.md参照)を`useState`または`useReducer`で保持
- **副作用**:
  - マウント時: localStorage読み込み + `<html>`属性の初期反映(business-logic-model.md参照)
  - マウント時: `storage`イベントリスナー登録、アンマウント時に解除
  - state変更時: `<html>`属性の更新 + localStorage書き込み
- **Props**: `children: React.ReactNode`のみ
- **公開する値・操作**(`useTheme()`経由):
  - `theme`, `brand`, `fontFamily`, `fontSize`(現在値)
  - `setTheme`, `setBrand`, `setFontFamily`, `setFontSize`(各セッター、business-rules.mdのバリデーション規則を適用)
- **ユーザー操作フロー**: 利用側アプリがテーマ切り替えUI(例: ヘッダーのトグルボタン)を独自に実装し、`useTheme()`のセッターを呼び出す。ThemeProvider自体はUIを持たない

## useTheme (フック)

- `ThemeProvider`のContextを`useContext`で取得して返すだけの薄いラッパー
- `ThemeProvider`の外部で呼び出された場合: 開発時に`console.warn`を出し、デフォルト値相当のno-op実装を返す(呼び出し側アプリのクラッシュを防ぐ。Question 3の「fail-soft」方針と整合)

## Icon

- **Props**:
  - `name: IconName`(必須)
  - `size?: number`(デフォルト: 20)
  - `label?: string`(指定時は`aria-label`を設定。未指定時は`aria-hidden="true"`)
- **状態管理**: なし(Presentationalコンポーネント)
- **レンダリング構造**: `iconRegistry[name]`から取得したSVGコンポーネントを、`width`/`height`/`fill="currentColor"`/aria属性とともに描画
- **ユーザー操作フロー**: なし(装飾・情報伝達目的のコンポーネントであり、それ自体はインタラクティブではない。クリック可能にしたい場合は利用側で`<button><Icon .../></button>`のように包む)

## フォームバリデーション

本ユニットにはフォーム入力コンポーネントが含まれないため、該当なし。

## API統合ポイント

外部API・バックエンドとの通信は発生しない(該当なし)。
