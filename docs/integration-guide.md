# 組み込みガイド — Web UI デザインシステム

このガイドは、他プロジェクト(MasterMeister等)でこのデザインシステムをWEB UIの部品として利用する際の手順をまとめたものです。

> **本リポジトリの位置づけ**: 本プロジェクトは検証・サンプル用のプロトタイプです(`aidlc-docs/inception/requirements/requirements.md`参照)。本番プロジェクトへの移植を前提としており、npm registryへの発行は行っていません。ライセンスはリポジトリ直下の`LICENSE`(Apache License 2.0)に従います。

## 1. インストール・セットアップ

npm発行は行っていないため、本リポジトリを利用側プロジェクトの依存として直接参照する形になります。将来npm registryへ発行する場合は、以下のようなコマンドに置き換わります。

```bash
npm install <パッケージ名>
```

**`src/`をコピーする方式は推奨しません**。`dist/`のビルド成果物(ESM/CJS/CSS/型定義一式)を利用側プロジェクトが素通しで消費できるようにするのがこのパッケージ構成の前提であり、`src/`にはテストファイル(`*.test.tsx`)等の非公開ファイルも含まれます。コピーすると、利用側で本リポジトリと同じビルド設定(Vite libraryモード・`vite-plugin-dts`・TypeScript設定)を再構築しない限りコンパイルできず、将来の更新も手動diff/マージが必要になります。

### 手順A: git submodule + ローカルpackage参照(推奨)

本リポジトリはnpm workspacesのモノレポ構成です(ワークスペースルートは非公開、実際に配布するパッケージは`packages/make-you-chic-ui/`)。`npm install`はワークスペースルートで実行しますが、利用側プロジェクトが依存として参照するのは`packages/make-you-chic-ui`サブディレクトリである点に注意してください。

```bash
# 1. 利用側プロジェクトのルートでsubmoduleとして取り込む
git submodule add <このリポジトリのURL> vendor/make-you-chic-ui
cd vendor/make-you-chic-ui
npm install      # workspaces全体の依存解決(ルートで実行)
npm run build    # packages/make-you-chic-ui/dist/ に ESM/CJS/CSS/.d.ts 一式を生成
cd ../..

# 2. 利用側プロジェクトの依存として追加(package.jsonのdependenciesに
#    "make-you-chic-ui": "file:vendor/make-you-chic-ui/packages/make-you-chic-ui" が追記される)
npm install ./vendor/make-you-chic-ui/packages/make-you-chic-ui
```

以降、`import { Button } from 'make-you-chic-ui'`のように、パッケージ名でそのままimportできます(`<パッケージ名>`はこの`make-you-chic-ui`を指します)。

**更新時の手順**:

```bash
cd vendor/make-you-chic-ui
git pull origin main
npm install
npm run build
cd ../..
npm install   # file: 参照を再解決させ、更新後のdist/を反映させる
```

`npm install`のfile:参照がnode_modules配下にsymlink/コピーどちらとして配置されるかはnpmのバージョンに依存するため、`dist/`再ビルド後は必ず利用側で`npm install`を再実行し、反映されたことを確認してください。

### 手順B: npm pack によるtarball参照

git submoduleを使いたくない場合は、ビルド成果物をtarball化して参照する方法もあります。

```bash
# このリポジトリのワークスペースルートで
npm run build
npm pack -w make-you-chic-ui   # make-you-chic-ui-0.0.0.tgz を生成

# 利用側プロジェクトで
npm install /path/to/make-you-chic-ui-0.0.0.tgz
```

こちらは更新のたびに`npm pack`をやり直し、利用側で`npm install`し直す必要があります。submoduleより追跡は手間ですが、利用側リポジトリにgit submoduleを持ち込みたくない場合の選択肢です。

`npm run build`は`dist/`に型定義(`.d.ts`、`package.json`の`types`フィールドが指す`dist/index.d.ts`から各コンポーネントの型を再export)も出力します。利用側では追加設定なしでTypeScriptの型補完・型チェックが効きます。

### 必須の依存ライブラリ

