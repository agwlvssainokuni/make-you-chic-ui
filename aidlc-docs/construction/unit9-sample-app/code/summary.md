# Unit 9: サンプルアプリケーション — 実装サマリー

## 背景

Build and Testステージ完了後のレビューで発覚した要件漏れ(FR9)への対応。デザインシステムを実際に組み込んで動作確認できる、ブラウザで開けるReactアプリケーションが存在しなかった(`examples/`のコンポーネント自体は既にあったが、それらをマウントするエントリポイントがなかった)。

## 生成物

### ライブラリ側の小さな拡張

- `src/components/AppShell/Sidebar.tsx`: `AppShellNavItem`に`onClick?: (event: React.MouseEvent) => void`を追加。react-router等のSPAルーター統合時、`href`のみだとSidebarクリックがネイティブ遷移(フルページリロード)になってしまう問題への対応
- `examples/ListView/ListView.tsx`: `onViewUser?: (user: SampleUser) => void`を追加。指定時のみ各行に「詳細」ボタンを表示し、List→Detail遷移を可能にする
- 両方ともオプショナルな追加で既存の呼び出し側・テストに影響なし。`AppShell.test.tsx`・`ListView.test.tsx`にそれぞれ新規テストケースを追加(計3件)

### サンプルアプリケーション本体(`sample-app/`)

- `App.tsx`: `AppShell` + react-router `Routes`。Sidebarの各`navItems`に`onClick`でSPA遷移を実装
- `main.tsx`: `ThemeProvider`/`ToastProvider`/`ModalStackProvider`(組み込みガイド記載の必須セットアップ)+ `BrowserRouter`でマウント
- `pages/CatalogPage.tsx` + `.css`: Button/フォーム入力系/静的表示/フィードバック/ナビゲーション/Tableの主要バリエーションを一覧表示するコンポーネントカタログ。Tableは`備考`列を`editable: true`にしたその場編集デモを含む(`tableRows`をstate化し`onCellEdit`でイミュータブルに更新)
- `pages/UserListPage.tsx`: `ListView`をラップし、`onViewUser`で`/users/:id`へ遷移
- `pages/UserDetailPage.tsx`: `:id`を`initialSampleUsers`から検索し`DetailView`に渡す。見つからない場合は`/users`へリダイレクト。**既知の制約**: List側の編集はUserListPage内のローカルstateに閉じており、UserDetailPageは独立して静的サンプルデータを参照するため、List側での編集はDetail側に反映されない(リファレンス実装として許容)
- `pages/ThemeSettingsPage.tsx`: `useTheme()`でテーマ4軸を切り替えられるパネル

### ビルド・実行環境

- `index.html`(リポジトリルート、`sample-app/main.tsx`を読み込む)
- `vite.sample-app.config.ts`(新規、独立したビルド設定。既存`vite.config.ts`のライブラリビルド(`build.lib`)には影響しない)
- `package.json`: `react-router`を追加、`sample-app:build`スクリプトを追加、`lint:css`の対象に`sample-app/**/*.css`を追加
- `tsconfig.json`の`include`に`sample-app`・`vite.sample-app.config.ts`を追加

## ドキュメント更新

- `aidlc-docs/inception/requirements/requirements.md`: FR9追加
- `aidlc-docs/inception/application-design/unit-of-work.md`: Unit 9登録
- `aidlc-docs/inception/application-design/component-methods.md`: `AppShellNavItem.onClick`追加を反映

## 検証結果

- `npx tsc --noEmit`: 0エラー
- `npm test`: 199/199件成功(既存196件 + 新規3件、その場編集はレビュー指摘対応として`CatalogPage.tsx`に追記・目視/ビルド確認のみ)
- `npm run lint`(oxlint+eslint): 0エラー
- `npm run lint:css`: 0エラー
- `npm run format:check`: クリーン
- `npm run build`(ライブラリ): 成功、モジュール数93のまま変化なし(react-router追加の影響を受けていないことを確認)
- `npm run sample-app:build`: 成功(`dist-sample-app/`に出力、`.gitignore`に追加)
- `npm run dev` + Vite開発サーバーへの実リクエストで`main.tsx`/`App.tsx`/`CatalogPage.tsx`/`UserDetailPage.tsx`が200で変換されることを確認(ブラウザでのクリック操作による目視確認は本セッションの実行環境では未実施)

## 位置づけ

`sample-app/`はパッケージのバレルエクスポート・npm発行対象(`npm run build`)には含まれない。HTML版デモ(`html-demo/`, FR6)とは独立したスコープであり、HTML版側の更新は不要。
