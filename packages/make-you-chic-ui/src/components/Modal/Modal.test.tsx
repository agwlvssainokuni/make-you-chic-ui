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
import { axe } from 'vitest-axe'
import { useRef, useState } from 'react'
import { Modal } from './Modal'
import { ModalStackProvider } from './ModalStackContext'

function ControlledModal({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <ModalStackProvider>
      <div data-testid="app-root">
        <button data-testid="trigger" onClick={() => setOpen(true)}>
          開く
        </button>
        <Modal open={open} onClose={() => setOpen(false)} title="確認">
          <p>本文</p>
          <button data-testid="modal-action">OK</button>
        </Modal>
      </div>
    </ModalStackProvider>
  )
}

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    render(
      <ModalStackProvider>
        <Modal open={false} onClose={() => {}} title="確認">
          content
        </Modal>
      </ModalStackProvider>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with role=dialog and aria-modal when open', () => {
    render(
      <ModalStackProvider>
        <Modal open onClose={() => {}} title="確認">
          content
        </Modal>
      </ModalStackProvider>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('確認')
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <ModalStackProvider>
        <Modal open onClose={onClose} title="確認">
          content
        </Modal>
      </ModalStackProvider>,
    )
    await userEvent.click(screen.getByTestId('modal-close-button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    render(
      <ModalStackProvider>
        <Modal open onClose={onClose} title="確認">
          content
        </Modal>
      </ModalStackProvider>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay background is clicked, but not when the dialog itself is clicked', async () => {
    const onClose = vi.fn()
    render(
      <ModalStackProvider>
        <Modal open onClose={onClose} title="確認">
          content
        </Modal>
      </ModalStackProvider>,
    )
    await userEvent.click(screen.getByTestId('modal-dialog'))
    expect(onClose).not.toHaveBeenCalled()
    await userEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves initial focus to the first focusable element inside the dialog (the header close button)', () => {
    render(
      <ModalStackProvider>
        <Modal open onClose={() => {}} title="確認">
          <button data-testid="first-button">最初</button>
        </Modal>
      </ModalStackProvider>,
    )
    // The close button is rendered in the header, before the body content,
    // so it is legitimately first in DOM order.
    expect(screen.getByTestId('modal-close-button')).toHaveFocus()
  })

  it('moves initial focus to initialFocusRef when provided', () => {
    function ModalWithInitialFocusRef() {
      const ref = useRef<HTMLButtonElement>(null)
      return (
        <ModalStackProvider>
          <Modal open onClose={() => {}} title="確認" initialFocusRef={ref}>
            <button data-testid="first-button">最初</button>
            <button ref={ref} data-testid="target-button">
              対象
            </button>
          </Modal>
        </ModalStackProvider>
      )
    }
    render(<ModalWithInitialFocusRef />)
    expect(screen.getByTestId('target-button')).toHaveFocus()
  })

  it('restores focus to the triggering element after closing', async () => {
    render(<ControlledModal initialOpen={false} />)
    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('modal-close-button'))
    expect(trigger).toHaveFocus()
  })

  it('applies inert to the render container while open, and removes it after closing', async () => {
    // React Testing Library mounts the component tree into a wrapper <div>
    // appended directly to document.body, which is exactly the sibling
    // element ModalStackContext should mark `inert` while the Modal is open
    // (inert on this wrapper cascades to everything inside it, including
    // the app-root div).
    const { container } = render(<ControlledModal initialOpen={false} />)
    expect(container).not.toHaveAttribute('inert')

    await userEvent.click(screen.getByTestId('trigger'))
    expect(container).toHaveAttribute('inert')

    await userEvent.click(screen.getByTestId('modal-close-button'))
    expect(container).not.toHaveAttribute('inert')
  })

  it('supports stacking: only the topmost Modal is not inert, and Escape closes only the topmost', async () => {
    const onCloseFirst = vi.fn()
    const onCloseSecond = vi.fn()
    render(
      <ModalStackProvider>
        <Modal open onClose={onCloseFirst} title="1つ目">
          content
        </Modal>
        <Modal open onClose={onCloseSecond} title="2つ目">
          content
        </Modal>
      </ModalStackProvider>,
    )

    const overlays = screen.getAllByTestId('modal-overlay')
    expect(overlays).toHaveLength(2)
    expect(overlays[0]).toHaveAttribute('inert')
    expect(overlays[1]).not.toHaveAttribute('inert')

    await userEvent.keyboard('{Escape}')
    expect(onCloseSecond).toHaveBeenCalledTimes(1)
    expect(onCloseFirst).not.toHaveBeenCalled()
  })

  it('has no detectable accessibility violations', async () => {
    render(
      <ModalStackProvider>
        <Modal open onClose={() => {}} title="確認">
          <p>本文</p>
        </Modal>
      </ModalStackProvider>,
    )
    // Modal content is rendered via a portal into document.body.
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations()
  })
})
