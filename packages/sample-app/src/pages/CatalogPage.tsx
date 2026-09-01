/*
 * Copyright 2026 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import './CatalogPage.css'
import { useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dropdown,
  FormField,
  Icon,
  Modal,
  RadioGroup,
  Select,
  Switch,
  Table,
  Tabs,
  TextInput,
  Textarea,
  Tooltip,
  useToast,
  type CellEditComponentProps,
  type TableColumn,
} from 'make-you-chic-ui'

interface CatalogRow {
  id: string
  component: string
  priority: string
  note: string
}

const PRIORITY_OPTIONS = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
]

const initialTableRows: CatalogRow[] = [
  { id: '1', component: 'Button', priority: 'low', note: '4 variants x 3 sizes' },
  { id: '2', component: 'Table', priority: 'high', note: 'このテーブル自身のサンプル' },
  { id: '3', component: 'Modal', priority: 'medium', note: 'フォーカストラップ・inert対応' },
  { id: '4', component: 'Select', priority: 'low', note: 'ネイティブselect+カスタムchevron' },
  { id: '5', component: 'Toast', priority: 'medium', note: '自動消去・スタック表示' },
]

/**
 * Custom editComponent example (extension point documented on
 * TableColumn.editComponent): reuses the library's own Select instead of
 * the DefaultCellEditor's free-text input, and commits immediately on
 * change (no separate Enter step, matching native <select> UX).
 */
function PriorityCellEditor({
  value,
  onCommit,
  onCancel,
}: CellEditComponentProps<unknown>): React.JSX.Element {
  return (
    <Select
      // oxlint-disable-next-line jsx_a11y/no-autofocus
      autoFocus
      value={typeof value === 'string' ? value : ''}
      options={PRIORITY_OPTIONS}
      onChange={onCommit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      }}
      onBlur={onCancel}
      data-testid="table-cell-editor-priority"
    />
  )
}

const tableColumns: TableColumn<CatalogRow>[] = [
  { key: 'component', header: 'コンポーネント', sortable: true },
  {
    key: 'priority',
    header: '優先度(プルダウンでその場編集)',
    editable: true,
    editComponent: PriorityCellEditor,
    render: (row) => PRIORITY_OPTIONS.find((o) => o.value === row.priority)?.label ?? row.priority,
  },
  { key: 'note', header: '備考(クリックしてその場編集)', editable: true },
]

/**
 * Component catalog: representative variations of every published
 * component, for live visual/behavioral verification of the React library
 * (Unit 9 — complements the HTML demo pages, which NFR3 already covers).
 */
