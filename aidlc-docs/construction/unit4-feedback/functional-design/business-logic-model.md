# Business Logic Model — Unit 4: フィードバック系

## Modalのフォーカストラップ・スタック管理

```
1. ModalStackContext(Unit内部)がグローバルに開いているModalのスタック([{id, zIndex}, ...])を保持する
2. Modalマウント時: スタックに自身を追加(zIndex = 現在のスタック長 * 10 + ベース値)、開いた時点のdocument.activeElementを記憶
3. Modalアンマウント時: スタックから自身を除去し、記憶していた要素にフォーカスを戻す
4. 自身がスタックの最上位である間のみ、フォーカストラップ(Tabキー制御)を有効化する
5. 背景のinert化: 自身以外の最上位要素(<body>直下の兄弟でModalのポータル先を除く)にinert属性を付与・解除する
```

## Toastのキュー管理

```
1. ToastProvider内でToastItem[]をstateとして保持
2. show(options)呼び出し時: 一意なid発行 → ToastItemを配列の先頭に追加(Question 4: 新しいものが上)
3. 各Toastは自身のdurationでsetTimeoutを仕掛け、時間経過で自動的にキューから除去する
4. ホバー中: setTimeoutをclearし、残り時間を記録。ホバー解除時に残り時間で再度setTimeoutを仕掛ける
5. dismiss(id)呼び出し時: 即座にキューから除去(タイマーもクリア)
```

## Tooltipの表示位置計算・衝突検出

```
1. トリガー要素のgetBoundingClientRect()と、Tooltip要素自身のサイズ(表示前は概算、表示後に再計算)を取得
2. placement propに応じた基本座標を計算(例: 'top'ならトリガー要素の上端 - Tooltip高さ - オフセット)
3. 計算結果がviewportの範囲外になる場合、反対方向のplacementで再計算する
   (top⇔bottom, left⇔right の1回だけの単純な切り替え。多段階のフォールバックは行わない)
4. 最終的な座標をposition: fixedで適用する
```

## Tooltipの表示/非表示タイミング制御

```
1. mouseenter/focus発生 → 300msのタイマーを開始
2. タイマー完了前にmouseleave/blurが発生 → タイマーをキャンセル(表示しない)
3. タイマー完了 → 表示状態にする
4. 表示中にmouseleave/blur/Escapeが発生 → 即座に非表示にする(ディレイなし)
```
