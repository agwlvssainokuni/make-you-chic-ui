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
import './Modal.css'
import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../utils/useFocusTrap'
import { useModalStack } from './ModalStackContext'
import { Icon } from '../Icon'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Element to focus when the Modal opens; defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Dialog rendered via a portal into document.body, with focus trapping and
 * background inert-ing coordinated through ModalStackContext (supports
 * multiple stacked Modals; see Functional Design Question 2 = A).
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  initialFocusRef,
}: ModalProps): React.JSX.Element | null {
  const id = useId()
  const titleId = `${id}-title`
  const overlayRef = useRef<HTMLDivElement>(null)
  const { register, unregister, isTopmost } = useModalStack()

  useEffect(() => {
    if (!open || !overlayRef.current) return
    const el = overlayRef.current
    register(id, el)
    return () => unregister(id)
  }, [open, id, register, unregister])

  const topmost = isTopmost(id)

  useFocusTrap({ containerRef: overlayRef, active: open && topmost, initialFocusRef })

  useEffect(() => {
    if (!open || !topmost) return
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, topmost, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="mycui-modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      data-testid="modal-overlay"
    >
      <div
        className={`mycui-modal-dialog size-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="modal-dialog"
      >
        <div className="mycui-modal-header">
          <span id={titleId}>{title}</span>
          <button
            type="button"
            className="mycui-modal-close-button"
            onClick={onClose}
            aria-label="閉じる"
            data-testid="modal-close-button"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="mycui-modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
