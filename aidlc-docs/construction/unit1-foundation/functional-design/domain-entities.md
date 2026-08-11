# Domain Entities — Unit 1: 基盤

本ユニットは業務ドメインエンティティ(Order/User等)を持たない。代わりに、テーマ状態の型構造を定義する。

## ThemeState

```ts
type ThemeMode = 'light' | 'dark';
type ThemeBrand = 'blue' | 'green' | 'purple' | 'orange';
type ThemeFontFamily = 'sans' | 'serif';
type ThemeFontSize = 'sm' | 'md' | 'lg';

interface ThemeState {
  theme: ThemeMode;
  brand: ThemeBrand;
  fontFamily: ThemeFontFamily;
  fontSize: ThemeFontSize;
}
```

## IconRegistryEntry

```ts
type IconName = 'menu' | 'chevron-down' | 'close' | 'check' | 'bell' | 'user';
// 今後のユニットで必要になったアイコンを追加する

type IconRegistry = Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>>;
```
