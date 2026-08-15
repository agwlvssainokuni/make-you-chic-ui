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
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Switch } from './Switch'

describe('Switch', () => {
  it('has role="switch"', () => {
    render(<Switch aria-label="通知を有効にする" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles when clicked (uncontrolled)', async () => {
    render(<Switch aria-label="通知を有効にする" />)
    const input = screen.getByTestId('switch') as HTMLInputElement
    expect(input.checked).toBe(false)
    await userEvent.click(input)
    expect(input.checked).toBe(true)
  })

  it('calls onChange with the new boolean value when controlled', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} aria-label="通知を有効にする" />)
    await userEvent.click(screen.getByTestId('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('applies the checked visual state to the track', () => {
    render(<Switch checked onChange={() => {}} aria-label="通知を有効にする" />)
    expect(screen.getByTestId('switch-track')).toHaveClass('checked')
  })

  it('renders an inline label when label prop is provided', () => {
    render(<Switch label="通知を有効にする" />)
    expect(screen.getByText('通知を有効にする')).toBeInTheDocument()
  })

  it('forwards the ref to the underlying <input> element', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Switch ref={ref} aria-label="x" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Switch label="通知を有効にする" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
