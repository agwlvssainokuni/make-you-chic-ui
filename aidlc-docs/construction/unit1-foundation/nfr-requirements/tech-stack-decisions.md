# Tech Stack Decisions — Unit 1: 基盤(プロジェクト全体に適用)

Unit 1は最初のユニットのため、ここで確定する技術スタックはUnit 2〜8にも共通適用する。

## 確定済み(Requirements Analysis / Application Design由来)

| 項目           | 選択                                    | 出典                          |
| -------------- | --------------------------------------- | ----------------------------- |
| 実装言語       | React + TypeScript                      | requirements.md Q2            |
| ビルドツール   | Vite + npm                              | requirements.md NFR1          |
| スタイリング   | Vanilla CSS(セマンティックトークン参照) | requirements.md NFR2          |
| パッケージ構成 | 単一パッケージ、バレルエクスポート      | application-design-plan.md Q9 |

## 本ステージで新規確定

| 項目                               | 選択                                        | 理由                                                                                                                                          |
| ---------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 単体テストフレームワーク           | **Vitest**                                  | Viteと同一エコシステムのため設定の二重管理が不要                                                                                              |
| コンポーネントテストユーティリティ | **@testing-library/react**                  | Vitestと組み合わせて実装詳細でなく振る舞いをテストする標準的な手法                                                                            |
| a11y自動テスト                     | **vitest-axe**                              | axe-coreベースのアクセシビリティ違反検出をVitestのアサーションとして実行                                                                      |
| Property-Based Testing             | **fast-check**                              | PBT-09拡張ルールの推奨、Vitestとの統合実績あり。Partial適用範囲(PBT-02/03/07/08/09)に対応                                                     |
| Lintツール                         | **ESLint**(`@typescript-eslint`)            | TypeScriptの静的解析                                                                                                                          |
| Formatツール                       | **Prettier**                                | コードスタイルの統一                                                                                                                          |
| CSS Lintツール                     | **stylelint**                               | NFR2「コンポーネントCSSはセマンティックトークンのみ参照する」をカスタムルールで静的検証(プリミティブトークンの直接参照を禁止するルールを設定) |
| APIドキュメント形式                | **JSDoc**(必須、公開コンポーネント・フック) | IDEホバー表示による組み込みやすさの向上(FR7と連動)                                                                                            |

## 依存パッケージ一覧(Unit 1時点で追加するもの)

```json
{
  "devDependencies": {
    "vitest": "*",
    "@testing-library/react": "*",
    "@testing-library/jest-dom": "*",
    "vitest-axe": "*",
    "fast-check": "*",
    "eslint": "*",
    "@typescript-eslint/parser": "*",
    "@typescript-eslint/eslint-plugin": "*",
    "eslint-plugin-jsx-a11y": "*",
    "prettier": "*",
    "stylelint": "*",
    "stylelint-config-standard": "*"
  }
}
```

具体的なバージョン番号はCode Generation時に最新の安定版を選定する。
