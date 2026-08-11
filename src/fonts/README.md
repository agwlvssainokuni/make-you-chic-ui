# フォントファイルについて

このディレクトリには、セルフホスティングする以下のwoff2ファイルを配置してください(ライセンス上、本リポジトリにバイナリを同梱していません)。

- `noto-sans-jp-400.woff2` / `noto-sans-jp-500.woff2` / `noto-sans-jp-600.woff2` / `noto-sans-jp-700.woff2`
- `noto-serif-jp-400.woff2` / `noto-serif-jp-500.woff2` / `noto-serif-jp-600.woff2` / `noto-serif-jp-700.woff2`

## 入手方法

[Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP) および [google-webfonts-helper](https://gwfh.mranftl.com/fonts) 等から、Noto Sans JP / Noto Serif JP の woff2 形式(サブセット化を行う場合は日本語+ラテン文字を含めること)をダウンロードし、上記のファイル名でこのディレクトリに配置してください。

`../theme/fonts.css` はこれらのファイルパスを前提に `@font-face` を定義しています(`font-display: swap`、NFR Design参照)。ファイルを配置しない場合、フォールバックのシステムフォント(`--font-family-sans-raw`/`--font-family-serif-raw`、tokens.css参照)で表示されます。
