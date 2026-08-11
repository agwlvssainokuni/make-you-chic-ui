# Business Logic Model — Unit 1: 基盤

## テーマ状態管理ロジック(ThemeProvider)

### 初期化フロー

```
1. マウント時、4軸それぞれについて以下の優先順位で初期値を決定する:
   a. localStorageに保存値があればそれを使う
   b. theme軸のみ: 保存値がなければ window.matchMedia('(prefers-color-scheme: dark)') を評価
      - true → 'dark' / false → 'light'
   c. brand/fontFamily/fontSize軸: 保存値がなければ固定デフォルト値を使う
      - brand: 'blue', fontFamily: 'sans', fontSize: 'md'
2. 決定した初期値を state にセットし、<html>要素の対応するdata属性に反映する
   (data-theme, data-brand, data-font-family, data-font-size)
```

### 変更フロー(set*メソッド呼び出し時)

```
1. 呼び出されたsetXXX(value)を検証する(business-rules.md の有効値チェック)
2. 不正な値の場合は何もしない(開発時はconsole.warn)
3. 正しい値の場合:
   a. Reactのstateを更新
   b. <html>要素の対応するdata属性を更新
   c. localStorageに書き込む(キー命名は業務ルール参照)
```

### マルチタブ同期フロー(Question 1 = A)

```
1. ThemeProviderマウント時に window.addEventListener('storage', handler) を登録
2. 他タブでlocalStorageの該当キーが変更されたイベントを受信したら:
   a. 変更されたキーが4軸のいずれかに対応するものか判定
   b. 対応する場合、そのキーの新しい値でstateと<html>のdata属性を更新
      (このタブ側では再度localStorageへの書き込みは行わない — 無限ループ防止)
3. アンマウント時にイベントリスナーを解除する
```

## Iconのレンダリングロジック(Question 2 = B, Question 3 = A)

```
1. Iconコンポーネントは同梱アイコンの「名前 → SVGコンポーネント」のマップ(iconRegistry)を持つ
2. name propを受け取ったら iconRegistry から対応するSVGコンポーネントを取得
3. 見つかった場合: サイズ(size prop、デフォルト値あり)・色(currentColor継承)・
   aria属性(labelがあればaria-label、なければaria-hidden="true")を適用して描画
4. 見つからない場合:
   - 開発時(import.meta.env.DEV): console.warnでnameを含む警告を出力
   - 本番ビルド時: 警告なし
   - いずれの場合も何も描画しない(nullを返す)
```
