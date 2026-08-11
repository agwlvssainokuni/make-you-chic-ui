# コンポーネント一覧・責務・インターフェース概要

`aidlc-docs/inception/requirements/requirements.md` FR1〜FR3を実現するコンポーネント群。カテゴリごとに責務とインターフェース概要(主要props)を示す。詳細な型定義・ビジネスルールはFunctional Design(Construction phase、ユニット単位)で確定する。

## サービス層(Provider/Hook)

### ThemeProvider / useTheme
- **目的**: テーマ4軸(theme, brand, fontFamily, fontSize)の状態管理・`localStorage`永続化・`<html>`属性への反映
- **責務**: アプリ起動時に`localStorage`から復元(theme未設定時は`prefers-color-scheme`を尊重)、状態変更時に`<html>`のdata属性を更新・永続化
- **インターフェース概要**: `<ThemeProvider>{children}</ThemeProvider>`(ルートに1回だけ配置)、`useTheme()`が`{ theme, brand, fontFamily, fontSize, setTheme, setBrand, setFontFamily, setFontSize }`を返す

### ToastProvider / useToast
- **目的**: Toast通知の表示キュー管理
- **責務**: 複数Toastの同時表示、`aria-live="polite"`領域の提供
- **インターフェース概要**: `<ToastProvider>{children}</ToastProvider>`(ルートに1回)、`useToast()`が`{ show(options), dismiss(id) }`を返す

## 基本入力系

### Button
- **目的**: クリック操作の起点となる基本コンポーネント
- **責務**: variant/size/loading状態の表示切り替え、`aria-busy`制御
- **インターフェース概要**: `variant`(primary/secondary/danger/ghost), `size`(sm/md/lg), `loading`, `disabled`, `className`, `style`, 標準button属性

### FormField
- **目的**: ラベル・補助テキスト・エラーメッセージの表示枠。内側の入力コンポーネントとContext経由で連携する(Question 6=A)
- **責務**: `useId()`によるid自動生成、Context経由でid/エラー状態を提供、`aria-describedby`の自動設定
- **インターフェース概要**: `label`, `error`, `helperText`, `required`, `children`

### TextInput / Textarea / Select / Checkbox / Radio / RadioGroup / Switch
- **目的**: 各種フォーム入力
- **責務**: FormFieldのContextを参照してid/aria紐付けを自動化。Controlled/Uncontrolled両対応(Question 2=B)。`forwardRef`対応(Question 8=B、全コンポーネント共通方針の一部)
- **インターフェース概要**:
  - TextInput/Textarea: `value`/`defaultValue`, `onChange`, `placeholder`, `disabled`, `className`, `style`
  - Select: `value`/`defaultValue`, `onChange`, `options`(`{label, value}[]`)
  - Checkbox/Switch: `checked`/`defaultChecked`, `onChange`, `disabled`
  - RadioGroup: `value`/`defaultValue`, `onChange`, `options`(`{label, value}[]`) — Question 1=Bによりprops駆動、個別`<Radio>`の子要素合成はしない
  - Radio: RadioGroup内部実装用の単一入力プリミティブ(個別公開はするが主要APIはRadioGroup)

## データ表示系

### Table
- **目的**: 一覧データの表示・操作
- **責務**: 3段階トグルソート、ページネーション、行選択(`Set`管理)、列幅調整(ドラッグ終了時のみstate更新)、セルインライン編集
- **インターフェース概要**: `columns`, `data`, `sortState`/`onSortChange`, `selectedRows`(Set)/`onSelectionChange`, `pagination`関連props

### Avatar
- **目的**: ユーザーの視覚的識別(画像 or イニシャル)
- **責務**: 画像読み込み失敗時のイニシャルフォールバック
- **インターフェース概要**: `src`, `name`(イニシャル生成元), `size`, `className`, `style`

### Badge
- **目的**: 件数・状態等の小さな強調表示
- **責務**: variant別の配色、数値の丸め表示(例: 99+)
- **インターフェース概要**: `variant`, `count`または`children`

### Card
- **目的**: コンテンツのグルーピング用コンテナ
- **責務**: 一貫した余白・境界線・角丸の適用
- **インターフェース概要**: `children`, `className`, `style`

### Icon
- **目的**: 各コンポーネントが利用する共通アイコンプリミティブ(Question 3=A: 自前SVGセット同梱)
- **責務**: サイズ・色(`currentColor`継承)・`aria-hidden`/`title`の一貫した適用
- **インターフェース概要**: `name`(同梱アイコンセットのキー), `size`, `label`(アクセシブルネームが必要な場合)

補足: Description List(Detail Viewのラベル+値表示)は独立コンポーネント化せず、`.description-list`系CSS命名パターンとしてFR2側で扱う(部品一覧には含めない)。

## フィードバック系

### Modal
- **目的**: フォーカスを要する重要な対話・確認
- **責務**: `createPortal`でbody直下配置、フォーカストラップ、`inert`での背景無効化、Escキー・背景クリックでの閉鎖
- **インターフェース概要**: `open`, `onClose`, `title`, `children`, `size`

### Toast
- **目的**: 一時的な操作結果通知(`useToast()`経由で表示)
- **責務**: 自動消滅、複数同時表示、`aria-live="polite"`
- **インターフェース概要**: `useToast().show({ message, variant, duration })`

### Alert/Banner
- **目的**: 常時表示・非モーダルな通知(フォーム全体のエラーサマリー等)
- **責務**: variant別の配色・アイコン、任意の閉じるボタン・アクションリンク
- **インターフェース概要**: `variant`(info/success/warning/danger), `title`, `children`, `onDismiss`(任意), `action`(任意)

### Tooltip
- **目的**: アイコンのみのボタン等の補助説明
- **責務**: hover/focus時の表示、`aria-describedby`によるトリガー要素との紐付け、適切な表示位置計算
- **インターフェース概要**: `content`, `children`(トリガー要素), `placement`

## ナビゲーション・レイアウト系

### Tabs
- **目的**: Detail View等でのセクション切替
- **責務**: キーボード操作(矢印キー移動)、`role="tablist"/"tab"/"tabpanel"`の適用。Question 1=Bによりprops駆動(`items`配列)
- **インターフェース概要**: `items`(`{label, content}[]`), `activeIndex`/`defaultActiveIndex`, `onChange`

### Dropdown/Menu
- **目的**: Topbarのユーザーメニュー等
- **責務**: 開閉状態管理、キーボード操作(矢印キー/Esc)、外側クリックでの閉鎖。Question 1=Bによりprops駆動(`items`配列)
- **インターフェース概要**: `trigger`(トリガー要素), `items`(`{label, onClick}[]`), `placement`

### AppShell
- **目的**: 全画面が描画される最上位のレイアウトシェル(Sidebar+Topbar+Content)
- **責務**: Sidebar折り畳み状態の管理・永続化、内部Context経由での状態公開(`useAppShell()`、Question 5=A)。Sidebarナビ項目はprops駆動(Question 1=B)
- **インターフェース概要**: `navItems`(`{label, icon, href}[]`), `user`(Topbarのユーザーメニュー用), `userMenuItems`(Unit 5 Functional Designで追加), `children`(Contentスロット)。`useAppShell()`が`{ collapsed, toggleCollapsed, setCollapsed }`を返す
- **変更履歴**: `notificationCount`propはUnit 5 Functional Design(Question 5)で廃止。通知アイコン機能自体を持たないこととした
