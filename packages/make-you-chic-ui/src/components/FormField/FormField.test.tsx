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
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { FormField } from './FormField'
import { useFieldProps } from './useFieldProps'

function Probe() {
  const fieldProps = useFieldProps()
  return <input {...fieldProps} data-testid="probe-input" />
}

describe('FormField', () => {
  it('links the label to the wrapped input via id', () => {
    render(
      <FormField label="名前">
        <Probe />
      </FormField>,
    )
    const input = screen.getByTestId('probe-input')
    const label = screen.getByText('名前')
    expect(label).toHaveAttribute('for', input.id)
  })

  it('renders helper text and links it via aria-describedby when there is no error', () => {
    render(
      <FormField label="名前" helperText="全角で入力してください">
        <Probe />
      </FormField>,
    )
    const input = screen.getByTestId('probe-input')
    const helper = screen.getByText('全角で入力してください')
    expect(input.getAttribute('aria-describedby')).toBe(helper.id)
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('renders an error message with role=alert and sets aria-invalid', () => {
    render(
      <FormField label="名前" error="必須項目です">
        <Probe />
      </FormField>,
    )
    const input = screen.getByTestId('probe-input')
    const error = screen.getByRole('alert')
    expect(error).toHaveTextContent('必須項目です')
    expect(input.getAttribute('aria-describedby')).toBe(error.id)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the error instead of the helper text when both are provided', () => {
    render(
      <FormField label="名前" error="必須項目です" helperText="全角で入力してください">
        <Probe />
      </FormField>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('必須項目です')
    expect(screen.queryByText('全角で入力してください')).not.toBeInTheDocument()
  })

  it('renders a required marker when required is true', () => {
    const { container } = render(
      <FormField label="名前" required>
        <Probe />
      </FormField>,
    )
    expect(container.querySelector('.mycui-form-field-required-mark')).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <FormField label="名前" error="必須項目です">
        <Probe />
      </FormField>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('useFieldProps outside of FormField', () => {
  it('falls back to a locally generated id with no aria-describedby/aria-invalid', () => {
    render(<Probe />)
    const input = screen.getByTestId('probe-input')
    expect(input.id).toBeTruthy()
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(input).not.toHaveAttribute('aria-invalid')
  })
})
