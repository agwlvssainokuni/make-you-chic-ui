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

### Unit 8: 組み込みガイド
- **責務**: 他プロジェクトへの組み込み手順書の作成(インストール方法、import方法、`ThemeProvider`/`ToastProvider`の設定方法、`className`によるカスタマイズ指針を含む)
- **対応FR/NFR**: FR7(組み込みガイド)
- **対応Application Design**: 該当なし(ドキュメント成果物)
- **備考**: HTML版デモ成果物を持たない唯一のユニット

## コード構成方針(Q4=A: 単一パッケージ構成)

```
web-design-system-sample/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.css
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── FormField/ ...
│   │   ├── TextInput/ ...
│   │   ├── ...(コンポーネントごとに同様のフォルダ構成)
│   │   └── AppShell/ ...
│   ├── theme/
│   │   ├── tokens.css        (プリミティブトークン)
│   │   ├── semantic.css      (セマンティックトークン)
│   │   ├── ThemeProvider.tsx
│   │   └── useTheme.ts
│   ├── icons/
│   │   └── (同梱SVGアイコンセット。Iconコンポーネント自体はsrc/components/Icon/)
│   ├── fonts/                (Noto Sans/Serif JP woff2、セルフホスティング用)
│   └── index.ts              (単一バレルエクスポート、Application Design Question 9=A)
├── html-demo/
│   ├── index.html            (デモ一覧トップ)
│   ├── components/           (コンポーネント単位のデモページ、Storybook代替)
│   ├── patterns/             (List View / Detail View 等の画面パターンデモ)
│   └── assets/               (フォント・共通CSS)
├── docs/
│   └── integration-guide.md  (Unit 8の成果物)
├── vite.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

各コンポーネントフォルダには、テスト(`*.test.tsx`)を併置する。a11y自動テスト(axe)・PBT(fast-check, Partial適用)の配置方針はNFR Requirementsステージ(ユニット単位)で確定する。
