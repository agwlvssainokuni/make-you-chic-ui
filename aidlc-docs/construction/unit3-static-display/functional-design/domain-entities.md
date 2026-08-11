# Domain Entities — Unit 3: 静的表示系

業務ドメインエンティティは存在しない。Badgeのvariant型のみ定義する。

```ts
type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'success'
```

Avatar/Cardは業務データ型を持たない(propsのみで完結)。
