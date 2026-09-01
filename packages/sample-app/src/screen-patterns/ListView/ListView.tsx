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
import { useState } from 'react'
import {
  TextInput,
  Select,
  Table,
  Badge,
  Button,
  type SortState,
  type TableColumn,
} from 'make-you-chic-ui'
import { EditUserModal, type EditUserFormValues } from '../EditUserModal/EditUserModal'
import { DeleteConfirmModal } from '../DeleteConfirmModal/DeleteConfirmModal'
import { initialSampleUsers, type SampleUser } from '../data/sampleUsers'

const ROLE_FILTER_OPTIONS = [
  { label: 'すべての役割', value: '' },
  { label: '管理者', value: 'admin' },
  { label: '一般ユーザー', value: 'member' },
]

const PAGE_SIZE = 3

export interface ListViewProps {
  /** When provided, shows a "詳細" action per row that calls back with the row (Unit 9: List → Detail navigation). */
  onViewUser?: (user: SampleUser) => void
}

/**
 * List View screen pattern: filter bar + bulk-action bar (selection-only)
 * + Table + pagination (Functional Design: business-rules.md).
 * Reference implementation only — not exported from the package (Unit 5
 * decision: sample-app/screen-patterns/ is not part of the published API).
 */
export function ListView({ onViewUser }: ListViewProps = {}): React.JSX.Element {
  const [users, setUsers] = useState<SampleUser[]>(initialSampleUsers)
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [sortState, setSortState] = useState<SortState | null>(null)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set())
  const [editingUser, setEditingUser] = useState<{
    mode: 'create' | 'edit'
    user?: SampleUser
  } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[] } | null>(null)

  const filteredUsers = users.filter((u) => {
    const matchesText =
      searchText.trim() === '' || u.name.includes(searchText) || u.email.includes(searchText)
    const matchesRole = roleFilter === '' || u.role === roleFilter
    return matchesText && matchesRole
  })

  const sortedUsers = sortState
    ? [...filteredUsers].sort((a, b) => {
        const diff = a.name.localeCompare(b.name)
        return sortState.direction === 'desc' ? -diff : diff
      })
    : filteredUsers

  const pageStart = (page - 1) * PAGE_SIZE
  const pageUsers = sortedUsers.slice(pageStart, pageStart + PAGE_SIZE)

  const columns: TableColumn<SampleUser>[] = [
    { key: 'name', header: '名前', sortable: true },
    { key: 'email', header: 'メールアドレス' },
    {
      key: 'role',
      header: '役割',
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'primary' : 'secondary'}>
          {row.role === 'admin' ? '管理者' : '一般ユーザー'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {onViewUser && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewUser(row)}
              data-testid={`list-view-view-${row.id}`}
            >
              詳細
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditingUser({ mode: 'edit', user: row })}
            data-testid={`list-view-edit-${row.id}`}
          >
            編集
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget({ ids: [row.id] })}
            data-testid={`list-view-delete-${row.id}`}
          >
            削除
          </Button>
        </div>
      ),
    },
  ]

  function handleSave(values: EditUserFormValues): void {
    if (editingUser?.mode === 'edit' && editingUser.user) {
      const targetId = editingUser.user.id
      setUsers((prev) => prev.map((u) => (u.id === targetId ? { ...u, ...values } : u)))
    } else {
      setUsers((prev) => [...prev, { ...values, id: String(Date.now()), tablePermissions: [] }])
    }
    setEditingUser(null)
  }

  function handleDeleteConfirmed(): void {
    if (!deleteTarget) return
    const idsToRemove = new Set(deleteTarget.ids)
    setUsers((prev) => prev.filter((u) => !idsToRemove.has(u.id)))
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      deleteTarget.ids.forEach((id) => next.delete(id))
      return next
    })
    setDeleteTarget(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <TextInput
          value={searchText}
          onChange={(v) => {
            setSearchText(v)
            setPage(1)
          }}
          placeholder="名前・メールアドレスで検索"
          aria-label="ユーザー検索"
          data-testid="list-view-search"
        />
        <Select
          options={ROLE_FILTER_OPTIONS}
          value={roleFilter}
          onChange={(v) => {
            setRoleFilter(v)
            setPage(1)
          }}
          aria-label="役割で絞り込み"
          data-testid="list-view-role-filter"
        />
        <Button variant="primary" onClick={() => setEditingUser({ mode: 'create' })}>
          新規作成
        </Button>
      </div>

      {selectedRowIds.size > 0 && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
          data-testid="list-view-bulk-bar"
        >
          <span>{selectedRowIds.size}件選択中</span>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget({ ids: Array.from(selectedRowIds) })}
            data-testid="list-view-bulk-delete"
          >
            削除
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        data={pageUsers}
        totalCount={filteredUsers.length}
        getRowId={(row) => row.id}
        sortState={sortState}
        onSortChange={setSortState}
        selectedRowIds={selectedRowIds}
        onSelectionChange={setSelectedRowIds}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        aria-label="ユーザー一覧"
      />

      {editingUser && (
        <EditUserModal
          mode={editingUser.mode}
          user={editingUser.user}
          open
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          variant="simple"
          message={
            deleteTarget.ids.length === 1
              ? 'このユーザーを削除しますか?'
              : `選択した${deleteTarget.ids.length}件のユーザーを削除しますか?`
          }
          open
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  )
}
