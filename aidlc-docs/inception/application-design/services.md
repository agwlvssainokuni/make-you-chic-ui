# サービス層(Provider/Context)定義

コンポーネント単体では完結しない、アプリ全体で共有される状態・オーケストレーションを担うサービス層。いずれもReact ContextベースのProvider + フックの組み合わせで提供する(Application Design Plan Question 4, 5より)。

## ThemeProvider

- **責務**: テーマ4軸(`theme`/`brand`/`fontFamily`/`fontSize`)の状態管理、`localStorage`への永続化、`<html>`要素へのdata属性反映
- **スコープ**: アプリケーションルートに1回だけ配置(全画面に影響するグローバルサービス)
- **オーケストレーション**:
  1. マウント時に`localStorage`から復元。`theme`未設定時は`window.matchMedia('(prefers-color-scheme: dark)')`を尊重
  2. `set*`系メソッド呼び出し時に、state更新 → `<html>`のdata属性更新 → `localStorage`書き込み、の順で反映
  3. 実際の見た目の変化はCSS側のセマンティックトークン(FR4)が担う。ThemeProvider自身はdata属性の設定・永続化のみを担当し、スタイル計算はしない
- **利用側との関係**: コンポーネント個々のCSSはセマンティックトークンのみ参照するため、ThemeProviderが存在しなくても表示は崩れない(data属性未設定時はデフォルト値のCSSが適用される)。ThemeProviderは状態管理の利便性を提供するオプショナルなレイヤー

## ToastProvider

- **責務**: Toast通知のキュー管理(複数同時表示)、`aria-live="polite"`領域の描画
- **スコープ**: アプリケーションルートに1回だけ配置
- **オーケストレーション**:
  1. `useToast().show()`呼び出し時にキューへ追加し、一意なidを発行
  2. `duration`経過後に自動的にキューから削除(`dismiss`との重複実行を防ぐガードあり)
  3. 複数Toastは新しい順にスタック表示

## AppShell内部Context(useAppShell)

- **責務**: Sidebar折り畳み状態の管理・永続化・公開
- **スコープ**: `AppShell`コンポーネントのサブツリー内のみ(ToastProvider/ThemeProviderと異なりアプリ全体のグローバルサービスではない)
- **オーケストレーション**:
  1. `AppShell`マウント時、折り畳み状態を`localStorage`から復元
  2. `toggleCollapsed`/`setCollapsed`呼び出し時にstate更新 → `localStorage`書き込み
  3. `AppShell`内のTopbar(ハンバーガーボタン等)や、`AppShell`の`children`(Content領域)から`useAppShell()`を呼び出すことで、折り畳み状態の参照・操作が可能
- **利用側との関係**: `AppShell`の外側から`useAppShell()`を呼び出すと未定義動作(Context Providerの外)となるため、組み込みガイド(FR7)にスコープを明記する

## サービス間の独立性

ThemeProvider・ToastProvider・AppShellの3つのサービスは互いに依存しない独立したContextである。利用側は必要なものだけを個別に組み込める(例: テーマ切り替え不要なプロジェクトはThemeProviderを使わずCSS変数を静的に設定してもよい)。
