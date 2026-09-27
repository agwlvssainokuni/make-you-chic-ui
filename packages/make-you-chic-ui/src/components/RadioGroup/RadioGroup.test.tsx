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
import { RadioGroup } from './RadioGroup'

const options = [
  { label: '読み取りのみ', value: 'read' },
  { label: '読み取り/書き込み', value: 'write' },
]

describe('RadioGroup', () => {
  it('has role="radiogroup" and renders one radio per option', () => {
    render(<RadioGroup name="perm" options={options} defaultValue="read" />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })

  it('reflects defaultValue as the checked option (uncontrolled)', () => {
    render(<RadioGroup name="perm" options={options} defaultValue="read" />)
    expect(screen.getByTestId('radio-read')).toBeChecked()
    expect(screen.getByTestId('radio-write')).not.toBeChecked()
  })

  it('switches the checked option on click (uncontrolled)', async () => {
    render(<RadioGroup name="perm" options={options} defaultValue="read" />)
    await userEvent.click(screen.getByTestId('radio-write'))
    expect(screen.getByTestId('radio-write')).toBeChecked()
    expect(screen.getByTestId('radio-read')).not.toBeChecked()
  })

  it('calls onChange with the selected value when controlled', async () => {
    const onChange = vi.fn()
    render(<RadioGroup name="perm" options={options} value="read" onChange={onChange} />)
    await userEvent.click(screen.getByTestId('radio-write'))
    expect(onChange).toHaveBeenCalledWith('write')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<RadioGroup name="perm" options={options} defaultValue="read" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders as a fieldset/legend and exposes the legend as the accessible name when legend is provided', () => {
    render(
      <RadioGroup name="perm" options={options} defaultValue="read" legend="アクセス権限" />,
    )
    const group = screen.getByRole('group', { name: 'アクセス権限' })
    expect(group.tagName).toBe('FIELDSET')
  })

  it('applies lang to an individual option label', () => {
    render(
      <RadioGroup
        name="lang-demo"
        options={[
          { label: '日本語', value: 'ja' },
          { label: 'English', value: 'en', lang: 'en' },
        ]}
        defaultValue="ja"
      />,
    )
    expect(screen.getByText('English')).toHaveAttribute('lang', 'en')
    expect(screen.getByText('日本語')).not.toHaveAttribute('lang')
  })

  it('has no detectable accessibility violations with a legend', async () => {
    const { container } = render(
      <RadioGroup name="perm" options={options} defaultValue="read" legend="アクセス権限" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
