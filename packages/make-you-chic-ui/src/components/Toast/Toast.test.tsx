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
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function Trigger() {
  const { show } = useToast()
  return (
    <button
      data-testid="show-toast"
      onClick={() => show({ message: '保存しました', variant: 'success' })}
    >
      表示
    </button>
  )
}

describe('ToastProvider / useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a toast when show() is called', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await act(async () => {
      screen.getByTestId('show-toast').click()
    })
    expect(screen.getByText('保存しました')).toBeInTheDocument()
  })

  it('auto-dismisses after the default duration (4000ms)', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await act(async () => {
      screen.getByTestId('show-toast').click()
    })
    expect(screen.getByText('保存しました')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.queryByText('保存しました')).not.toBeInTheDocument()
  })

  it('pauses the dismiss timer on hover and resumes on mouse leave', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await act(async () => {
      screen.getByTestId('show-toast').click()
    })
    const toastEl = screen.getByText('保存しました').closest('.mycui-toast')!

    await act(async () => {
      vi.advanceTimersByTime(3000)
      fireEvent.mouseEnter(toastEl)
    })
    await act(async () => {
      vi.advanceTimersByTime(5000) // well past the original 4000ms total
    })
    expect(screen.getByText('保存しました')).toBeInTheDocument() // still there: paused

    await act(async () => {
      fireEvent.mouseLeave(toastEl)
      vi.advanceTimersByTime(1000) // remaining ~1000ms from before hover
    })
    expect(screen.queryByText('保存しました')).not.toBeInTheDocument()
  })

  it('stacks newer toasts above older ones', async () => {
    function MultiTrigger() {
      const { show } = useToast()
      return (
        <button
          data-testid="show-two"
          onClick={() => {
            show({ message: '1件目' })
            show({ message: '2件目' })
          }}
        >
          表示
        </button>
      )
    }
    render(
      <ToastProvider>
        <MultiTrigger />
      </ToastProvider>,
    )
    await act(async () => {
      screen.getByTestId('show-two').click()
    })
    const container = screen.getByTestId('toast-container')
    const messages = Array.from(container.querySelectorAll('.mycui-toast-message')).map(
      (el) => el.textContent,
    )
    expect(messages).toEqual(['2件目', '1件目'])
  })

  it('has aria-live=polite on the toast container', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    expect(screen.getByTestId('toast-container')).toHaveAttribute('aria-live', 'polite')
  })

  it('has no detectable accessibility violations', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await act(async () => {
      screen.getByTestId('show-toast').click()
    })
    // axe() relies on real async timing internally, which never resolves
    // while fake timers are active.
    vi.useRealTimers()
    // Toast content is rendered via a portal into document.body, so scan
    // the whole body rather than the RTL-returned container.
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
