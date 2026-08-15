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
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Icon } from './Icon'

describe('Icon', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a known icon with the default size', () => {
    render(<Icon name="close" />)
    const svg = screen.getByTestId('icon-close')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '20')
    expect(svg).toHaveAttribute('height', '20')
  })

  it('applies a custom size', () => {
    render(<Icon name="bell" size={32} />)
    expect(screen.getByTestId('icon-bell')).toHaveAttribute('width', '32')
  })

  it('is aria-hidden when no label is provided', () => {
    render(<Icon name="check" />)
    expect(screen.getByTestId('icon-check')).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes an accessible name when a label is provided', () => {
    render(<Icon name="user" label="ユーザー" />)
    const svg = screen.getByTestId('icon-user')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).toHaveAttribute('aria-label', 'ユーザー')
  })

  it('renders nothing and warns in dev for an unknown icon name', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error intentionally passing an invalid icon name to test fail-soft behavior
    const { container } = render(<Icon name="does-not-exist" />)
    expect(container).toBeEmptyDOMElement()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'))
  })

  it('has no detectable accessibility violations (decorative usage)', async () => {
    const { container } = render(<Icon name="menu" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no detectable accessibility violations (labeled usage)', async () => {
    const { container } = render(<Icon name="user" label="ユーザーメニュー" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
