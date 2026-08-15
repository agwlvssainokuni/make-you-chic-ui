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
import { axe } from 'vitest-axe'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the count as-is when at or below maxCount', () => {
    render(<Badge count={42} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('42')
  })

  it('rounds the count to "maxCount+" when it exceeds the default maxCount (99)', () => {
    render(<Badge count={150} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('99+')
  })

  it('respects a custom maxCount', () => {
    render(<Badge count={12} maxCount={9} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('9+')
  })

  it('renders children when count is not provided', () => {
    render(<Badge>NEW</Badge>)
    expect(screen.getByTestId('badge')).toHaveTextContent('NEW')
  })

  it('renders as an empty dot when neither count nor children are provided', () => {
    render(<Badge />)
    expect(screen.getByTestId('badge')).toHaveClass('mycui-badge-empty')
    expect(screen.getByTestId('badge')).toHaveTextContent('')
  })

  it('applies the requested variant', () => {
    render(<Badge variant="danger" count={1} />)
    expect(screen.getByTestId('badge')).toHaveClass('variant-danger')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Badge count={3} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
