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
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('defaults to 3 rows', () => {
    render(<Textarea />)
    expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '3')
  })

  it('accepts a custom rows value', () => {
    render(<Textarea rows={6} />)
    expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '6')
  })

  it('behaves as uncontrolled by default', async () => {
    render(<Textarea defaultValue="こんにちは" />)
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement
    expect(textarea.value).toBe('こんにちは')
    await userEvent.type(textarea, '!')
    expect(textarea.value).toBe('こんにちは!')
  })

  it('forwards the ref to the underlying <textarea> element', () => {
    const ref = { current: null as HTMLTextAreaElement | null }
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Textarea aria-label="コメント" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
