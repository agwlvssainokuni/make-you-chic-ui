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
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders the title and children', () => {
    render(
      <Alert variant="danger" title="エラー">
        入力内容を確認してください
      </Alert>,
    )
    expect(screen.getByText('エラー')).toBeInTheDocument()
    expect(screen.getByText('入力内容を確認してください')).toBeInTheDocument()
  })

  it('uses role="alert" for danger and warning variants', () => {
    render(<Alert variant="danger">問題があります</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('uses role="status" for info and success variants', () => {
    render(<Alert variant="info">お知らせ</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders a dismiss button only when onDismiss is provided', () => {
    const { rerender } = render(<Alert variant="info">内容</Alert>)
    expect(screen.queryByTestId('alert-dismiss-button')).not.toBeInTheDocument()

    const onDismiss = vi.fn()
    rerender(
      <Alert variant="info" onDismiss={onDismiss}>
        内容
      </Alert>,
    )
    expect(screen.getByTestId('alert-dismiss-button')).toBeInTheDocument()
  })

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn()
    render(
      <Alert variant="info" onDismiss={onDismiss}>
        内容
      </Alert>,
    )
    await userEvent.click(screen.getByTestId('alert-dismiss-button'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('renders an action link and calls its onClick', async () => {
    const onClick = vi.fn()
    render(
      <Alert variant="warning" action={{ label: '再試行', onClick }}>
        失敗しました
      </Alert>,
    )
    await userEvent.click(screen.getByText('再試行'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <Alert ref={ref} variant="info">
        内容
      </Alert>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Alert variant="danger" title="エラー" onDismiss={() => {}}>
        入力内容を確認してください
      </Alert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
