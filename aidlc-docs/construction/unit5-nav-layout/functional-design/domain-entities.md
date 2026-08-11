# Domain Entities — Unit 5: ナビゲーション・レイアウト系

```ts
interface TabItem { label: string; content: React.ReactNode; }

interface MenuItem { label: string; onClick(): void; }

interface AppShellNavItem { label: string; icon?: IconName; href: string; }
interface AppShellUserMenuItem { label: string; onClick(): void; } // Question 4 = A で追加
```

`notificationCount`および通知アイコンに関する型はQuestion 5により廃止(該当なし)。