本パッケージは`react`(`^19.0.0`) / `react-dom`(`^19.0.0`)を`peerDependencies`として要求します。利用側プロジェクトが既に保持しているReact/ReactDOMをそのまま利用する構成のため、利用側のpackage.jsonにこの2つを対応バージョンで用意してください(`ThemeProvider`等はContext/hooksベースで実装されているため、Reactが二重にインストールされるとフックエラーやContextの不整合が発生します)。手順A/Bいずれの方法でインストールした場合も、npmがpeerDependenciesの充足を検証します(バージョン不一致時は警告またはエラーになります)。

### 必須のセットアップ

アプリケーションのルート(エントリポイント)で、以下の3つのProviderを組み合わせて配置してください。いずれも省略可能です(省略した場合の挙動は各コンポーネントのfail-soft設計により、開発時の警告のみでクラッシュはしません)。

```tsx
import { ThemeProvider, ToastProvider, ModalStackProvider } from '<パッケージ名>'
import '<パッケージ名>/dist/index.css' // ビルド成果物のCSS(トークン・セマンティックトークン)

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ModalStackProvider>{/* アプリケーション本体 */}</ModalStackProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
```

- `ThemeProvider`: テーマ4軸(dark/light、ブランド、フォント、文字サイズ)の状態管理・永続化(省略時はCSSのデフォルト値が適用されるのみで、切り替えUIとの連携ができなくなります)
- `ToastProvider`: `useToast()`によるトースト通知機能に必要です
- `ModalStackProvider`: 複数の`Modal`を同時に開く場合のスタック管理・背景の`inert`制御に必要です(単一の`Modal`のみを使う場合は省略可能)

### Webフォント(自己ホスティング)の追加セットアップ

デザインシステム自体はNoto Sans JP / Noto Serif JPのフォント本体を同梱・importしません(1ウェイトあたり約1MBあり、コンポーネントCSSと同じバンドルに含めるとサイズが膨れ上がるため)。代わりに`@fontsource/noto-sans-jp` / `@fontsource/noto-serif-jp`(本パッケージの`dependencies`のため`npm install`時に自動的に取得されます)を、利用側プロジェクトのエントリポイントで直接importしてください(NFR7: UIは日本語のみが対象のため`japanese`サブセットのみで十分です)。

```tsx
import '@fontsource/noto-sans-jp/japanese-400.css'
import '@fontsource/noto-sans-jp/japanese-500.css'
import '@fontsource/noto-sans-jp/japanese-600.css'
import '@fontsource/noto-sans-jp/japanese-700.css'
import '@fontsource/noto-serif-jp/japanese-400.css'
import '@fontsource/noto-serif-jp/japanese-500.css'
import '@fontsource/noto-serif-jp/japanese-600.css'
import '@fontsource/noto-serif-jp/japanese-700.css'
```

`@fontsource`はGoogle FontsのフォントをOFL(SIL Open Font License 1.1)のもとnpmパッケージとして再配布したもので、CDNへのランタイム依存なしに自己ホスティングできます(ライセンス全文もパッケージに同梱されています)。上記のimportを省略した場合はシステムフォント(`--font-family-sans-raw`/`--font-family-serif-raw`のフォールバック)で表示されます。`packages/sample-app/src/main.tsx`が実装例です。

## 2. コンポーネントのimportと基本的な使い方

すべてのコンポーネントは単一のバレルエクスポートから利用できます(Application Design Question 9 = A)。

```tsx
import { Button, FormField, TextInput, Table, AppShell } from '<パッケージ名>'
```

### Buttonの例

```tsx
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  保存
</Button>
```

### FormField + TextInputの例

```tsx
<FormField label="名前" required error={errors.name}>
  <TextInput value={name} onChange={setName} />
</FormField>
```

### Tableの例

`data`propには**現在ページの行のみ**を渡してください(Unit 6 Functional Design Question 2 = B: 大量データ・サーバーサイドページネーション対応のため、外部スライス方式を採用しています)。

```tsx
<Table
  columns={[
    { key: 'name', header: '名前', sortable: true },
    { key: 'email', header: 'メールアドレス' },
  ]}
  data={currentPageRows}
  totalCount={totalRowCount}
  getRowId={(row) => row.id}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
/>
```

### AppShellの例

`AppShell`はアプリケーション全体を包む最上位のレイアウトです。全画面は`children`(Contentスロット)に描画します。

