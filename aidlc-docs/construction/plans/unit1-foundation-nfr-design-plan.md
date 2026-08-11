# NFR Design Plan — Unit 1: 基盤(デザイントークン・テーマエンジン・Icon)

## 実施タスク

- [ ] `aidlc-docs/construction/unit1-foundation/nfr-design/nfr-design-patterns.md` を作成
- [ ] `aidlc-docs/construction/unit1-foundation/nfr-design/logical-components.md` を作成

## カテゴリ別の適用判定

- **Resilience Patterns**: 限定的に適用。ネットワーク通信は発生しないためリトライ戦略等は非該当だが、`localStorage`アクセス自体が失敗しうる環境(プライベートブラウジング、ストレージ無効化、容量超過)への対処は検討対象
- **Scalability Patterns**: 非該当。トラフィック・負荷という概念を持たないクライアントサイドライブラリ
- **Performance Patterns**: 適用。NFR Requirementsで決定したContext再レンダリング対策に加え、Webフォント(FR8)の読み込み戦略(FOUT/FOIT対策)を検討
- **Security Patterns**: 非該当(Security Baseline拡張はスキップ済み)。ただし`localStorage`読み込み時の値検証は品質観点で検討(Reliabilityに近い)
- **Logical Components**: 非該当。キュー・キャッシュ・サーキットブレーカー等のインフラコンポーネントは本ユニットに存在しない

## 確認質問

### Question 1: `localStorage`アクセス失敗時の挙動

プライベートブラウジングモードやストレージ容量超過等で`localStorage`へのアクセス(読み込み・書き込み)が例外を投げる環境があります。この場合、ThemeProviderはどう振る舞いますか?

A) `try/catch`で例外を捕捉し、その回のアクセスは無視してメモリ上のstateのみで動作を継続する(永続化されないが、アプリ自体はクラッシュしない)

B) 例外を再スローし、利用側アプリでのエラーハンドリングに委ねる

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2: `localStorage`読み込み時の値検証

現在の業務ルールでは`set*`メソッド呼び出し時のみ値を検証しますが、`localStorage`から読み込んだ初期値(過去のバージョンで保存された不正な値や、手動で書き換えられた値である可能性がある)についても同様に検証しますか?

A) 検証する。不正な値であれば無視し、デフォルト値(business-rules.md記載)にフォールバックする

B) 検証しない。`set*`時の検証のみで十分とする

X) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3: Webフォント読み込み戦略(FR8)

セルフホスティングするNoto Sans/Serif JP(woff2)について、`font-display`の戦略やちらつき(FOUT/FOIT)対策の方針を確認します。

A) `font-display: swap`を使用し、フォント読み込み完了までシステムフォントで表示し、読み込み完了後に切り替える(表示の即時性を優先、若干のレイアウトシフトの可能性あり)

B) `font-display: optional`を使用し、読み込みが十分速い場合のみ適用し、間に合わなければシステムフォントのまま(レイアウトシフトを避けることを優先)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
