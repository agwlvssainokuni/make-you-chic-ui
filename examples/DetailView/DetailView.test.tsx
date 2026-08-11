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
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailView } from './DetailView'
import type { SampleUser } from '../data/sampleUsers'

const user: SampleUser = {
  id: '1',
  name: '山田 太郎',
  email: 'yamada@example.com',
  role: 'admin',
  tablePermissions: [{ tableName: 'users', permission: '読み取り/書き込み' }],
}

describe('DetailView', () => {
  it('shows the header with name and role', () => {
    render(<DetailView user={user} onDelete={() => {}} />)
    expect(screen.getAllByText('山田 太郎').length).toBeGreaterThan(0)
  })

  it('shows the basic-info tab content by default', () => {
    render(<DetailView user={user} onDelete={() => {}} />)
    expect(screen.getByText('yamada@example.com')).toBeInTheDocument()
  })

  it('switches to the danger-zone tab and requires typing the exact name to delete', async () => {
    const onDelete = vi.fn()
    render(<DetailView user={user} onDelete={onDelete} />)

    await userEvent.click(screen.getByRole('tab', { name: '危険操作' }))
    await userEvent.click(screen.getByTestId('detail-view-delete'))

    const confirmButton = screen.getByTestId('delete-confirm-button')
    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByTestId('delete-confirm-input'), '山田 太郎')
    await userEvent.click(confirmButton)
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