export function CatalogPage(): React.JSX.Element {
  const { show } = useToast()
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [radioValue, setRadioValue] = useState('a')
  const [selectValue, setSelectValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [tableRows, setTableRows] = useState(initialTableRows)

  function handleCellEdit(rowId: string, columnKey: string, value: unknown): void {
    setTableRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [columnKey]: String(value) } : row)),
    )
  }

  return (
    <div>
      <h1>コンポーネントカタログ</h1>

      <section className="catalog-section">
        <h2 className="catalog-section-title">Button</h2>
        {(['primary', 'secondary', 'danger', 'ghost'] as const).map((variant) => (
          <div className="catalog-row" key={variant}>
            <span className="catalog-label">{variant}</span>
            <Button variant={variant} size="sm">
              Small
            </Button>
            <Button variant={variant} size="md">
              Medium
            </Button>
            <Button variant={variant} size="lg">
              Large
            </Button>
            <Button variant={variant} loading>
              Loading
            </Button>
          </div>
        ))}
      </section>

      <section className="catalog-section">
        <h2 className="catalog-section-title">フォーム入力</h2>
        <div className="catalog-row">
          <FormField label="名前" helperText="TextInputの例">
            <TextInput value={textValue} onChange={setTextValue} placeholder="山田 太郎" />
          </FormField>
        </div>
        <div className="catalog-row">
          <FormField label="備考" helperText="Textareaの例">
            <Textarea value={textareaValue} onChange={setTextareaValue} rows={3} />
          </FormField>
        </div>
        <div className="catalog-row">
          <FormField label="役割" error={selectValue === '' ? '未選択です' : undefined}>
            <Select
              options={[
                { label: '選択してください', value: '' },
                { label: '管理者', value: 'admin' },
                { label: '一般ユーザー', value: 'member' },
              ]}
              value={selectValue}
              onChange={setSelectValue}
            />
          </FormField>
        </div>
        <div className="catalog-row">
          <Checkbox label="Checkbox" checked={checked} onChange={setChecked} />
          <Switch label="Switch" checked={switchOn} onChange={setSwitchOn} />
        </div>
        <div className="catalog-row">
          <RadioGroup
            name="catalog-radio"
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { label: '選択肢A', value: 'a' },
              { label: '選択肢B', value: 'b' },
            ]}
          />
        </div>
      </section>

      <section className="catalog-section">
        <h2 className="catalog-section-title">静的表示</h2>
        <div className="catalog-row">
          <Avatar name="山田 太郎" size="sm" />
          <Avatar name="鈴木 花子" size="md" />
          <Avatar name="佐藤 次郎" size="lg" />
          <Badge variant="primary">New</Badge>
          <Badge variant="danger" count={12} />
          <Icon name="bell" />
          <Icon name="user" />
          <Icon name="check" />
        </div>
        <Card>
          <p style={{ margin: 0 }}>Cardはコンテンツをグルーピングするコンテナです。</p>
        </Card>
      </section>

      <section className="catalog-section">
        <h2 className="catalog-section-title">フィードバック</h2>
        <div className="catalog-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <Alert variant="info" title="Info">
            通常の通知です。
          </Alert>
          <Alert variant="success" title="Success">
            処理が成功しました。
          </Alert>
          <Alert variant="warning" title="Warning">
            確認が必要です。
          </Alert>
          <Alert variant="danger" title="Danger" onDismiss={() => {}}>
            エラーが発生しました。
          </Alert>
        </div>
        <div className="catalog-row">
          <Button onClick={() => show({ message: '保存しました', variant: 'success' })}>
            Toastを表示
          </Button>
          <Tooltip content="削除します">
            <Button variant="danger" size="sm">
              削除
            </Button>
          </Tooltip>
          <Button onClick={() => setModalOpen(true)}>Modalを開く</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="サンプルModal">
            <p>Modalの内容です。フォーカストラップと背景inertが有効になっています。</p>
          </Modal>
        </div>
      </section>

      <section className="catalog-section">
        <h2 className="catalog-section-title">ナビゲーション</h2>
        <Tabs
          aria-label="カタログタブ"
          activeIndex={tabIndex}
          onChange={setTabIndex}
          items={[
            { label: 'タブ1', content: <p>タブ1の内容</p> },
            { label: 'タブ2', content: <p>タブ2の内容</p> },
          ]}
        />
        <div className="catalog-row">
          <Dropdown
            trigger={<Button variant="secondary">メニューを開く</Button>}
            items={[
              { label: 'プロフィール', onClick: () => {} },
              { label: 'ログアウト', onClick: () => {} },
            ]}
          />
        </div>
      </section>

      <section className="catalog-section">
        <h2 className="catalog-section-title">Table</h2>
        <p>
          「コンポーネント」列でソート、「優先度」列(カスタムeditComponent)と「備考」列(既定のテキスト編集)でそれぞれ独立にその場編集ができます。
        </p>
        <Table
          columns={tableColumns}
          data={tableRows}
          totalCount={tableRows.length}
          getRowId={(row) => row.id}
          page={1}
          pageSize={tableRows.length}
          onPageChange={() => {}}
          onCellEdit={handleCellEdit}
          aria-label="カタログ表"
        />
      </section>
    </div>
  )
}
