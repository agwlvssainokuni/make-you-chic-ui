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
import { Select } from './Select'

const options = [
  { label: '管理者', value: 'admin' },
  { label: '一般ユーザー', value: 'member' },
]

describe('Select', () => {
  it('renders an <option> per entry in options', () => {
    render(<Select options={options} defaultValue="admin" aria-label="役割" />)
    const select = screen.getByTestId('select') as HTMLSelectElement
    expect(select.options).toHaveLength(2)
  })

  it('behaves as uncontrolled by default', async () => {
    render(<Select options={options} defaultValue="admin" aria-label="役割" />)
    const select = screen.getByTestId('select') as HTMLSelectElement
    expect(select.value).toBe('admin')
    await userEvent.selectOptions(select, 'member')
    expect(select.value).toBe('member')
  })

  it('behaves as controlled when value is provided', async () => {
    const onChange = vi.fn()
    render(<Select options={options} value="admin" onChange={onChange} aria-label="役割" />)
    const select = screen.getByTestId('select') as HTMLSelectElement
    await userEvent.selectOptions(select, 'member')
    expect(onChange).toHaveBeenCalledWith('member')
  })

  it('forwards the ref to the underlying <select> element', () => {
    const ref = { current: null as HTMLSelectElement | null }
    render(<Select ref={ref} options={options} aria-label="役割" />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Select options={options} aria-label="役割" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
