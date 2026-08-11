# Code Generation Plan — Unit 9: サンプルアプリケーション

## ユニットコンテキスト

- **対応要件**: FR9(サンプルアプリケーションの実装。Build and Testステージ完了後に発覚した要件漏れ)
- **依存ユニット**: Unit 1〜8(全コンポーネント・examples/・組み込みガイド)
- **配置方針**: `sample-app/`配下。パッケージのバレルエクスポート・npm発行対象には含めない
- **ユーザー方針確認済み事項**:
  - 配置: 本リポジトリに`index.html`を追加(別パッケージ化はしない)
  - ナビゲーション: react-router(新規依存)
  - デモ範囲: コンポーネントカタログページ + List/Detail/編集/削除の操作フローページ + テーマ切り替えパネル(テーマ設定ページとして実装)。3画面ともAppShellのSidebarメニューから遷移可能にする

## 実施ステップ

- [ ] **Step 1: ライブラリ側の小さな拡張(2件)**
  - `AppShellNavItem`に`onClick?: (event: React.MouseEvent) => void`を追加(`Sidebar.tsx`で`<a>`に付与)。理由: 現状`href`のみのためSidebarクリックがネイティブ遷移(フルページリロード)になり、react-routerでのSPA遷移ができない
  - `ListView`に`onViewUser?: (user: SampleUser) => void`を追加、指定時のみ行に「詳細」ボタンを表示(`data-testid="list-view-view-{id}"`)。List→Detail遷移用。両方とも既存のテストに影響しないオプショナル追加とし、`AppShell.test.tsx`・`ListView.test.tsx`に新規ケースを追加
- [ ] **Step 2: 依存追加**
  - `package.json`に`react-router`を追加
- [ ] **Step 3: コンポーネントカタログページ**
  - `sample-app/pages/CatalogPage.tsx` + `CatalogPage.css`: Unit 1〜6の主要コンポーネントの代表バリエーションをセクション分けして一覧表示(Button各variant/size、フォーム入力系一式、Avatar/Badge/Card、Modal/Toast/Alert/Tooltipの起動デモ、Tabs/Dropdown、Table簡易例)
- [ ] **Step 4: 画面パターン操作フローページ**
  - `sample-app/pages/UserListPage.tsx`: `ListView`をラップし`onViewUser`で`/users/:id`へ`navigate`
  - `sample-app/pages/UserDetailPage.tsx`: `useParams()`で`:id`取得、`initialSampleUsers`から検索して`DetailView`に渡す(見つからない場合は一覧へリダイレクト)。`onDelete`は削除後`/users`へ`navigate`
- [ ] **Step 5: テーマ設定ページ**
  - `sample-app/pages/ThemeSettingsPage.tsx`: `useTheme()`でtheme/brand/fontFamily/fontSizeの4軸をRadioGroup等で切り替えられるパネル
- [ ] **Step 6: アプリ本体・エントリポイント**
  - `sample-app/App.tsx`: `AppShell`(navItems: カタログ/ユーザー管理/テーマ設定、各`onClick`でreact-router `navigate`)+ `Routes`(`/catalog`, `/users`, `/users/:id`, `/theme`、`/`は`/catalog`へリダイレクト)
  - `sample-app/main.tsx`: `ThemeProvider`/`ToastProvider`/`ModalStackProvider`(組み込みガイド記載の必須セットアップ)+ `BrowserRouter`+ `App`をマウント
- [ ] **Step 7: ビルド設定**
  - `index.html`(リポジトリルート、`sample-app/main.tsx`を読み込む)
  - `vite.sample-app.config.ts`(新規、`index.html`をエントリとする通常のVite多ページビルド。既存`vite.config.ts`のライブラリビルド設定とは独立)
  - `package.json`にスクリプト追加: `"sample-app:build": "tsc -b --noEmit && vite build --config vite.sample-app.config.ts"`。`npm run dev`は既存`vite.config.ts`のままで動作確認(ビルド設定はdevサーバーの`index.html`配信に影響しないため)
  - `tsconfig.json`の`include`に`sample-app`と`vite.sample-app.config.ts`を追加
- [ ] **Step 8: ドキュメント更新**
  - `aidlc-docs/inception/application-design/component-methods.md`・`unit-of-work.md`は本ステップ開始前に更新済み
  - `aidlc-docs/construction/unit9-sample-app/code/summary.md`にサマリー作成
- [ ] **Step 9: 検証**
  - `npm run lint`(oxlint+eslint)・`npx tsc --noEmit`・`npm test`・`npm run lint:css`・`npm run format:check`・`npm run build`(ライブラリ、影響がないことを確認)・`npm run sample-app:build`をすべて実行し、`npm run dev`で実機動作確認(カタログ/ユーザー一覧→詳細→削除確認モーダル/テーマ切り替えの一連の操作)

## 共通ルール(継続)

- ライセンス表記、セマンティックトークン参照、`data-testid`
- `sample-app/`はHTML版デモ(`html-demo/`)とは独立(HTML版の更新は不要 — FR9はReact版サンプルアプリの要件であり、FR6のHTML版デモとは別スコープ)

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
