# メソッド/フック シグネチャ

各コンポーネント・フックの高レベルなシグネチャ。詳細なビジネスルール(バリデーション条件、エッジケース処理等)はConstruction phaseのFunctional Designで確定する。

## サービス層フック

```ts
// ThemeProvider / useTheme
function useTheme(): {
  theme: 'light' | 'dark';
  brand: 'blue' | 'green' | 'purple' | 'orange';
  fontFamily: 'sans' | 'serif';
  fontSize: 'sm' | 'md' | 'lg';
  setTheme(value: 'light' | 'dark'): void;
  setBrand(value: 'blue' | 'green' | 'purple' | 'orange'): void;
  setFontFamily(value: 'sans' | 'serif'): void;
  setFontSize(value: 'sm' | 'md' | 'lg'): void;
};

// ToastProvider / useToast
function useToast(): {
  show(options: { message: string; variant?: 'info' | 'success' | 'warning' | 'danger'; duration?: number }): string; // returns toast id
  dismiss(id: string): void;
};

// AppShell内部 / useAppShell
function useAppShell(): {
  collapsed: boolean;
  toggleCollapsed(): void;
  setCollapsed(value: boolean): void;
};
```

## 基本入力系

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // default: 'primary'
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  loading?: boolean; // default: false, sets aria-busy
}
const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}
const FormField: React.FC<FormFieldProps>;
// 内部でFormFieldContextを提供し、Question 6=Aの方針により子のInput系コンポーネントが自動でid/aria-describedbyを参照する

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const TextInput: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<HTMLInputElement>>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

interface SelectOption { label: string; value: string; }
interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
  disabled?: boolean;
}
const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}
const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}
const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;

interface RadioOption { label: string; value: string; }
interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
}
const RadioGroup: React.FC<RadioGroupProps>;

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}
const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>; // RadioGroup内部実装用
```

## データ表示系

```ts
interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: number;
  render?(row: T): React.ReactNode;
}
interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sortState?: { key: string; direction: 'asc' | 'desc' | null };
  onSortChange?(state: { key: string; direction: 'asc' | 'desc' | null }): void;
  selectedRowIds?: Set<string>;
  onSelectionChange?(ids: Set<string>): void;
  page?: number;
  pageSize?: number;
  onPageChange?(page: number): void;
  onCellEdit?(rowId: string, key: string, value: unknown): void;
}
const Table: <T>(props: TableProps<T>) => React.ReactElement;

interface AvatarProps {
  src?: string;
  name: string; // イニシャル生成元
  size?: 'sm' | 'md' | 'lg';
}
const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  count?: number; // 99+ 等の丸め表示
  children?: React.ReactNode;
}
const Badge: React.FC<BadgeProps>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;

interface IconProps {
  name: string; // 同梱アイコンセットのキー
  size?: number;
  label?: string; // アクセシブルネームが必要な場合。省略時はaria-hidden
}
const Icon: React.FC<IconProps>;
```

## フィードバック系

```ts
interface ModalProps {
  open: boolean;
  onClose(): void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
const Modal: React.FC<ModalProps>;

interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onDismiss?(): void;
  action?: { label: string; onClick(): void };
}
const Alert: React.FC<AlertProps>;

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement; // トリガー要素
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
const Tooltip: React.FC<TooltipProps>;
```

## ナビゲーション・レイアウト系

```ts
interface TabItem { label: string; content: React.ReactNode; }
interface TabsProps {
  items: TabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?(index: number): void;
}
const Tabs: React.FC<TabsProps>;

interface MenuItem { label: string; onClick(): void; }
interface DropdownProps {
  trigger: React.ReactElement;
  items: MenuItem[];
  placement?: 'bottom-start' | 'bottom-end';
}
const Dropdown: React.FC<DropdownProps>;

interface AppShellNavItem { label: string; icon?: string; href: string; }
interface AppShellUserMenuItem { label: string; onClick(): void; } // Unit 5 Functional Designで追加
interface AppShellProps {
  navItems: AppShellNavItem[];
  user?: { name: string; avatarSrc?: string };
  userMenuItems?: AppShellUserMenuItem[]; // Unit 5 Functional Designで追加
  children: React.ReactNode; // Contentスロット
}
const AppShell: React.FC<AppShellProps>;
// notificationCountはUnit 5 Functional Design(Question 5)で廃止(通知アイコン機能を持たない)
```

## すべてのコンポーネント共通のprops(Question 7=A, Question 8=B)

```ts
interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
}
// DOM要素をルートに持つ全コンポーネントはforwardRef対応(Question 8=B)
```
