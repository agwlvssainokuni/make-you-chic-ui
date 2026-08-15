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
import { useEffect, type RefObject } from 'react'
import { getFocusableElements } from './getFocusableElements'

export interface UseFocusTrapOptions {
  /** Container to trap focus within. */
  containerRef: RefObject<HTMLElement | null>
  /** Whether the trap is currently active (e.g. this Modal is the topmost one). */
  active: boolean
  /** Preferred element to focus when the trap activates. Falls back to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Traps Tab/Shift+Tab navigation within a container and sets initial focus
 * when activated (Functional Design: business-logic-model.md, Question 1 =
 * B). Does not itself manage a modal stack — see ModalStackContext for
 * multi-modal coordination.
 */
export function useFocusTrap({ containerRef, active, initialFocusRef }: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const target = initialFocusRef?.current ?? getFocusableElements(container)[0]
    target?.focus()

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Tab' || !container) return
      const focusable = getFocusableElements(container)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
