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
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListView } from './ListView'

describe('ListView', () => {
  it('renders the first page of users', () => {
    render(<ListView />)
    expect(screen.getByText('山田 太郎')).toBeInTheDocument()
  })

  it('filters by search text', async () => {
    render(<ListView />)
    await userEvent.type(screen.getByTestId('list-view-search'), '鈴木')
    expect(screen.getByText('鈴木 花子')).toBeInTheDocument()
    expect(screen.queryByText('山田 太郎')).not.toBeInTheDocument()
  })

  it('shows the bulk action bar only when rows are selected', async () => {
    render(<ListView />)
    expect(screen.queryByTestId('list-view-bulk-bar')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('table-select-1'))
    expect(screen.getByTestId('list-view-bulk-bar')).toBeInTheDocument()
  })

  it('deletes a user after confirming the simple delete dialog', async () => {
    render(<ListView />)
    await userEvent.click(screen.getByTestId('list-view-delete-1'))
    await userEvent.click(screen.getByTestId('delete-confirm-button'))
    expect(screen.queryByText('山田 太郎')).not.toBeInTheDocument()
  })

  it('does not render a view action when onViewUser is not provided', () => {
    render(<ListView />)
    expect(screen.queryByTestId('list-view-view-1')).not.toBeInTheDocument()
  })

  it('calls onViewUser with the row when the view action is clicked', async () => {
    let viewedName = ''
    render(<ListView onViewUser={(user) => (viewedName = user.name)} />)
    await userEvent.click(screen.getByTestId('list-view-view-1'))
    expect(viewedName).toBe('山田 太郎')
  })

  it('opens the create modal and adds a new user', async () => {
    render(<ListView />)
    await userEvent.click(screen.getByText('新規作成'))
    await userEvent.type(screen.getByTestId('edit-user-name'), '新規 太郎')
    await userEvent.type(screen.getByTestId('edit-user-email'), 'shinki@example.com')
    await userEvent.click(screen.getByTestId('edit-user-save'))
    // 新規ユーザーは末尾(初期5件 + 1件、1ページ3件のため2ページ目)に追加される
    await userEvent.click(screen.getByTestId('table-next-page'))
    expect(screen.getByText('新規 太郎')).toBeInTheDocument()
  })
})
