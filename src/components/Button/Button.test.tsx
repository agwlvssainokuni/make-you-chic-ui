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
import { Button } from './Button'

describe('Button', () => {
  it('renders children and defaults to variant=primary size=md', () => {
    render(<Button>保存</Button>)
    const btn = screen.getByRole('button', { name: '保存' })
    expect(btn).toHaveClass('variant-primary', 'size-md')
  })

  it('applies the requested variant and size', () => {
    render(
      <Button variant="danger" size="lg">
        削除
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('variant-danger', 'size-lg')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>送信</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        送信
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows a spinner, sets aria-busy, and disables the button when loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        送信
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('forwards the ref to the underlying <button> element', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>保存</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Button>保存</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
