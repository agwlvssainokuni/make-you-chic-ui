# Unit of Work 定義

`unit-of-work-plan.md`の承認済み方針(Q1=中間粒度8ユニット、Q2=React先行・同ユニット内でHTML版反映、Q3=基盤ユニット最優先、Q4=単一パッケージ構成)に基づき、以下8ユニットに分割する。

各ユニットは「React + TypeScript実装」と「HTML+CSS(+JS)静的デモへの反映」の両方を含む(Q2=Aの方針。組み込みガイドのユニットのみHTML成果物を持たない)。

## ユニット一覧

### Unit 1: 基盤(デザイントークン・テーマエンジン・Icon)

- **責務**: プリミティブ/セマンティックトークン(CSS変数)、`ThemeProvider`/`useTheme()`、`Icon`コンポーネントと同梱SVGアイコンセットの実装
- **対応FR/NFR**: FR3(テーマ機能4軸), FR4(デザイントークン), FR8(Webフォントセルフホスティング), NFR2(スタイリング方式)
- **対応Application Design**: ThemeProvider/useTheme(services.md), Icon(components.md)

### Unit 2: 基本入力系

- **責務**: Button, FormField, TextInput, Textarea, Select, Checkbox, Radio/RadioGroup, Switchの実装
- **対応FR/NFR**: FR1(該当コンポーネント), NFR6(a11y: `useId()`によるラベル紐付け、`aria-describedby`)
- **対応Application Design**: components.md「基本入力系」全体

### Unit 3: 静的表示系

- **責務**: Avatar, Badge, Cardの実装
- **対応FR/NFR**: FR1(該当コンポーネント)
- **対応Application Design**: components.md「データ表示系」の一部(Table・Iconを除く)

### Unit 4: フィードバック系

- **責務**: Modal, Toast+ToastProvider, Alert/Banner, Tooltipの実装
- **対応FR/NFR**: FR1(該当コンポーネント), NFR6(a11y: フォーカストラップ、`inert`、`aria-live`)
- **対応Application Design**: components.md「フィードバック系」、services.md「ToastProvider」

### Unit 5: ナビゲーション・レイアウト系

- **責務**: Tabs, Dropdown/Menu, AppShell(+`useAppShell()`)の実装
- **対応FR/NFR**: FR1(該当コンポーネント), NFR9(レスポンシブ: デスクトップ幅追従)
- **対応Application Design**: components.md「ナビゲーション・レイアウト系」、services.md「AppShell内部Context」

### Unit 6: Table

- **責務**: ソート・ページネーション・行選択・列幅調整・インライン編集を含むTableの実装
- **対応FR/NFR**: FR1(Table), Property-Based Testing拡張(PBT-02/03/07/08/09、ソート・ページネーション計算)
- **対応Application Design**: components.md「Table」

### Unit 7: 画面パターン

- **責務**: List View、Detail View(Description Listパターン含む)、編集Modal、削除確認の実装。Unit 1〜6の全コンポーネントを組み合わせて構成
- **対応FR/NFR**: FR2(画面パターン)
- **対応Application Design**: 該当なし(画面パターンはコンポーネント合成であり新規コンポーネントではないため)
- **位置づけ**: React実装は`examples/`配下に置き、パッケージのバレルエクスポート(`src/index.ts`)には含めない。組み合わせ方の参考実装・開発時の見た目確認用であり、他プロジェクトが画面単位でそのままimportして使う想定はしない(個々のコンポーネント単位での再利用を前提とするため)。HTML版は従来通り`html-demo/patterns/`に反映する

### Unit 8: 組み込みガイド

- **責務**: 他プロジェクトへの組み込み手順書の作成(インストール方法、import方法、`ThemeProvider`/`ToastProvider`の設定方法、`className`によるカスタマイズ指針を含む)
- **対応FR/NFR**: FR7(組み込みガイド)
- **対応Application Design**: 該当なし(ドキュメント成果物)
- **備考**: HTML版デモ成果物を持たない唯一のユニット

### Unit 9: サンプルアプリケーション(Build and Testステージ完了後に追加)

- **責務**: デザインシステムを実際に組み込んで動作確認できるReactアプリケーションの実装(コンポーネントカタログページ、画面パターン操作フローページ、テーマ設定ページの3画面、`AppShell`+react-routerによるSidebarナビゲーション)
- **対応FR/NFR**: FR9(サンプルアプリケーションの実装。要件定義漏れとしてBuild and Testステージ完了後に追加)
- **対応Application Design**: `AppShellNavItem`に`onClick`を追加(SPAルーター統合のため。既存の`href`のみの構成では`<a>`のネイティブ遷移となりフルページリロードが発生するため)、`ListView`に`onViewUser`オプショナルpropを追加(List→Detail遷移のため)
- **位置づけ**: `packages/sample-app/`配下に配置。パッケージのバレルエクスポートには含めず、npm発行対象(`npm run build`)にも含めない。`npm run dev`で起動、専用のビルドスクリプト(`npm run sample-app:build`)で別途ビルド可能

## コード構成方針(Q4=A: 単一パッケージ構成 → 2026-08-13、npm workspaces構成へ移行)

当初はQ4=A(単一パッケージ構成)で決定したが、ライブラリ本体とサンプルアプリの依存関係(peerDependencies/dependenciesの境界)を明確に分離するため、npm workspacesによるモノレポ構成に移行した。ディレクトリ構造以外の設計判断(単一バレルエクスポート、画面パターンの非公開扱い等)は変更していない。

```
make-you-chic-ui/                       (workspaceルート、非公開)
├── packages/
│   ├── make-you-chic-ui/               (デザインシステム本体。npm distの元)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.css
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ...(コンポーネントごとに同様のフォルダ構成)
│   │   │   │   └── AppShell/ ...
│   │   │   ├── theme/
│   │   │   │   ├── tokens.css        (プリミティブトークン)
│   │   │   │   ├── semantic.css      (セマンティックトークン)
│   │   │   │   ├── ThemeProvider.tsx
│   │   │   │   └── useTheme.ts
│   │   │   └── index.ts              (単一バレルエクスポート、Application Design Question 9=A)
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   ├── package.json              (peerDependencies: react/react-dom)
│   │   └── tsconfig.json
│   └── sample-app/                     (動作確認用アプリ。dependenciesの"make-you-chic-ui": "*"でworkspace参照)
│       ├── src/
│       │   ├── screen-patterns/      (Unit 7: 画面パターンのReact参考実装。パッケージのexportには含めない)
│       │   │   ├── ListView/
│       │   │   ├── DetailView/
│       │   │   ├── EditUserModal/
│       │   │   └── DeleteConfirmModal/
│       │   └── pages/
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
├── html-demo/
│   ├── index.html            (デモ一覧トップ)
│   ├── components/           (コンポーネント単位のデモページ、Storybook代替)
│   ├── patterns/             (List View / Detail View 等の画面パターンデモ)
│   └── assets/               (フォント・共通CSS)
├── docs/
│   └── integration-guide.md  (Unit 8の成果物)
├── package.json               (workspaceルート、共通devDependencies集約)
└── tsconfig.base.json         (共通compilerOptions)
```

各コンポーネントフォルダには、テスト(`*.test.tsx`)を併置する。a11y自動テスト(axe)・PBT(fast-check, Partial適用)の配置方針はNFR Requirementsステージ(ユニット単位)で確定する。
