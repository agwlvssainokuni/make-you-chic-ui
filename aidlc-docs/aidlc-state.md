# AI-DLC State Tracking

## Project Information
- **Project Type**: Greenfield
- **Start Date**: 2026-08-11T06:21:52Z
- **Current Stage**: INCEPTION - Requirements Analysis (完了、承認待ち)

## Workspace State
- **Existing Code**: No
- **Reverse Engineering Needed**: No
- **Workspace Root**: web-design-system-sample/ (プロジェクトルート)

## Code Location Rules
- **Application Code**: ワークスペースルート(aidlc-docs/には置かない)
- **Documentation**: aidlc-docs/ のみ
- **Structure patterns**: construction/code-generation.md のCritical Rulesを参照

## Reference Materials (Git管理対象外, .gitignore済み)
- `reference/CLAUDE.md` — デザインシステム設計方針(トークン設計、コンポーネントAPI命名規則、a11y方針、実装済みコンポーネント、画面パターン、テーマ機能等)
- `reference/integrated-app-demo.html` — 共通レイアウト+List/Detail View 統合デモ(Vanilla JS参考実装)
- `reference/table-advanced-demo.html` — 高度なTable操作デモ(Vanilla JS参考実装)

## Project Ground Rules (ユーザー指定)
- コミットは作業単位(原則ステップごと、長い場合はサブアイテムごと)でこまめに行う
- audit.md / aidlc-state.md の追記・更新時にもコミットする
- AIが自発的にコミットするが、実行前に必ずユーザーの許可を求める
- コミットコメントは日本語で記述する
- 成果物(生成コード)にはライセンス表記のコメントを入れる(ライセンス: Apache License 2.0 — リポジトリ直下の `LICENSE` を確認)
- ドキュメント内のファイルパスは絶対パスでなく相対パスで記述する

## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
| Resiliency Baseline | No | Requirements Analysis |
| Property-Based Testing | Partial(PBT-02, 03, 07, 08, 09のみ強制) | Requirements Analysis |

## Stage Progress
### 🔵 INCEPTION PHASE
- [x] Workspace Detection (2026-08-11T06:21:52Z) — Greenfieldと判定、Requirements Analysisへ
- [x] Requirements Analysis (2026-08-11T06:23:00Z 質問提示 → 回答受領・分析完了) — `aidlc-docs/inception/requirements/requirements.md` 作成、ユーザー承認待ち
