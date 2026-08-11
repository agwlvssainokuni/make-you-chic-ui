# Business Logic Model — Unit 3: 静的表示系

## Avatarの表示状態遷移

```
1. srcが指定されておらず、nameのみの場合 → 常にイニシャル表示
2. srcが指定されている場合 → まず<img>を描画
   a. 読み込み成功 → 画像を表示したまま
   b. onError発火 → 内部state(imageError)をtrueにし、以降はイニシャル表示に切り替える
3. srcもnameも指定されていない場合 → 空のAvatar(背景色のみの円)を表示
```

## Badgeの表示ロジック

```
1. count propが指定されている場合: business-rules.mdの丸め規則に従って数値/"NN+"を表示
2. countが指定されておらずchildrenが指定されている場合: childrenをそのまま表示(ドット状の小さいBadge等)
3. どちらも指定されていない場合: 空のBadge(ドットのみ)として最小サイズで表示
```
