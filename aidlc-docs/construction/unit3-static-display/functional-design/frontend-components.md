# Frontend Components — Unit 3: 静的表示系

## Avatar

- **Props**: `src?`, `name`(イニシャル生成元・`alt`テキストにも使用), `size?`(sm/md/lg, デフォルトmd), `className`, `style`
- **状態**: `imageError: boolean`(内部state、srcが変わったらリセット)
- **レンダリング**: `imageError`がfalseかつ`src`があれば`<img>`、そうでなければイニシャルを表示する円形の`<div>`
- **a11y**: `<img>`には`alt={name}`を設定。イニシャル表示時は`role="img"`+`aria-label={name}`をdivに設定
- **ref**: `forwardRef<HTMLDivElement>`(画像・イニシャルどちらの場合もルートは`<div>`に統一し、refの型を安定させる)

## Badge

- **Props**: `variant?`(primary/secondary/danger/success, デフォルトprimary), `count?`, `maxCount?`(デフォルト99), `children?`, `className`, `style`
- **状態**: なし(Presentational)
- **レンダリング**: business-logic-model.mdの表示ロジックに従う
- **ref**: 不要(単純な`<span>`のみ、他コンポーネントとの位置合わせは利用側のCSSで行う)

## Card

- **Props**: `children`, `className`, `style`, 標準`<div>`属性
- **状態**: なし(Presentational)
- **レンダリング**: 単純な`<div>`(枠線・角丸・背景色・パディングをCSSで適用)
- **ref**: `forwardRef<HTMLDivElement>`
