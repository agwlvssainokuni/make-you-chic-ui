# Code Generation Plan — Unit 3: 静的表示系

## ユニットコンテキスト

- **対応要件**: FR1(Avatar/Badge/Card)
- **依存ユニット**: Unit 1(Icon、任意)
- **設計根拠**: `aidlc-docs/construction/unit3-static-display/functional-design/`(NFR Requirements/NFR DesignはSKIP)

## 実施ステップ

- [ ] **Step 1: Avatar 生成 + 単体テスト**
  - `src/components/Avatar/Avatar.tsx`, `Avatar.css`, `index.ts`, `Avatar.test.tsx`(vitest-axe含む)
- [ ] **Step 2: Badge 生成 + 単体テスト**
  - `src/components/Badge/Badge.tsx`, `Badge.css`, `index.ts`, `Badge.test.tsx`
- [ ] **Step 3: Card 生成 + 単体テスト**
  - `src/components/Card/Card.tsx`, `Card.css`, `index.ts`, `Card.test.tsx`
- [ ] **Step 4: バレルエクスポート更新**(`src/index.ts`)
- [ ] **Step 5: HTML版デモへの反映**(`html-demo/components/static-display-demo.html`、`html-demo/index.html`更新)
- [ ] **Step 6: サマリードキュメント作成**

## 共通ルール(継続)

- ライセンス表記(`Copyright 2026 agwlvssainokuni`, Apache-2.0)
- セマンティックトークンのみ参照(NFR2)
- `data-testid`付与、JSDoc付与

本計画が本ユニットのCode Generationにおける唯一の実行手順であり、計画外の作業は行わない。
