# Business Logic Model — Unit 7: 画面パターン

## List Viewの状態管理

```
1. users: SampleUser[](ローカルstate、初期値はモックデータ)
2. searchText, roleFilter: フィルタ条件(ローカルstate)
3. filteredUsers = users.filter(u => (u.name/u.email がsearchTextを含む) && (roleFilterが未指定 or u.role === roleFilter))
4. page, pageSize: ページネーション用state。Tableへは filteredUsers をpage/pageSizeでスライスしたものを渡し、
   totalCount = filteredUsers.length を渡す(Unit 6 Table Question 2 = Bの外部スライス方式に準拠)
5. selectedRowIds: Set<string>(Table連携)
6. 一括削除確定 → users から selectedRowIds に含まれるIDを除去、selectedRowIdsをクリア
```

## Detail Viewの状態管理

```
1. activeTab: Tabsコンポーネントのactiveindex(Uncontrolled、Tabs自身が管理)
2. 危険操作タブの確認テキスト入力値とターゲット名の一致判定 → 一致時のみButtonのdisabledをfalseにする
3. 削除確定 → 呼び出し元(List View等)に削除を伝播するコールバックを呼ぶ想定(examples単体では簡易的にアラート表示等で代替してもよい)
```

## 編集Modalの初期値解決

```
function resolveInitialValues(mode: 'create' | 'edit', user?: SampleUser) {
  if (mode === 'edit' && user) return { name: user.name, email: user.email, role: user.role };
  return { name: '', email: '', role: 'member' };
}
```
