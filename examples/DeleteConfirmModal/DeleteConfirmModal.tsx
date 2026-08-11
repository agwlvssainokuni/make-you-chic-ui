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
import { useState } from 'react'
import { Modal, TextInput, Button } from '../../src'

export interface DeleteConfirmModalProps {
  /** 'simple' for List View row/bulk delete, 'typed-confirmation' for Detail View danger-zone delete. */
  variant: 'simple' | 'typed-confirmation'
  /** Required when variant='typed-confirmation'; the user must type this exact value to enable delete. */
  targetName?: string
  /** Message shown above the confirmation controls. */
  message: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * Two delete-confirmation flavors (Functional Design Question 4 = A):
 * a simple Yes/No dialog for low-risk deletes, and a type-the-name dialog
 * for high-risk deletes.
 */
export function DeleteConfirmModal({
  variant,
  targetName,
  message,
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps): React.JSX.Element {
  const [typedName, setTypedName] = useState('')

  const canConfirm = variant === 'simple' || typedName === targetName

  function handleConfirm(): void {
    if (!canConfirm) return
    onConfirm()
    setTypedName('')
  }

  return (
    <Modal open={open} onClose={onClose} title="削除の確認">
      <p>{message}</p>
      {variant === 'typed-confirmation' && (
        <TextInput
          value={typedName}
          onChange={setTypedName}
          placeholder={targetName}
          aria-label={`確認のため「${targetName}」と入力してください`}
          data-testid="delete-confirm-input"
        />
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={!canConfirm}
          data-testid="delete-confirm-button"
        >
          削除する
        </Button>
      </div>
    </Modal>
  )
}
