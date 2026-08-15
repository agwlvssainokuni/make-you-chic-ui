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
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Avatar, getInitials } from './Avatar'

describe('getInitials', () => {
  it('takes the first character of the first two words, uppercased', () => {
    expect(getInitials('山田 太郎')).toBe('山太')
    expect(getInitials('Taro Yamada')).toBe('TY')
  })

  it('falls back to a single initial when there is only one word', () => {
    expect(getInitials('Cher')).toBe('C')
  })

  it('returns an empty string for an empty name', () => {
    expect(getInitials('  ')).toBe('')
  })
})

describe('Avatar', () => {
  it('shows initials when no src is provided', () => {
    render(<Avatar name="山田 太郎" />)
    expect(screen.getByTestId('avatar')).toHaveTextContent('山太')
    expect(screen.getByTestId('avatar')).toHaveAttribute('role', 'img')
    expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', '山田 太郎')
  })

  it('shows the image when src is provided', () => {
    render(<Avatar src="https://example.com/a.png" name="山田 太郎" />)
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument()
  })

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="https://example.com/broken.png" name="山田 太郎" />)
    fireEvent.error(screen.getByTestId('avatar-image'))
    expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument()
    expect(screen.getByTestId('avatar')).toHaveTextContent('山太')
  })

  it('applies the requested size class', () => {
    render(<Avatar name="山田 太郎" size="lg" />)
    expect(screen.getByTestId('avatar')).toHaveClass('size-lg')
  })

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Avatar ref={ref} name="山田 太郎" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Avatar name="山田 太郎" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
