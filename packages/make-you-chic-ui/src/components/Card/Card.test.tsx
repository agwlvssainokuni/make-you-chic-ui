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
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>本文</p>
      </Card>,
    )
    expect(screen.getByText('本文')).toBeInTheDocument()
  })

  it('merges a custom className with the base class', () => {
    render(<Card className="custom">content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('mycui-card', 'custom')
  })

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Card ref={ref}>content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Card>
        <p>本文</p>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
