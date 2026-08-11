# Business Rules — Unit 1: 基盤

## テーマ4軸の有効値

| 軸 | 有効値 | デフォルト(localStorage未設定時) |
|---|---|---|
| theme | `'light'` \| `'dark'` | `prefers-color-scheme`に従う(true→'dark', false→'light') |
| brand | `'blue'` \| `'green'` \| `'purple'` \| `'orange'` | `'blue'`(reference/CLAUDE.mdの既定値を踏襲) |
| fontFamily | `'sans'` \| `'serif'` | `'sans'`(reference/CLAUDE.mdの既定値を踏襲) |
| fontSize | `'sm'` \| `'md'` \| `'lg'` | `'md'`(reference/CLAUDE.mdの`--font-scale: 1`に相当) |

## バリデーション規則

- `set*`メソッドに上記有効値以外が渡された場合、状態を変更せず何もしない(開発時のみ`console.warn`)
- TypeScriptの型定義(Union型)により、コンパイル時点で不正値の大半は防止される。実行時チェックはJavaScript利用時や動的な値渡しに対する保険

## localStorageキー命名規則

- `design-system-theme`, `design-system-brand`, `design-system-font-family`, `design-system-font-size`の4キーに分けて保存する(1つのJSONにまとめない — Question 1のマルチタブ同期で、`storage`イベントがキー単位で発火するため、変更軸の特定が容易になる)

## `<html>`属性反映規則

- `data-theme`: `'light'`時は属性を明示的に付与しない(CSS側のデフォルトをlightとして設計するため)。`'dark'`時のみ`data-theme="dark"`を付与
- `data-brand`, `data-font-family`, `data-font-size`: 常に現在値を明示的に属性へ反映する(デフォルト値であっても省略しない。CSS側の実装をシンプルにするため)

## Iconの命名規則

- アイコン名は kebab-case(例: `chevron-down`, `close`, `bell`)。コンポーネントカテゴリ内で新規アイコンが必要になった場合もこの命名規則に従う
- 初期実装で用意するアイコンは、他コンポーネントが実際に必要とする最小限のセットとする(Application Design時の合意事項): `menu`(Sidebar折り畳み), `chevron-down`(Select/Dropdown), `close`(Modal/Toast/Alert), `check`(Checkbox), `bell`(通知), `user`(Avatarフォールバック)
