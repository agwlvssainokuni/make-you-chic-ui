# ユニット依存関係・実装順序

Unit of Work Plan Question 3(基盤ユニット最優先)・Question 5(依存順序に厳密に従う)の方針に基づき、以下の順序で実装する。

## 依存関係マトリクス

| ユニット | 依存元(このユニットが依存するユニット) | 依存理由 |
|---|---|---|
| Unit 1: 基盤 | なし | 最初のユニット。トークン・テーマ・Iconは全ユニットの前提 |
| Unit 2: 基本入力系 | Unit 1 | セマンティックトークンでスタイリング |
| Unit 3: 静的表示系 | Unit 1 | Icon(Avatar/Badgeが任意で利用)、トークン |
| Unit 4: フィードバック系 | Unit 1, Unit 2 | Icon(variant別アイコン)、Button(Modal/Alertのアクションボタン) |
| Unit 5: ナビゲーション・レイアウト系 | Unit 1, Unit 2, Unit 3 | Icon、Badge/Avatar(AppShellのTopbar)、Dropdown内のBadge等 |
| Unit 6: Table | Unit 1, Unit 2 | Icon(ソート矢印)、Checkbox(行選択) |
| Unit 7: 画面パターン | Unit 1〜6(全て) | List View/Detail View等は全コンポーネントを合成して構成 |
| Unit 8: 組み込みガイド | Unit 1〜7(全て) | 完成した全コンポーネント・画面パターンを対象にドキュメント化 |

## 実装順序

```
Unit 1(基盤)
  └─> Unit 2(基本入力系)
        ├─> Unit 3(静的表示系)
        │     └─> Unit 5(ナビゲーション・レイアウト系)
        ├─> Unit 4(フィードバック系)
        └─> Unit 6(Table)
              └─> Unit 7(画面パターン) ※Unit 3, 4, 5の完了も必要
                    └─> Unit 8(組み込みガイド)
```

**確定シーケンス**: Unit 1 → Unit 2 → Unit 3 → Unit 4 → Unit 5 → Unit 6 → Unit 7 → Unit 8

Question 5(Answer: A)の方針により、依存関係のないUnit 3・4・6同士の並行実行は行わず、上記の確定シーケンスに厳密に従って逐次実装する。

## テキスト代替(依存関係図)

```
Unit 1: 基盤 (トークン/テーマ/Icon)
  → Unit 2: 基本入力系 (Button/FormField/TextInput等)
    → Unit 3: 静的表示系 (Avatar/Badge/Card)
      → Unit 5: ナビゲーション・レイアウト系 (Tabs/Dropdown/AppShell)
    → Unit 4: フィードバック系 (Modal/Toast/Alert/Tooltip)
    → Unit 6: Table
      → Unit 7: 画面パターン (Unit 3,4,5,6完了が前提)
        → Unit 8: 組み込みガイド (Unit 1-7完了が前提)
```
