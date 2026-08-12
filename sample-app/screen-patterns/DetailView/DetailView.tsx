/**
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
import './DetailView.css'
import { useState } from 'react'
import { Avatar, Tabs, Card, Table, Badge, Button, type TableColumn } from '../../../src'
import { DeleteConfirmModal } from '../DeleteConfirmModal/DeleteConfirmModal'
import type { SampleUser, TablePermission } from '../data/sampleUsers'

export interface DetailViewProps {
  user: SampleUser
  onDelete: (userId: string) => void
}

const permissionColumns: TableColumn<TablePermission>[] = [
  { key: 'tableName', header: 'テーブル名' },
  {
    key: 'permission',
    header: '権限',
    render: (row) => (
      <Badge variant={row.permission === '読み取り/書き込み' ? 'primary' : 'secondary'}>
        {row.permission}
      </Badge>
    ),
  },
]

/**
 * Detail View screen pattern: header (Avatar + name + role) + Tabs, with
 * dangerous actions isolated in their own tab (Functional Design:
 * business-rules.md). Reference implementation only (sample-app/screen-patterns/,
 * not exported from the package).
 */
export function DetailView({ user, onDelete }: DetailViewProps): React.JSX.Element {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div>
      <div className="detail-view-header">
        <Avatar name={user.name} src={user.avatarSrc} size="lg" />
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {user.name}
          </h1>
          <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
            {user.role === 'admin' ? '管理者' : '一般ユーザー'}
          </Badge>
        </div>
      </div>

      <Tabs
        aria-label="詳細セクション"
        items={[
          {
            label: '基本情報',
            content: (
              <dl className="description-list">
                <dt className="description-list-term">名前</dt>
                <dd className="description-list-description">{user.name}</dd>
                <dt className="description-list-term">メールアドレス</dt>
                <dd className="description-list-description">{user.email}</dd>
                <dt className="description-list-term">役割</dt>
                <dd className="description-list-description">
                  {user.role === 'admin' ? '管理者' : '一般ユーザー'}
                </dd>
              </dl>
            ),
          },
          {
            label: 'アクセス権限',
            content: (
              <Table
                columns={permissionColumns}
                data={user.tablePermissions}
                totalCount={user.tablePermissions.length}
                getRowId={(row) => row.tableName}
                page={1}
                pageSize={user.tablePermissions.length || 1}
                onPageChange={() => {}}
                aria-label="アクセス権限一覧"
              />
            ),
          },
          {
            label: '危険操作',
            content: (
              <Card>
                <p style={{ fontWeight: 'var(--font-weight-semibold)', margin: '0 0 4px' }}>
                  このユーザーを削除
                </p>
                <p style={{ color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
                  削除すると復元できません。関連するアクセス権限もすべて失われます。
                </p>
                <Button
                  variant="danger"
                  onClick={() => setConfirmingDelete(true)}
                  data-testid="detail-view-delete"
                >
                  削除する
                </Button>
              </Card>
            ),
          },
        ]}
      />

      <DeleteConfirmModal
        variant="typed-confirmation"
        targetName={user.name}
        message={`確認のため「${user.name}」と入力してください。この操作は取り消せません。`}
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={() => {
          onDelete(user.id)
          setConfirmingDelete(false)
        }}
      />
    </div>
  )
}
