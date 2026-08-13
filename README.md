# make-you-chic-ui

他プロジェクト(MasterMeister等)でWEB UIの部品として再利用できる、React + TypeScript製のデザインシステムです。

> **本リポジトリの位置づけ**: 検証・サンプル用のプロトタイプです。将来的な本番リポジトリへの移植を前提としており、npm registryへの発行は行っていません。他プロジェクトへの組み込み手順は[docs/integration-guide.md](docs/integration-guide.md)を参照してください。詳しい要件は[aidlc-docs/inception/requirements/requirements.md](aidlc-docs/inception/requirements/requirements.md)にまとまっています。

## 特徴

- **コンポーネント一式**: Button / FormField・TextInput・Textarea・Select・Checkbox・Switch・RadioGroup / Table / Modal / Toast / Avatar / Tabs / Dropdown / Badge / Icon / Tooltip / Card / Alert / AppShell(Sidebar+Topbar+Contentのレイアウトシェル)
- **画面パターンの参考実装**: List View・Detail View・編集Modal・削除確認(`packages/sample-app/src/screen-patterns/`、配布パッケージには含まれません)
- **テーマ機能4軸**: ライト/ダーク、ブランドカラー(blue/green/purple/orange)、フォント(ゴシック/明朝)、文字サイズ(sm/md/lg)を`data-*`属性とセマンティックトークン層のみで切り替え
- **デザイントークン**: プリミティブ/セマンティックの2層構造のCSS変数
- **Vanilla CSS**: コンポーネントごとに`.css`ファイルを分割(CSS Modules・CSS-in-JSは不使用)
- **アクセシビリティ**: 単体テストに加え、axeによる自動アクセシビリティテストを実施
- **Webフォントの自己ホスティング**: Noto Sans JP / Noto Serif JPを`@fontsource`経由でセルフホスティング(CDN非依存)
- **Node.js不要のHTML版デモ**(`html-demo/`): ブラウザで直接開いてデザインを確認できる静的デモページ

## ディレクトリ構成

npm workspacesによるモノレポ構成です。

```
packages/
  make-you-chic-ui/    デザインシステム本体(React + TypeScript、npm distの元)
    src/
      components/       各UIコンポーネント
      theme/            テーマ状態管理(ThemeProvider / useTheme)
      utils/            共通ユーティリティ
      index.ts          単一バレルエクスポート
    dist/               `npm run build`のビルド成果物(ESM/CJS/CSS/型定義)
  sample-app/          動作確認用サンプルアプリ(配布パッケージには含まれない、"make-you-chic-ui"をworkspace参照)
    src/
      pages/            コンポーネントカタログ・画面パターン操作フロー・テーマ設定の各ページ
      screen-patterns/  List/Detail View等の画面パターン参考実装
html-demo/             Node.js不要のHTML+CSS静的デモ(配布パッケージには含まれない)
docs/                  組み込みガイド等のドキュメント
aidlc-docs/             AI-DLCワークフローの要件・設計・監査ログ
```

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev            # サンプルアプリ(packages/sample-app/)を開発サーバーで起動
```

## ビルド

```bash
npm run build           # デザインシステム本体を packages/make-you-chic-ui/dist/ にビルド(ESM/CJS/CSS/.d.ts)
npm run sample-app:build # サンプルアプリを packages/sample-app/dist/ にビルド
```

## テスト・静的検証

```bash
npm test                 # 単体テスト(各パッケージのvitestをworkspaces経由で実行、アクセシビリティテスト含む)
npm run lint              # oxlint + eslint(リポジトリ全体)
npm run lint:css          # stylelint(packages/make-you-chic-ui/src/ html-demo/ packages/sample-app/)
npm run format:check      # prettierフォーマットチェック
npm run format            # prettierフォーマット適用
```

各パッケージ単体でwatchモードのテストを実行する場合は`npm run test:watch -w make-you-chic-ui`のように`-w`(workspace)フラグを指定してください。

## 使い方(他プロジェクトへの組み込み)

```tsx
import { Button, ThemeProvider } from 'make-you-chic-ui'
import 'make-you-chic-ui/style.css'

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">保存</Button>
    </ThemeProvider>
  )
}
```

インストール手順(git submodule / `npm pack`)、必須Provider、テーマ設定、スタイルカスタマイズの指針など詳細は[docs/integration-guide.md](docs/integration-guide.md)を参照してください。

## ライセンス

[Apache License 2.0](LICENSE)
