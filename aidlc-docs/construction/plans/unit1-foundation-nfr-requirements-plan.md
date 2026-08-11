# NFR Requirements Plan — Unit 1: 基盤(デザイントークン・テーマエンジン・Icon)

## 実施タスク

- [ ] `aidlc-docs/construction/unit1-foundation/nfr-requirements/nfr-requirements.md` を作成
- [ ] `aidlc-docs/construction/unit1-foundation/nfr-requirements/tech-stack-decisions.md` を作成(プロジェクト全体のテスト関連技術スタックを含む。Unit 1が最初のユニットのため、以降の全ユニットで踏襲する)

## 前提

Unit 1は最初のユニットのため、本ステージで確定するテスト関連の技術スタック(テストフレームワーク、a11yテストツール、PBTフレームワーク、Lint構成)はプロジェクト全体(Unit 2〜8)に適用される。

## カテゴリ別の適用判定

- **Scalability Requirements**: 非該当。バックエンド・トラフィックを持たないUIライブラリのため対象外
- **Performance Requirements**: 限定的に適用。ThemeProviderのContext再レンダリング最適化のみ検討
- **Availability Requirements**: 非該当。デプロイ・稼働概念を持たないプロトタイプ段階のため対象外
- **Security Requirements**: 非該当(要件定義書でSecurity Baseline拡張はスキップ済み)
- **Tech Stack Selection**: 適用。テストフレームワーク・a11yテストツール・PBTフレームワーク・Lintツール
- **Reliability Requirements**: 限定的に適用。Iconの未定義名時のfail-soft動作(Functional Design済み)以外に追加検討事項なし
- **Maintainability Requirements**: 適用。JSDocコメント要否、Lint/Format構成
- **Usability Requirements**: 適用(NFR6/NFR9を参照)。本ユニット自体はUIをほぼ持たないため、Icon/ThemeProviderのAPI使いやすさの観点のみ

## 確認質問

### Question 1: 単体テストフレームワーク

Vite(NFR1で決定済み)との親和性を踏まえ、単体テストフレームワークは何を使用しますか?

A) Vitest + React Testing Library(Viteネイティブ、設定の二重管理が不要)

B) Jest + React Testing Library(実績豊富だが、Viteと別に設定が必要)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: アクセシビリティ自動テストツール

NFR4(単体テスト+a11y自動テスト)のa11y部分は、どのツールで実施しますか?

A) `vitest-axe`(Question 1でVitestを選んだ場合の対応ライブラリ)。コンポーネント単体テスト内で`toHaveNoViolations()`のようなアサーションを実行

B) `jest-axe`(Jestを選んだ場合の対応ライブラリ)

C) `eslint-plugin-jsx-a11y`による静的解析のみ(実行時のDOM検証は行わない)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: Property-Based Testingフレームワーク

拡張機能設定(Property-Based Testing: Partial、PBT-09でフレームワーク選定が必須)に基づき、PBTフレームワークを確定します。TypeScript/JavaScriptエコシステムでの標準的な選択肢は`fast-check`です。これを採用してよいですか?

A) はい。`fast-check`を採用する(Vitestとの統合実績あり)

B) いいえ、他のフレームワークを希望する(Answerに記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4: Lint/Format構成

コード品質・一貫性のためのLint/Formatツールはどこまで導入しますか?

A) ESLint(TypeScript対応)+ Prettierのみ

B) 上記に加えて、stylelintも導入し「コンポーネントCSSはセマンティックトークンのみ参照する」(NFR2)というプロジェクト固有ルールを静的に検証する

C) 導入しない(今回のプロトタイプ段階では不要)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5: JSDocコメントの要否

公開コンポーネント・フックのProps/戻り値に対して、JSDocコメント(IDEでのホバー時ドキュメント表示用)を必須としますか?

A) 必須とする。エディタ上での使いやすさを重視し、公開APIには一貫してJSDocを付与する

B) 任意とする。複雑なpropsのみコメントを付与し、自明なものは省略する

X) Other (please describe after [Answer]: tag below)

[Answer]: 
