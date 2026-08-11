# NFR Design Patterns — Unit 1: 基盤

## Resilience: `localStorage`アクセスのフォールトトレランス(Question 1 = A)

```ts
function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // プライベートブラウジング/無効化/例外時はnull扱い(デフォルト値へフォールバック)
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 永続化は諦めるが、呼び出し元のstate更新自体は継続する(メモリ上でのみ動作)
  }
}
```

`ThemeProvider`は上記のラッパー関数を通じてのみ`localStorage`にアクセスする。個々のコンポーネントが直接`window.localStorage`を呼び出すことは禁止する(Code Generation時のレビュー観点)。

## Reliability: 読み込み時の値検証(Question 2 = A)

```
1. safeLocalStorageGet()で文字列を取得
2. 取得できた場合、business-rules.mdの有効値リストと照合
3. 有効値であればそれを初期値として採用
4. 取得できない、または有効値と一致しない場合、business-rules.mdのデフォルト値にフォールバック
   (theme軸のみ、フォールバック前にprefers-color-schemeを評価)
```

`set*`時のバリデーションと同一の検証関数(`isValidThemeValue(axis, value)`)を、初期読み込み時にも共用する。ロジックの重複を避ける。

## Performance: Webフォント読み込み戦略(Question 3 = A)

```css
@font-face {
  font-family: 'Noto Sans JP';
  src: url('./fonts/noto-sans-jp.woff2') format('woff2');
  font-display: swap;
  font-weight: 400 700; /* 可変フォントでない場合はウェイトごとに複数@font-face定義 */
}
@font-face {
  font-family: 'Noto Serif JP';
  src: url('./fonts/noto-serif-jp.woff2') format('woff2');
  font-display: swap;
  font-weight: 400 700;
}
```

- `font-display: swap`採用により、フォント読み込み完了まではシステムフォント(`-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", Meiryo, sans-serif` 等のフォールバックスタック)で表示し、読み込み完了後に差し替える
- レイアウトシフトの影響を軽減するため、`--font-family-sans`/`--font-family-serif`トークンのフォールバックスタックには、Noto Sans/Serif JPに字幅の近いシステムフォントを優先順位高く配置する(reference/CLAUDE.mdの既存フォールバックスタックを踏襲)

## Performance: Context再レンダリング対策(NFR Requirementsからの引き継ぎ)

```tsx
const value = useMemo(
  () => ({ theme, brand, fontFamily, fontSize, setTheme, setBrand, setFontFamily, setFontSize }),
  [theme, brand, fontFamily, fontSize, setTheme, setBrand, setFontFamily, setFontSize]
);
```

各`setXXX`は`useCallback`で参照を固定し、`useMemo`の依存配列を安定させる。
