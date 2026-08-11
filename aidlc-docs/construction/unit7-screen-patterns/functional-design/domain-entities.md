# Domain Entities — Unit 7: 画面パターン

## SampleUser(サンプルドメイン、Question 1 = A)

```ts
interface SampleUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  avatarSrc?: string
  tablePermissions: { tableName: string; permission: '読み取り' | '読み取り/書き込み' }[]
}
```

`tablePermissions`はDetail Viewの「アクセス権限」タブ(reference/CLAUDE.mdの参考実装に登場)向けのサンプルデータ。

## サンプルデータ(モック、Question 2 = A)

```ts
const initialUsers: SampleUser[] = [
  { id: '1', name: '山田 太郎', email: 'yamada@example.com', role: 'admin', tablePermissions: [...] },
  { id: '2', name: '鈴木 花子', email: 'suzuki@example.com', role: 'member', tablePermissions: [...] },
  // ... 実装時に十数件程度用意し、ページネーション・フィルタの動作確認ができる件数にする
];
```
