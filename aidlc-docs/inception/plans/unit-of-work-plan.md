# Unit of Work Plan — Web UI デザインシステム

## 実施タスク

- [ ] `aidlc-docs/inception/application-design/unit-of-work.md` を作成(ユニット定義・責務)
- [ ] `aidlc-docs/inception/application-design/unit-of-work-dependency.md` を作成(依存関係マトリクス・実装順序)
- [ ] `aidlc-docs/inception/application-design/unit-of-work-story-map.md` を作成(User Storiesはスキップ済みのため、FR1〜FR8の各要件をどのユニットが満たすかのマッピングとして代用)
- [ ] Greenfieldのためコード構成方針(ディレクトリ構造)を`unit-of-work.md`に記載
- [ ] ユニット境界・依存関係の妥当性を検証
- [ ] 全FR/NFRがいずれかのユニットに割り当てられていることを確認

## 前提

User Storiesステージはスキップ済みのため、`unit-of-work-story-map.md`はストーリーではなく`requirements.md`のFR1〜FR8をユニットにマッピングする形で代用する。

## ユニット分割方針確認質問

### Question 1: 分割の粒度

`aidlc-docs/inception/application-design/components.md`の19コンポーネント/フックをどの粒度でユニット化しますか?

A) **粗い(4〜5ユニット)**: 例) 「基盤(トークン/テーマ/Icon)」「入力系」「表示・フィードバック・ナビ系をまとめて1つ」「Table」「画面パターン+HTML版+ガイド」。ユニットあたりの作業量は大きいが、繰り返すConstruction phaseのループ回数(承認ゲート)は少ない

B) **中間(8〜9ユニット)**: カテゴリ単位(基盤/静的表示系/基本入力系/フィードバック系/ナビ・レイアウト系/Table/画面パターン/HTML版/組み込みガイド)で分割。1ユニットあたりの規模が扱いやすい

C) **細かい(コンポーネント単位に近い、15+ユニット)**: 個々のコンポーネントごとにほぼ1ユニット。レビューの粒度は最も細かいが、承認ゲートの往復が非常に多くなる

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2: React版とHTML版の実装順序

各ユニットにおいて、React版とNode.js不要のHTML版(FR6)はどちらを先に作りますか?

A) React版を先に実装し、同じユニット内でHTML版に反映する(ロジックをReact→HTMLへ移植)

B) HTML版を先に(または`reference/`の既存デモを拡張する形で)プロトタイピングし、同じユニット内でReact版に移植する(`reference/CLAUDE.md`の既存デモの成り立ちに近い)

C) React版をすべてのユニットで先に作り切ってから、最後にまとめてHTML版を1つの独立したユニットとして作る

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3: 基盤ユニットの優先順位

デザイントークン・テーマエンジン(FR3/FR4、`ThemeProvider`)・Iconプリミティブは、他の全コンポーネントが依存する基盤です。最初のユニットとして最優先で実装することでよいですか?

A) はい。トークン/テーマ/Iconを最初のユニットとする

B) いいえ、別の優先順位にしたい(Answerに具体的な希望を記載)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: コード構成(ディレクトリ構造)

Greenfieldプロジェクトのため、リポジトリのディレクトリ構造方針を確認します。

A) 単一パッケージ構成: `src/components/*`(React)、`src/theme/*`、`src/hooks/*`、`html-demo/*`(HTML版)、`docs/*`(組み込みガイド)をワークスペースルート直下にまとめる

B) モノレポ構成: `packages/react/`、`packages/html-demo/`、`packages/docs/`のようにパッケージを分離する(将来のnpm発行を見据える場合)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5: ユニットの並行性

Construction phaseの各ユニットは「設計→コード生成」を完了してから次のユニットに進む逐次処理が原則ですが、依存関係のないユニット(例: Table と 基本入力系)について、実装順序の柔軟性は必要ですか?

A) 不要。`unit-of-work-dependency.md`で決めた順序に厳密に従って良い

B) 必要。依存関係が無ければ、ユーザーの指示でユニット順序を入れ替えられるようにしておきたい

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## 質問カテゴリの適用範囲についての注記

- **Team Alignment(チーム編成)**: 本プロジェクトは単一開発者(ユーザー)+AIによる開発であり、複数チームへの割り当てを検討する対象がないため、このカテゴリの質問は省略する(該当なしと判断)
- **Business Domain(業務ドメイン境界)**: 本プロジェクトは特定の業務ドメインを持たない汎用UIコンポーネントライブラリであり、業務境界に沿った分割は適用対象外と判断する
