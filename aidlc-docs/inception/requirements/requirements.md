# 要件定義書 — Web UI デザインシステム

## Intent Analysis Summary

- **User Request**: 他プロジェクト(MasterMeister等)でWEB UIの部品として再利用できるデザインシステムを構築したい。`reference/CLAUDE.md`(デザイン方針)、`reference/integrated-app-demo.html`、`reference/table-advanced-demo.html`(Vanilla JS参考実装)を提供資料として受領。
- **Request Type**: New Project(Greenfieldのデザインシステム構築)
- **Scope Estimate**: System-wide — 複数コンポーネント、複数画面パターン、テーマ機能、かつReact版とNode.js不要のHTML版という2種類の成果物を並行して作る
- **Complexity Estimate**: Complex — a11y要件、テーマ4軸の掛け合わせ、Table等の複雑なインタラクション、二重成果物(React版+静的HTML版)を含む

## 背景・参照資料

- `reference/CLAUDE.md`: デザインシステム設計方針(トークン設計、コンポーネントAPI命名規則、a11yの最低ライン、実装済みコンポーネント一覧、画面パターン、テーマ・バリエーション機能、Webフォント方針)
- `reference/integrated-app-demo.html`: 共通レイアウト(Sidebar+Topbar+Content)+ List View/Detail View の統合デモ(Vanilla JS実装)
- `reference/table-advanced-demo.html`: Tableの高度な操作(ソート、ページネーション、行選択、列幅調整、インライン編集)のデモ(Vanilla JS実装)
- これらは `reference/` に配置され、Git管理対象外(`.gitignore` 済み)の入力資料として扱う

## プロジェクトの位置づけ

本リポジトリ(`web-design-system-sample`)は、**検証・サンプル用のプロトタイプ**として扱う。将来的に本番用リポジトリへの移植を前提とし、今回のワークフローでは配布パッケージ化(npm発行等)は行わない。

## 機能要件 (Functional Requirements)

- **FR1 コンポーネント一式の実装**: 以下5種類のコンポーネントをReactで実装する
  - Button(variant: primary/secondary/danger/ghost、size: sm/md/lg、loading状態 `aria-busy`)
  - FormField + TextInput / Select / Checkbox(`forwardRef` 対応必須)
  - Table(3段階トグルソート、ページネーション、行選択(`Set`管理の制御コンポーネント)、列幅調整(ドラッグ終了時のみstate更新)、セルクリックによるインライン編集)
  - Modal(`createPortal`でbody直下配置、フォーカストラップ、Escキー・背景クリックで閉じる)
  - Toast(Context + `useToast`フック、`aria-live="polite"`、複数同時表示対応)
- **FR2 画面パターンの実装**: List View、Detail View、編集Modal(新規/編集共用)、削除確認(簡易/確認テキスト入力式)、共通レイアウト(Sidebar折り畳み可能+Topbar+Content)を実装する
- **FR3 テーマ機能4軸の実装**: `data-theme`(ライト/ダーク、`localStorage`永続化、初回`prefers-color-scheme`尊重)、`data-brand`(blue/green/purple/orange)、`data-font-family`(ゴシック/明朝)、`data-font-size`(sm/md/lg)を、セマンティックトークン層のみで完結させる(コンポーネント側CSSは変更不要)
- **FR4 デザイントークン設計**: プリミティブ/セマンティックの2層構造をCSS変数で実装する。コンポーネントのCSSはセマンティックトークンのみ参照する
- **FR5 React + TypeScript版の実装**: 部品として他プロジェクトから利用する本体は React + TypeScript で実装する
- **FR6 Node.js不要のHTML版の並行作成**: React版とは別に、Node.js環境がなくてもブラウザで直接開いてデザインイメージを確認できる HTML + CSS(+必要に応じてJS)の静的デモ版を、FR1〜FR3の全対象について作成する(`reference/`の2デモを土台として拡張する想定)
- **FR7 組み込みガイドの作成**: 他プロジェクトでWEB UIの部品として利用する際の手順書(インストール方法、コンポーネントのimport方法、テーマ設定方法等)を作成する
- **FR8 Webフォントのセルフホスティング**: Noto Sans JP / Noto Serif JP をwoff2形式で同梱し、`@font-face`で読み込む(CDN依存にしない)

## 非機能要件 (Non-Functional Requirements)

- **NFR1 ビルド構成**: Vite + npm を使用する
- **NFR2 スタイリング方式**: Vanilla CSS。コンポーネントごとに `.css` ファイルを分割し、セマンティックトークンはグローバルに定義する(CSS Modules・CSS-in-JSは使用しない)
- **NFR3 コンポーネントカタログ**: Storybookは導入しない。FR6のHTML版デモページをカタログ・ドキュメントとして代替する
- **NFR4 テスト**: 単体テスト(コンポーネントロジック)+ アクセシビリティ自動テスト(axe等)を実施する
- **NFR5 ブラウザ対応**: モダンブラウザ最新2バージョンのみ対応(Chrome/Edge/Firefox/Safari)。`color-mix()`等のモダンCSS機能の利用を許容する
- **NFR6 アクセシビリティ**: WCAG 2.1 Level AA準拠を目標とする。加えて`reference/CLAUDE.md`記載の最低ライン(フォーカスリング維持、モーダルのフォーカストラップ+`inert`、`aria-describedby`によるエラー紐付け、キーボード完結操作、`useId`によるラベル紐付け)を満たす
- **NFR7 国際化(i18n)への配慮**: 現時点のUIは日本語のみを前提とするが、将来的な多言語対応を見据え、UI文言をコンポーネント内にハードコードせず外出しできる構造にしておく
- **NFR8 ライセンス表記**: 生成する成果物コードにはライセンス表記コメントを付与する(リポジトリのライセンス: Apache License 2.0)

## 拡張機能(Extensions)の適用

| Extension | 判定 | 適用範囲 |
|---|---|---|
| Security Baseline | No(スキップ) | バックエンド/認証を持たないプロトタイプ段階のUIライブラリのため非適用 |
| Resiliency Baseline | No(スキップ) | インフラを持たないフロントエンドライブラリのため非適用(AWS Well-Architected信頼性の観点は対象外) |
| Property-Based Testing | Partial(部分適用) | PBT-02(往復性)、PBT-03(不変性)、PBT-07(ジェネレータ品質)、PBT-08(シュリンク・再現性)、PBT-09(フレームワーク選定)のみ強制適用。対象はTableのソート/ページネーション計算等の純粋関数部分を想定 |

## スコープに関するリスク・留意事項

- 今回のスコープはコンポーネント5種+画面パターン5種+テーマ4軸+React版/HTML版の二重実装+組み込みガイドと広範囲であるため、後続のWorkflow Planning / Units Generationで**実装単位への分割**を検討することを推奨する
- HTML版とReact版で実装ロジック(状態設計、イベントハンドリング、a11y対応)の整合を保つ必要がある。`reference/CLAUDE.md`には「Reactコンポーネント化する際はVanilla JS実装のロジックをそのまま移植する」との方針記載があり、本要件ではこれを両方向(React→HTML版の更新も含む)で保つ

## サマリー

React + TypeScriptによるコンポーネントライブラリ(Button/FormField系/Table/Modal/Toast の5コンポーネント、5画面パターン、4軸テーマ機能)を、WCAG 2.1 AA準拠を目標に実装する。並行してNode.js不要のHTML+CSS(+JS)静的デモ版と、他プロジェクトへの組み込みガイドを作成する。本リポジトリはプロトタイプ/サンプル位置づけとし、パッケージ配布は今回のスコープ外とする。
