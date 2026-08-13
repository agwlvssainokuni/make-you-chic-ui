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
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles when clicked (uncontrolled)', async () => {
    render(<Checkbox aria-label="利用規約に同意する" />)
    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    await userEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('calls onChange with the new boolean value when controlled', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} aria-label="利用規約に同意する" />)
    await userEvent.click(screen.getByTestId('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('renders an inline label when label prop is provided', () => {
    render(<Checkbox label="利用規約に同意する" />)
    expect(screen.getByText('利用規約に同意する')).toBeInTheDocument()
  })

  it('shows the check icon only when checked', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} aria-label="x" />)
    expect(screen.getByTestId('checkbox-box').querySelector('svg')).toBeNull()
    rerender(<Checkbox checked onChange={() => {}} aria-label="x" />)
    expect(screen.getByTestId('checkbox-box').querySelector('svg')).not.toBeNull()
  })

  it('forwards the ref to the underlying <input> element', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Checkbox ref={ref} aria-label="x" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Checkbox label="利用規約に同意する" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
