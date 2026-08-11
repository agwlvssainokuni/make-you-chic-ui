# Domain Entities — Unit 4: フィードバック系

## ToastItem

```ts
interface ToastItem {
  id: string
  message: string
  variant: 'info' | 'success' | 'warning' | 'danger'
  duration: number // ms, Question 3 = B(デフォルト4000)
  createdAt: number
}
```

## ModalStackEntry(Question 2 = A)

```ts
interface ModalStackEntry {
  id: string
  zIndex: number
}
```

## TooltipPlacement

```ts
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
```
