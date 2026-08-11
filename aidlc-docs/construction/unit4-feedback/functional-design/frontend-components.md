# Frontend Components — Unit 4: フィードバック系

## Modal

- **Props**: `open`, `onClose`, `title`, `children`, `size?`(sm/md/lg, デフォルトmd), `initialFocusRef?`
- **状態**: 開いているModalのスタック位置(内部Context経由)、フォーカストラップの対象範囲
- **レンダリング**: `createPortal`でdocument.body直下に配置。`role="dialog"` `aria-modal="true"` `aria-labelledby`(titleのid)
- **ref**: 不要(`open`/`onClose`による制御のみで十分、DOM操作は内部完結)

## Toast / ToastProvider / useToast

- **ToastProvider Props**: `children`のみ
- **useToast() 戻り値**: `show(options: {message, variant?, duration?}): string`, `dismiss(id: string): void`
- **状態**: `ToastItem[]`(business-logic-model.md参照)
- **レンダリング**: `createPortal`で画面右上固定のコンテナに`ToastItem`ごとの`<div role="status">`をmapで描画。コンテナ自体に`aria-live="polite"` `aria-atomic="false"`

## Alert(Alert/Bannerコンポーネント名は`Alert`)

- **Props**: `variant`(info/success/warning/danger)、`title?`, `children`, `onDismiss?`, `action?: {label, onClick}`
- **状態**: なし(表示/非表示の管理は利用側が`onDismiss`を通じて行う。Alert自身はunmountされるまで表示され続ける)
- **レンダリング**: variant別のアイコン(Icon経由)+ メッセージ + 任意の閉じるボタン・アクションリンク。`role="alert"`(danger/warning時)または`role="status"`(info/success時)
- **ref**: `forwardRef<HTMLDivElement>`

## Tooltip

- **Props**: `content`, `children`(トリガー要素、単一の`ReactElement`である必要がある), `placement?`(デフォルトtop)
- **状態**: `visible: boolean`、表示タイマーのref
- **実装方式**: トリガー要素に`onMouseEnter`/`onMouseLeave`/`onFocus`/`onBlur`ハンドラを`cloneElement`で注入。Tooltip本体は`createPortal`でbody直下に配置し、business-logic-model.mdの位置計算ロジックを`useLayoutEffect`で実行
- **a11y**: トリガー要素に`aria-describedby`(Tooltip要素のid)を注入。Tooltip要素自体は`role="tooltip"`
- **ref**: 不要(children側で個別にrefを管理)
