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
import { Dropdown } from './Dropdown'

const items = [
  { label: 'プロフィール', onClick: vi.fn() },
  { label: 'ログアウト', onClick: vi.fn() },
]

describe('Dropdown', () => {
  it('is closed by default', () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on trigger click and focuses the first item', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-item-0')).toHaveFocus()
  })

  it('closes when the trigger is clicked again (toggle)', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    render(
      <div>
        <Dropdown trigger={<button>メニュー</button>} items={items} />
        <button data-testid="outside">外側</button>
      </div>,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('navigates items with ArrowDown/ArrowUp, wrapping at the edges', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('dropdown-item-1')).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('dropdown-item-0')).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByTestId('dropdown-item-1')).toHaveFocus()
  })

  it('closes and returns focus to the trigger on Escape', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('calls the item onClick and closes when an item is selected', async () => {
    const onClick = vi.fn()
    render(<Dropdown trigger={<button>メニュー</button>} items={[{ label: '削除', onClick }]} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('dropdown-item-0'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('sets aria-haspopup and aria-expanded on the trigger', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toHaveAttribute('aria-haspopup', 'true')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('has no detectable accessibility violations while open', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    // The menu portals to document.body outside of any page landmark; the
    // "region" rule checks whole-page landmark coverage, which isn't
    // meaningful when testing an isolated component fragment.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})
