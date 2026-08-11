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
import { Tabs } from './Tabs'

const items = [
  { label: '基本情報', content: <p>基本情報の内容</p> },
  { label: 'アクセス権限', content: <p>アクセス権限の内容</p> },
  { label: '危険操作', content: <p>危険操作の内容</p> },
]

describe('Tabs', () => {
  it('shows the first tab panel by default', () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    expect(screen.getByTestId('tab-panel')).toHaveTextContent('基本情報の内容')
  })

  it('switches the panel when a tab is clicked', async () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    await userEvent.click(screen.getByTestId('tab-1'))
    expect(screen.getByTestId('tab-panel')).toHaveTextContent('アクセス権限の内容')
  })

  it('switches immediately (automatic activation) when ArrowRight moves focus', async () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    screen.getByTestId('tab-0').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByTestId('tab-1')).toHaveFocus()
    expect(screen.getByTestId('tab-panel')).toHaveTextContent('アクセス権限の内容')
  })

  it('wraps around with ArrowRight from the last tab to the first', async () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    screen.getByTestId('tab-2').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByTestId('tab-0')).toHaveFocus()
  })

  it('moves to the last tab with End and the first with Home', async () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    screen.getByTestId('tab-0').focus()
    await userEvent.keyboard('{End}')
    expect(screen.getByTestId('tab-2')).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByTestId('tab-0')).toHaveFocus()
  })

  it('applies roving tabindex: only the selected tab has tabIndex 0', () => {
    render(<Tabs items={items} aria-label="詳細セクション" />)
    expect(screen.getByTestId('tab-0')).toHaveAttribute('tabindex', '0')
    expect(screen.getByTestId('tab-1')).toHaveAttribute('tabindex', '-1')
    expect(screen.getByTestId('tab-2')).toHaveAttribute('tabindex', '-1')
  })

  it('calls onChange with the new index when controlled', async () => {
    const onChange = vi.fn()
    render(<Tabs items={items} activeIndex={0} onChange={onChange} aria-label="詳細セクション" />)
    await userEvent.click(screen.getByTestId('tab-2'))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Tabs items={items} aria-label="詳細セクション" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
