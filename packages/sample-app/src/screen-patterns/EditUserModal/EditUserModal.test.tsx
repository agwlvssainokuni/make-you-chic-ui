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
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditUserModal } from './EditUserModal'
import type { SampleUser } from '../data/sampleUsers'

const user: SampleUser = {
  id: '1',
  name: '山田 太郎',
  email: 'yamada@example.com',
  role: 'admin',
  tablePermissions: [],
}

describe('EditUserModal', () => {
  it('starts with empty fields in create mode', () => {
    render(<EditUserModal mode="create" open onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByTestId('edit-user-name')).toHaveValue('')
    expect(screen.getByText('ユーザーを新規作成')).toBeInTheDocument()
  })

  it('starts pre-filled with the user values in edit mode', () => {
    render(<EditUserModal mode="edit" user={user} open onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByTestId('edit-user-name')).toHaveValue('山田 太郎')
    expect(screen.getByText('ユーザーを編集')).toBeInTheDocument()
  })

  it('disables save until required fields are filled', async () => {
    render(<EditUserModal mode="create" open onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByTestId('edit-user-save')).toBeDisabled()
    await userEvent.type(screen.getByTestId('edit-user-name'), '新規 太郎')
    await userEvent.type(screen.getByTestId('edit-user-email'), 'new@example.com')
    expect(screen.getByTestId('edit-user-save')).not.toBeDisabled()
  })

  it('calls onSave with the current form values', async () => {
    const onSave = vi.fn()
    render(<EditUserModal mode="edit" user={user} open onClose={() => {}} onSave={onSave} />)
    await userEvent.click(screen.getByTestId('edit-user-save'))
    expect(onSave).toHaveBeenCalledWith({
      name: '山田 太郎',
      email: 'yamada@example.com',
      role: 'admin',
    })
  })
})
