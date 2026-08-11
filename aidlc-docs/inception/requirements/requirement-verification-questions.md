# Requirements Clarification Questions — Web UI デザインシステム

`reference/CLAUDE.md`、`reference/integrated-app-demo.html`、`reference/table-advanced-demo.html` を確認しました。
デザイン方針(トークン設計、命名規則、a11y方針、テーマ機能)や参考実装(Vanilla JS版)はかなり具体的でしたが、
実際に本プロジェクトで生成するコードの技術スタックや配布形態などが未確定のため、以下を確認させてください。

各質問に、[Answer]: タグの後ろに選択肢のアルファベットで回答してください。
当てはまる選択肢がない場合は最後の「Other」を選び、[Answer]: タグの後ろに内容を記述してください。

## Question 1
このプロジェクト(`web-design-system-sample`)は、最終的にどのような成果物として扱われますか?

A) `MasterMeister` などの利用側プロジェクトから読み込む独立npmパッケージ(公開/社内レジストリへの発行を想定)

B) 単一リポジトリ内のコンポーネント集(npm発行はせず、Gitサブモジュールやコピーで利用)

C) このリポジトリ自体は検証・サンプル用であり、将来的に本番用リポジトリへ移植する前提のプロトタイプ

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
実装言語・フレームワークについて、`reference/CLAUDE.md` 末尾に「Reactコンポーネント化する際は」との記載がありました。React前提で進めてよいですか?

A) はい。React + TypeScript で実装する

B) はい。React + JavaScript(型なし)で実装する

C) いいえ。Vanilla JS(参考実装デモと同様の方式)のまま拡張する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
ビルドツール・パッケージマネージャーの希望はありますか?

A) Vite + npm

B) Vite + pnpm

C) 特にこだわりはない(AI側で標準的な構成を提案してよい)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
今回のワークフローで実装するスコープはどこまでとしますか? (`reference/CLAUDE.md` には実装済みコンポーネント5種・画面パターン5種・テーマ機能4軸が記載されています)

A) 全て一括実装(Button, FormField+TextInput/Select/Checkbox, Table, Modal, Toast の全コンポーネント + 全画面パターン + テーマ機能4軸)

B) まずはコンポーネント一式(Button〜Toast)とテーマ機能のみ実装し、画面パターン(List View/Detail View等)は次回以降のスコープとする

C) まずはButton・FormField系など基本コンポーネントのみ実装し、Table/Modal/Toastのような複雑なコンポーネントは次回以降とする

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
スタイリング方式は `reference` のデモと同様「CSS変数によるプリミティブ/セマンティック2層構造」を採用する前提でよいですか? (CSS Modules / Vanilla CSS / CSS-in-JS のいずれを使うか)

A) Vanilla CSS(コンポーネントごとに `.css` ファイルを分割し、グローバルにセマンティックトークンを定義)

B) CSS Modules(クラス名の衝突を防ぐため、コンポーネントごとに `.module.css`)

C) CSS-in-JS(styled-components や vanilla-extract 等)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
コンポーネントカタログ/ドキュメントとして Storybook のような開発環境を用意しますか?

A) はい、Storybookを導入する

B) いいえ、`reference/integrated-app-demo.html` のようなデモページ(HTML)で代替する

C) いいえ、今回は不要(単体テストのみで十分)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 7
テストについて、どこまで求めますか?

A) 単体テスト(コンポーネントロジック)+ アクセシビリティ自動テスト(axe等)

B) 単体テストのみ

C) 現時点ではテスト不要(後続フェーズで追加)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 8
サポート対象ブラウザの範囲はどこまでですか? (`color-mix()` 等のモダンCSS機能を使用しているため確認)

A) モダンブラウザ最新版のみ(Chrome/Edge/Firefox/Safari の直近2バージョン)

B) IE11等のレガシーブラウザも含める

C) 特に指定なし(AI側で一般的なモダンブラウザ対応として進めてよい)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 9
アクセシビリティの目標基準はありますか? (`reference/CLAUDE.md` にフォーカスリング・フォーカストラップ等の実装方針の記載あり)

A) WCAG 2.1 Level AA準拠を目標とする

B) `reference/CLAUDE.md` に記載の項目を満たせば十分(明示的な等級目標はなし)

C) 特に定めない

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 10
Webフォント(Noto Sans JP / Noto Serif JP)の読み込み方式について、今回のスコープではどちらとしますか? (`reference/CLAUDE.md` には「本番はセルフホスティングに切り替える」との記載あり)

A) 今回はGoogle Fonts CDN経由のままでよい(セルフホスティングは将来対応)

B) 今回からセルフホスティング(woff2同梱)で実装する

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 11
多言語対応(i18n)は必要ですか?

A) 不要。日本語UIのみを前提とする

B) 必要。将来的な多言語対応を見据えた設計(文言の外出し等)をしておく

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question: Resiliency Extensions
Should the resiliency baseline be applied to this project?

**What this extension is.** Enabling it applies a set of **directional, design-time best practices** for building resilient systems, derived from the **AWS Well-Architected Framework (Reliability Pillar)** and resilience-review guidance. It steers requirements, design, and code toward fault tolerance, high availability, observability, and recoverability — covering 15 practice areas across business goals, change management, observability, high availability, disaster recovery, and continuous improvement.

**What this extension is NOT.** Enabling it does **not** make your workload production-ready, nor does it certify or guarantee any availability, RTO, or RPO target. It is a **starting point** that scaffolds good resiliency decisions early — it is not a substitute for a formal **AWS Well-Architected Review** of the built system.

Treat the output as a well-grounded **first draft of your resiliency posture** to build on and validate — not a finished, production-certified result.

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