```tsx
<AppShell
  navItems={[{ label: 'ダッシュボード', icon: 'menu', href: '/dashboard' }]}
  user={{ name: currentUser.name, avatarSrc: currentUser.avatarUrl }}
  userMenuItems={[{ label: 'ログアウト', onClick: handleLogout }]}
>
  {/* List View / Detail View 等の画面 */}
</AppShell>
```

> **注記**: `AppShell`に通知アイコン機能はありません(Unit 5 Functional Designで廃止)。通知が必要な場合は、`children`側で独自に実装するか、`Badge`/`Icon`を組み合わせて独自のTopbar拡張を検討してください。

**ログイン画面等、AppShellと異なるレイアウトが必要な画面がある場合**は、react-routerの「レイアウトルート」パターン(`path`なしの`<Route>`が`<Outlet/>`を描画し、ネストした子ルートだけがそのレイアウトを継承する)で分離してください。`packages/sample-app/src/App.tsx`の`AppShellLayout`/`LoginPage`が実装例です。

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} /> {/* AppShellの外 */}
  <Route element={<AppShellLayout />}>
    {/* ここに列挙したpathだけがAppShell配下になる */}
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>
</Routes>
```

### 画面パターンの参考実装

List View・Detail View・編集Modal・削除確認の組み合わせ方は、本リポジトリの`packages/sample-app/src/screen-patterns/`配下(`ListView`, `DetailView`, `EditUserModal`, `DeleteConfirmModal`)を参考にしてください。これらは配布パッケージには含まれない参考実装です。

## 3. テーマ設定

`useTheme()`フックで現在のテーマ状態の参照・変更ができます。

```tsx
import { useTheme } from '<パッケージ名>'

function ThemeToggle() {
  const { theme, setTheme, brand, setBrand } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'ダークモードへ' : 'ライトモードへ'}
    </button>
  )
}
```

| 軸           | 有効値                                            | 説明               |
| ------------ | ------------------------------------------------- | ------------------ |
| `theme`      | `'light'` \| `'dark'`                             | ライト/ダーク      |
| `brand`      | `'blue'` \| `'green'` \| `'purple'` \| `'orange'` | ブランドカラー     |
| `fontFamily` | `'sans'` \| `'serif'`                             | ゴシック/明朝      |
| `fontSize`   | `'sm'` \| `'md'` \| `'lg'`                        | 文字サイズスケール |

状態は`localStorage`に自動永続化され、別タブでの変更も同期されます(`ThemeProvider`のマルチタブ同期機能)。

## 4. スタイルカスタマイズの指針

全コンポーネントは`className`/`style`propsを受け付けます(Application Design Question 7 = A)。ただし、以下を推奨します。

1. **まずは`variant`/`size`等の定義済みpropsを使う**。デザインシステムとしての一貫性が最も保たれます
2. **レイアウト調整(margin、配置等)には`className`を使う**。トークンベースのCSS変数(`var(--space-*)`等)と組み合わせてください
3. **`style`propは最終手段とする**。内部のトークン参照を上書きすると、テーマ切り替え時に意図しない見た目になる場合があります

## 5. Node.js不要のHTML版デモ / サンプルアプリケーション

`html-demo/`配下には、Node.js環境がなくてもブラウザで直接開けるデザイン確認用のデモページがあります(`html-demo/index.html`がトップページ)。React環境を用意する前のデザインレビューや、非エンジニアとの見た目共有に活用してください。ただし、これらは配布パッケージには含まれず、参考実装のみです。

実際にReactで動くアプリケーションとしての確認は`packages/sample-app/`(`npm run dev`で起動)を参照してください。コンポーネントカタログページ、List/Detail View + 編集/削除の操作フローページ、テーマ設定パネルの3画面を`AppShell`のSidebarから行き来できます(FR9)。こちらも配布パッケージには含まれません。

## 6. 既知の制約・今後の課題

- **本番運用には未対応**: 本リポジトリはプロトタイプ位置づけであり、npm発行やCI/CDパイプラインは今回のスコープ外です
- **レスポンシブはデスクトップのみ**: タブレット・モバイル幅への最適化は行っていません(NFR9)。デスクトップブラウザのウィンドウ幅の伸縮のみに対応します
- **画面パターン(`packages/sample-app/src/screen-patterns/`)は配布対象外**: List View等の組み合わせ方は参考実装として提供されますが、パッケージのAPIとしては公開されていません。利用側プロジェクトで同様のパターンを実装する際の出発点としてご利用ください
