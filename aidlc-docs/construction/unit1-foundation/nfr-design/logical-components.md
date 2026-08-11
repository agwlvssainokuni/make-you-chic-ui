# Logical Components — Unit 1: 基盤

本ユニットはキュー・キャッシュ・サーキットブレーカー等のインフラ的な論理コンポーネントを持たない(バックエンド・ネットワーク通信が存在しないクライアントサイドライブラリのため)。

該当する論理コンポーネントとしては、以下の内部ユーティリティのみ:

| コンポーネント | 責務 | 配置場所 |
|---|---|---|
| `safeLocalStorageGet` / `safeLocalStorageSet` | `localStorage`アクセスの例外吸収(nfr-design-patterns.md参照) | `src/theme/storage.ts` |
| `isValidThemeValue(axis, value)` | テーマ軸ごとの値検証(読み込み時・書き込み時で共用) | `src/theme/validation.ts` |
| `iconRegistry` | アイコン名→SVGコンポーネントのマップ(Functional Design参照) | `src/components/Icon/registry.ts` |

いずれもUnit 1内で完結する内部実装であり、外部インフラサービスとの連携はない。
