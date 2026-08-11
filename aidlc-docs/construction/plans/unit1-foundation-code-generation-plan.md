# Code Generation Plan — Unit 1: 基盤(デザイントークン・テーマエンジン・Icon)

## ユニットコンテキスト

- **対応要件**: FR3, FR4, FR8, NFR1, NFR2(`aidlc-docs/inception/application-design/unit-of-work-story-map.md`参照)
- **依存ユニット**: なし(最初のユニット)
- **後続ユニットへの提供インターフェース**: `ThemeProvider`/`useTheme()`、`Icon`コンポーネント、CSSトークン(プリミティブ/セマンティック)、フォントのセルフホスティング設定
- **設計根拠**: `aidlc-docs/construction/unit1-foundation/functional-design/`、`nfr-requirements/`、`nfr-design/`
- **ワークスペースルート**: `aidlc-docs/aidlc-state.md`より、プロジェクトルート直下(単一パッケージ構成、`aidlc-docs/inception/application-design/unit-of-work.md`のディレクトリ構造に従う)

## 全ユニット共通ルール

- 生成する全コードファイルの先頭にApache License 2.0のライセンス表記コメントを付与する(プロジェクトのグラウンドルール)
- コンポーネントのCSSはセマンティックトークンのみ参照し、プリミティブトークンを直接参照しない(NFR2)
- インタラクティブなDOM要素には`data-testid`属性を付与する(`{component}-{element-role}`命名規則)。本ユニットはインタラクティブなUI要素を持たないため大部分は非該当

## 実施ステップ

- [x] **Step 1: プロジェクト構造セットアップ(Greenfield初回)**
  - `package.json`(Vite + npm、依存関係は`tech-stack-decisions.md`参照)
  - `tsconfig.json`(strict mode)
  - `vite.config.ts`
  - `vitest.config.ts`
  - `.eslintrc`(ESLint + `@typescript-eslint` + `eslint-plugin-jsx-a11y`)
  - `.prettierrc`
  - `.stylelintrc`(NFR2のセマンティックトークン参照規約をカスタムルールで検証)
  - `unit-of-work.md`のディレクトリ構造に従い`src/`, `examples/`, `html-demo/`, `docs/`の空フォルダを作成
  - `.gitignore`更新(`node_modules/`, `dist/`等をGit対象外に追加)

- [x] **Step 2: デザイントークン生成**
  - `src/theme/tokens.css`(プリミティブトークン: 色・スペーシング・角丸等、reference/CLAUDE.md準拠)
  - `src/theme/semantic.css`(セマンティックトークン: `--color-primary`等、テーマ4軸に応じて値が変わるもの)

- [x] **Step 3: テーマ状態管理ロジック生成(Business Logic)**
  - `src/theme/storage.ts`(`safeLocalStorageGet`/`safeLocalStorageSet`、NFR Design参照)
  - `src/theme/validation.ts`(`isValidThemeValue`、business-rules.md参照)
  - `src/theme/types.ts`(`ThemeState`等の型定義、domain-entities.md参照)

- [x] **Step 4: テーマ状態管理ロジックの単体テスト**
  - `src/theme/storage.test.ts`(localStorageアクセス失敗時のフォールバックを含む)
  - `src/theme/validation.test.ts`(有効値・不正値のテスト。`fast-check`によるPBT: 「有効な軸+有効な値の組み合わせは常にtrueを返す」「無効な値は常にfalseを返す」という不変条件を検証)

- [x] **Step 5: ThemeProvider / useTheme 生成(Frontend Components)**
  - `src/theme/ThemeProvider.tsx`(初期化・マルチタブ同期・`<html>`属性反映、Context値のメモ化)
  - `src/theme/useTheme.ts`(Provider外呼び出し時のfail-soft動作を含む)

- [x] **Step 6: ThemeProvider / useTheme の単体テスト**
  - `src/theme/ThemeProvider.test.tsx`(初期化、`set*`呼び出し、`storage`イベント同期、`localStorage`失敗時のシナリオ)
  - `vitest-axe`によるa11yテスト(ThemeProviderはDOM要素を持たないため、`children`を通したレンダリング結果に違反がないことを確認する程度)

- [x] **Step 7: Icon コンポーネント生成(Frontend Components)**
  - `src/components/Icon/icons/`配下に初期アイコン6種のSVGコンポーネント(`menu`, `chevron-down`, `close`, `check`, `bell`, `user`)
  - `src/components/Icon/registry.ts`(`iconRegistry`マップ)
  - `src/components/Icon/Icon.tsx`(props、未定義名時のfail-soft動作)
  - `src/components/Icon/Icon.css`(サイズ・色のセマンティックトークン参照)
  - `src/components/Icon/index.ts`

- [x] **Step 8: Icon コンポーネントの単体テスト**
  - `src/components/Icon/Icon.test.tsx`(正常系、未定義名時のconsole.warn+無描画、`label`指定時のaria-label)
  - `vitest-axe`によるa11yテスト

- [x] **Step 9: Webフォントのセルフホスティング設定**(実バイナリのwoff2は同梱せず、配置手順を`src/fonts/README.md`に記載)
  - `src/fonts/`にNoto Sans JP / Noto Serif JPのwoff2ファイルを配置(プレースホルダーとして軽量なダミーファイル、または実際のフォントファイル取得方法をコメントで明記)
  - `src/theme/fonts.css`(`@font-face`定義、`font-display: swap`、NFR Design参照)

- [x] **Step 10: バレルエクスポート更新**
  - `src/index.ts`にThemeProvider/useTheme/Iconをエクスポート追加

- [x] **Step 11: HTML版デモへの反映(FR6、Question 2=A方針)**
  - `html-demo/index.html`(デモ一覧トップページの雛形)
  - `html-demo/assets/tokens.css`, `html-demo/assets/semantic.css`(React版と同一のトークンを反映)
  - `html-demo/assets/fonts.css`
  - `html-demo/components/theme-demo.html`(テーマ切り替えUIのVanilla JSデモ。ThemeProviderのロジックをVanilla JSに移植)
  - `html-demo/components/icon-demo.html`(Icon一覧の静的デモ)

- [x] **Step 12: サマリードキュメント作成**
  - `aidlc-docs/construction/unit1-foundation/code/summary.md`(生成ファイル一覧、テスト結果概要 ※実行はBuild and Testステージで行う)

## ストーリー(要件)トレーサビリティ

| 要件                               | 対応ステップ     |
| ---------------------------------- | ---------------- |
| FR3(テーマ機能4軸)                 | Step 2, 3, 5, 11 |
| FR4(デザイントークン)              | Step 2, 11       |
| FR8(Webフォントセルフホスティング) | Step 9, 11       |
| NFR1(ビルド構成)                   | Step 1           |
| NFR2(スタイリング方式)             | Step 2, 7        |
| NFR6(a11y)                         | Step 6, 8        |
| Property-Based Testing(Partial)    | Step 4           |

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
