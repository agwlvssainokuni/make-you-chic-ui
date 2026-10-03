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
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export const MODAL_BASE_Z_INDEX = 1000

interface ModalStackEntry {
  id: string
  portalEl: HTMLElement
}

interface ModalStackContextValue {
  register: (id: string, portalEl: HTMLElement) => void
  unregister: (id: string) => void
  isTopmost: (id: string) => boolean
  zIndexOf: (id: string) => number
  /**
   * Queues an element to be focused once `inert` has been lifted from it
   * (applied from the same effect that toggles `inert`, after this Modal's
   * entry is gone from the stack). Overwrites any previously queued target.
   */
  setFocusToRestore: (el: HTMLElement | null) => void
}

const ModalStackContext = createContext<ModalStackContextValue | null>(null)

/**
 * Tracks all currently-open <Modal> portal elements so that:
 * - only the topmost Modal traps focus (Functional Design Question 2 = A)
 * - every element outside the topmost Modal's portal (the app root AND any
 *   lower Modal portals) gets `inert` applied, per requirements.md FR1
 */
export function ModalStackProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [entries, setEntries] = useState<ModalStackEntry[]>([])
  const focusToRestoreRef = useRef<HTMLElement | null>(null)

  const register = useCallback((id: string, portalEl: HTMLElement) => {
    setEntries((prev) => (prev.some((e) => e.id === id) ? prev : [...prev, { id, portalEl }]))
  }, [])

  const unregister = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const setFocusToRestore = useCallback((el: HTMLElement | null) => {
    focusToRestoreRef.current = el
  }, [])

  const isTopmost = useCallback(
    (id: string) => entries.length > 0 && entries[entries.length - 1].id === id,
    [entries],
  )

  const zIndexOf = useCallback(
    (id: string) =>
      MODAL_BASE_Z_INDEX +
      Math.max(
        entries.findIndex((e) => e.id === id),
        0,
      ) *
        10,
    [entries],
  )

  // Apply/remove inert on every <body> child that is not the topmost
  // Modal's own portal element, then restore focus to any queued target —
  // in that order, so focus lands on an element that is no longer inert
  // (see useFocusTrap's onDeactivate / Modal's finalFocusRef).
  useEffect(() => {
    const topmostEl = entries[entries.length - 1]?.portalEl
    const bodyChildren = Array.from(document.body.children) as HTMLElement[]

    for (const child of bodyChildren) {
      if (entries.length === 0 || child === topmostEl) {
        child.removeAttribute('inert')
      } else {
        child.setAttribute('inert', '')
      }
    }

    const focusTarget = focusToRestoreRef.current
    if (focusTarget) {
      focusToRestoreRef.current = null
      focusTarget.focus()
    }
  }, [entries])

  const value = useMemo(
    () => ({ register, unregister, isTopmost, zIndexOf, setFocusToRestore }),
    [register, unregister, isTopmost, zIndexOf, setFocusToRestore],
  )

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>
}

const fallbackStack: ModalStackContextValue = {
  register: () => {},
  unregister: () => {},
  isTopmost: () => true,
  zIndexOf: () => MODAL_BASE_Z_INDEX,
  // No inert coordination without a Provider, so nothing can block focus()
  // — restore it immediately instead of queuing.
  setFocusToRestore: (el) => el?.focus(),
}

/**
 * Consumed by <Modal>. When no ModalStackProvider is present (e.g. a single
 * Modal used without wrapping the app), falls back to treating every Modal
 * as topmost with no inert coordination (fail-soft, consistent with
 * useTheme/Icon). A lone <Modal> still works correctly in this case since
 * its own focus trap and portal placement do not depend on the stack.
 */
export function useModalStack(): ModalStackContextValue {
  const ctx = useContext(ModalStackContext)
  return ctx ?? fallbackStack
}
