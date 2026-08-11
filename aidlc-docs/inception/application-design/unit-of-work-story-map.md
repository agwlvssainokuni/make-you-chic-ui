# Unit ⇔ 要件(FR/NFR)マッピング

User Storiesステージはスキップ済み(業務要件・複数ペルソナを持たない開発者向けコンポーネントライブラリのため)。本ドキュメントはストーリーマップの代わりに、`aidlc-docs/inception/requirements/requirements.md`のFR1〜FR8・NFR1〜NFR9を各ユニットにマッピングする。

## マッピング表

| 要件                                  | 内容                                     | 対応ユニット                                                                                                              |
| ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| FR1(コンポーネント一式)               | 十数種類のコンポーネント実装             | Unit 1(Icon), Unit 2(基本入力系), Unit 3(静的表示系), Unit 4(フィードバック系), Unit 5(ナビ・レイアウト系), Unit 6(Table) |
| FR2(画面パターン)                     | List View/Detail View/編集Modal/削除確認 | Unit 7                                                                                                                    |
| FR3(テーマ機能4軸)                    | data-theme/brand/font-family/font-size   | Unit 1                                                                                                                    |
| FR4(デザイントークン)                 | プリミティブ/セマンティック2層のCSS変数  | Unit 1                                                                                                                    |
| FR5(React+TypeScript版)               | 部品本体の実装言語                       | Unit 1〜7全て                                                                                                             |
| FR6(Node.js不要のHTML版)              | 静的デモ版の並行作成                     | Unit 1〜7全て(各ユニット内でHTML版へ反映。Unit 8は対象外)                                                                 |
| FR7(組み込みガイド)                   | 他プロジェクトへの導入手順書             | Unit 8                                                                                                                    |
| FR8(Webフォントセルフホスティング)    | Noto Sans/Serif JPのwoff2同梱            | Unit 1                                                                                                                    |
| NFR1(ビルド構成)                      | Vite + npm                               | 全ユニット共通(Unit 1でセットアップ)                                                                                      |
| NFR2(スタイリング方式)                | Vanilla CSS                              | Unit 1(トークン基盤)、以降各ユニット                                                                                      |
| NFR3(コンポーネントカタログ)          | Storybookなし、HTML版デモで代替          | Unit 1〜7(html-demo/への反映)                                                                                             |
| NFR4(テスト)                          | 単体テスト+a11y自動テスト                | 各ユニットのCode Generation/Build and Testステージ                                                                        |
| NFR5(ブラウザ対応)                    | モダンブラウザ最新2バージョン            | 全ユニット共通の実装制約                                                                                                  |
| NFR6(アクセシビリティ)                | WCAG 2.1 AA、reference記載の最低ライン   | 各ユニットのFunctional Design/NFR Design                                                                                  |
| NFR7(i18n配慮)                        | 文言の外出し構造                         | 各ユニット(特にUnit 2, 4, 5, 7でUI文言を持つ箇所)                                                                         |
| NFR8(ライセンス表記)                  | 生成コードへのライセンスコメント         | 各ユニットのCode Generation                                                                                               |
| NFR9(レスポンシブ)                    | デスクトップのみ、ウィンドウ幅追従       | Unit 5(AppShell), Unit 6(Table), Unit 7(画面パターン)                                                                     |
| 拡張: Property-Based Testing(Partial) | PBT-02/03/07/08/09                       | Unit 6(Table)を主対象。他ユニットは純粋関数の有無に応じて適用                                                             |

## 未割当の確認

FR1〜FR8・NFR1〜NFR9のすべてがいずれかのユニットに割り当てられていることを確認済み。未割当の要件はない。
