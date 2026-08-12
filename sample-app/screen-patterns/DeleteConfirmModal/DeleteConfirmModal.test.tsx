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
import { DeleteConfirmModal } from './DeleteConfirmModal'

describe('DeleteConfirmModal', () => {
  it('simple variant: delete is enabled immediately and no text input is shown', () => {
    render(
      <DeleteConfirmModal
        variant="simple"
        message="削除しますか?"
        open
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    )
    expect(screen.queryByTestId('delete-confirm-input')).not.toBeInTheDocument()
    expect(screen.getByTestId('delete-confirm-button')).not.toBeDisabled()
  })

  it('typed-confirmation variant: delete stays disabled until the exact name is typed', async () => {
    render(
      <DeleteConfirmModal
        variant="typed-confirmation"
        targetName="山田 太郎"
        message="このユーザーを削除します。"
        open
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    )
    const input = screen.getByTestId('delete-confirm-input')
    const button = screen.getByTestId('delete-confirm-button')
    expect(button).toBeDisabled()

    await userEvent.type(input, '違う名前')
    expect(button).toBeDisabled()

    await userEvent.clear(input)
    await userEvent.type(input, '山田 太郎')
    expect(button).not.toBeDisabled()
  })

  it('calls onConfirm when delete is clicked while enabled', async () => {
    const onConfirm = vi.fn()
    render(
      <DeleteConfirmModal
        variant="simple"
        message="削除しますか?"
        open
        onClose={() => {}}
        onConfirm={onConfirm}
      />,
    )
    await userEvent.click(screen.getByTestId('delete-confirm-button'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
