# NFR Requirements — Unit 1: 基盤

## 適用カテゴリと判定

| カテゴリ | 判定 | 内容 |
|---|---|---|
| Scalability | 非該当 | バックエンド・トラフィックを持たないUIライブラリ |
| Performance | 限定的に適用 | ThemeProviderのContext値を`useMemo`でメモ化し、不要な再レンダリングを避ける |
| Availability | 非該当 | プロトタイプ段階、デプロイ・稼働概念なし |
| Security | 非該当 | Security Baseline拡張はRequirements Analysisでスキップ済み |
| Tech Stack Selection | 適用 | `tech-stack-decisions.md`参照 |
| Reliability | 限定的に適用 | Icon未定義名時のfail-soft動作(Functional Design済み) |
| Maintainability | 適用 | 公開API(コンポーネントProps・フック戻り値)にJSDoc必須。ESLint+Prettier+stylelintによる静的検証 |
| Usability | 適用 | `useTheme()`/`Icon`のAPIは最小限の呼び出しで意図した結果が得られること(NFR6/NFR9はUnit 1では直接該当するUIが少ないため、他ユニットで本格適用) |

## 決定事項サマリー

1. **テストフレームワーク**: Vitest + React Testing Library(プロジェクト全体で採用、以降のUnit 2〜8も踏襲)
2. **a11y自動テスト**: `vitest-axe`をコンポーネント単体テストに組み込む
3. **PBT**: `fast-check`を採用(Property-Based Testing拡張のPartial適用範囲: PBT-02/03/07/08/09)。Unit 1では純粋関数的なロジックが限定的(テーマのバリデーション関数程度)だが、フレームワーク自体はここで導入する
4. **Lint/Format**: ESLint(TypeScript対応)+ Prettier + stylelint。stylelintでNFR2(セマンティックトークンのみ参照)を静的に検証するカスタムルールを設定
5. **JSDoc**: 公開コンポーネント・フックのProps/戻り値には必須

## Unit 1固有の性能・信頼性要件

- **ThemeProviderのContext再レンダリング対策**: `{ theme, brand, fontFamily, fontSize, setTheme, setBrand, setFontFamily, setFontSize }`のオブジェクトを`useMemo`で依存配列`[theme, brand, fontFamily, fontSize]`により再生成を最小化する(セッター関数群は`useCallback`で参照を固定)
- **`storage`イベントリスナーのメモリリーク防止**: `useEffect`のクリーンアップ関数で確実に`removeEventListener`する(Functional Designで既に規定)
