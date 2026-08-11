# Business Rules — Unit 3: 静的表示系

## Avatarのイニシャル生成規則(Question 1 = A)

```
1. nameを空白でtrimし、連続空白を1つに正規化
2. 空白でsplitし、単語配列を得る
3. 先頭2単語それぞれの1文字目を取り、大文字化して連結する
   - 単語が1つしかない場合はその1文字目のみ(1文字のイニシャルになる)
   - nameが空文字の場合はイニシャル表示なし(空のAvatarとして描画)
```

## Avatar画像読み込み失敗規則(Question 2 = A)

```
<img>のonErrorイベント発火時、画像要素を非表示にしてイニシャル表示に切り替える。
一度失敗した場合、同一srcでの再試行は行わない(propsのsrcが変わった場合のみ再度画像表示を試みる)。
```

## Badgeの件数丸め規則(Question 3 = B)

```
count > maxCount の場合、`${maxCount}+`と表示する(例: maxCount=99のときcount=150は"99+")
count <= maxCount の場合、countをそのまま表示する
maxCountのデフォルト値は99
```

## Cardの構造(Question 4 = A)

```
Cardはchildrenをそのまま描画するシンプルなコンテナ。内部レイアウト(見出し・本文・フッター等の配置)は
利用側がCard内に任意のJSXを組み立てる形で実現する。将来複合構造が必要になった場合は別途検討する。
```
